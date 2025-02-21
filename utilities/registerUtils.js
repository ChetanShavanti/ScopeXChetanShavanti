const { expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

// Helper function to register a new user
async function registerNewUser(page) {
  // Open the signup page
  await page.goto('https://scopex.money/SignUp');

  // Enter a random full name using faker.js
  await page.fill('//input[@name="name"]', faker.person.fullName());

  // Enter a random email using faker.js
  let email = faker.internet.email();
  await page.fill('//input[@name="username"]', email);

  // Submit the form
  await page.click('//button[@type="submit"]');

  await Promise.race([
    page.waitForSelector('//*[contains(text(),"already exist!")]'),
    page.waitForSelector('.menu-active')
  ]);

  // Check if the email already exists and try another email if it does
  const emailExistsMessage = await page.locator('//*[contains(text(),"already exist!")]').isVisible();
  const nameError = await page.locator('//p[contains(text(),"Only letters are allowed")]').isVisible();

  if (emailExistsMessage || nameError) {
    email = faker.internet.email();
    await page.fill('//input[@name="username"]', email);
    await page.click('//button[@type="submit"]');
    await page.waitForTimeout(1000);
  }

  // Assert that the menu is active
  await page.waitForTimeout(2000);
  await expect(page.locator('.menu-active')).toBeVisible();
}

module.exports = { registerNewUser };