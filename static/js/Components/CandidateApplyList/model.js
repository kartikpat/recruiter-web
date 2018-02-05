

function Candidates() {

    var list = {
		rowContainer: $('.js_candidate_listing')
	};

    var config = {};

	function setConfig(key, value) {
		config[key] = value;
	}

    function getElement(id) {
		var card = $('.js_candidate_item.prototype').clone().removeClass('prototype hidden')
		card.attr('id', 'candidate-'+id);
		return {
			element: card,
            image: card.find('.js_img'),
			name: card.find('.js_name'),
			experience: card.find('.js_exp'),
            location: card.find('.js_loc'),
			appliedOn: card.find('.js_appliedOn'),
			notice: card.find('.js_notice'),
			skillTag: card.find('.js_skill_tag_list'),
			eduList: card.find('.js_edu_list'),
			profList: card.find('.js_prof_list')
		}
	}

    function getEducationElement() {
        var card = $('.js_edu.prototype').clone().removeClass("prototype hidden");
        return {
            element: card,
            name: card.find('.js_edu_name'),
            degree: card.find('.js_edu_degree'),
            tenure: card.find('.js_edu_tenure')
        }
    }

    function getProfessionalElement() {
        var card = $('.js_prof.prototype').clone().removeClass("prototype hidden");
        return {
            element: card,
            name: card.find('.js_prof_name'),
			tenure: card.find('.js_prof_tenure'),
			designation: card.find('.js_prof_designation')
        }
    }

    function createElement(aData) {
		var item = getElement(aData["userID"]);
        item.image.attr("src",aData["img"]);
        item.name.text(aData["name"]);
        item.experience.text(aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m");
        item.location.text(aData["preferredLocation"]);
        item.appliedOn.text(moment(aData["timestamp"]).format('DD-MM-YYYY'))
        item.notice.text(aData["notice"] + " months");
        var tagStr = '';
        $.each(aData["tags"],function(index, aTag) {
            var tag =  $('.js_skill_tag.prototype').clone().text(aTag["name"]).removeClass("prototype hidden");
            tagStr+=tag[0].outerHTML
        })
        item.skillTag.append(tagStr)
        var profStr = '';
        $.each(aData["jobs"],function(index, anObj) {
            var item = getProfessionalElement()
            item.name.text(anObj["organization"])
            item.designation.text(anObj["designation"]);

            var fromMon = getMonthName(anObj["exp"]["from"]["month"]);
            var toMon = getMonthName(anObj["exp"]["to"]["month"]);
            var fromYear = anObj["exp"]["from"]["year"];
            var toYear = anObj["exp"]["from"]["year"];
            var str = (anObj["is_current"]) ? fromMon + " - " + fromYear + " to Present": fromMon + " - " + fromYear + " to " + toMon + " - " + toYear;
            item.tenure.text(str);
            profStr+=item.element[0].outerHTML
        })
        item.profList.html(profStr)
        var eduStr = '';
        $.each(aData["education"],function(index, anObj) {
            var item = getEducationElement()
            item.name.text(anObj["institute"])
            item.tenure.text(anObj["batch"]["from"] + " - " + anObj["batch"]["to"] )
            item.degree.text(anObj["degree"] + "("+anObj["courseType"]+")")
            eduStr+=item.element[0].outerHTML
        })
        item.eduList.html(eduStr)
        return item
    }

    function init(res){

	}

    function getJobsCategoryTabsElement() {
        var card = $("#jobs-category-tabs");
        return {
            element: card,
            all: card.find(".js_all"),
            unread: card.find(".js_unread"),
            shortlisted: card.find(".js_shortlisted"),
            rejected: card.find(".js_rejected"),
            saved: card.find(".js_saved")
        }
    }

    function setJobStats(data) {
        var item = getJobsCategoryTabsElement()
        var unread = data["total"] - (data["shortlisted"] + data["rejected"] + data["save"])
        item.all.text("All"+"("+data["total"]+")");
        item.unread.text("Unread"+"("+unread+")")
        item.shortlisted.text("Shortlisted"+"("+data["shortlisted"]+")")
        item.rejected.text("Rejected"+"("+data["rejected"]+")")
        item.saved.text("Saved"+"("+data["save"]+")")
    }

    function addToList(dataArray){
		var str = '';
		dataArray.forEach(function(aData){
			var item = createElement(aData);
			str+=item.element[0].outerHTML;
		});
		list.rowContainer.html(str);
	}

    function createJobStatsTabs(fn) {
        jQuery("#jobs-category-tabs").tabs({
            active: 0,
            create:function(){
                $(this).removeClass("hidden")
            },
            activate: fn
        })
    }

    function activateStatsTab(event, ui) {
        $(ui.oldTab[0]).find(".bulk-selection-item").removeClass("active");
        $(ui.newTab[0]).find(".bulk-selection-item").addClass("active");
        return $(ui.newTab[0]).attr("data-attribute");
    }

    return {
		init: init,
		add: addToList,
		setConfig : setConfig,
        createJobStatsTabs: createJobStatsTabs,
        setJobStats: setJobStats,
        activateStatsTab: activateStatsTab
	}
}
