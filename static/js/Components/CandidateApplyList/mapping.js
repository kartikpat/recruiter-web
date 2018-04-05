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

var lastActive = {
    1: "Last 1 Month",
    3: "Last 3 Months",
    6: "Last 6 Months"
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

var willingTravel = {
    1: "Occasional",
    2: "Extensive",
    3: "No"
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

var cityList={
       "Anywhere": {
           "0": "Any Location",
           "87": "Metros",
           "88": "Anywhere in India/Multiple Locations",
           "89": "Overseas/International"
       },
       "National Locations": {
           "1": "Delhi NCR",
           "2": "Mumbai",
           "3": "Bangalore",
           "4": "Hyderabad",
           "5": "Kolkata",
           "6": "Chennai",
           "7": "Pune",
           "8": "Gujarat",
           "9": "Maharashtra",
           "10": "MP",
           "11": "Jaipur",
           "12": "Guwahati",
           "13": "Goa",
           "14": "Chandigarh",
           "15": "Punjab",
           "16": "Haryana",
           "17": "Kerala",
           "18": "Orrisa",
           "19": "Bihar",
           "20": "Jharkhand",
           "21": "UP",
           "31": "Karnataka",
           "32": "Tamil Nadu",
           "33": "Rajasthan",
           "34": "Andhra Pradesh",
           "35": "Telangana",
           "36": "Delhi",
           "37": "Gurgaon/Gurugram",
           "38": "Noida",
           "39": "Greater Noida",
           "40": "Faridabad",
           "41": "Ghaziabad",
           "42": "Jammu & Kashmir",
           "43": "Jammu",
           "44": "Srinagar",
           "45": "Amritsar",
           "46": "Jalandhar",
           "47": "Patiala",
           "48": "Ludhiana",
           "49": "Sonipat",
           "50": "Panipat",
           "51": "Udaipur",
           "52": "Jodhpur",
           "53": "Ahmedabad",
           "54": "Surat",
           "55": "Gandhinagar",
           "56": "Vadodara/Baroda",
           "57": "Haridwar",
           "58": "Dehradun",
           "59": "Uttarakhand",
           "60": "Lucknow",
           "61": "Patna",
           "62": "Ranchi",
           "63": "Jamshedpur",
           "64": "Chhattisgarh",
           "65": "Bhubaneshwar",
           "66": "Nagpur",
           "67": "Nasik",
           "68": "Navi Mumbai",
           "69": "Thane",
           "70": "Cochin/Kochi",
           "71": "Hosur",
           "72": "Hubli",
           "73": "Mysore",
           "74": "Raipur",
           "75": "Trivandrum/Thiruvananthapuram",
           "76": "Vijayawada",
           "77": "Guntur",
           "78": "Vishakhapatnam/Vizag",
           "79": "Aurangabad",
           "80": "Rajkot",
           "81": "Varanasi/Banaras",
           "82": "Warangal",
           "83": "Madurai",
           "84": "Coimbatore",
           "85": "Pondicherry",
           "86": "Cuttack"
       },
       "International Locations": {
           "22": "US",
           "23": "UK",
           "24": "Singapore",
           "25": "Middle East",
           "26": "Africa",
           "27": "Malaysia",
           "28": "EU",
           "30": "Hong Kong",
           "90": "Bahrain",
           "91": "Dubai",
           "92": "Kabul",
           "93": "Kuwait",
           "94": "Nigeria",
           "95": "London",
           "96": "Oman",
           "97": "Muscat",
           "98": "Doha",
           "99": "Qatar",
           "100": "Abu Dhabi",
           "101": "Saudi Arabia",
           "102": "Riyadh",
           "103": "Indonesia",
           "104": "Nepal",
           "105": "Bhutan",
           "106": "Dhaka",
           "107": "Bangladesh",
           "108": "China",
           "109": "Afghanistan",
           "110": "Pakistan",
           "111": "Sri Lanka",
           "112": "Ethiopia",
           "113": "Egypt",
           "114": "Kenya",
           "115": "Nairobi",
           "116": "Tanzania",
           "117": "South Africa",
           "118": "Zimbabwe",
           "119": "Zambia",
           "120": "Philippines"
       },
       "Others": {
           "100000": "Others"
       }
}
