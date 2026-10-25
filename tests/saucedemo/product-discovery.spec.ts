import { test, expect } from '@playwright/test';

test.describe('Discover and select products', () => {
  test('Browse, sort, and inspect a catalog product', async ({ page }) => {
    // 1. Sign in with standard_user / secret_sauce from a fresh browser context.
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems).toHaveCount(6);
    await expect(page.getByRole('combobox', { name: 'Sort products' })).toBeVisible();
    for (const item of await inventoryItems.all()) {
      await expect(item.locator('.inventory_item_name')).toBeVisible();
      await expect(item.locator('.inventory_item_desc')).toBeVisible();
      await expect(item.locator('.inventory_item_price')).toBeVisible();
      await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }

    // 2. Change the sort control to Price (low to high), then Price (high to low).
    const sortProducts = page.getByRole('combobox', { name: 'Sort products' });
    await sortProducts.selectOption('lohi');
    await expect(sortProducts).toHaveValue('lohi');
    await expect(inventoryItems.first().locator('.inventory_item_name')).toHaveText('Sauce Labs Onesie');
    await expect(inventoryItems.last().locator('.inventory_item_name')).toHaveText('Sauce Labs Fleece Jacket');
    await sortProducts.selectOption('hilo');
    await expect(sortProducts).toHaveValue('hilo');
    await expect(inventoryItems.first().locator('.inventory_item_name')).toHaveText('Sauce Labs Fleece Jacket');
    await expect(inventoryItems.last().locator('.inventory_item_name')).toHaveText('Sauce Labs Onesie');

    // 3. Select the Sauce Labs Backpack product by its title and verify its details.
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(page.getByRole('img', { name: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.getByText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.')).toBeVisible();
    await expect(page.getByText('$29.99', { exact: true })).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();

    // 4. Select Back to products.
    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryItems).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'Add to cart' }).first()).toBeVisible();
  });
});
