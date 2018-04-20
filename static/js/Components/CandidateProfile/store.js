function Store(){
	var store = {}

	var calendarList = {}

	var defaultId = null;

	var calendarId = null;

	function saveToStore(dataArray){
        dataArray.forEach(function(anObj) {
            store[anObj["id"]] = anObj;
        })
    }

    function emptyStore(){
		store = {};
    }

    function getCandidateFromStore(candidateId){
		return store[candidateId]
		}

		function updateCandidate(props, candidateId){
			/* props = {
				comment: comment,
				tags: []
			}
			*/

			if(store[candidateId] && props.comment){
				store[candidateId]["comment"]= props.comment;
			};
			if(store[candidateId] && (props.status || props.status ==0)){
				store[candidateId]['status'] = props.status;
			}
		}

		function getCalendarElement() {
			var card = $(".calendarOptions.prototype").clone().removeClass("prototype hidden");
			return {
				element : card
			}
		}

	function saveCalendarsToStore(array){
		var calendarOptionsStr = '';
		var item = getCalendarElement();
		item.element.text("Calendar Link: Select");
		item.element.attr("value","-1");
		item.element.attr({
			disabled: "disabled",
			selected: "selected"
		});
		calendarOptionsStr += item.element[0].outerHTML;
        array.forEach(function(anObj){
			var item = getCalendarElement()
			calendarList[anObj["id"]] = anObj;
            if(anObj["isDefault"]) {
				defaultId = anObj["defaultID"];
				calendarId = anObj["id"];
            }
			item.element.text(anObj["name"]);
            item.element.attr("value",anObj["id"]);
			calendarOptionsStr += item.element[0].outerHTML;
        })
		$(".calendarSelect").html(calendarOptionsStr)
    }

	function getDefaultId() {
		debugger
		return defaultId;
	}

	function setId(id, calId) {
		debugger
		defaultId = id;
		calendarId = calId;
	}

	function getCalendarId() {
		return calendarId
	}

	return {
		saveToStore: saveToStore,
		emptyStore: emptyStore,
		getCandidateFromStore: getCandidateFromStore,
		updateCandidate: updateCandidate,
		saveCalendarsToStore: saveCalendarsToStore,
		getDefaultId: getDefaultId,
		setId: setId,
		getCalendarId: getCalendarId
	}
}
