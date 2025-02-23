const { expect } = require('@playwright/test');

async function login(page) {
  await page.goto('https://scopex.money/Login');
  await page.fill('//input[@name="username"]', 'chetanshavanti27@gmail.com');
  await page.fill('//input[@name="password"]', 'Qw#1erty');
  await page.click('//button[contains(text(),"Log in")]');
  await page.waitForTimeout(5000);
  await page.waitForURL('https://scopex.money/Dashboard');
  await page.screenshot({ path: 'screenshots/login.png' });
}

async function logout(page) {
  await page.click('//*[name()="circle" and contains(@cx,"26")]');
  await page.click('//a[contains(text(),"Log out")]');
  await page.waitForTimeout(2000);
  await expect(page.locator('//a[@href="/Login"]')).toBeVisible();
  await page.screenshot({ path: 'screenshots/logout.png' });
}

module.exports = { login, logout };