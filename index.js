/**
 * @Author: Bernard Hanna
 * @Date:   2023-06-20 17:26:09
 * @Last Modified by:   Bernard Hanna
 * @Last Modified time: 2023-06-20 17:33:38
 */
const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the WordPress site
  await page.goto('http://localhost:10044');

  // Find Contact Form 7 forms
  const forms = await page.$$eval('.wpcf7-form', forms => forms.map(form => form.action));

  // Initialize an array to store the results
  let results = [];

  // Test each form
  for (let form of forms) {
    try {
      // Navigate to the form's action URL
      await page.goto(form);

      // Fill out and submit the form
      await page.type('input[name="your-name"]', 'Test Name');
      await page.type('input[name="your-email"]', 'test@example.com');
      await page.click('input[type="submit"]');

      // Wait for the page to navigate after submitting the form
      await page.waitForNavigation();

      // Check the response
      const responseText = await page.$eval('.wpcf7-response-output', el => el.textContent);

      // Add the result to the results array
      results.push({ form, responseText });
    } catch (error) {
      // If an error occurs, add it to the results array
      results.push({ form, error: error.message });
    }
  }

  // Close the browser
  await browser.close();

  // Print the results
  console.log(results);
}

run();
