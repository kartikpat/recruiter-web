function candidateList() {

    var list = {
		rowContainer: $('.js_candidate_listing'),
        header: $('#jobDetails'),
        candidatesContainer: $('.jsCandidatesArea'),
        defaultCalendar: null,
        candidateRow: $(".js_candidate_item"),
        candidateInviteButton : $(".jsSendInterviewInvite")
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

    function init(){

	}



    function getJobElements() {
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
            saved: card.find(".js_saved"),
            reviewed: card.find(".jsReviewed")
        }
    }

    function setJobStats(data) {
        var item = getJobsCategoryTabsElement()
        var unread = data["total"] - (data["shortlisted"] + data["rejected"] + data["save"] + data["reviewed"]);
        item.all.text("All"+"("+data["total"]+")");
        item.unread.text("Unread"+"("+unread+")")
        item.shortlisted.text("Shortlisted"+"("+data["shortlisted"]+")")
        item.rejected.text("Rejected"+"("+data["rejected"]+")")
        item.saved.text("Saved"+"("+data["save"]+")")
        item.reviewed.text("Reviewed"+"("+data["reviewed"]+")")
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
            if((!jQuery(e.target).parents(".jsClickableActions").length) && (!jQuery(e.target).parents(".candidate-item-section.image").length)) {
                var candidateId = $(this).attr('data-candidate-id');
                return fn(candidateId);
            }
        })
    }

    function activateStatsTab(event, ui) {
        $(ui.oldTab[0]).find(".bulk-selection-item").removeClass("active");
        $(ui.newTab[0]).find(".bulk-selection-item").addClass("active");
        return $(ui.newTab[0]).attr("data-attribute");
    }

    //Actions Component



    // function getActionElement() {
	// 	var card = $('.jsJobActions');
	// 	return {
	// 		element: card,
	// 		edit: card.find('.jsEdit'),
	// 		premium: card.find('.jsMakePremium'),
	// 		unpublish: card.find('.jsUnpublish'),
	// 		calendar: card.find('.jsCalendar'),
    //         calendarList: card.find('.jsCalendarList'),
    //         refresh: card.find('.jsRefresh'),
    //         facebook: card.find('.jsPostFacebook'),
    //         twitter: card.find('.jsTwitter'),
	// 		linkedIn: card.find('.jsLinkedIn')
	// 		// seperator: card.find('.js_seperator'),
	// 		// experience: card.find('.js_experience'),
	// 		// status: card.find('.js_status'),
	// 		// statusMsg: card.find('.js_status_msg'),
	// 		// views: card.find('.js_views'),
	// 		// applications: card.find('.js_applications'),
	// 		// edit: card.find('.js_edit'),
	// 		// cancel: card.find('.js_cancel'),
	// 		// refresh: card.find('.js_refresh'),
	// 		// premium: card.find('.js_premium'),
	// 		// facebook: card.find('.js_facebook'),
    //
	// 	}
	// }





    function onClickCandidateOtherActions() {
        list.rowContainer.on('click','.jsCandidateOtherActions',function(event) {
            $(this).toggleClass("inactive");
        })
    }



    function onClickSendMessage() {

    }

    function onClickSendInterviewInvite(fn) {
        list.rowContainer.on('click', settings.candidateInviteButton, function(e){

        })
    }

    function onClickDownloadResume() {

    }

    function onClickSave() {

    }

    function onClickAddComment(fn) {
        list.rowContainer.on('click','.jsAddComment',function(event) {
			// var jobId = $(this).attr("data-id");
			var modal = $(".jsAddCommentModal");
            modal.find(".jsAddComment").click(function(){
                fn(jobId)
            });
            addBodyFixed()
            modal.removeClass("hidden")
            return false;
        })
    }

    function onClickAddTag() {
        list.rowContainer.on('click','.jsAddTag',function(event) {
			// var jobId = $(this).attr("data-id");
			var modal = $(".jsAddTagModal");
            modal.find(".jsAddTag").click(function(){
                fn(jobId)
            });
            addBodyFixed()
            modal.removeClass("hidden")
            return false;
        })
    }

    function onClickFilters() {
        list.candidatesContainer.on('click','.jsFilter',function(event){
            var modal = $(".jsFiltersModal");
            addBodyFixed()
            modal.removeClass("hidden");
        })
    }

    return {
		init: init,
		addToList: addToList,
		setConfig : setConfig,
        createJobStatsTabs: createJobStatsTabs,
        setJobStats: setJobStats,
        activateStatsTab: activateStatsTab,
        onClickCandidate: onClickCandidate,
		
        onClickCandidateOtherActions: onClickCandidateOtherActions,
        onClickAddTag: onClickAddTag,
        onClickAddComment: onClickAddComment,
        onClickFilters: onClickFilters,

	}


}
