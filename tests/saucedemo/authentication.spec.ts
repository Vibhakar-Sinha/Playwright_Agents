import { test, expect } from '@playwright/test';

test.describe('Sign in and session access', () => {
  test('Sign in with valid credentials and reject invalid credentials', async ({ page }) => {
    // 1. Open https://www.saucedemo.com in a fresh browser context. Verify login form.
    await page.goto('https://www.saucedemo.com');
    await expect(page.getByRole('form', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // 2. Submit the form with both fields empty. Verify a visible error for the missing username.
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('alert')).toContainText('Username is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // 3. Enter an unrecognized username and an incorrect password, then select Login. Verify an authentication error.
    await page.getByRole('textbox', { name: 'Username' }).fill('unknown_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('alert')).toContainText('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // 4. Enter standard_user and secret_sauce, then select Login. Verify the product catalog.
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.getByRole('combobox', { name: 'Sort products' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
  });
});
