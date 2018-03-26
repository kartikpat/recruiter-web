var gender = {
    "-1": "",
    1: "Male",
    2: "Female",
    3: "Not Mentioned"
}

var binary = {
    1: "Yes",
    2: "No",
    0: "N.A."
}

var notice = {
    7: "Immediately Available",
    1: "1 month",
    2: "2 months",
    3: "3 months",
    4: "4 months",
    5: "5 months",
    6: "6 months"
}


var applicationDateObj = {
    3: "3 days",
    7: "7 days",
    15: "15 days",
    30: "30 days"
}

var workPermit = {
    1: "No",
    2: 'Have H1 Visa',
    3: 'TN Permit Holder',
    4: 'Green Card Holder',
    5: 'US Citizen',
    6: 'Authorized to work in US'
}

var defaultApplicationStatus = {
    0: "",
    1: "0",
    2: "4,5",
    3: "1",
    4: "2",
    5: "3"
}

var defaultTabObj = {
    "": 0,
    "0": 1,
    "4,5": 2,
    "1": 3,
    "2": 4,
    "3": 5
}

var filtersMapping = {
    "industry": "industry",
    "location": "currentLocation",
    "preferredLocation": "preferredLocation",
    "institute": "institute",
    "functionalArea": "functionalArea",
    "language": "language",
    "minExp": "experience",
    "maxExp": "experience",
    "minCtc": "salary",
    "maxCtc": "salary",
    "minAge": "age",
    "maxAge": "age",
    "minBatch": "batch",
    "maxBatch": "batch",
    "sex": "sex",
    "notice": "notice",
    "applicationDate": "applicationDate",
    "lastActive": "lastActive",
    "permit": "permit",
    "handleTeam": "handleTeam",
    "relocate": "relocate",
    "differentlyAbled": "differentlyAbled",
    "orderBy": "orderBy",
    "searchString": "searchString"
}

var minMaxMapping = {
    "minExp": "min",
    "maxExp": "max",
    "minCtc": "min",
    "maxCtc": "max",
    "minAge": "min",
    "maxAge": "max",
    "minBatch": "min",
    "maxBatch": "max"
}
