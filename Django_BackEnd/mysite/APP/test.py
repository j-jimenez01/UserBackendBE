
import pymongo

connection_String  = "mongodb+srv://KeshavMehta:ftZbEq1LCpPW4Uy1@cluster0.gq0hrfm.mongodb.net/?retryWrites=true&w=majority"
my_client = pymongo.MongoClient(connection_String)
dbname = my_client['test']
collection_name = dbname["users"]
myuser = {'email': 'dhruv.gorasiya@student.csulb.edu'}
mydoc = collection_name.find(myuser)

bla = list(mydoc)[0]['Pinned']

location_pins = []


    



import requests
from processing import processingEventData,processTime
locations = []
res = (requests.get(f"https://csulb.campuslabs.com/engage/api/discovery/event/search?endsAfter={processTime()}&status=Approved&take=100000&query={''}&skip=0")).json()['value']
for i in res:
    if i['location'] not in locations:
        locations.append(i['location'])

loc = [
    {
        'titles': ["SHS","Student Health Services"],
        'description': "Student Health Services",
        'location': {
            'latitude': 33.78229033858013,
            'longitude': -118.11792922513402
        },
    },
    {
        'titles': ["USU","University Student Union","ASI Beach Kitchen ","ASI","USU Games Center (1st floor)","CPaCE 2nd and 3rd floor","USU North Lawn","University Student Union (USU) Ballrooms","Coffee Bean"],
        'description': "University Student Union",
        'location': {
            'latitude': 33.781260370009484,
            'longitude': -118.1137525461882,
        },
    },
    {
        'titles': ["PH1","Peterson Hall 1","Peterson Hall 1-230"],
        'description': "Peterson Hall 1",
        'location': {
            'latitude': 33.778740890978085,
            'longitude': -118.11209781037276,
        },
    },
    {
        'titles': ["SRWC","SRWC Rock Wall"],
        'description': "Student Recreation and Wellness Center",
        'location': {
            'latitude': 33.785284553612705,
            'longitude': -118.10917416804547,
        },
    },
    {
        'description': "Speaker's Platform",
        'titles': ["Speaker's Platform","Central Quad & Speakers Platform "],
        'location': {
            'latitude': 33.78017591301152,
            'longitude': -118.11464369386114,
        },
    },

    {
        'description': "Facility Office",
        'titles': ["FO4-262 & FO3-003","FO4","FO3"],
        'location': {
            
            'latitude': 33.78356923147553, 
            'longitude': -118.10837404478207,
        },
    },

    {
        'description': "College of Business",
        'titles': ["College of Business Circle"],
        'location': {
            'latitude': 33.78433028824495, 
            'longitude': -118.11568562235317
        },
    },
    {
        'description': "Japanese Garden",
        'titles': ["Earl Burns Miller Japanese Garden"],
        'location': {
            'latitude': 33.78526765623466, 
            'longitude': -118.11979454577363
        },
    },
    {
        'description': "Bookstore",
        'titles': ["Bookstore Vending Area "],
        'location': {
            'latitude': 33.78017591301152,
            'longitude': -118.11464369386114,
        },
    },
    {
        'description': "Library",
        'titles': ["Library on campus: 5th floor "],
        'location': {
            'latitude': 33.77724310900099,
            'longitude': -118.11442240344515
        },
    }
]


for i in bla:
    # print(i['location'])
    for j in loc:
        # for k in j['titles']:
        if i['location'] in j['titles']: 
            # print(j['description'])
            if {'description':j['description'],'location':j['location']} not in location_pins:
                location_pins.append({'description':j['description'],'location':j['location']})
        
                
                
print(location_pins)

a = [{"A":10},{"A":10}]