const { expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

// Helper function to fill and submit the form
async function fillAndSubmitForm(page, name, email) {
  await page.fill('//input[@name="name"]', name);
  await page.fill('//input[@name="username"]', email);
  await page.click('//button[@type="submit"]');
  
  // Wait for 3 seconds after clicking submit
  await page.waitForTimeout(3000);
}

// Helper function to check for errors or success after form submission
async function checkFormSubmission(page) {
  return await Promise.race([
    page.waitForSelector('//*[contains(text(),"already exist!")]'),
    page.waitForSelector('//p[contains(text(),"Only letters are allowed")]'),
    page.waitForSelector('//*[contains(text(),"Hello")]') // Success message
  ]);
}

// Main function to register a new user
async function registerNewUser(page) {
  // Open the signup page
  await page.goto('https://scopex.money/SignUp');

  // Generate random name and email using faker.js
  const name = faker.person.fullName();
  let email = faker.internet.email();

  // Fill and submit the form
  await fillAndSubmitForm(page, name, email);

  // Wait for a result (either success or error)
  let result = await checkFormSubmission(page);

  // If an error occurred, handle it
  if (result) {
    const emailExistsMessage = await page.locator('//*[contains(text(),"already exist!")]').isVisible();
    const nameError = await page.locator('//p[contains(text(),"Only letters are allowed")]').isVisible();

    // Retry with a new email if email already exists or there's a name error
    if (emailExistsMessage || nameError) {
      email = faker.internet.email();  // Generate a new email
      await fillAndSubmitForm(page, name, email);  // Refill and submit the form
      await checkFormSubmission(page);  // Check the result again
    }
  }

  // Ensure the page waits until the success message ("Hello") is visible
  await page.waitForSelector('//*[contains(text(),"Hello")]', { timeout: 10000 });

  // Assert that the user has successfully registered
  await expect(page.locator('//*[contains(text(),"Hello")]')).toBeVisible();

  // Take a screenshot after successful registration
  await page.screenshot({ path: 'screenshots/NewUserRegister.png' });
}

module.exports = { registerNewUser };
