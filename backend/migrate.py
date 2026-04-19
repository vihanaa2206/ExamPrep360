from pymongo import MongoClient
import certifi

local = MongoClient('mongodb://127.0.0.1:27017/')
atlas = MongoClient('mongodb+srv://examadmin:ExamPrep123@examprep360.bu8jmxg.mongodb.net/ExamPrep360', tlsCAFile=certifi.where())

local_db = local['ExamPrep360']
atlas_db = atlas['ExamPrep360']

for col in local_db.list_collection_names():
    docs = list(local_db[col].find())
    if docs:
        atlas_db[col].insert_many(docs)
        print(f'Copied {col}: {len(docs)} docs')
    else:
        print(f'Empty: {col}')

print('DONE!')
