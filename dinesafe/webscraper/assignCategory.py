import openai
import json

# Define your OpenAI API key
openai.api_key = ""
# Predefined categories
categories = [
    "Pest Infestation",
    "Unsanitary Practices",
    "Improper Food Storage",
    "Improper Cooking or Reheating",
    "Personal Hygiene Violations",
    "Improper Cleaning and Sanitizing",
    "Equipment Issues"
]

# Path to your JSON file
file_path = "restaurants4.json"

# Load your existing JSON data
with open(file_path, "r") as file:
    data = json.load(file)

# Process each restaurant
for idx, restaurant in enumerate(data, start=1):
    summary = restaurant.get("summary", "")
    if "categories" not in restaurant:  # Skip if categories already added
        print(f"Processing {idx}/{len(data)}: {restaurant.get('name', 'Unknown')}")
        prompt = f"""Analyze the following restaurant inspection summary and determine which of the following categories are relevant:
{', '.join(categories)}.

Summary:
"{summary}"

Respond with a JSON object where each category is a key and the value is true or false.
"""
        try:
            # Use the correct method for chat-based models
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200
            )

            # Parse the response content
            content = response["choices"][0]["message"]["content"].strip()
            categories_result = json.loads(content)  # Convert JSON string to dict
            restaurant["categories"] = categories_result
        except json.JSONDecodeError:
            restaurant["categories"] = {cat: False for cat in categories}  # Default to all false
        except Exception:
            restaurant["categories"] = {cat: False for cat in categories}  # Default to all false

# Save updated data back to the same file
with open(file_path, "w") as file:
    json.dump(data, file, indent=4)

print(f"Categorization completed and saved to '{file_path}'.")