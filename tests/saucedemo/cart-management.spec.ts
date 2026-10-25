import { test, expect } from '@playwright/test';

test.describe('Manage the shopping cart', () => {
  test('Add items, review cart, remove an item, and continue shopping', async ({ page }) => {
    // 1. Sign in with standard_user / secret_sauce from a fresh browser context.
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();

    // 2. Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.getByRole('button', { name: 'Cart, 2 items' })).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

    // 3. Open the cart and review products, quantities, descriptions, prices, and actions.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    const backpack = cartItems.filter({ hasText: 'Sauce Labs Backpack' });
    const bikeLight = cartItems.filter({ hasText: 'Sauce Labs Bike Light' });
    for (const item of [backpack, bikeLight]) {
      await expect(item.locator('.cart_quantity')).toHaveText('1');
      await expect(item.locator('.inventory_item_desc')).toBeVisible();
      await expect(item.locator('.inventory_item_price')).toBeVisible();
      await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();

    // 4. Remove Sauce Labs Bike Light from the cart.
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(cartItems).toHaveCount(1);
    await expect(backpack).toBeVisible();
    await expect(bikeLight).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();

    // 5. Select Continue Shopping.
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  });
});
