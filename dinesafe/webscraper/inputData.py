import json
from pymongo import MongoClient
import sys
from datetime import datetime
import logging

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

    def extract_required_fields(self, document):
        """Extract and validate required fields from the document"""
        try:
            return {
                "name": document["name"],
                "address": document["address"],
                "summary": document["summary"],
                "pdfUrl": document["pdfUrl"],
                "categories": document["categories"],
                "imported_at": datetime.utcnow()
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
