# SauceDemo Core E-commerce Operations Test Plan

## Application Overview

Functional test plan for the SauceDemo storefront at https://www.saucedemo.com. The application presents documented demo credentials, a six-product catalog with sorting and product-detail views, add/remove cart actions, checkout information and order overview steps, and an order-completion confirmation. All scenarios begin from a fresh browser state with no existing session or cart. Use standard_user / secret_sauce for successful customer flows unless a test specifically covers login failure.

## Test Scenarios

### 1. 1. Sign in and session access

**Seed:** `tests/seed.spec.ts`

#### 1.1. Sign in with valid credentials and reject invalid credentials

**File:** `tests/saucedemo/authentication.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com in a fresh browser context.
    - expect: The Swag Labs login form displays Username and Password fields and a Login button.
  2. Submit the form with both fields empty.
    - expect: The user remains on the login screen and a visible validation error identifies the missing username.
  3. Enter an unrecognized username and an incorrect password, then select Login.
    - expect: The user remains on the login screen and a visible authentication error is shown.
  4. Enter standard_user and secret_sauce, then select Login.
    - expect: The user is taken to the Products catalog at /inventory.html.
    - expect: The catalog displays six products, a product sort control, and an empty cart indicator.

### 2. 2. Discover and select products

**Seed:** `tests/seed.spec.ts`

#### 2.1. Browse, sort, and inspect a catalog product

**File:** `tests/saucedemo/product-discovery.spec.ts`

**Steps:**
  1. Sign in with standard_user / secret_sauce from a fresh browser context.
    - expect: The Products catalog displays six products, names, descriptions, prices, and Add to cart buttons.
  2. Change the sort control to Price (low to high), then Price (high to low).
    - expect: Products reorder by price in the selected direction; the control reflects the active sort option.
  3. Select the Sauce Labs Backpack product name or image.
    - expect: The product detail page displays the matching product name, image, description, price, Add to cart, and Back to products controls.
  4. Select Back to products.
    - expect: The user returns to the catalog and can continue shopping.

### 3. 3. Manage the shopping cart

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add items, review cart, remove an item, and continue shopping

**File:** `tests/saucedemo/cart-management.spec.ts`

**Steps:**
  1. Sign in with standard_user / secret_sauce from a fresh browser context.
    - expect: The Products catalog is visible and the cart is empty.
  2. Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart.
    - expect: The cart indicator shows two items.
    - expect: Each added product's control changes from Add to cart to Remove.
  3. Open the cart.
    - expect: Your Cart lists both selected products, each with quantity 1, description, price, and a Remove control.
    - expect: Continue Shopping and Checkout actions are available.
  4. Remove Sauce Labs Bike Light from the cart.
    - expect: The cart shows only Sauce Labs Backpack and the cart indicator reflects one item.
  5. Select Continue Shopping.
    - expect: The Products catalog is displayed and the remaining cart item is preserved.

### 4. 4. Provide checkout information and review the order

**Seed:** `tests/seed.spec.ts`

#### 4.1. Validate required information and verify order totals

**File:** `tests/saucedemo/checkout-review.spec.ts`

**Steps:**
  1. Sign in with standard_user / secret_sauce, add Sauce Labs Backpack, open the cart, and select Checkout.
    - expect: Checkout: Your Information is displayed with First Name, Last Name, and Zip/Postal Code fields and Continue/Cancel buttons.
  2. Leave all customer-information fields empty and select Continue.
    - expect: Checkout does not advance and a visible validation error identifies the required missing field.
  3. Enter Alex as first name, Tester as last name, and 90210 as postal code; select Continue.
    - expect: Checkout: Overview is displayed with the selected item and its price.
    - expect: Payment and shipping information are shown.
    - expect: Item total, tax, and grand total are displayed; for the $29.99 Backpack the observed total is $32.39, including $2.40 tax.
  4. Select Cancel from the overview.
    - expect: The user returns to the catalog without placing the order.

### 5. 5. Place the order and confirm completion

**Seed:** `tests/seed.spec.ts`

#### 5.1. Complete checkout and verify order confirmation

**File:** `tests/saucedemo/order-completion.spec.ts`

**Steps:**
  1. Sign in with standard_user / secret_sauce, add one product, open the cart, select Checkout, and provide valid first name, last name, and postal code.
    - expect: The checkout overview shows the selected product, payment and shipping information, item total, tax, and total.
  2. Review the item and totals, then select Finish.
    - expect: The Checkout: Complete! page appears with a Thank you for your order! confirmation and dispatch message.
    - expect: The cart indicator is empty.
    - expect: A Back Home action is available.
  3. Select Back Home, open the navigation menu, and select Logout.
    - expect: The user is logged out and returned to the login page.
