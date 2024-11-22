import requests
from PyPDF2 import PdfReader
from io import BytesIO
import json
import openai  # Install the OpenAI Python client library with `pip install openai`

# Set your OpenAI API key
openai.api_key = ""

# Load your data
try:
    with open('./restaurants3.json', 'r') as file:
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
            model="gpt-3.5-turbo",  # Use gpt-4 if preferred
            messages=[
                {"role": "system", "content": "You are an assistant that summarizes restaurant inspection reports."},
                {"role": "user", "content": f"The following text contains inspection details of a restaurant. Summarize why the restaurant failed to pass the inspection in two sentences:\n\n{text}"}
            ]
        )
        # Extract and return the summary
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Error generating summary: {str(e)}"

# Specify the batch number
batch_number = 31  # Change this value to process the next batch (e.g., 1 for the first 10, 2 for the next 10, etc.)
batch_size = 10
batch_start = (batch_number - 1) * batch_size
batch_end = batch_start + batch_size
batch = data[batch_start:batch_end]  # Get the specified batch

print(f"Processing batch {batch_number} (restaurants {batch_start + 1} to {batch_end})...")

# Process the batch
for idx, entry in enumerate(batch, start=batch_start + 1):
    pdf_url = entry['pdfUrl']
    extracted_text = extract_pdf_text(pdf_url)
    entry['extractedText'] = extracted_text  # Add the extracted text to the entry
    print(f"Extracted text length for {entry['name']}: {len(extracted_text)}")
    
    # Generate a summary using AI
    if extracted_text != "No text found" and not extracted_text.startswith("Error"):
        summary = summarize_text(extracted_text)
    else:
        summary = "No valid text found to summarize."
    
    entry['summary'] = summary  # Add the summary to the entry

    # Print the summary for review
    print(f"{idx}. Summary for {entry['name']}:")
    print(summary)
    print("-" * 80)

# Save progress after processing the batch
try:
    with open('./restaurants3.json', 'w') as file:
        json.dump(data, file, indent=4)  # Pretty-print the JSON with an indent
    print("Batch progress saved successfully.")
except Exception as e:
    print(f"Error saving the updated JSON file: {str(e)}")
