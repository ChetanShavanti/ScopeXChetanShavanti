const { test, expect } = require('@playwright/test');
const { login, logout } = require('../utilities/utils');
const { deleteAllRecipients } = require('../utilities/recipientUtils');

test('Delete All Recipients', async ({ page }) => {
  test.setTimeout(900000);

  // Step 1: Login
  await login(page);

  // Step 2: Navigate to the recipients list page
  await page.goto('https://scopex.money/Recipient-List');

  // Step 3: Delete all recipients
  const recipientsDeleted = await deleteAllRecipients(page);

  // Step 4: Log out
  await logout(page);

  // Exit if no recipients were found
  if (!recipientsDeleted) {
    console.log('Exiting as no recipients were found.');
    return;
  }

  // Step 5: Verify that all recipients were deleted
  await page.goto('https://scopex.money/Recipient-List');
  await expect(page.locator('//*[contains(text(),"No recipients record were found!")]')).toBeVisible();

  // Step 6: Log out
  await logout(page);
});