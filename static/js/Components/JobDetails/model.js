var jobTagsArray = {}
function Job(){
	var settings ={};
	var config = {};

	function setConfig(key, value) {
		config[key] = value;
	}
	function init(){
			settings.jobTitle= $('#jobTitle'),
			settings.jobTags= $("#jobTags"),
			settings.jobDescription = $("#jobDescription"),
			settings.postedBy= $("#postedBy"),
			settings.postedByInfo= $("#postedByInfo"),
			settings.jobCategory= $("#jobCategory"),
			settings.jobCode= $("#jobCode"),
			settings.jobLocation= $("#jobLocation"),
			settings.jobPostedOn= $("#jobPostedOn"),
			settings.jobViews= $("#jobViews"),
			settings.jobApplications= $("#jobApplications")

	}

	function getTitleFormat(title, regex) {
        return title.replace(regex, '');
    }

    function getLocation(arr) {
        var array = []
        arr.forEach(function(value, index){
           for(var locCategory in cityList) {
               if(cityList[locCategory][value]) {
                   var locName = cityList[locCategory][value];
                   array.push(locName)
               }
           }
       })
       return array;
    }

	function setTags(arr) {
		var str = ""
		arr.forEach(function(aTag, index){
			str += "#" + aTag + " "
		})
		return str;
	}

	function setJobData(jobId,obj) {
		settings.jobTitle.text(getTitleFormat(obj["title"],(/\(\d+-\d+ \w+\)$/))).removeClass("shell");
		settings.jobDescription.html(obj["description"] || "No Description Available").removeClass("shell");
		settings.jobCategory.text(categoryObj[obj["category"]]).removeClass("shell");
		var locationTextArray = getLocation(obj["location"]);
		if(obj['otherLocation'].length>0)
		locationTextArray.push(obj['otherLocation']);
		if(locationTextArray.length>1)
		locationTextArray = (locationTextArray).join(", ");
		settings.jobLocation.text(locationTextArray).removeClass("shell")
		if(obj["tags"] && obj["tags"].length) {
			var tagStr = setTags(obj["tags"])
			settings.jobTags.html(tagStr).removeClass("shell");
		}
		else {
			settings.jobTags.addClass("hidden").removeClass("shell");
		}
		settings.postedBy.text(profile["name"]).removeClass("shell");
		settings.postedByInfo.text(profile["designation"] + " at " + profile["organisation"]);
		settings.jobCode.text(obj["publishedId"]).removeClass("shell");
		settings.jobPostedOn.text(moment(obj["created"]).format("DD MMMM YYYY")).removeClass("shell")
		settings.jobViews.text(obj["views"] || "N.A").removeClass("shell")
		settings.jobApplications.text(obj["totalApplications"] || "N.A").removeClass("shell");
	}

	return {
		init: init,
		setData: setJobData
	}

}
