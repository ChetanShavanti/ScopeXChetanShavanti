const { expect } = require('@playwright/test');
const { getAccountData } = require('./csvUtils');

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

// Function to add recipients from CSV data with retries
async function addRecipientsFromCSV(page) {
  // Read account data from CSV
  const accountData = await getAccountData();

  // Add recipient from CSV data with retries
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
}

// Function to delete all recipients
async function deleteAllRecipients(page) {
  // Check if there are no recipients
  const noRecipientsMessage = await page.locator('//*[contains(text(),"No recipients record were found!")]').isVisible();
  if (noRecipientsMessage) {
    console.log('No recipient found');
    return false;
  }

  // Get the count of pagination items
  const paginationCount = await page.locator('.sw-pagination li').count();

  for (let i = 0; i < paginationCount; i++) {
    // Get the count of collapse buttons
    const collapseButtonCount = await page.locator('//button[@data-test="collapse"]').count();

    for (let j = 0; j < collapseButtonCount; j++) {
      // Click on the collapse button
      await page.locator('//button[@data-test="collapse"]').nth(j).click();

      // Click on the delete button
      await page.locator('//button[contains(text(),"Delete")]').click();

      // Click on the confirmation button
      await page.locator('//button[contains(text(),"Yes")]').click();

      // Verify the success message
      await expect(page.locator('//*[contains(text(),"You have successfully deleted recipient!")]')).toBeVisible();
      
      // Click on the success message
      await page.locator('//*[contains(text(),"You have successfully deleted recipient!")]').click();

      // Wait for 1 second
      await page.waitForTimeout(1000);
    }

    // Move to the next page if there are more pages
    if (i < paginationCount - 1) {
      await page.locator('.sw-pagination li').nth(i + 1).click();
      await page.waitForTimeout(2000); // Wait for the page to load
    }
  }
  return true;
}

module.exports = { submitRecipientDetails, verifyAndConfirmRecipient, addRecipientsFromCSV, deleteAllRecipients };