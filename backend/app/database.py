from pymongo import MongoClient
import urllib.parse

# MongoDB Atlas credentials
USERNAME = "hrconnect"
PASSWORD = "BhhzaYpiVQ5AFG"
CLUSTER = "cluster0.q8twacw.mongodb.net"
DB_NAME = "HRMSethara"

# Encode username & password in case they have special characters
username = urllib.parse.quote_plus(USERNAME)
password = urllib.parse.quote_plus(PASSWORD)

# Connection string
MONGO_URI = f"mongodb+srv://hrconnect:BhhzaYpiVQ5AFG@cluster0.q8twacw.mongodb.net/HRMSethara?appName=Cluster0"

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
employee_collection = db.employees
attendance_collection = db.attendance


# mongodb+srv://hrconnect:BhhzaYpiVQ5AFG@cluster0.q8twacw.mongodb.net/?appName=Cluster0