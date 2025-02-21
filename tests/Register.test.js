const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test('SignUp and Dashboard Verification', async ({ page }) => {
  // Step 1: Open the signup page
  await page.goto('https://scopex.money/SignUp');

  // Step 2: Enter a random full name
  await page.fill('//input[@name="name"]', faker.person.fullName());

  // Step 3: Enter a random email
  let email = faker.internet.email();
  await page.fill('//input[@name="username"]', email);

  // Step 4: Submit the form
  await page.click('//button[@type="submit"]');

  // Step 5: Check if the email already exists and try another email if it does
  const emailExistsMessage = await page.locator('//*[contains(text(),"already exist!")]').isVisible();
  if (!emailExistsMessage) {
    await page.waitForTimeout(2000);
  } 
  else {
    email = faker.internet.email();
    await page.fill('//input[@name="username"]', email);
    await page.click('//button[@type="submit"]');
  }

  // Step 6: Assert that the menu is active
  await expect(page.locator('.menu-active')).toBeVisible();

  // Step 7: Log out
  await page.click('//*[name()="circle" and contains(@cx,"26")]');
  await page.click('//a[contains(text(),"Log out")]');
  await page.waitForTimeout(2000);
  await expect(page.locator('//a[@href="/Login"]')).toBeVisible();
});