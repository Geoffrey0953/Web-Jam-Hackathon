import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeReinspectionRestaurants() {
  const url = 'https://inspections.myhealthdepartment.com/orange-county';

  const browser = await puppeteer.launch({ headless: false }); // Non-headless mode for debugging
  const page = await browser.newPage();

  try {
    console.log('Navigating to the page...');
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('Waiting for dropdown...');
    await page.waitForSelector('#filterpurpose', { timeout: 60000 });

    console.log('Selecting "Reinspection" option...');
    await page.select('#filterpurpose', 'REINSPECTION');

    console.log('Waiting for initial results to load...');
    await page.waitForSelector('div.establishment-name-column', { timeout: 60000 });

    // Click "Load More Results" button until it disappears
    let loadMoreVisible = true;
    while (loadMoreVisible) {
      try {
        console.log('Checking for "Load More Results" button...');
        await page.waitForSelector('button.load-more-results-button:not([disabled])', { timeout: 10000 });
        console.log('Clicking "Load More Results" button...');
        await page.click('button.load-more-results-button');

        // Wait for "Loading..." state to complete
        console.log('Waiting for "Loading..." state to finish...');
        await page.waitForFunction(() => {
          const button = document.querySelector('button.load-more-results-button');
          return button && button.textContent.trim() === 'Load More Results';
        }, { timeout: 30000 });

      } catch (e) {
        console.log('"Load More Results" button not found or no more results. Assuming all results are loaded.');
        loadMoreVisible = false;
      }
    }

    console.log('Scraping results...');
    const restaurants = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('div.establishment-name-column').forEach((element) => {
        const nameElement = element.querySelector('h4.establishment-list-name a');
        const addressElement = element.querySelector('.establishment-list-address');
        const name = nameElement?.innerText.trim() || 'N/A';
        const address = addressElement?.innerText.trim() || 'N/A';
        const detailsLink = nameElement?.getAttribute('href') || 'N/A';

        results.push({
          name,
          address,
          detailsLink: detailsLink.startsWith('/') ? `https://inspections.myhealthdepartment.com${detailsLink}` : detailsLink,
        });
      });
      return results;
    });

    console.log('Scraped restaurants:', restaurants);

    // Export to JSON file
    console.log('Saving data to restaurants.json...');
    fs.writeFileSync('restaurants.json', JSON.stringify(restaurants, null, 2));
    console.log('Data saved successfully.');

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

scrapeReinspectionRestaurants();
