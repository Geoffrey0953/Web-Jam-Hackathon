import requests
from PyPDF2 import PdfReader
from io import BytesIO
import json
import openai  # Install the OpenAI Python client library with `pip install openai`

# Set your OpenAI API key

# Load your data
try:
    with open('./updated_testData.json', 'r') as file:
        data = json.load(file)
        if not data:
            print("No data found in the JSON file.")
            exit()
except FileNotFoundError:
    print("JSON file not found. Ensure the file exists and the path is correct.")
    exit()

def extract_pdf_text(url):
    try:
        # Download the PDF with a timeout
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Load the PDF content into PyPDF2
        pdf_reader = PdfReader(BytesIO(response.content))
        text = ""
        
        # Extract text from all pages
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        # Return all extracted text
        return text if text else "No text found"
    except requests.exceptions.Timeout:
        return "Error: Timeout while downloading the PDF"
    except requests.exceptions.RequestException as e:
        return f"Error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"

def summarize_text(text):
    try:
        # Use OpenAI ChatCompletion API for summarization
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0125",  # Use gpt-4 if you prefer higher accuracy and are okay with higher costs
            messages=[
                {"role": "system", "content": "You are an assistant that summarizes restaurant inspection reports."},
                {"role": "user", "content": f"The following text contains inspection details of a restaurant. Summarize why the restaurant failed to pass the inspection in two sentences:\n\n{text}"}
            ]
        )
        # Extract and return the summary
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Error generating summary: {str(e)}"



# Iterate through the data, scrape the PDFs, and generate summaries
for idx, entry in enumerate(data):
    pdf_url = entry['pdfURL']
    extracted_text = extract_pdf_text(pdf_url)
    entry['extractedText'] = extracted_text  # Add the extracted text to the entry
    print(len(extracted_text))
    # Generate a summary using AI
    if extracted_text != "No text found" and not extracted_text.startswith("Error"):
        summary = summarize_text(extracted_text)
    else:
        summary = "No valid text found to summarize."
    
    entry['summary'] = summary  # Add the summary to the entry

    # Print the summary for review
    print(f"{idx+1}. Summary for {entry['name']}:")
    print(summary)
    print("-" * 80)

# Save the updated data back to the JSON file
try:
    with open('./updated_testData.json', 'w') as file:
        json.dump(data, file, indent=4)  # Pretty-print the JSON with an indent
    print("Updated JSON file saved successfully.")
except Exception as e:
    print(f"Error saving the updated JSON file: {str(e)}")
