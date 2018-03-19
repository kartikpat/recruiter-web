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
        settings.massResumeDownload = $(".downloadResumeMass"),
        settings.massReject = $(".massReject"),
        settings.massSave = $(".massSave"),
        settings.massShortlist = $(".massShortlist"),
        settings.massComment = $(".massComment"),
        settings.massTag = $(".massTag"),
        settings.downloadExcelMass = $(".downloadExcelMass")
        settings.bulkActionContainer = $("#massActionContainer"),
        settings.massCheckboxInput = $("#massCheckboxInput"),
        settings.massCheckboxLabel = $("#massCheckboxLabel"),
        settings.candidateSelectedLength = null,
        settings.bulkActionModal = $(".bulkActionModal"),
        settings.selectedApplicationIds = {},
        settings.jobTabs = $("#jobs-tabs"),
        settings.candidateItemShellClass = ".candidateItem.shell",
        settings.sendInterviewInviteF2FClass = ".inviteF2f",
        settings.sendInterviewInviteTelephonicClass = ".inviteTelephonic",
        settings.tooltip= $(".tooltip"),
        settings.coverLetterLink = $(".coverLetterLink"),
        settings.candidateDetailsModal= $('.candidateDetailsModal')

        onClickMassCheckbox()
        onClickCandidateOtherActions()
        onClickMassSave()
        onClickMassReject()
        onClickMassShortlist()
        onClickMassComment()

        onClickCoverLetterLink()
        $(window).click(function(event) {
    		$(settings.candidateOtherActionsClass).addClass('inactive');
    	});
	}



    function onClickCoverLetterLink() {
        settings.rowContainer.on('click', settings.coverLetterLink, function(e){
            e.preventDefault()
            // settings.candidateDetailsModal.find("#tabbed-content").tabs({active: 2});
            return false
        })
    }

    function onClickSendInterviewInviteF2F(fn) {
        settings.rowContainer.on('click', settings.sendInterviewInviteF2FClass, function(e){
            e.preventDefault()

            if(parseInt($(this).attr("data-clickable")) == 1) {
                window.location = "/booked-slots"

            }
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            var inviteId = parseInt($(this).attr("data-invite-id"));
            fn(applicationId, inviteId);
            return false
        })
    }

    function onClickSendInterviewInviteTelephonic(fn) {
        settings.rowContainer.on('click', settings.sendInterviewInviteTelephonicClass, function(e){
            e.preventDefault()
            if(parseInt($(this).attr("data-clickable")) == 1) {
                window.location = "/booked-slots"

            }
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            var inviteId =  parseInt($(this).attr("data-invite-id"));
            fn(applicationId, inviteId);
            return false
        })
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
            savedButton: card.find(settings.candidateSaveButton),
            downloadResumeButton: card.find(settings.candidateDownloadResumeButton),
            interviewinvite: card.find(".interviewinvite"),
            coverLetterLink: card.find(".coverLetterLink"),
            viewCommentLink: card.find(".commentLink"),
            viewTagLink: card.find(".tagLink")
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
        item.element.find(".openCandidateLink").attr('href',"/job/"+config["jobId"]+"/applications/"+aData["id"]+"");
        item.element.attr("data-application-id", aData["id"]);
        item.image.attr("src",(aData["img"] || "/static/images/noimage.png"));
        item.name.text(aData["name"] || "NA");
        item.experience.text((aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m") || "NA");
        item.location.text(aData["currentLocation"] || "NA");
        item.appliedOn.text(moment(aData["timestamp"], "x").format('DD-MM-YYYY'))
        if(aData["notice"] == 7) {
            item.notice.text("Immediately Available");
        }
        else if(aData["notice"] == 1) {
            item.notice.text((aData["notice"] + " month"));
        }
        else {
            item.notice.text((aData["notice"] + " months"));
        }

        item.shortlistButton.attr("data-action", 1);
        item.rejectButton.attr("data-action", 2);
        item.savedButton.attr("data-action", 3);
        item.downloadResumeButton.attr("data-href", aData["resume"])
        item.downloadResumeButton.attr("download", aData["name"].replace(/ +/g, '_')+'_resume.pdf')
        var status = aData["status"];
        item.shortlistButton.attr("data-status", status);
        item.rejectButton.attr("data-status", status);
        item.savedButton.attr("data-status", status);
        if(status == 1) {
            item.shortlistButton.text("Shortlisted");
        }
        else if(status == 2) {
            item.rejectButton.text("Rejected");
        }
        else if(status == 3) {
            item.savedButton.text("Saved for later");
        }
        item.element.attr("data-status", status)
        // var tagStr = '';
        // $.each(aData["tags"],function(index, aTag) {
        //     var tag =  settings.candidateTagsPrototype.clone().text(aTag["name"]).removeClass("prototype hidden");
        //     tagStr+=tag[0].outerHTML
        // })
        // item.jobTagList.html(tagStr)


        var profStr = '';
        if(aData["jobs"].length == 0) {
            profStr = "<div style='line-height:1.5;'><span style='font-weight:bold;'>"+aData["name"]+"</span> does not have any work experience yet</div>"
        }
        else {
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
            if(aData["jobs"].length > 3) {
                profStr+= "<span style='color: #155d9a'>"+(aData["jobs"].length - 3)+" more work experience.</span>"
            }
        }

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
        if(aData["education"].length > 3) {
            eduStr+= "<span style='color: #155d9a'>"+(aData["education"].length - 3)+" more education.</span>"
        }

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
        // if(aData["invite"]) {
        //     item.interviewinvite.text("Resend Interview Invite");
        // }
        if(aData["cover"]) {
            item.coverLetterLink.removeClass("hidden")
        }
        var flag=0;
        if(aData["comment"]) {
            item.viewCommentLink.removeClass("hidden")
            flag++;
        }
        if(aData["tags"].length) {
            item.viewTagLink.removeClass("hidden")
            flag++;
        }
        if(flag>1){
              item.viewTagLink.css("border-left","1px solid #e8e8e8");
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

    function updateJobStats(status, newStatus, number) {
        var item = getJobsCategoryTabsElement();
        var oldCount = item.element.find("li[data-attribute='"+status+"'] .tabStats").text()

        if(status != "") {
            item.element.find("li[data-attribute='"+status+"'] .tabStats").text(parseInt(oldCount) - number);
        }
        var newCount = item.element.find("li[data-attribute='"+newStatus+"'] .tabStats").text()

        item.element.find("li[data-attribute='"+newStatus+"'] .tabStats").text(parseInt(newCount) + number);
    }

    function addToList(dataArray, status){
		var str = '';
        var element = $(".candidateListing[data-status-attribute='"+status+"']");
        hideShells(status);
        if(!dataArray.length) {
			return element.html("<div class='no-data'>No Applications Found!</div>")
		}else {
            element.find(".no-data").remove()
        }
		dataArray.forEach(function(aData, index){
			var item = createElement(aData);
			str+=item.element[0].outerHTML;
            console.log(index)
		});
		element.append(str);
        settings.rowContainer.find(".candidate-select").removeClass("selected");
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
            var status = $(this).attr("data-status")
            var applicationId = $(this).attr("data-application-id")
            return fn(candidateId, status, applicationId);
        })
    }

    function activateStatsTab(event, ui) {
        $(ui.oldTab[0]).find(".bulk-selection-item").removeClass("active");
        $(ui.newTab[0]).find(".bulk-selection-item").addClass("active");
        return $(ui.newTab[0]).attr("data-attribute");
    }

    function setDefaultTab(status) {
        $("li .bulk-selection-item").removeClass("active")
        $("li[data-attribute='"+status+"'] .bulk-selection-item").addClass("active")
    }

    function onClickCandidateOtherActions() {
        settings.rowContainer.on('click', settings.candidateOtherActionsClass,function(event) {
            event.stopPropagation();
            $(this).toggleClass("inactive");
            return false
        })
    }

    function onClickSendMessage(fn) {
        settings.rowContainer.on('click', settings.candidateSendMessageButton,function(event) {
            event.stopPropagation();
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            fn(candidateId, applicationId);
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
            var url = $(this).attr("data-href");
            window.open(url);
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            var status = $(this).closest(settings.candidateRowClass).attr("data-status")
            fn(applicationId, status)
            return false
        })
    }

    function onClickSaveCandidate(fn) {
        settings.rowContainer.on('click', settings.candidateSaveButton, function(event){
            event.stopPropagation();
            var status = $(this).attr("data-status");
            var action = $(this).attr("data-action");
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            fn(applicationId, status, action);
            return false
        })
    }



    // function onClickMassTag(fn) {
    //     var modal = $(".jsAddTagModal");
    //     settings.massTag.click(function(event) {
    //         modal.find(".jsModalText").text("You are about to add Tag on "+settings.candidateSelectedLength+" candidates.")
    //         addBodyFixed()
    //         modal.removeClass("hidden")
    //     })
    //     modal.find(".jsAddTag").click(function(){
    //         fn()
    //     });
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
            event.stopPropagation();
            var status = $(this).attr("data-status");
            var action = $(this).attr("data-action");
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            fn(applicationId, status, action);
            return false
        })
    }

    function onClickRejectCandidate(fn) {
        settings.rowContainer.on('click', settings.candidateRejectButtonClass, function(event) {
            event.stopPropagation();
            var status = $(this).attr("data-status");
            var action = $(this).attr("data-action");
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            fn(applicationId, status, action);
            return false
        })
    }

    function candidateActionTransition(arr) {
        arr.forEach(function(applicationId){
            settings.rowContainer.find(".candidateRow[data-application-id="+applicationId+"]").slideUp("normal", function() {
                 $(this).remove();
             })
        })

    }

    function onChangeCandidateCheckbox(fn) {
        settings.rowContainer.on('click', settings.candidateCheckboxClass, function(event){
            event.stopPropagation();

            if(jQuery(this).is(":checked")){
                jQuery(this).closest(".candidate-select").addClass("selected");
                var el = jQuery(".candidate-select.selected");
                settings.bulkActionContainer.removeClass("hidden")
            } else {
                jQuery(this).closest(".candidate-select").removeClass("selected");
                var el = jQuery(".candidate-select.selected");
                var applicationId =  $(this).closest(settings.candidateRowClass).attr("data-application-id")
                if(el.length >=1) {
                    settings.bulkActionContainer.removeClass("hidden")
                }
                else {
                    settings.bulkActionContainer.addClass("hidden")
                }
            }
        })
        settings.rowContainer.on('click', settings.candidateCheckboxLabelClass, function(event) {
            event.stopPropagation();

        })
    }

    function onClickMassCheckbox(){
        settings.massCheckboxInput.click(function(event){
            event.stopPropagation();

            if(jQuery(this).is(":checked")){
                var candidateSelect = jQuery(".candidate-select")
                candidateSelect.not(".candidate-select.prototype").addClass("selected");
                candidateSelect.find("input").prop("checked",  true);
                var el = jQuery(".candidate-select.selected");
                if(el.length >=2) {
                    settings.bulkActionContainer.removeClass("hidden")
                }
                else {
                    settings.bulkActionContainer.addClass("hidden")
                }
            } else {
                var candidateSelect = jQuery(".candidate-select")

                candidateSelect.not(".candidate-select.prototype").removeClass("selected");
                jQuery(".candidate-select input").prop("checked",  false);


                settings.bulkActionContainer.addClass("hidden")

            }
        })
        settings.massCheckboxLabel.click(function(event) {
            event.stopPropagation();

        })
    }

    function onClickMassReject(fn) {
        settings.massReject.click(function(e){
            e.stopPropagation()
            var arr = returnSelectedApplications();
			settings.bulkActionModal.find(".modalHeading").text("Are you sure?");
			settings.bulkActionModal.find(".jsModalText").text("You are about to reject "+arr.length+" candidates.")
			settings.bulkActionModal.find(".jsModalTextSecondary").text("These candidates will be moved to the Rejected Tab.").removeClass("hidden");
            settings.bulkActionModal.find(".massActionButton").text("Reject").attr("data-action", "reject").attr("data-status", "2")
            settings.bulkActionModal.find(".massTextarea").val("")
            addBodyFixed()
            settings.bulkActionModal.removeClass("hidden")
        })

    }

    function onClickMassShortlist() {
        settings.massShortlist.click(function(e){
            e.stopPropagation()
            var arr = returnSelectedApplications();
            settings.bulkActionModal.find(".modalHeading").text("Are you sure?");
			settings.bulkActionModal.find(".jsModalText").text("You are about to shortlist "+arr.length+" candidates.")
			settings.bulkActionModal.find(".jsModalTextSecondary").text("These candidates will be moved to the Shortlisted Tab.").removeClass("hidden");
            settings.bulkActionModal.find(".massActionButton").text("Shortlist").attr("data-action", "shortlist").attr("data-status", "1")
            settings.bulkActionModal.find(".massTextarea").val("")
            addBodyFixed()
            settings.bulkActionModal.removeClass("hidden")
        })
    }

    function onClickMassSave() {
        settings.massSave.click(function(e){
            e.stopPropagation()
            var arr = returnSelectedApplications();
            settings.bulkActionModal.find(".modalHeading").text("Are you sure?");
			settings.bulkActionModal.find(".jsModalText").text("You are about to save "+arr.length+" candidates.")
			settings.bulkActionModal.find(".jsModalTextSecondary").text("These candidates will be moved to the Saved Tab.").removeClass("hidden");
            settings.bulkActionModal.find(".massActionButton").text("Save for Later").attr("data-action", "save").attr("data-status", "3")
            settings.bulkActionModal.find(".massTextarea").val("")
            addBodyFixed()
            settings.bulkActionModal.removeClass("hidden")
        })
    }

    function onClickMassComment() {
        settings.massComment.click(function(e){
            e.stopPropagation()
            var arr = returnSelectedApplications();
            settings.bulkActionModal.find(".modalHeading").text("Add Comment");
			settings.bulkActionModal.find(".jsModalText").text("The Comment will be added on "+arr.length+" candidates profiles.")
			settings.bulkActionModal.find(".jsModalTextSecondary").addClass("hidden")
            settings.bulkActionModal.find(".massActionButton").text("Add").attr("data-action", "comment")
            settings.bulkActionModal.find(".massTextarea").val("")
            addBodyFixed()
            settings.bulkActionModal.removeClass("hidden")
        })
    }

    function onClickMassActionButton(fn) {
        settings.bulkActionModal.find(".massActionButton").click(function(e){
            e.stopPropagation()
            var selectedApplicationIds = returnSelectedApplications()
            var action = $(this).attr("data-action");
            var comment = settings.bulkActionModal.find(".massTextarea").val();
            var newStatus;
            if($(this).attr("data-status")) {
                newStatus =  $(this).attr("data-status");
            }

            if(!comment) {
                return settings.bulkActionModal.find(".errorField").removeClass("hidden")
            }
            else {
                settings.bulkActionModal.find(".errorField").addClass("hidden")
            }
            settings.bulkActionModal.addClass("hidden")

            fn(selectedApplicationIds, action, comment, newStatus)
        })
    }

    function returnSelectedApplications() {

        var el = settings.rowContainer.find(".candidate-select.selected")

        var selectedApplicationIds = []
        $.each(el, function(index,anElem){

            var applicationId = $(anElem).closest(settings.candidateRowClass).attr("data-application-id")

            selectedApplicationIds.push(applicationId)
        })
        return selectedApplicationIds
    }

    function onClickDownloadMassExcel(fn) {
        settings.downloadExcelMass.click(function(event){

            var arr = returnSelectedApplications()
            fn(arr)
            return true;
        })
    }

    function onClickDownloadMassResume(fn) {
        settings.massResumeDownload.click(function(event){
            var arr = returnSelectedApplications()
            fn(arr)
        })
    }

    function setHref(str) {
        var href = settings.downloadExcelMass.attr("href");
        href += str;
        console.log(href)
        settings.downloadExcelMass.attr("href", href);
    }

    function closeModal() {
		removeBodyFixed()
		settings.bulkActionModal.addClass("hidden")
	}

    function initializeJqueryTabs(defaultTab, fn) {
        settings.jobTabs.tabs({
            active: defaultTab,
            create:function(){
                $(this).removeClass("hidden")
            },
            activate: function(event, ui){
                settings.bulkActionContainer.addClass("hidden")
                settings.massCheckboxInput.prop("checked", false)
                fn(event, ui);
            }
        })
    }


    function showShells(status) {
        $(".candidateListing[data-status-attribute='"+status+"']").find(settings.candidateItemShellClass).removeClass("hidden")
    }

    function hideShells(status) {
        $(".candidateListing[data-status-attribute='"+status+"']").find(settings.candidateItemShellClass).addClass("hidden")
    }

    function removeCandidate(status) {
        $(".candidateListing[data-status-attribute='"+status+"']").find(settings.candidateRowClass).remove();
    }

    function changeButtonText(arr, newStatus, dataAction) {

        arr.forEach(function(applicationId){

            settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateShortlist").attr("data-status", newStatus)
            settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateReject").attr("data-status", newStatus)
            settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateSave").attr("data-status", newStatus)
            if(newStatus == settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateSave").attr("data-action")) {
                settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateSave").text("Saved For Later")
            }
            else {
                settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateSave").text("Save For Later")
            }
            if(newStatus == settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateReject").attr("data-action")) {
                settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateReject").text("Rejected")
            }
            else {
                settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateReject").text("Reject")
            }
            if(newStatus == settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateShortlist").attr("data-action")) {
                settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateShortlist").text("Shortlisted")
            }
            else {
                settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateShortlist").text("Shortlist")
            }
        })
    }

    function setInvite() {
        $(settings.sendInterviewInviteF2FClass).attr("data-clickable","1")
        $(settings.sendInterviewInviteTelephonicClass).attr("data-clickable","1")
        $(settings.sendInterviewInviteF2FClass).attr("title","You need to set up your calendar before sending an invite. Click to set up calendar")
        $(settings.sendInterviewInviteTelephonicClass).attr("title","You need to set up your calendar before sending an invite. Click to set up calendar")

        settings.rowContainer.find(".tooltip").not(".prototype .tooltip").tooltipster({
			animation: 'fade',
			delay: 0,
			side:['left'],
			theme: 'tooltipster-borderless'
		})

        settings.candidateDetailsModal.find(".tooltip").tooltipster({
			animation: 'fade',
			delay: 0,
			side:['left'],
			theme: 'tooltipster-borderless'
		})

    }

    function changeInviteText(applicationId) {
        $(settings.candidateRowClass).find(".candidateRow[data-application-id="+applicationId+"] .interviewinvite").text("Resend Interview Invite")
    }

    function changeStatus(arr, newStatus) {
        arr.forEach(function(applicationId){
            settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"']").attr("data-status", newStatus)
        })
    }

    return {
		init: init,
		addToList: addToList,
		setConfig : setConfig,
        initializeJqueryTabs: initializeJqueryTabs,
        setJobStats: setJobStats,
        activateStatsTab: activateStatsTab,
        onClickCandidate: onClickCandidate,
        onClickSendInterviewInvite: onClickSendInterviewInvite,
        onClickAddTag: onClickAddTag,
        onClickAddComment: onClickAddComment,
        onClickSendMessage: onClickSendMessage,
        onClickSaveCandidate: onClickSaveCandidate,
        onClickDownloadResume: onClickDownloadResume,
        onClickShortlistCandidate: onClickShortlistCandidate,
        onClickRejectCandidate: onClickRejectCandidate,
        onChangeCandidateCheckbox: onChangeCandidateCheckbox,
        candidateActionTransition: candidateActionTransition,
        onClickViewComment: onClickViewComment,
        onClickViewTag: onClickViewTag,
        onClickDownloadMassExcel: onClickDownloadMassExcel,
        updateJobStats: updateJobStats,
        onClickMassComment: onClickMassComment,
        setHref: setHref,
        onClickMassActionButton: onClickMassActionButton,
        onClickDownloadMassResume: onClickDownloadMassResume,
        closeModal: closeModal,
        showShells: showShells,
        hideShells: hideShells,
        removeCandidate: removeCandidate,
        setDefaultTab: setDefaultTab,
        onClickSendInterviewInviteTelephonic: onClickSendInterviewInviteTelephonic,
        onClickSendInterviewInviteF2F: onClickSendInterviewInviteF2F,
        setInvite: setInvite,
        changeInviteText: changeInviteText,
        changeButtonText: changeButtonText,
        changeStatus: changeStatus
	}
}
