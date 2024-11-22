import puppeteer from "puppeteer";
import fs from "fs";
import testData from "./restaurants.json" assert { type: "json" };

// Delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapePdfUrls() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Define batch range (adjust as needed for different batches)
    const batchSize = 10;
    const batchIndex = 22; // Change this for each batch: 0 for the first 10, 1 for the next 10, etc.
    const start = batchIndex * batchSize;
    const end = start + batchSize;

    // Limit to the current batch of restaurants
    const limitedData = testData.slice(start, end);

    // Load existing data if available
    let existingData = [];
    const filePath = "./testDataWithPdfUrls.json";
    if (fs.existsSync(filePath)) {
      existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    // Update only the current batch
    for (const restaurant of limitedData) {
      console.log(`Visiting details page for ${restaurant.name}...`);
      await page.goto(restaurant.detailsLink, { waitUntil: "networkidle2" });

      // Wait for the page to load fully and give additional buffer time
      await delay(2000); // Add a 2-second delay to ensure the page is fully rendered

      // Wait for the "View" button to appear
      const viewButtonSelector = ".inspection-listing-view-button";
      try {
        await page.waitForSelector(viewButtonSelector, { timeout: 5000 }); // Timeout after 5 seconds if not found

        // Extract the PDF URL from the first "View" button
        const pdfUrl = await page.evaluate((selector) => {
          const viewButton = document.querySelector(selector);
          return viewButton ? viewButton.href : null;
        }, viewButtonSelector);

        if (!pdfUrl) {
          console.error(
            `No "View" button found for ${restaurant.name}. Skipping...`
          );
          restaurant.pdfUrl = null; // Set to null if no URL is found
        } else {
          const fullPdfUrl = pdfUrl.startsWith("/")
            ? `https://inspections.myhealthdepartment.com${pdfUrl}`
            : pdfUrl;

          console.log(`PDF URL for ${restaurant.name}: ${fullPdfUrl}`);
          restaurant.pdfUrl = fullPdfUrl; // Add the URL to the restaurant object
        }
      } catch (error) {
        console.error(
          `Timeout waiting for "View" button for ${restaurant.name}. Skipping...`
        );
        restaurant.pdfUrl = null; // Set to null if timeout occurs
      }
    }

    // Merge updated batch with existing data
    const updatedData = [...existingData];
    for (const restaurant of limitedData) {
      const index = updatedData.findIndex((r) => r.name === restaurant.name);
      if (index !== -1) {
        updatedData[index] = restaurant; // Update existing entry
      } else {
        updatedData.push(restaurant); // Add new entry
      }
    }

    // Save the merged data back to the file
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    console.log("Updated data saved to testDataWithPdfUrls.json");
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }
}

scrapePdfUrls();
