function candidateList() {

    var settings = {};
    var config = {};

    function init(){
        settings.rowContainer= $('.candidateListing'),
        settings.header= $('#jobDetails'),
        settings.candidateRowClass= ".candidateRow",
        settings.candidateInviteButton= ".candidateSendInterviewInvite",
        settings.candidateAddTagButton= ".candidateAddTag",
        settings.candidateAddCommentButton= ".candidateAddComment",
        settings.candidateSaveButton= ".candidateSave",
        settings.candidateDownloadResumeButton= ".candidateDownloadResume",
        settings.candidateSendMessageButton= ".candidateSendMessage",
        settings.candidateOtherActionsClass= '.candidateOtherActions',
        settings.candidateShortlistButtonClass='.candidateShortlist',
        settings.candidateRejectButtonClass= '.candidateReject',
        settings.candidateCheckboxClass= '.candidateCheckbox',
        settings.candidateCheckboxLabelClass= '.candidateCheckboxLabel',
        settings.candidateTagsPrototype= $('.candidateTags.prototype')
	}

	function setConfig(key, value) {
		config[key] = value;
	}

    function getElement(id) {
		var card = $(""+settings.candidateRowClass+".prototype").clone().removeClass('prototype hidden')
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
			profList: card.find('.js_prof_list'),
            candidateCheckbox: card.find(settings.candidateCheckbox),
            candidateCheckboxLabel: card.find(settings.candidateCheckboxLabel),
            proMember: card.find('.isPro'),
            isFollowedUp: card.find('.isFollowedUp')
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
            var tag =  settings.candidateTagsPrototype.clone().text(aTag["name"]).removeClass("prototype hidden");
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

        item.candidateCheckbox.attr("id",aData["userID"]);
        item.candidateCheckboxLabel.attr("for",aData["userID"]);
        if(aData["pro"]) {
            item.proMember.removeClass("hidden")
        }
        if(aData["follow"]) {
            item.isFollowedUp.removeClass("hidden")
        }
        return item
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

    function addToList(dataArray, status){
        console.log(status)
		var str = '';
		dataArray.forEach(function(aData, index){
			var item = createElement(aData);
			str+=item.element[0].outerHTML;
            console.log(index)
		});
		$(".candidateListing[data-status-attribute='"+status+"']").append(str);
        $("#jobs-tabs").removeClass("hidden")
	}

    function createJobStatsTabs(fn) {
        jQuery("#jobs-tabs").tabs({
            active: 0,
            create:function(){

            },
            activate: function(event, ui){
                settings.rowContainer.empty();
                fn(event, ui);
            }
        })
    }

    function onClickCandidate(fn) {
        settings.rowContainer.on('click', ".candidate-item", function(e){
            var candidateId = $(this).attr('data-candidate-id');
            return fn(candidateId);
        })
    }

    function activateStatsTab(event, ui) {
        $(ui.oldTab[0]).find(".bulk-selection-item").removeClass("active");
        $(ui.newTab[0]).find(".bulk-selection-item").addClass("active");
        return $(ui.newTab[0]).attr("data-attribute");
    }

    function onClickCandidateOtherActions() {
        settings.rowContainer.on('click', settings.candidateOtherActionsClass,function(event) {
            event.stopPropagation();
            $(this).toggleClass("inactive");
        })
    }

    function onClickSendMessage(fn) {
        settings.rowContainer.on('click', settings.candidateSendMessageButton,function(event) {
            event.stopPropagation();
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            fn(candidateId);
            return false
        });
    }

    function onClickSendInterviewInvite(fn) {
        settings.rowContainer.on('click', settings.candidateInviteButton, function(event){
            event.stopPropagation();
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            fn(candidateId);
            return false
        })
    }

    function onClickDownloadResume(fn) {
        settings.rowContainer.on('click', settings.candidateDownloadResumeButton, function(event){
            event.stopPropagation();
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            fn(candidateId);
            return false
        })
    }

    function onClickSaveJob(fn) {
        settings.rowContainer.on('click', settings.candidateSaveButton, function(event){
            event.stopPropagation();
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            fn(candidateId);
            return false
        })
    }

    // function onClickAddComment(fn) {
    //     settings.rowContainer.on('click', settings.candidateAddCommentButton ,function(event) {
    //         event.stopPropagation();
	// 		// var jobId = $(this).attr("data-id");
	// 		var modal = $(".jsAddCommentModal");
    //         modal.find(".jsAddComment").click(function(){
    //             return fn
    //         });
    //         addBodyFixed()
    //         modal.removeClass("hidden")
    //         return false;
    //     })
    // }
    //
    // function onClickAddTag() {
    //     settings.rowContainer.on('click',settings.candidateAddTagButton ,function(event) {
    //         event.stopPropagation()
	// 		// var jobId = $(this).attr("data-id");
	// 		var modal = $(".jsAddTagModal");
    //         modal.find(".jsAddTag").click(function(){
    //             fn(jobId)
    //         });
    //         addBodyFixed()
    //         modal.removeClass("hidden")
    //         return false;
    //     })
    // }

    function onClickAddTag(fn) {
        settings.rowContainer.on('click',settings.candidateAddTagButton ,function(event) {
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            fn(candidateId);
            return false
        })
    }

    function onClickAddComment(fn) {
        settings.rowContainer.on('click',settings.candidateAddCommentButton ,function(event) {
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            fn(candidateId);
            return false
        })
    }



    function onClickShortlistCandidate(fn) {

        settings.rowContainer.on('click', settings.candidateShortlistButtonClass, function(event) {
            debugger
            console.log("a")
            event.stopPropagation();
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            fn(candidateId);
        })
    }

    function onClickRejectCandidate(fn) {
        settings.rowContainer.on('click', settings.candidateRejectButtonClass, function(event) {
            event.stopPropagation();
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            fn(candidateId);
        })
    }

    function candidateActionTransition(candidateId) {
        settings.rowContainer.find(".candidateRow[data-candidate-id="+candidateId+"]").addClass("hidden")
    }

    function onChangeCandidateCheckbox(fn) {
        settings.rowContainer.on('click', settings.candidateCheckboxClass, function(event){
            event.stopPropagation();
        })
        settings.rowContainer.on('click', settings.candidateCheckboxLabelClass, function(event) {
            event.stopPropagation();
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            return fn(candidateId);
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
        onClickSendInterviewInvite: onClickSendInterviewInvite,
        onClickCandidateOtherActions: onClickCandidateOtherActions,
        onClickAddTag: onClickAddTag,
        onClickAddComment: onClickAddComment,
        onClickSendMessage: onClickSendMessage,
        onClickSaveJob: onClickSaveJob,
        onClickDownloadResume: onClickDownloadResume,
        onClickShortlistCandidate: onClickShortlistCandidate,
        onClickRejectCandidate: onClickRejectCandidate,
        onChangeCandidateCheckbox: onChangeCandidateCheckbox,
        candidateActionTransition: candidateActionTransition
	}


}
