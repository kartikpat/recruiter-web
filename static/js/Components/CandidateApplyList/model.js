function candidateList() {

    var list = {
		rowContainer: $('.js_candidate_listing'),
        header: $('.jsHeader')
	};

    var config = {};

	function setConfig(key, value) {
		config[key] = value;
	}

    function getElement(id) {
		var card = $('.js_candidate_item.prototype').clone().removeClass('prototype hidden')
		card.attr('data-candidate-id', id);
		return {
			element: card,
            image: card.find('.js_img'),
			name: card.find('.js_name'),
			experience: card.find('.js_exp'),
            location: card.find('.js_loc'),
			appliedOn: card.find('.js_appliedOn'),
			notice: card.find('.js_notice'),
			jobTagList: card.find('.js_job_tag_list'),
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
            tenure: card.find('.js_edu_tenure'),
            seperator: card.find('.jsSeperator')
        }
    }

    function getProfessionalElement() {
        var card = $('.js_prof.prototype').clone().removeClass("prototype hidden");
        return {
            element: card,
            name: card.find('.js_prof_name'),
			tenure: card.find('.js_prof_tenure'),
			designation: card.find('.js_prof_designation'),
            seperator: card.find('.jsSeperator')
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
            var tag =  $('.js_job_tag.prototype').clone().text(aTag["name"]).removeClass("prototype hidden");
            tagStr+=tag[0].outerHTML
        })
        item.jobTagList.html(tagStr)
        var profStr = '';
        $.each(aData["jobs"],function(index, anObj) {
            if(index > 2) {
                return
            }
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
            if(index > 2) {
                return
            }
            var item = getEducationElement()
            item.name.text(anObj["institute"])
            item.tenure.text(anObj["batch"]["from"] + " - " + anObj["batch"]["to"] )
            item.degree.text(anObj["degree"] + "("+anObj["courseType"]+")")
            eduStr+=item.element[0].outerHTML
        })
        item.eduList.html(eduStr)
        return item
    }

    function init(data){
        setPageHeader(data)
	}

    function setPageHeader(data) {
        var item = getHeaderElement();
        item.title.text(unescape(data["title"])).removeClass("hidden");
        if(data["location"]) {
            item.location.text(data["location"]).removeClass("hidden")
            item.seperator.removeClass("hidden")

        }
        if(data["experience"]) {
            item.experience.text(unescape(data["experience"])).removeClass("hidden")
        }
    }

    function getHeaderElement() {
        var card = list.header;
        return {
            element : card,
            title : card.find(".jsTitle"),
            location : card.find(".jsLocation"),
            seperator : card.find(".jsSeperator"),
            experience : card.find(".jsExperience"),
        }
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

    function onClickCandidate(fn) {
        list.rowContainer.on('click', ".candidate-item", function(e){
            var candidateId = $(this).attr('data-candidate-id');
            return fn(candidateId);
        })
        // settings.candidateList.on("click", ".candidate-item", function(e) {
        //     if((!jQuery(e.target).parents(".candidate-item-section.profile-actions").length) && (!jQuery(e.target).parents(".candidate-item-section.image").length)) {
        //         var str = $(this).attr("id");
        //         var candidateId = str.substr(10, str.len);
        //         populateCandidateData(store[candidateId]);
        //     }
        // });
    }

    function activateStatsTab(event, ui) {
        $(ui.oldTab[0]).find(".bulk-selection-item").removeClass("active");
        $(ui.newTab[0]).find(".bulk-selection-item").addClass("active");
        return $(ui.newTab[0]).attr("data-attribute");
    }



    //Actions Component
    function onClickJobEdit() {
		list.header.find('.js_edit').click(function(event) {
			return parseInt($(this).attr('data-editable')) ? true : false;
		})
	}

    function onClickJobCancel(fn){
		list.header.on('click','.jsUnpublish',function(){
			var modal = $(".unpublishModal")
			var jobId = $(this).attr("data-id");
			modal.removeClass('hidden');
			modal.find(".unpublishButton").click(function(){
				fn(jobId)
			});
			return false;
		});
	}

	function onClickJobRefresh(fn) {
		list.header.on('click','.jsRefresh',function(event) {
			var modal = $(".refreshModal")
			if(parseInt($(this).attr("data-refresh"))) {
				var jobId = $(this).attr("data-id");
				modal.removeClass('hidden');
				modal.find(".refreshButton").click(function(){
					fn(jobId)
				});
			}
			return false;
		})
	}

	function onClickJobMakePremium(fn) {
		list.header.on('click','.jsMakePremium',function(event) {
			var jobId = $(this).attr("data-id");
			var modal = $(".premiumModal");
			if(config["availableCredits"] > 10) {
				modal.find('.premiumButton').click(function(){
					fn(jobId)
				}).removeClass("hidden");
				modal.find(".section.modal_text").text("This job will be highlighted and moved to top of the list for 15 days starting today. You will have "+(parseInt(config["availableCredits"]) - 1)+" credits left.")
				modal.removeClass('hidden');
				return false
			}
			modal.find(".js_modalText").text("Reach out to more candidates in less amount of time by making your job premium.")
			modal.find(".section.modal_text").text("You don’t have any premium credits right now! We’ll reach out to you to help you with it!")
            modal.removeClass('hidden');
			//shootEmail()
			return false;
		})
	}

    function getActionElement() {
		var card = $('.jsActionButtons');
		return {
			element: card,
			edit: card.find('.jsEdit'),
			premium: card.find('.jsMakePremium'),
			unpublish: card.find('.jsUnpublish'),
			calendar: card.find('.jsCalendar'),
            calendarList: card.find('.jsCalendarList'),
            refresh: card.find('jsRefresh')
			// seperator: card.find('.js_seperator'),
			// experience: card.find('.js_experience'),
			// status: card.find('.js_status'),
			// statusMsg: card.find('.js_status_msg'),
			// views: card.find('.js_views'),
			// applications: card.find('.js_applications'),
			// edit: card.find('.js_edit'),
			// cancel: card.find('.js_cancel'),
			// refresh: card.find('.js_refresh'),
			// premium: card.find('.js_premium'),
			// facebook: card.find('.js_facebook'),
			// twitter: card.find('.js_twiiter'),
			// linkedIn: card.find('.js_linkedIn')
		}
	}

    function showActions(data) {
        var item = getActionElement();
        console.log(data)
        if(data["status"] == "published" && !data["premium"]) {
            item.calendar.removeClass("hidden")
            item.edit.removeClass("hidden")

            item.unpublish.removeClass("hidden")
            if(data["refresh"])
    		    item.refresh.removeClass("hidden")
            if(!data["premium"] )
                item.premium.removeClass("hidden")
        }
        else if(data["status"] == "unpublished") {
            item.calendar.removeClass("hidden")
            item.edit.removeClass("hidden")
        }

    }

    return {
		init: init,
		addToList: addToList,
		setConfig : setConfig,
        createJobStatsTabs: createJobStatsTabs,
        setJobStats: setJobStats,
        activateStatsTab: activateStatsTab,
        onClickCandidate: onClickCandidate,
        showActions : showActions,
        onClickJobEdit: onClickJobEdit,
		onClickJobCancel: onClickJobCancel,
		onClickJobRefresh: onClickJobRefresh,
		onClickJobMakePremium: onClickJobMakePremium
	}
}
