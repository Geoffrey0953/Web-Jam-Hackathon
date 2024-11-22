import json
from pymongo import MongoClient
import sys
from datetime import datetime
import logging
from urllib.parse import quote_plus
import requests

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class RestaurantInspectionLoader:
    def __init__(self, connection_string, database_name):
        """Initialize MongoDB connection"""
        try:
            self.client = MongoClient(connection_string)
            self.db = self.client[database_name]
            logger.info(f"Successfully connected to database: {database_name}")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise


    def fetchData(self, address):
        url_safe_address = quote_plus(address)
        APIKEY = "AIzaSyDsEGZgrOkbNKUQaT_2OuMbBqNL5gjO1iI"
        url = f"https://maps.googleapis.com/maps/api/geocode/json?address={url_safe_address}&key={APIKEY}"
        
        try:
            # Make HTTP request
            response = requests.get(url)
            response.raise_for_status()  # Raise an exception for bad status codes
            
            # Parse JSON response
            data = response.json()
            
            # Check if the request was successful
            if data['status'] == 'OK':
                # Get the first result
                result = data['results'][0]
                
                # Extract location data
                location = result['geometry']['location']
                #formatted_address = result['formatted_address']
                
                return location
            # {
                    
            #         # 'lat': location['lat'],
            #         # 'lng': location['lng'],
            #         #'formatted_address': formatted_address
            #     }
            else:
                logger.error(f"Geocoding failed with status: {data['status']}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching geocoding data: {str(e)}")
            return None

    def extract_required_fields(self, document):
        """Extract and validate required fields from the document"""
        try:
            return {
                "name": document["name"],
                "address": document["address"],
                "summary": document["summary"],
                "pdfUrl": document["pdfUrl"],
                "categories": document["categories"],
                "location": self.fetchData(document["address"]),
                "imported_at": datetime
                .utcnow()
            }
        except KeyError as e:
            logger.error(f"Missing required field: {str(e)}")
            raise

    def load_json_file(self, file_path, collection_name):
        """Load JSON file into MongoDB collection"""
        try:
            # Read JSON file
            with open(file_path, 'r') as file:
                data = json.load(file)
            
            # Get the collection
            collection = self.db[collection_name]
             
            documents_to_insert = []
            
            # Handle both single document and array of documents
            if isinstance(data, list):
                for doc in data:
                    processed_doc = self.extract_required_fields(doc)
                    documents_to_insert.append(processed_doc)
            else:
                processed_doc = self.extract_required_fields(data)
                documents_to_insert.append(processed_doc)
            
            # Insert data
            result = collection.insert_many(documents_to_insert)
            logger.info(f"Successfully inserted {len(result.inserted_ids)} documents")
            
            # Create indexes for better query performance
            collection.create_index("name")
            collection.create_index("address")
            
            return True
            
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON file: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error processing file: {str(e)}")
            raise
        
    def close_connection(self):
        """Close MongoDB connection"""
        self.client.close()
        logger.info("MongoDB connection closed")

def main():
    # Configuration
    MONGO_URI = "mongodb+srv://tester:testing123@atlascluster.frneldu.mongodb.net/"  # Replace with your MongoDB connection string
    DATABASE_NAME = "oc_health"   # Replace with your database name
    COLLECTION_NAME = "oc_inspections2"           # Replace with your collection name
    
    if len(sys.argv) != 2:
        print("Usage: python script.py <path_to_json_file>")
        sys.exit(1)
    
    json_file_path = sys.argv[1]
    
    try:
        # Initialize loader
        loader = RestaurantInspectionLoader(MONGO_URI, DATABASE_NAME)
        
        # Process file
        loader.load_json_file(json_file_path, COLLECTION_NAME)
        
        # Close connection
        loader.close_connection()
        
    except Exception as e:
        logger.error(f"Script failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
