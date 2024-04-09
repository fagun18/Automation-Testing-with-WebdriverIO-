const { expect, browser, $ } = require("@wdio/globals");
const faker = require('faker');
const fs = require('fs');

// Function to take a screenshot
async function takeScreenshot(filename) {
    const screenshot = await browser.takeScreenshot();
    fs.writeFileSync(filename, screenshot, 'base64');
}

// Function to send results to Slack
async function sendResultsToSlack(message, progressMessage, snapshotPath) {
    // Placeholder for sending test results to Slack channel
    // You'll need to implement this function using Slack API
    // Here's a basic example using webhook URL:

    const slackWebhookUrl = 'Insert your Slack webhook url';

    const axios = require('axios');

    try {
        // Prepare the message payload
        let payload = {
            text: message
        };

        // Add progress message to payload if provided
        if (progressMessage) {
            payload.text += "\nProgress: " + progressMessage;
        }

        // Add snapshot if provided
        if (snapshotPath) {
            // Read the snapshot file
            const snapshot = fs.readFileSync(snapshotPath);
            // Attach snapshot to payload
            payload.files = [{
                name: 'test_result.png',
                content: snapshot.toString('base64'),
                filetype: 'auto'
            }];
        }

        // Send payload to Slack
        const response = await axios.post(slackWebhookUrl, payload);

        if (response.status === 200) {
            console.log('Results sent to Slack:', message);
        } else {
            console.error('Failed to send results to Slack:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending results to Slack:', error.message);
    }
}

describe("SauceDemo Automation Test", () => {
    it("should complete the purchase process", async () => {
        try {
            // Set browser window size to maximal screen resolution
            await browser.maximizeWindow();

            await browser.url('https://www.saucedemo.com/');
            await browser.pause(3000);
            await sendResultsToSlack("Test started", "Navigated to saucedemo.com");

            // Input username and password
            await $("#user-name").setValue("standard_user");
            await $("#password").setValue("secret_sauce");
            await browser.pause(2000);

            // Click login button
            await $("#login-button").click();
            await browser.pause(1000); // Added a short pause

            // Wait for inventory page to load
            await browser.waitUntil(async () => (await browser.getUrl()) === 'https://www.saucedemo.com/inventory.html');
            await browser.pause(3000); // Added a short pause
            await sendResultsToSlack("Logged in successfully", "Inventory page loaded");

            // Add first item to cart
            await $("#add-to-cart-sauce-labs-backpack").click();
            await browser.pause(1000); // Added a short pause
            await sendResultsToSlack("Added first item to cart", "First item added");
            await browser.pause(1000); // Added a short pause

            // View first item details
            await $("#item_5_title_link > div").click();
            await browser.pause(2000); // Added a short pause
            await sendResultsToSlack("Viewed first item details");
            await browser.pause(3000); // Added a short pause

            // Wait for item details page to load
            await browser.waitUntil(async () => (await browser.getUrl()) === 'https://www.saucedemo.com/inventory-item.html?id=5');
            await browser.pause(4000); // Added a short pause

            // Add first item to cart
            await $("#add-to-cart").click();
            await sendResultsToSlack("Added first item to cart");
            await browser.pause(1000); // Added a short pause

            // Go back to products page
            await $("#back-to-products").click();
            await browser.pause(1000); // Added a short pause
            await sendResultsToSlack("Navigated back to products page");
            await browser.pause(1000); // Added a short pause

            // Add second item to cart
            await $("#add-to-cart-sauce-labs-bolt-t-shirt").click();
            await browser.pause(1000); // Added a short pause
            await sendResultsToSlack("Added second item to cart");
            await browser.pause(1000); // Added a short pause

            // View shopping cart
            await $("#shopping_cart_container > a").click();
            await browser.pause(3000); // Added a short pause
            await sendResultsToSlack("Viewed shopping cart");
            await browser.pause(1000); // Added a short pause

            // Proceed to checkout
            await $("#checkout").click();
            await browser.pause(4000); // Added a short pause
            await sendResultsToSlack("Proceeded to checkout");
            await browser.pause(1000); // Added a short pause

            // Wait for checkout step one page to load
            await browser.waitUntil(async () => (await browser.getUrl()) === 'https://www.saucedemo.com/checkout-step-one.html');
            await browser.pause(5000); // Added a short pause

            // Fill checkout form with random data
            await $("#first-name").setValue(faker.name.firstName());
            await browser.pause(1000); // Added a short pause
            await $("#last-name").setValue(faker.name.lastName());
            await browser.pause(1000); // Added a short pause
            await $("#postal-code").setValue(faker.address.zipCode());
            await browser.pause(1000); // Added a short pause
            await $("#continue").click();
            await browser.pause(1000); // Added a short pause
            await sendResultsToSlack("Filled checkout form");
            await browser.pause(1000); // Added a short pause

            // Wait for checkout step two page to load
            await browser.waitUntil(async () => (await browser.getUrl()) === 'https://www.saucedemo.com/checkout-step-two.html');
            await browser.pause(3000); // Added a short pause

            // Finish purchase
            await $("#finish").click();
            await browser.pause(1000); // Added a short pause
            await sendResultsToSlack("Finished purchase");
            await browser.pause(3000); // Added a short pause

            // Wait for checkout complete page to load
            await browser.waitUntil(async () => (await browser.getUrl()) === 'https://www.saucedemo.com/checkout-complete.html');
            await browser.pause(2000); // Added a short pause
            await sendResultsToSlack("Checkout complete", "Test completed successfully!");
            await browser.pause(1000); // Added a short pause

            // Go back to products page
            await $("#back-to-products").click();
            await browser.pause(1000); // Added a short pause
            await sendResultsToSlack("Navigated back to products page");
            await browser.pause(5000); // Added a short pause

            // Take a snapshot
            await takeScreenshot("test_result.png");

            // Send test results to Slack with snapshot
            await sendResultsToSlack("Automation Testing completed successfully!", null, "test_result.png");
        } catch (error) {
            console.error('Error occurred:', error);
            await sendResultsToSlack("Test failed with error: " + error.message);
            throw error; // Re-throw the error to fail the test
        }
    });
});
