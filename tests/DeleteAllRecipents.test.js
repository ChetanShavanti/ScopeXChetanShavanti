const { test, expect } = require('@playwright/test');
const fs = require('fs');

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
      
     // Click on the sucess message
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

test('Delete All Recipients', async ({ page }) => {
  // Step 1: Login
  await page.goto('https://scopex.money/Login');
  await page.fill('//input[@name="username"]', 'chetanshavanti27@gmail.com');
  await page.fill('//input[@name="password"]', 'Qw#1erty');
  await page.click('//button[contains(text(),"Log in")]');
  await page.waitForURL('https://scopex.money/Dashboard');

  // Step 2: Navigate to the recipients list page
  await page.goto('https://scopex.money/Recipient-List');

  // Step 3: Delete all recipients
  const recipientsDeleted = await deleteAllRecipients(page);

  // Step 4: Log out
  await page.click('//*[name()="circle" and contains(@cx,"26")]');
  await page.click('//a[contains(text(),"Log out")]');
  await page.waitForTimeout(2000);
  await expect(page.locator('//a[@href="/Login"]')).toBeVisible();

  // Exit if no recipients were found
  if (!recipientsDeleted) {
    console.log('Exiting as no recipients were found.');
    return;
  }
});