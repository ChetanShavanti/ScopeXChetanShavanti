const { test, expect } = require('@playwright/test');
const { login, logout } = require('../utilities/utils');
const { addRecipientsFromCSV } = require('../utilities/recipientUtils');

test('Add Recipient with Retry Logic', async ({ page }) => {
  test.setTimeout(900000); 

  // Step 1: Login
  await login(page);

  // Step 2: Add recipients from CSV
  await addRecipientsFromCSV(page);

  // Step 3: Log out
  await logout(page);
});