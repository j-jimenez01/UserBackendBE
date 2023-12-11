from rest_framework import response 
from rest_framework.decorators import api_view
from django.shortcuts import HttpResponse
from .processing import processTime, processingEventData
import requests
import pymongo

connection_String  = "mongodb+srv://KeshavMehta:ftZbEq1LCpPW4Uy1@cluster0.gq0hrfm.mongodb.net/?retryWrites=true&w=majority"
my_client = pymongo.MongoClient(connection_String)
dbname = my_client['test']
collection_name = dbname["users"]
myuser = {'email': 'dhruv.gorasiya@student.csulb.edu'}
mydoc = collection_name.find(myuser)
a = list(mydoc)

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



@api_view(['GET'])
def getPinList(request):
    location_pins = [{"description": "University Student Union",
    "location": {
      "latitude": 33.781260370009484,
      "longitude": -118.1137525461882,
    }}]
    query = {'email': request.GET.get('query')}
    print(query)
    user = collection_name.find(query)
    if(user):
        pinnedEvents = list(user)[0]['Pinned']
        for i in pinnedEvents:
                for j in loc:
        # for k in j['titles']:
                    if i['location'] in j['titles']: 
                        # print(j['description'])
                        if {'description':j['description'],'location':j['location']} not in location_pins:
                            location_pins.append({'description':j['description'],'location':j['location']})
        print(location_pins)
        return response.Response(location_pins)
    return response.Response("USER NOT FOUND")

@api_view(['GET'])
def getSubList(request):
    query = {'email': request.GET.get('query')}
    user = collection_name.find(query)
    print(user)
    if(user):
        subscribedOrgs = list(user)[0]['Subscribed']
        print(subscribedOrgs)
        return response.Response(subscribedOrgs)
    print("DID NOT FIND USER______________")
    return response.Response("USER NOT FOUND")

@api_view(['GET'])
def getEvents(request):

    def date(date):
        final_date = ""
        if(int(date[:2]) >= 13):
            for i in range(13,25):
                if(i == int(date[:2])):
                    final_date = i-12
                    date = str(final_date) + " : " + date[3:] + " pm"
                    return date
        else:
            return  date + " am"
        
    def month(month):
        if(month[5:7] == "01"):
            return f"January {month[8:10]} {month[0:4]}"
        if(month[5:7] == "02"):
            return f"February {month[8:10]} {month[0:4]}"
        if(month[5:7] == "03"):
            return f"March {month[8:10]} {month[0:4]}"
        if(month[5:7] == "04"):
            return f"April {month[8:10]} {month[0:4]}"
        if(month[5:7] == "05"):
            return f"May {month[8:10]} {month[0:4]}"
        if(month[5:7] == "06"):
            return f"June {month[8:10]} {month[0:4]}"
        if(month[5:7] == "07"):
            return f"July {month[8:10]} {month[0:4]}"
        if(month[5:7] == "08"):
            return f"August {month[8:10]} {month[0:4]}"
        if(month[5:7] == "09"):
            return f"September {month[8:10]} {month[0:4]}"
        if(month[5:7] == "10"):
            return f"October {month[8:10]} {month[0:4]}"
        if(month[5:7] == "11"):
            return f"November {month[8:10]} {month[0:4]}"
        if(month[5:7] == "12"):
            return f"December {month[8:10]} {month[0:4]}"
                        #https://csulb.campuslabs.com/engage/api/discovery/event/search?endsAfter=2023-10-11T17%5E%25%5E3A39%5E%25%5E3A12-07%5E%25%5E3A00&status=Approved&take=15&query=farm
    res = (requests.get(f"https://csulb.campuslabs.com/engage/api/discovery/event/search?endsAfter={processTime()}&status=Approved&take=100000&query={request.GET.get('query')}")).json()['value']
    for i in res:
        print(i['location'])
    val  = [ { 'pinned': False,'name': i['name'], "key" : i['id'], 'description': processingEventData(i['description']) , 'location': i['location'],'start' : f"{date(i['startsOn'][11:16])} on {month(i['startsOn'][:10])}", 'end': f"{date(i['endsOn'][11:16])} on {month(i['endsOn'][:10])}", 'imagePath': f'https://se-images.campuslabs.com/clink/images/{i["imagePath"]}?preset=large-w&quot'} for i in res]
    return response.Response(val)

# get orgs list by username form front end and for every orgID do getORGcall from the beach sync database
@api_view(['GET'])
def getOrgs(request):
    res = requests.get(f"https://csulb.campuslabs.com/engage/api/discovery/search/organizations?orderBy%5B0%5D=UpperName%20asc&top=10&filter&query={request.GET.get('query')}&skip=0").json()['value']
    # return response.Response(res.json()['value'])
    val  = [ {'name': i['Name'], 'Summary': i['Summary'], 'ProfilePicture': f"https://se-images.campuslabs.com/clink/images/{i['ProfilePicture']}?preset=small-sq"} for i in res]
    
    return response.Response(val)

# image query https://se-images.campuslabs.com/clink/images/__profilepicture__?preset=small-sq
@api_view(['GET'])
def getOrgEvents(request):
    pass

