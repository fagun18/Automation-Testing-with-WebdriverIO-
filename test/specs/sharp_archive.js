const { expect, browser, $ } = require("@wdio/globals");
const faker = require('faker');

describe("SauceDemo Automation Test", () => {
    it("should complete the purchase process", async () => {
        await browser.setWindowSize(1920, 1080);
        await browser.url('https://www.saucedemo.com/');
        await browser.pause(3000); // Pause for 3 second

        // Input username and password
        await $("#user-name").setValue("standard_user");
        await $("#password").setValue("secret_sauce");
        await browser.pause(2000); // Pause for 2 second

        // Click login button
        await $("#login-button").click();

        // Wait for inventory page to load
        await browser.waitUntil(async () => (await browser.getUrl()) === 'https://www.saucedemo.com/inventory.html');
        await browser.pause(5000); // Pause for 5 second

        // Add first item to cart
        await $("#add-to-cart-sauce-labs-backpack").click();
        await browser.pause(3000); // Pause for 3 second

        // View first item details
        await $("#item_5_title_link > div").click();
        await browser.pause(3000); // Pause for 3 second

        // Wait for item details page to load
        await browser.waitUntil(async () => (await browser.getUrl()) === 'https://www.saucedemo.com/inventory-item.html?id=5');
        await browser.pause(3000); // Pause for 3 second

        // Add first item to cart
        await $("#add-to-cart").click();
        await browser.pause(3000); // Pause for 3 second

        // Go back to products page
        await $("#back-to-products").click();
        await browser.pause(3000); // Pause for 3 second

        // Add second item to cart
        await $("#add-to-cart-sauce-labs-bolt-t-shirt").click();
        await browser.pause(3000); // Pause for 3 second

        // View shopping cart
        await $("#shopping_cart_container > a").click();
        await browser.pause(3000); // Pause for 3 second

        // Proceed to checkout
        await $("#checkout").click();
        await browser.pause(3000); // Pause for 3 second

        // Wait for checkout step one page to load
        await browser.waitUntil(async () => (await browser.getUrl()) === 'https://www.saucedemo.com/checkout-step-one.html');
        await browser.pause(3000); // Pause for 3 second

        // Fill checkout form with random data
        await $("#first-name").setValue(faker.name.firstName());
        await $("#last-name").setValue(faker.name.lastName());
        await $("#postal-code").setValue(faker.address.zipCode());
        await browser.pause(3000); // Pause for 3 second
        await $("#continue").click();
        await browser.pause(3000); // Pause for 3 second

        // Wait for checkout step two page to load
        await browser.waitUntil(async () => (await browser.getUrl()) === 'https://www.saucedemo.com/checkout-step-two.html');
        await browser.pause(3000); // Pause for 3 second

        // Finish purchase
        await $("#finish").click();
        await browser.pause(3000); // Pause for 3 second

        // Wait for checkout complete page to load
        await browser.waitUntil(async () => (await browser.getUrl()) === 'https://www.saucedemo.com/checkout-complete.html');
        await browser.pause(3000); // Pause for 3 second

        // Go back to products page
        await $("#back-to-products").click();
        await browser.pause(5000); // Pause for 5 second
    });
});
