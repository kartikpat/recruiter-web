var recruiterID = localStorage.id;
//var baseUrl = "http://13.126.92.102:8000"
// baseUrl = "http://192.168.86.128:8000"
var slotBox = $(".slots-box.prototype");
var createSlotsContainer = $(".create-slots-container");
var slotsInfoContainer = $(".slots-info-container");
var calendarId;
var aSlotBoxId = 0;
var getCreateNewParameter;
var createdCalendarId;
var isCreated = 0;

$(document).ready(function(){

    getCreateNewParameter = getUrlParameter("createNew");

    if(getCreateNewParameter == 0) {
        var urlObject = fetchURL();
    	var res = urlObject["pathname"].split("/");
    	console.log(res);
    	if(!(isNaN(res[4]))){
    		calendarId = res[4];
    	}
    	getRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar/"+calendarId+"/slots", {}, populateCalendarSlots);
        $("#calendar-name").attr("readonly","readonly")
    }

    else if(getCreateNewParameter == 1) {
        $("#calendar-name").attr("readonly", false)
        createSlot();
    }

    $(".add-more-slots").click(createSlot);
    $(".save-slots-data").click(saveSlotsData);
    slotsInfoContainer.find('input,textarea').on('input',function() {
        checkErrorClass(this);
    });
})

createSlotsContainer.on('input','.slots-box.not-hidden input,select',function() {
    checkErrorClass(this);
})

createSlotsContainer.on('change', '.radio-info input', function(){
    var radioButton = $(this);
    var isDisabled = radioButton.val();
    if(isDisabled == 1) {
        console.log(1);
        $(this).parent().parent().parent().parent().find(".datepicker.to").prop("disabled", false);
    }
    else {
        $(this).parent().parent().parent().parent().find(".datepicker.to").attr("disabled", true);
    }
})

var checkErrorClass = function(ele) {
    var elem = $(ele);
    elem.val() === '' ? elem.next().removeClass("hidden"): elem.next().addClass("hidden");
}

var createSlotCallback = function(res, slotsArray, message, telMessage) {
    if(res["status"] == "success") {
        console.log(res);
        calendarId = res["data"];
        if(message!= '' && telMessage!= '' )
        postRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar/"+calendarId+"/slots", null, {
            slotString: JSON.stringify(slotsArray)
        },successCallback);
    }
}

var saveSlotsData = function() {
    var slotsArray = [];
    slotsInfoContainer.find("input,textarea").each(function() {
        checkErrorClass(this);
    })
    var message = slotsInfoContainer.find("#mssg-f2f").val();
    var telMessage = slotsInfoContainer.find("#mssg-telephonic").val();
    $(".slots-box.not-hidden").each(function() {
        $(this).find("input,select").each(function() {
            checkErrorClass(this);
        })
        var obj = {}
        obj["message"] = message;
        obj["telMessage"] = telMessage;
        var aSlotBox = $(this);
        var day = [];
        aSlotBox.find(".checkbox input:checked").each(function() {
            day.push(parseInt($(this).val()));
        });
        var timeFrom = aSlotBox.find(".timepicker.from").val();
        var timeTo = aSlotBox.find(".timepicker.to").val();
        var dateFrom = aSlotBox.find(".datepicker.from").val();
        var isDisabled = aSlotBox.find(".radio-info input:checked").val();
        //console.log(isDisabled);
        if(isDisabled == 1) {
            var dateTo = aSlotBox.find(".datepicker.to").val();
            obj["dateTo"] = dateTo;
        }
        obj["timeFrom"] = timeFrom;
        obj["timeTo"] = timeTo;
        obj["day"] = day;
        obj["dateFrom"] = dateFrom;
        var dataAttribute = aSlotBox.attr("data-id");
        if(dataAttribute) {
            var dataId = dataAttribute.split("-")[2];
            if(dataId) {
                obj["id"] = dataId;
            }
        }
        slotsArray.push(obj);
    });
    if(getCreateNewParameter == 1) {
        if(isCreated == 0) {
            var calendarName = $("#calendar-name").val();
            isCreated = 1;
            if(calendarName!= '') {
                postRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar", null, {
                    name: calendarName
                }, function(res) {
                    createSlotCallback(res, slotsArray, message, telMessage );
                });
            }
        }
        else {
            if(message!= '' && telMessage!= '') {
                postRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar/"+calendarId+"/slots", null, {
                    slotString: JSON.stringify(slotsArray)
                },successCallback);
            }
        }
    }
    else if (getCreateNewParameter == 0) {
        if(message!= '' && telMessage!= '') {
            postRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar/"+calendarId+"/slots", null, {
                slotString: JSON.stringify(slotsArray)
            },successCallback);
        }
    }
}


var successCallback = function(res) {
    console.log(res);
}

createSlotsContainer.on('focus','.datepicker', function() {
    $(this).datepicker({
        dateFormat: 'yy-mm-dd'
    });
})

var createSlot = function() {
    aSlotBoxId++;
    var aSlotBox = slotBox.clone().removeClass('prototype hidden');
    aSlotBox.addClass("not-hidden");
    aSlotBox.attr("data-id", aSlotBoxId)
    aSlotBox.find(".close-slot-box").attr("data-id", aSlotBoxId);
    aSlotBox.find(".on").attr("name", aSlotBoxId);
    aSlotBox.find(".never").attr("name", aSlotBoxId);
    $(".create-slots-container").append(aSlotBox);
}

createSlotsContainer.on('click','.close-slot-box', function() {
    var dataId = $(this).attr("data-id");
    $(".slots-box[data-id="+dataId+"]").remove();
})

var populateCalendarSlots = function(res) {
    if(res["status"] == "success") {
        var data = res["data"][0];
        var leftSlots;
        var array = data["slots"];
        leftSlots = data["left"] > 100 ? "100+" : data["left"];
        //console.log(leftSlots);
        $(".heading-container .remaining-slots").text("(Remaining Slots: "+leftSlots+")");
        slotsInfoContainer.find("#calendar-name").val(data["name"]);
        slotsInfoContainer.find("#mssg-f2f").val(array[0]["message"]);
        slotsInfoContainer.find("#mssg-telephonic").val(array[0]["tel_message"]);
        $.each(array, function(index, anObj) {

            var row = slotBox.clone().removeClass('prototype hidden');
            row.addClass("not-hidden");
            row.attr("data-id", "js-close-"+anObj["id"]);
            row.find(".from.timepicker").val(anObj["time_from"]);
            row.find(".to.timepicker").val(anObj["time_to"]);
            row.find(".from.datepicker").val(ISODateToD_M_Y(anObj["date_from"]));
            row.find(".close-slot-box").attr("data-id", "js-close-"+anObj["id"]);
            row.find(".on").attr("name", "disabled-"+anObj["id"]);
            row.find(".never").attr("name", "disabled-"+anObj["id"]);
            if(anObj["date_to"]) {
                row.find(".to.datepicker").val(ISODateToD_M_Y(anObj["date_to"]));
                row.find(".on").prop("checked", true);
            }
            else {
                row.find(".to.datepicker").attr("disabled", "disabled");
                row.find(".never").prop("checked",true);
            }
            $.each(anObj["day"], function(index, aDay) {
                row.find("#repeat-every input[value="+aDay+"]").attr("checked", true);
            })
            createSlotsContainer.append(row);
        })
    }
}

function ISODateToD_M_Y(aDate) {
  var date = new Date(aDate),
	year = date.getFullYear(),
	month = date.getMonth(),
	dt = date.getDate();

  if (dt < 10) {
	dt = '0' + dt;
  }
  if (month < 10) {
	month = '0' + month;
  }

  var str = year + "-" + month + "-" + dt;
  return str;
}

function fetchURL(){
       var obj = {}
       for(var key in window["location"]){
               if(typeof(window["location"][key])=="string"){
                       obj[key]= window["location"][key];
               }
       }
       return obj;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
