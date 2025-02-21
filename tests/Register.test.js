const { test, expect } = require('@playwright/test');
const { registerNewUser } = require('../utilities/registerUtils');
const { addRecipientsFromCSV } = require('../utilities/recipientUtils');
const { logout } = require('../utilities/utils');

test('Register a user and Add Recipients', async ({ page }) => {
  test.setTimeout(900000);

  // Step 1: Register a new user
  await registerNewUser(page);

  // Step 2: Add recipients from CSV
  await addRecipientsFromCSV(page);

  // Step 3: Log out
  await logout(page);
});