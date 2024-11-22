import puppeteer from "puppeteer";
import pdfParse from "pdf-parse";
import fs from "fs/promises";

// Load the data from the JSON file
const jsonFile = "./updated_testData.json";
let restaurantData = JSON.parse(await fs.readFile(jsonFile, "utf-8"));

async function scrapePDFContents() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    for (const restaurant of restaurantData) {
      if (!restaurant.pdfURL) {
        console.log(`No PDF URL for ${restaurant.name}, skipping...`);
        restaurant.pdfSnippet = null;
        continue;
      }

      console.log(`Accessing PDF for ${restaurant.name}...`);
      const response = await page.goto(restaurant.pdfURL, {
        waitUntil: "networkidle2",
      });

      // Download the PDF as a buffer
      const pdfBuffer = await response.buffer();

      if (!pdfBuffer || pdfBuffer.length === 0) {
        console.log(
          `Failed to download PDF for ${restaurant.name}, skipping...`
        );
        restaurant.pdfSnippet = null;
        continue;
      }

      console.log(`Extracting data from the PDF for ${restaurant.name}...`);
      try {
        const pdfData = await pdfParse(pdfBuffer);
        const snippet = pdfData.text.slice(0, 100).trim(); // Extract first 100 characters
        restaurant.pdfSnippet = snippet;
        console.log(`Snippet for ${restaurant.name}: ${snippet}`);
      } catch (error) {
        console.error(`Failed to parse PDF for ${restaurant.name}:`, error);
        restaurant.pdfSnippet = null;
      }

      // Optional: Add a delay between requests to avoid server overload
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Save the updated data back to the JSON file
    console.log("Saving updated data to JSON...");
    await fs.writeFile(
      "./updated_testData_with_snippets.json",
      JSON.stringify(restaurantData, null, 2)
    );
    console.log("Data saved to updated_testData_with_snippets.json.");
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }
}

scrapePDFContents();
