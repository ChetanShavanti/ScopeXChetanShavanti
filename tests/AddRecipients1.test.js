const { test, expect } = require('@playwright/test');
const fs = require('fs');
const csv = require('csv-parser');

// Helper function to read CSV data
async function getAccountData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('account_data.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

// Function to submit recipient details and handle errors
async function submitRecipientDetails(page, account_name, account_number, ifsc_code) {
  await page.fill('//input[@name="recipient_name"]', account_name);
  await page.fill('//input[@name="recipient_nick_name"]', 'NickName ' + account_name);
  await page.fill('//input[@name="bank_account_number"]', account_number);
  await page.fill('//input[@name="ifsc_code"]', ifsc_code);
  await page.click('//*[@type="submit"]');
  
  await page.waitForTimeout(5000);

  const errors = [
    '//*[contains(text(),"Recipient with same bank account number already exists.")]',
    '//*[contains(text(),"Bank account not found please provide correct bank credentials")]',
    '//*[contains(text(),"Bank account number already exist")]'
  ];

  for (const error of errors) {
    const isErrorVisible = await page.locator(error).isVisible();
    if (isErrorVisible) {
      console.log('Error encountered. Retrying with next account...');
      return false;
    }
  }

  const confirmVisible = await page.locator('//*[contains(text(),"Confirm recipient details")]').isVisible();
  if (confirmVisible) {
    console.log('Confirm recipient details found. Proceeding...');
    return true;
  }

  return false;
}

// Function to verify name and complete recipient addition
async function verifyAndConfirmRecipient(page, expected_name) {
  const confirmVisible = await page.locator('//*[contains(text(),"Confirm recipient details")]').isVisible();
  if (confirmVisible) {
    const displayedName = await page.locator('.text-left.text-slate-600').textContent();
    if (displayedName.includes(expected_name)) {
      console.log(`Name match: ${expected_name}`);
      await page.click('//button[contains(text(),"Confirm")]');
      await page.waitForTimeout(2000);
      
      // Check for possible error after clicking "Confirm"
      const duplicateAccountError = await page.locator('//*[contains(text(),"Bank account number already exist")]').isVisible();
      if (duplicateAccountError) {
        console.log('Duplicate account error after confirming. Retrying with next account...');
        return false;  // Stop further execution for this account and retry with next account
      }

      // If no errors, assert that the recipient was added successfully
      await expect(page.locator('//*[contains(text(),"Recipient added successfully!")]')).toBeVisible();
      await expect(page.locator('//p[contains(text(),"Recipient List")]')).toBeVisible();
      console.log('Recipient added successfully.');
      return true;  // Successfully added recipient
    } else {
      console.log(`Name mismatch: Expected ${expected_name}, but found ${displayedName}`);
    }
  }
  return false;
}

// Function to log in
async function login(page) {
  await page.goto('https://scopex.money/Login');
  await page.fill('//input[@name="username"]', 'chetanshavanti27@gmail.com');
  await page.fill('//input[@name="password"]', 'Qw#1erty');
  await page.click('//button[contains(text(),"Log in")]');
  await page.waitForTimeout(2000);
  await page.waitForURL('https://scopex.money/Dashboard');
  
}

// Function to log out
async function logout(page) {
  await page.click('//*[name()="circle" and contains(@cx,"26")]');
  await page.click('//a[contains(text(),"Log out")]');
  await page.waitForTimeout(2000);
  await expect(page.locator('//a[@href="/Login"]')).toBeVisible();
}

test('Add Recipient with Retry Logic', async ({ page }) => {
  test.setTimeout(900000); // 15 minutes

  // Step 1: Login
  await login(page);

  // Step 2: Read account data from CSV
  const accountData = await getAccountData();

  // Step 3: Add recipient from CSV data with retries
  for (let i = 0; i < accountData.length; i++) {
    const { account_name, account_number, ifsc_code } = accountData[i];
    console.log(`Attempt ${i + 1}: Adding account ${account_name}`);

    // Open the "Add Recipient" page
    await page.goto('https://scopex.money/Add-Recipient');

    let success = false;
    while (!success) {
      success = await submitRecipientDetails(page, account_name, account_number, ifsc_code);

      if (success) {
        const confirmed = await verifyAndConfirmRecipient(page, account_name);
        if (confirmed) {
          break;  // Exit the loop if the recipient is added successfully
        }
      }

      if (i === 3) {
        console.log('Waiting for 4 minutes after 4 failed attempts...');
        await page.waitForTimeout(240000); // Wait for 4 minutes (240,000 ms)
      }
    }
  }

  // Step 4: Log out
  await logout(page);
});