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
        settings.candidateTagsPrototype= $('.candidateTags.prototype'),
        settings.viewCommentButtonClass = '.viewCommentButton',
        settings.viewTagButtonClass = '.viewTagButton',
        settings.massResumeDownload = $("#downloadResumeMass"),
        settings.massReject = $("#massReject"),
        settings.massShortlist = $("#massShortlist"),
        settings.massComment = $("#massComment"),
        settings.massTag = $("#massTag"),
        settings.downloadExcelMass = $("#downloadExcelMass")

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
            candidateCheckbox: card.find(settings.candidateCheckboxClass),
            candidateCheckboxLabel: card.find(settings.candidateCheckboxLabelClass),
            proMember: card.find('.isPro'),
            isFollowedUp: card.find('.isFollowedUp'),
            shortlistButton: card.find(settings.candidateShortlistButtonClass),
            rejectButton: card.find(settings.candidateRejectButtonClass),
            savedButton: card.find(settings.candidateSaveButton)
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
        item.element.attr("data-application-id", aData["id"]);
        item.image.attr("src",aData["img"]);
        item.name.text(aData["name"]);
        item.experience.text(aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m");
        item.location.text(aData["preferredLocation"]);
        item.appliedOn.text(moment(aData["timestamp"]).format('DD-MM-YYYY'))
        item.notice.text(aData["notice"] + " months");
        item.shortlistButton.attr("data-status", "1");
        item.rejectButton.attr("data-status", "2");
        item.savedButton.attr("data-status", "3");
        // var tagStr = '';
        // $.each(aData["tags"],function(index, aTag) {
        //     var tag =  settings.candidateTagsPrototype.clone().text(aTag["name"]).removeClass("prototype hidden");
        //     tagStr+=tag[0].outerHTML
        // })
        // item.jobTagList.html(tagStr)
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

        console.log(aData['userID']);
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
            all: card.find("#allNo"),
            unread: card.find("#unreadNo"),
            shortlisted: card.find("#shortlistedNo"),
            rejected: card.find("#rejectedNo"),
            saved: card.find("#savedNo"),
            reviewed: card.find("#reviewedNo")
        }
    }

    function setJobStats(data) {
        var item = getJobsCategoryTabsElement()
        var unread = data["total"] - (data["shortlisted"] + data["rejected"] + data["save"] + data["reviewed"]);
        item.all.text(data["total"]);
        item.unread.text(unread)
        item.shortlisted.text(data["shortlisted"])
        item.rejected.text(data["rejected"])
        item.saved.text(data["save"])
        item.reviewed.text(data["reviewed"])
    }

    function updateJobStats(status, newStatus) {
        var item = getJobsCategoryTabsElement();
        var oldCount = item.element.find("li[data-attribute='"+status+"'] .tabStats").text()
        debugger
        item.element.find("li[data-attribute='"+status+"'] .tabStats").text(parseInt(oldCount) - 1);
        var newCount = item.element.find("li[data-attribute='"+newStatus+"'] .tabStats").text()
        debugger
        item.element.find("li[data-attribute='"+newStatus+"'] .tabStats").text(parseInt(newCount) + 1);
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
            create:function(){},
            activate: function(event, ui){
                fn(event, ui);
            }
        })
    }

    function emptyCandidateList() {
        settings.rowContainer.empty();
    }

    function onClickViewComment(fn) {
        settings.rowContainer.on('click', settings.viewCommentButtonClass, function(e){
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            fn(candidateId);
            return false
        })
    }

    function onClickViewTag(fn) {
        settings.rowContainer.on('click', settings.viewTagButtonClass, function(e){
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            fn(candidateId);
            return false
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
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            fn(applicationId);
            return false
        })
    }

    function onClickSaveJob(fn) {
        settings.rowContainer.on('click', settings.candidateSaveButton, function(event){
            event.stopPropagation();
            var status = $(this).attr("data-status");
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            fn(applicationId, status);
            return false
        })
    }

    function onClickMassComment(fn) {
        settings.massComment.click(function(event) {
			// var jobId = $(this).attr("data-id");
			var modal = $(".jsAddCommentModal");
            modal.find(".jsAddComment").click(function(){
                return fn
            });
            addBodyFixed()
            modal.removeClass("hidden")
        })
    }

    function onClickMassTag() {
        settings.rowContainer.on('click',settings.candidateAddTagButton ,function(event) {
            event.stopPropagation()
			// var jobId = $(this).attr("data-id");
			var modal = $(".jsAddTagModal");
            modal.find(".jsAddTag").click(function(){
                fn(jobId)
            });
            addBodyFixed()
            modal.removeClass("hidden")
        })
    }

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
            console.log("a")
            event.stopPropagation();
            var status = $(this).attr("data-status");
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            fn(applicationId, status);
        })
    }

    function onClickRejectCandidate(fn) {
        settings.rowContainer.on('click', settings.candidateRejectButtonClass, function(event) {
            event.stopPropagation();
            var status = $(this).attr("data-status");
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            fn(applicationId, status);
        })
    }

    function candidateActionTransition(applicationId) {
        settings.rowContainer.find(".candidateRow[data-application-id="+applicationId+"]").addClass("hidden")
    }

    function onChangeCandidateCheckbox(fn) {
        settings.rowContainer.on('click', settings.candidateCheckboxClass, function(event){
            event.stopPropagation();

            if(jQuery(this).is(":checked")){
                jQuery(this).closest(".candidate-select").addClass("selected");
            } else {
                jQuery(this).closest(".candidate-select").removeClass("selected");
            }
        })
        settings.rowContainer.on('click', settings.candidateCheckboxLabelClass, function(event) {
            event.stopPropagation();
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            return fn(candidateId);
        })
    }

    function onClickMassReject() {
        settings.massReject.click(function(){
            alert()
        })
    }

    function onClickMassShortlist() {
        settings.massReject.click(function(){
            alert()
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
        candidateActionTransition: candidateActionTransition,
        onClickViewComment: onClickViewComment,
        onClickViewTag: onClickViewTag,
        emptyCandidateList: emptyCandidateList,
        onClickMassReject: onClickMassReject,
        onClickMassShortlist: onClickMassShortlist,
        updateJobStats: updateJobStats
	}


}
