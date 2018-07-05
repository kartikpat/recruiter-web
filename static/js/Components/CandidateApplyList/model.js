function candidateList() {

    var settings = {};
    var config = {};

    function init(profile, baseUrl){
        settings.rowContainer= $('.candidateListing'),
        settings.rowContainerClass='.candidateListing'
        settings.header= $('#jobDetails'),
        settings.candidateRowClass= ".candidateRow",
        settings.candidateRow=$('.candidateRow'),
        settings.candidateInviteButton= ".candidateSendInterviewInvite",
        settings.candidateAddTagButton= ".candidateAddTagModal",
        settings.candidateAddCommentButton= ".candidateAddCommentTip",
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
        settings.coverLetterLinkClass = ".coverLetterLink",
        settings.candidateDetailsModal= $('.candidateDetailsModal'),
        settings.bulkDownArrow= $('#bulkDownArrow'),
        settings.bulkActionsDropdown= $('#bulkActionsDropdown'),
        settings.bulkActionsContainer = $("#bulkActionsContainer"),
        settings.applicationsCount = $(".applicationsCount"),
        settings.bulkCheckInputClass = ".bulkCheckInput",
        settings.bulkBackIcon = $(".bulkBackIcon"),
        settings.secondMassActionContainer = $("#secondMassActionContainer");
        settings.totalApplicationsCount = 0;
        settings.recommendationLinkClass = (".recommendationsLink");
        settings.baseUrl = baseUrl;
        settings.from = ''
        settings.to = ''
        settings.emptyView = $(".empty-screen"),
        settings.contactMenu=$('.contact-menu'),
        settings.candidateAddCommentButtonClass= '.candidateAddComment',
        settings.candidateCommentTextareaClass= '.candidateCommentText',
        settings.commentTextarea=('.comment-text'),
        settings.candidateEditComment=('.candidateAddEdit'),
        settings.contactMenubutton=$('.contactMenubutton');
        settings.candidateAddTagButtonClass= '.candidateAddTag',
        settings.candidateTagInputClass = '.candidateTagInputContainer',
        settings.candidateTagListClass = '.candidateTagListContainer',
        settings.candidateTagPrototype= $('.candidateTag.prototype'),
        settings.tagListing = ".recruiterTagsContainer",
        settings.candidateTagRemoveClass = '.tagRemove',
        settings.topbutton=$('#topbutton'),
        settings.tagInputError = $(".tagInputError"),
        settings.tagArr = [],
        settings.status = ''
        settings.url = baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications/download/excel";
        settings.newPost=$('.newPost');
        onClickBulkDownArrow()
        onClickMassCheckbox()
        onClickCandidateOtherActions()
        onClickMassSave()
        onClickMassReject()
        onClickMassShortlist()
        onClickMassComment()
        onChangebulkCheckbox()
        onClickActionListItems()
        contactMenu()
        onClickBulkBackIcon()
        onClickModal()
        closetooltipModal()
        backToTop()

        $(window).click(function(event) {
    		$(settings.candidateOtherActionsClass).addClass('inactive');
            $(settings.bulkActionsDropdown).addClass("hidden")
            settings.contactMenu.addClass('hidden')
        });

        settings.bulkActionsDropdown.click(function(e){
            e.stopPropagation()
        })

        if(parseInt(profile.excel)) {
            settings.downloadExcelMass.removeClass("hidden")
            settings.bulkDownArrow.removeClass("hidden")
        }
        if(parseInt(profile.bulk)) {
            settings.massResumeDownload.removeClass("hidden")
            settings.bulkDownArrow.removeClass("hidden")
        }
        
        $(".downloadExcelMass").attr('href', settings.url + "?token="+getCookie("recruiter-access-token")+"");
	}


    function onClickEducation(fn){
        settings.rowContainer.on('click', '.moreEducationLink', function(){
            var applicationId=$(this).closest('.candidate-item').attr("data-application-id");
            settings.candidateDetailsModal.find("#tabbed-content").tabs({active: 1});
            var eventObj = {
                event_category: eventMap["viewCandidProfile"]["cat"],
                event_label: 'origin=CandidateApplyList,type=MoreEducation,recId='+recruiterId+''
            }
            sendEvent(eventMap["viewCandidProfile"]["event"], eventObj)
            fn(applicationId)
            return false
        })
    }

    function onclickMoreOrganisation(fn){
        settings.rowContainer.on('click', '.moreExperience', function(){
            var applicationId=$(this).closest('.candidate-item').attr("data-application-id");
            settings.candidateDetailsModal.find("#tabbed-content").tabs({active: 1});
            var eventObj = {
                event_category: eventMap["viewCandidProfile"]["cat"],
                event_label: 'origin=CandidateApplyList,type=MoreExperience,recId='+recruiterId+''
            }
            sendEvent(eventMap["viewCandidProfile"]["event"], eventObj)
            fn(applicationId);
            return false
        })
    }

    function onClickNewPost(fn){
        settings.newPost.click(function(){
            fn()
        })    
    }

    function showNewPost(){
        settings.newPost.addClass('slideInDown');
        settings.newPost.removeClass('hidden');
    }

    function hideNewPost(){
        settings.newPost.addClass('hidden');
    }

    function onClickBulkBackIcon() {
        settings.bulkBackIcon.click(function(){
            settings.bulkActionContainer.addClass("hidden")
            settings.secondMassActionContainer.addClass("hidden")
            settings.massCheckboxInput.prop("checked",false)
            settings.rowContainer.find(".candidateCheckbox").prop("checked", false)
            settings.rowContainer.find(".candidate-select").removeClass("selected")
            settings.bulkActionsDropdown.find(".bulkCheckInput input").attr("disabled", false)
            settings.bulkActionsDropdown.find(".bulkCheckInput label").removeClass("not-allowed")
            settings.bulkActionsDropdown.find(".bulkCheckInput input").prop("checked", false)
            $(".second-fold").addClass("hidden")
        })
    }

    function onClickActionListItems() {
        settings.rowContainer.on('click','.action-list-items',function(e) {
            e.stopPropagation()
            return false
        })
    }

    function onChangebulkCheckbox() {
        settings.bulkActionsDropdown.on('click', ".bulkCheckInput input", function(e) {
            e.stopPropagation()
            if(jQuery(this).is(":checked")) {
                var len = $(this).attr("data-length")
                settings.bulkActionsDropdown.find(".bulkCheckInput input").attr("disabled", true)
                settings.bulkActionsDropdown.find(".bulkCheckInput label").addClass("not-allowed")
                $(this).attr("disabled", false)
                $(this).next().removeClass("not-allowed")
                var from = $(this).attr("data-from");
                var to = $(this).attr("data-to");
                settings.from = from;
                settings.to = to;
                settings.totalApplicationsCount = len;
                settings.applicationsCount.text(len + " candidates selected");
                settings.massCheckboxInput.prop("checked", false);
                settings.rowContainer.find(".candidateCheckbox").prop("checked", false);
                settings.rowContainer.find(".candidate-select").removeClass("selected");
                $(".second-fold").addClass("hidden");
                settings.bulkActionContainer.attr("data-type-request", "bulkRequestDropdown").removeClass("hidden");
            } else {
                settings.bulkActionsDropdown.find(".bulkCheckInput input").attr("disabled", false)
                settings.bulkActionsDropdown.find(".bulkCheckInput label").removeClass("not-allowed")
                settings.secondMassActionContainer.addClass("hidden")
                settings.bulkActionContainer.addClass("hidden")
            }
        })
        settings.bulkActionsDropdown.on('click', ".bulkCheckInput label", function(e) {
            e.stopPropagation()
        })
    }

    function onClickBulkDownArrow() {
        settings.bulkDownArrow.click(function(e){
            e.stopPropagation()
            settings.bulkActionsDropdown.toggleClass("hidden")
        })
    }

    function onClickCoverLetterLink(fn) {
        settings.rowContainer.on('click',settings.coverLetterLinkClass, function() {
            console.log($(this))
            var applicationId=$(this).closest('.candidate-item').attr("data-application-id");
            var eventObj = {
                event_category: eventMap["viewCandidProfile"]["cat"],
                event_label: 'origin=CandidateApplyList,type=CoverLetter,recId='+recruiterId+''
            }
            sendEvent(eventMap["viewCandidProfile"]["event"], eventObj)
            settings.candidateDetailsModal.find("#tabbed-content").tabs({active: 2});
            fn(applicationId)
            return false
        })
    }

    function onClickRecommendationLink(fn) {
        settings.rowContainer.on('click',settings.recommendationLinkClass, function() {
            var applicationId=$(this).closest('.candidate-item').attr("data-application-id");
            var eventObj = {
                event_category: eventMap["viewCandidProfile"]["cat"],
                event_label: 'origin=CandidateApplyList,type=recommendations,recId='+recruiterId+''
            }
            sendEvent(eventMap["viewCandidProfile"]["event"], eventObj)
            settings.candidateDetailsModal.find("#tabbed-content").tabs({active: 1});
            fn(applicationId)
            return false
        })
    }

    function onClickSendInterviewInviteF2F(fn) {
        settings.rowContainer.on('click', settings.sendInterviewInviteF2FClass, function(e){
            e.preventDefault()
            if(parseInt($(this).attr("data-clickable")) == 1) {
                window.location = staticEndPoints.createCalendar

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
                window.location = staticEndPoints.createCalendar
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

    function contactMenu(){
        settings.contactMenubutton.on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            settings.contactMenu.toggleClass('hidden')
        })
        settings.contactMenu.click(function(e){
            e.stopPropagation();
        });

    }

    function getElement(id) {
		var card = $(""+settings.candidateRowClass+".prototype").clone().removeClass('prototype hidden')
		card.attr('data-candidate-id', id);

		return {
            element: card,
            textarea:card.find('.commentdisabled'),
            Commentarea: card.find('.comment-tooltip .candidateCommentText'),
            AddCommentButton:card.find('.comment-tooltip .candidateAddComment'),
            EditComment:card.find('.comment-tooltip .candidateAddEdit'),
            candidateTagList: card.find(settings.candidateTagListClass),
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
            recommendationsLink: card.find(".recommendationsLink"),
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
        item.name.text(aData["name"] || "N/A");
        item.experience.text((aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m") || "N/A");
        item.location.text(aData["currentLocation"] || "N/A");
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

        item.downloadResumeButton.attr("data-href", baseUrl + aData["resume"])
        item.downloadResumeButton.attr("download", aData["name"].replace(/ +/g, '_')+'_resume.pdf')
        var status = aData["status"];
        item.shortlistButton.attr("data-status", status);
        item.rejectButton.attr("data-status", status);
        item.savedButton.attr("data-status", status);

        var tagStr = '';
        $.each(aData["tags"],function(index, aTag) {
            var tag = getCandidateTag(aTag)
            tagStr+=tag[0].outerHTML
        })
        item.candidateTagList.html(tagStr)

        if(status == 1) {
            item.shortlistButton.text("Shortlisted").addClass('act-short');
            item.shortlistButton.siblings(".iconTick").removeClass("hidden")
        }
        else if(status == 2) {
            item.rejectButton.text("Rejected").addClass('act-rej');
            item.rejectButton.siblings(".iconCross").removeClass("hidden")
        }
        else if(status == 3) {
            item.savedButton.text("Saved for later");

        }
        item.element.attr("data-status", status)
        if(aData["invite"]) {
            item.interviewinvite.text("Resend Interview Invite")
        }
        // var tagStr = '';
        // $.each(aData["tags"],function(index, aTag) {
        //     var tag =  settings.candidateTagsPrototype.clone().text(aTag["name"]).removeClass("prototype hidden");
        //     tagStr+=tag[0].outerHTML
        // })
        // item.jobTagList.html(tagStr)


        var profStr = '';
        if(aData["jobs"].length == 0) {
            // profStr = "<div style='line-height:1.5;color:#2b2b2b;'><span style='font-weight:bold;'>"+aData["name"]+"</span> does not have any work experience yet</div>"
        }
        else {
            aData["jobs"] = sortArrayOfObjectsByMultipleKey(aData["jobs"])
            $.each(aData["jobs"],function(index, anObj) {
                if(index > 2) {
                    return
                }
                var item = getProfessionalElement()
                item.name.text(anObj["organization"])
                item.designation.text(anObj["designation"]);

                if(anObj["exp"]["from"]["month"] && anObj["exp"]["to"]["month"] && anObj["exp"]["from"]["year"] && anObj["exp"]["to"]["year"]) {
                    var fromMon = getMonthName(anObj["exp"]["from"]["month"]);
                    var toMon = getMonthName(anObj["exp"]["to"]["month"]);
                    var fromYear = anObj["exp"]["from"]["year"];
                    var toYear = anObj["exp"]["to"]["year"];
                    var str = (anObj["is_current"]) ? fromMon + ", " + fromYear + " to Present": fromMon + ", " + fromYear + " to " + toMon + ", " + toYear;
                }

                item.tenure.text(str);

                profStr+=item.element[0].outerHTML
            })
            if(aData["jobs"].length > 3) {
                profStr+= "<span style='color: #155d9a;font-size:13px' class='moreExperience'>"+(aData["jobs"].length - 3)+" more work experience</span><span class='icon-right_arrow link-color'></span>"
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
            item.tenure.text(anObj["batch"]["from"] + " to " + anObj["batch"]["to"] )
            item.degree.text(anObj["degree"] +" " + "("+anObj["courseType"]+")")
            eduStr+=item.element[0].outerHTML
        })

        if(aData["education"].length > 3) {
            eduStr+= "<span style='color: #155d9a;font-size:13px' class='moreEducationLink'>"+(aData["education"].length - 3)+" more education</span><span class='icon-right_arrow link-color'></span>"
        }

        item.eduList.html(eduStr)

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
        if(aData["recommendation"] && aData["recommendation"].length > 0) {
            item.recommendationsLink.removeClass("hidden")
        }
        if(aData["tags"].length == 0) {
            item.viewCommentLink.addClass("no-after")
        }

        if(aData["comment"]){
            item.Commentarea.addClass('hidden').html(aData["comment"]);
            item.textarea.removeClass('hidden').html(aData["comment"]);
            item.AddCommentButton.addClass('hidden');
            item.EditComment.removeClass('hidden');
            item.viewCommentLink.removeClass("hidden")

        }
        if(aData["tags"].length) {
            item.viewTagLink.removeClass("hidden")

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

    function addToList(dataArray, status, offset, pageContent, filterFlag){
        settings.status = status;
		var str = '';
        var element = $(".candidateListing[data-status-attribute='"+status+"']");
        hideShells(status);
        if(dataArray.length<1 && offset == 0) {
            if(filterFlag > 0) {
                return
            }
			if(status== ""){
				$('.user-text').text('You have not received any applications yet.');
				$('.empty-text').text('You’ll a list here once you do');
				settings.emptyView.removeClass('hidden');
				return
			}
			else if(status== "0" ){
				$('.user-text').text('Great job!');
				$('.empty-text').text('You have sorted all your received applications');
        		settings.emptyView.removeClass('hidden');
				return
            }
            else if(status== "4,5"){
				$('.user-text').text('You have not reviewed any candidates yet.');
				$('.empty-text').text('Any candidate that is viewed or downloaded will appear here');
				settings.emptyView.removeClass('hidden');
				return
            }
            else if(status== "1"){
				$('.user-text').text('You have not shortlisted any candidates yet.');
				$('.empty-text').text('Click on ‘Shortlist’ button to shortlist a candidate in ‘Unread Tab’');
			    settings.emptyView.removeClass('hidden');
				return
            }
            else if(status== "2"){
				$('.user-text').text('You have not rejected any candidates yet');
				$('.empty-text').text("Click on ‘Reject’ button to reject a candidate in ‘Unread Tab'");
                settings.emptyView.removeClass('hidden');
                return
            }
            else if(status== "3"){
				$('.user-text').text('You have not saved any candidates yet.');
				$('.empty-text').text('Click on ‘Save’ in the other actions to save a candidate in ‘Unread Tab’');
			    settings.emptyView.removeClass('hidden');
				return
			}
		}
		dataArray.forEach(function(aData, index){
			var item = createElement(aData);
			str+=item.element[0].outerHTML;
		});
		element.append(str);
        // settings.rowContainer.find(".candidate-select").removeClass("selected");
        if(dataArray.length < pageContent) {
            if(element.find(".no-more-records").length == 0) {
                return element.append("<div class='no-more-records no-data'>You have reached the end of the list</div>")
            }
        }
	}

    function onClickViewComment(fn) {
        settings.rowContainer.on('click', settings.viewCommentButtonClass, function(e){
            e.preventDefault();
            var applicationId= $(this).closest(settings.candidateRowClass).attr("data-application-id")
            $('.action-tooltip').addClass('hidden');
            $(this).closest(settings.candidateRowClass).find('.comment-tooltip').removeClass('hidden');
            $(this).closest(settings.candidateRowClass).find(settings.commentTextarea).removeClass("hidden");
            $(this).closest(settings.candidateRowClass).find(settings.candidateCommentTextareaClass).addClass("hidden");
            $(this).closest(settings.candidateRowClass).find(settings.candidateAddCommentButtonClass).addClass("hidden");
            $(this).closest(settings.candidateRowClass).find(settings.candidateEditComment).removeClass("hidden");

            if(window.innerWidth<768){
                addBodyFixed();
            }
            fn(applicationId);
        })
    }

    function onClickViewTag(fn) {
        settings.rowContainer.on('click', settings.viewTagButtonClass, function(e){
            e.preventDefault();
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            $('.action-tooltip').addClass('hidden');
            $(this).closest(settings.candidateRowClass).find('.tag-tooltip').removeClass('hidden');
            if(window.innerWidth<768){
                addBodyFixed();
            }
            fn(applicationId);
        })
    }


    
    function onClickCandidate(fn) {
        settings.rowContainer.on('click', ".openCandidateLink", function(e){
            if(fn()){
                e.stopPropagation();
                e.preventDefault();
            }    
        })
    }

    function activateStatsTab(event, ui) {
        $(ui.oldTab[0]).find(".bulk-selection-item").removeClass("active");
        $(ui.newTab[0]).find(".bulk-selection-item").addClass("active");
        return getActiveTab(ui);
    }

    function getActiveTab(ui){
        return $(ui.newTab[0]).attr("data-attribute");   
    }

    function setDefaultTab(status) {
        $("li .bulk-selection-item").removeClass("active")
        $("li[data-attribute='"+status+"'] .bulk-selection-item").addClass("active")
    }



    function onClickCandidateOtherActions() {
        settings.rowContainer.on('mouseenter', settings.candidateOtherActionsClass,function(event) {
            event.stopPropagation();
            $(this).removeClass("inactive");
            return false
        })
        settings.rowContainer.on('mouseleave', settings.candidateOtherActionsClass,function(event) {
            event.stopPropagation();
            $(this).addClass("inactive");
            return false
        })
        settings.rowContainer.on('click', settings.candidateOtherActionsClass,function(event) {
            event.stopPropagation();
            return false
        })
    }

    function onClickSendMessage(fn) {
        settings.rowContainer.on('click', settings.candidateSendMessageButton,function(event) {
            event.preventDefault();
            var candidateId = $(this).closest(settings.candidateRowClass).attr("data-candidate-id")
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            fn(candidateId, applicationId);
        });
    }

    function onClickDownloadResume(fn) {
        settings.rowContainer.on('click', settings.candidateDownloadResumeButton, function(event){
            event.preventDefault()
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            var status = $(this).closest(settings.candidateRowClass).attr("data-status")   
            if(fn(applicationId, status)){
                var url = $(this).attr("data-href");
                url += "?type=download"
                window.open(url);
            }    
        })
    }

    function onClickSaveCandidate(fn) {
        settings.rowContainer.on('click', settings.candidateSaveButton, function(event){
            event.preventDefault();
            var status = $(this).attr("data-status");
            var action = $(this).attr("data-action");
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            fn(applicationId, status, action);
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

            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            settings.rowContainer.find('.tag-tooltip').addClass('hidden');
            settings.rowContainer.find('.comment-tooltip').addClass('hidden');
            $(".candidateRow[data-application-id="+applicationId+"]").find('.tag-tooltip').removeClass('hidden');
            if(window.innerWidth<768){
                addBodyFixed();
            }
        })
    }


    function onClickAddComment(fn){
        settings.rowContainer.on('click',settings.candidateAddCommentButton ,function(event) {
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            settings.rowContainer.find('.comment-tooltip').addClass('hidden');
            settings.rowContainer.find('.tag-tooltip').addClass('hidden');
            $(".candidateRow[data-application-id="+applicationId+"]").find('.comment-tooltip').removeClass('hidden');
            if(window.innerWidth<768){
                addBodyFixed();
            }
        })
    }

    function onClickComment(fn) {
        settings.rowContainer.on('keyup',settings.candidateCommentTextareaClass,function(event) {
            if(event.which==13)
            if (!event.shiftKey)
            {
                event.stopPropagation();
                event.preventDefault();
                var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")

                var comment = ($(this).closest(settings.candidateRowClass).find(settings.candidateCommentTextareaClass).val()).trim();
                if(!comment) {
                    return
                }
                fn(applicationId, comment);
            }
        });

        settings.rowContainer.on('click', settings.candidateAddCommentButtonClass,function(event) {
            event.stopPropagation();
            event.preventDefault();
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")

            var comment = ($(this).closest(settings.candidateRowClass).find(settings.candidateCommentTextareaClass).val()).trim();
            if(!comment) {
                return
            }
            fn(applicationId, comment);
        });

        settings.rowContainer.on('click',settings.candidateEditComment,function(event){
            event.stopPropagation();
            event.preventDefault();
            
            $(this).closest(settings.candidateRowClass).find(settings.candidateCommentTextareaClass).val($(this).closest(settings.candidateRowClass).find(settings.commentTextarea).val());
            $(this).closest(settings.candidateRowClass).find(settings.commentTextarea).addClass("hidden");
            $(this).closest(settings.candidateRowClass).find(settings.candidateCommentTextareaClass).removeClass("hidden");
            $(this).closest(settings.candidateRowClass).find(settings.candidateAddCommentButtonClass).removeClass("hidden");
            $(this).closest(settings.candidateRowClass).find(settings.candidateEditComment).addClass("hidden");
        });
    }

    function onClickTag(fn,fn1){
        settings.rowContainer.on('keyup', settings.candidateTagInputClass ,function(event) {
            event.stopPropagation();
            event.preventDefault();
            var tagName = $(this).val();
            if (event.which != 13) {
                 $(this).removeAttr("tag-id")
            }
            if(event.which==13)
            {
                var tagName = ($(this).closest(settings.candidateRowClass).find(settings.candidateTagInputClass).val()).trim();
                if(!tagName) {
                    $(this).closest(settings.candidateRowClass).find(settings.candidateTagInputClass).addClass("error-border");
                    $(this).closest(settings.candidateRowClass).find(settings.candidateTagInputClass).next().removeClass("hidden")
                    return
                }
                var obj = searchObjByKey(settings.tagArr, tagName, "name")
                var tagId = $(settings.CandidateTagInputClass).attr("tag-id");
                if(obj) {
                    tagId = obj["id"]
                }
                $(this).removeAttr("tag-id")
                var parameters = {}
                if(tagId) {
                    parameters.tagId = tagId;
                }
                parameters.tagName = tagName;
                var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
                return fn(applicationId, parameters);
            }
            return fn1(tagName)
        });
        settings.rowContainer.on('click', settings.candidateAddTagButtonClass,function(event) {
            event.stopPropagation();
            event.preventDefault();

            var tagName = ($(this).closest(settings.candidateRowClass).find(settings.candidateTagInputClass).val()).trim();
            if(!tagName) {
                $(this).closest(settings.candidateRowClass).find(settings.candidateTagInputClass).addClass("error-border");
                $(this).closest(settings.candidateRowClass).find(settings.candidateTagInputClass).next().removeClass("hidden")
                return
            }
            var obj = searchObjByKey(settings.tagArr, tagName, "name")
            var tagId = $(settings.CandidateTagInputClass).attr("tag-id");
            if(obj) {
                tagId = obj["id"]
            }
            $(this).removeAttr("tag-id")
            var parameters = {}
            if(tagId) {
                parameters.tagId = tagId;
            }
            parameters.tagName = tagName;
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            return fn(applicationId, parameters);
        });
    }

    function getCandidateTag(aTag) {
        var tag =  settings.candidateTagPrototype.clone().removeClass("prototype hidden");
        tag.find(".tagLabel").text(aTag["name"]);
        tag.find(".tagRemove").attr("data-tag-id", aTag["id"]);
        return tag
    }

    function appendCandidateTag(aTag,applicationId){
        var tag = getCandidateTag(aTag);
        $(".candidateRow[data-application-id="+applicationId+"]").find(settings.candidateTagListClass).append(tag);
        // $(".candidateRow[data-application-id="+applicationId+"]").find(settings.viewCommentButtonClass).removeClass('hidden');
        emptyInputElement($(settings.candidateTagInputClass));
    }

    function emptyInputElement(element) {
        element.val("")
    }

    function onClickDeleteTag(fn) {
        settings.rowContainer.on('click', settings.candidateTagRemoveClass,function(event) {
            event.stopPropagation();
            event.preventDefault();
            var tagId = $(this).attr("data-tag-id");
            var applicationId = $(this).closest(settings.candidateRowClass).attr("data-application-id")
            return fn(applicationId, tagId);
        });
    }

    function removeTag(tagId) {
        $(settings.candidateTagListClass).find(".tagRemove[data-tag-id="+tagId+"]").closest(".candidateTag").remove()
    }

    function showDropdownTags(data) {
        settings.tagArr = data;
        initializeAutoCompleteComponent(settings.tagListing, data)
    }

    function initializeAutoCompleteComponent(selector, availableTags) {
        var suggestedTagsArray = [];
        availableTags.forEach(function(aTag) {
            suggestedTagsArray.push({
                "label": aTag["name"],
                "value": aTag["name"],
                "id": aTag["id"]
            });
        })
        settings.rowContainer.find(settings.tagListing).autocomplete({
              source: suggestedTagsArray,
            select: function( event, ui ) {
                settings.rowContainer.find(settings.tagListing).attr("tag-id", ui.item.id);
                settings.rowContainer.find(settings.tagListing).val( ui.item.value);
                return false;
            }
        });
    }

    function addComment(comment,applicationId){
        $(".candidateRow[data-application-id="+applicationId+"]").find(settings.candidateCommentTextareaClass).addClass("hidden");
        $(".candidateRow[data-application-id="+applicationId+"]").find(settings.candidateAddCommentButtonClass).addClass("hidden");
        $(".candidateRow[data-application-id="+applicationId+"]").find(settings.commentTextarea).val(comment);
        $(".candidateRow[data-application-id="+applicationId+"]").find(settings.commentTextarea).removeClass("hidden");
        $(".candidateRow[data-application-id="+applicationId+"]").find(settings.candidateEditComment).removeClass("hidden");
    }

    function onClickModal(){
        settings.rowContainer.on('click','.action-tooltip',function(event) {
            event.preventDefault();
            event.stopPropagation();
        })
    }

    function closetooltipModal(){
        settings.rowContainer.on('click','.close-modal',function(event) {
            $('.action-tooltip').addClass('hidden');
            settings.rowContainer.find(settings.tagInputError).addClass('hidden');
            removeBodyFixed();
        })

    }


    function onClickShortlistCandidate(fn) {
        settings.rowContainer.on('click', settings.candidateShortlistButtonClass, function(event) {
                $(this).addClass('hidden')
                $(this).prev().removeClass('hidden')
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
            var val=$(this).html();
                $(this).addClass('hidden')
                $(this).prev().removeClass('hidden')
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
                var candidateSelect = jQuery(".candidate-select")
                var el = $(".candidateListing[data-status-attribute='"+settings.status+"']").find(".candidate-select input:checked")
   
                // if(el.length > 100) {
                //     $(this).prop("checked", false);
                //     toastNotify(3, "You can perform action on only 100 candidates at once.")
                //     return
                // }
                jQuery(this).closest(".candidate-select").addClass("selected");
                candidateSelect.addClass("selector");
                var arr = returnSelectedApplications()
                settings.totalApplicationsCount = arr.length;
                settings.bulkActionsDropdown.find(".bulkCheckInput input").attr("disabled", false);
                settings.bulkActionsDropdown.find(".bulkCheckInput label").removeClass("not-allowed")
                settings.bulkActionsDropdown.find(".bulkCheckInput input").prop("checked", false);
                settings.applicationsCount.text(arr.length + " candidates selected");
                settings.bulkActionContainer.attr("data-type-request", "bulkRequest").removeClass("hidden")
            } else {
                var candidateSelect = jQuery(".candidate-select")
                jQuery(this).closest(".candidate-select").removeClass("selected");
                var el = $(".candidateListing[data-status-attribute='"+settings.status+"']").find(".candidate-select input:checked")
                var applicationId =  $(this).closest(settings.candidateRowClass).attr("data-application-id")
                if(el.length > 0) {
                    var arr = returnSelectedApplications()
                    settings.totalApplicationsCount = arr.length;
                    settings.applicationsCount.text(arr.length + " candidates selected");
                    settings.bulkActionContainer.removeClass("hidden")
                }
                else {
                    settings.secondMassActionContainer.addClass("hidden")
                    settings.bulkActionContainer.addClass("hidden")
                    candidateSelect.removeClass('selector')
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

                var candidateSelect = $(".candidateListing[data-status-attribute='"+settings.status+"']").find(".candidate-select")
                var candidateSelectTotal = candidateSelect.not(".candidateRow.prototype .candidate-select");
                // if(candidateSelectTotal.length > 100) {
                //     candidateSelectTotal = candidateSelectTotal.slice(0, 100);
                //     toastNotify(3, "You can perform action on only 100 candidates at once.")
                // }
                candidateSelectTotal.addClass("selected")
                candidateSelectTotal.find("input").prop("checked",  true);
                settings.bulkActionsDropdown.find(".bulkCheckInput input").attr("disabled", false);
                settings.bulkActionsDropdown.find(".bulkCheckInput label").removeClass("not-allowed")
                settings.bulkActionsDropdown.find(".bulkCheckInput input").prop("checked", false);
                var arr = returnSelectedApplications()
                settings.totalApplicationsCount = arr.length
                settings.applicationsCount.text(arr.length + " candidates selected");
                settings.bulkActionContainer.attr("data-type-request", "bulkRequest").removeClass("hidden")
            } else {
                var candidateSelect = jQuery(".candidate-select")
                candidateSelect.not(".candidate-select.prototype").removeClass("selected");
                jQuery(".candidate-select input").prop("checked",  false);
                settings.secondMassActionContainer.addClass("hidden")
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
			settings.bulkActionModal.find(".modalHeading").text("Are you sure?");
			settings.bulkActionModal.find(".jsModalText").text("You are about to reject "+settings.totalApplicationsCount+" candidates.")
			settings.bulkActionModal.find(".jsModalTextSecondary").text("These candidates will be moved to the Rejected Tab.").removeClass("hidden");
            settings.bulkActionModal.find(".massActionButton").text("Reject").attr("data-action", "reject").attr("data-status", "2")
            settings.bulkActionModal.find(".massTextarea").val("")
            settings.bulkActionModal.find(".errorField").addClass("hidden")
            addBodyFixed()
            settings.bulkActionModal.removeClass("hidden")
        })

    }

    function onClickMassShortlist() {
        settings.massShortlist.click(function(e){
            e.stopPropagation()

            settings.bulkActionModal.find(".modalHeading").text("Are you sure?");
			settings.bulkActionModal.find(".jsModalText").text("You are about to shortlist "+settings.totalApplicationsCount+" candidates.")
			settings.bulkActionModal.find(".jsModalTextSecondary").text("These candidates will be moved to the Shortlisted Tab.").removeClass("hidden");
            settings.bulkActionModal.find(".massActionButton").text("Shortlist").attr("data-action", "shortlist").attr("data-status", "1")
            settings.bulkActionModal.find(".massTextarea").val("")
            settings.bulkActionModal.find(".errorField").addClass("hidden")
            addBodyFixed()
            settings.bulkActionModal.removeClass("hidden")
        })
    }

    function onClickMassSave() {
        settings.massSave.click(function(e){
            e.stopPropagation()

            settings.bulkActionModal.find(".modalHeading").text("Are you sure?");
			settings.bulkActionModal.find(".jsModalText").text("You are about to save "+settings.totalApplicationsCount+" candidates.")
			settings.bulkActionModal.find(".jsModalTextSecondary").text("These candidates will be moved to the Saved Tab.").removeClass("hidden");
            settings.bulkActionModal.find(".massActionButton").text("Save for Later").attr("data-action", "save").attr("data-status", "3")
            settings.bulkActionModal.find(".massTextarea").val("")
            settings.bulkActionModal.find(".errorField").addClass("hidden")
            addBodyFixed()
            settings.bulkActionModal.removeClass("hidden")
        })
    }

    function onClickMassComment() {
        settings.massComment.click(function(e){
            e.stopPropagation()

            settings.bulkActionModal.find(".modalHeading").text("Add Comment");
			settings.bulkActionModal.find(".jsModalText").text("The Comment will be added on "+settings.totalApplicationsCount+" candidates profiles.")
			settings.bulkActionModal.find(".jsModalTextSecondary").addClass("hidden")
            settings.bulkActionModal.find(".massActionButton").text("Add").attr("data-action", "comment")
            settings.bulkActionModal.find(".massTextarea").val("")
            settings.bulkActionModal.find(".errorField").addClass("hidden")
            addBodyFixed()
            settings.bulkActionModal.removeClass("hidden")
        })
    }

    function onClickMassActionButton(fn) {
        settings.bulkActionModal.find(".massActionButton").click(function(e){
            e.stopPropagation()
            var selectedApplicationIds = returnSelectedApplications()
            var action = $(this).attr("data-action");
            var comment = (settings.bulkActionModal.find(".massTextarea").val()).trim();
            var newStatus;
            if($(this).attr("data-status")) {
                newStatus =  $(this).attr("data-status");
            }
            if(action == "comment") {
                if(comment == '') {
                    return settings.bulkActionModal.find(".errorField").removeClass("hidden")
                }
                else {
                    settings.bulkActionModal.find(".errorField").addClass("hidden")
                }
            }

            closeModal()
            var requestType = settings.bulkActionContainer.attr("data-type-request")
            fn(selectedApplicationIds, action, comment, newStatus, requestType, settings.from, settings.to)
        })
    }

    function returnSelectedApplications() {

        var el = $(".candidateListing[data-status-attribute='"+settings.status+"']").find(".candidate-select input:checked")

        var selectedApplicationIds = []
        $.each(el, function(index,anElem){
            var applicationId = $(anElem).closest(settings.candidateRowClass).attr("data-application-id")

            selectedApplicationIds.push(applicationId)
        })
        return selectedApplicationIds
    }

    function onClickDownloadMassExcel(fn) {
        settings.downloadExcelMass.click(function(event) {
            var requestType = settings.bulkActionContainer.attr("data-type-request");
            var arr = returnSelectedApplications()
            if(fn(arr,settings.from, settings.to,requestType))
                return true
            return false
        })
    }

    function onClickDownloadMassResume(fn) {
        settings.massResumeDownload.click(function(event){
            var requestType = settings.bulkActionContainer.attr("data-type-request");
            var arr = returnSelectedApplications()
            fn(arr,settings.from, settings.to, requestType);
        })
    }

    function setHref(str) {
        var href = settings.url;
        str += "token="+getCookie(cookieName)+""
        href += str;
        settings.downloadExcelMass.attr("href", href);
    }

    function closeModal() {
		removeBodyFixed()
		settings.bulkActionModal.addClass("hidden")
    }

    function initializeJqueryTabs(defaultTab, fn, fn1) {
        settings.jobTabs.tabs({
            active: defaultTab,
            create:function(){
                $(this).removeClass("hidden")
                populateCheckInputDropdown()
                settings.bulkActionsContainer.removeClass("hidden")
            },
            activate: function(event, ui) {
                hideEmptyScreen()
                settings.bulkActionContainer.addClass("hidden")
                settings.secondMassActionContainer.addClass("hidden")
                settings.massCheckboxInput.prop("checked", false)
                fn(event, ui);
            },
            beforeActivate: function(event, ui){
                if(event.which){
                    fn1(event, ui);
                    return false
                }
                return true
            }
        })
    }
    function setJqueryTab(index){
        debugger
        settings.jobTabs.tabs( "option", "active",index);
    }

    function onClickJqueryTabs(){
        $('.ui-tabs-anchor')
    }

    function hideEmptyScreen() {
        settings.emptyView.addClass("hidden")
    }

    function showShells(status) {
        $(".candidateListing[data-status-attribute='"+status+"']").find(settings.candidateItemShellClass).removeClass("hidden");
        $(".candidateListing[data-status-attribute='"+status+"']").find('.no-data').remove();
    }

    function hideShells(status) {
        $(".candidateListing[data-status-attribute='"+status+"']").find(settings.candidateItemShellClass).addClass("hidden")
    }

    function removeCandidate(status) {
        $(".candidateListing[data-status-attribute='"+status+"']").find(settings.candidateRowClass).remove();
        // store.emptyStore();
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
                settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateReject").addClass('act-rej').text("Rejected")
            }
            else {
                settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateReject").removeClass('act-rej').text("Reject")
            }
            if(newStatus == settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateShortlist").attr("data-action")) {
                settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateShortlist").addClass('act-short').text("Shortlisted")
            }
            else {
                settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"'] .candidateShortlist").removeClass('act-short').text("Shortlist")
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
            theme: 'tooltipster-borderless',

		})

        settings.candidateDetailsModal.find(".tooltip").tooltipster({
			animation: 'fade',
			delay: 0,
            side:['left'],
			theme: 'tooltipster-borderless'
		})
    }

    function changeInviteText(applicationId) {
        settings.rowContainer.find(".candidateRow[data-application-id="+applicationId+"] .interviewinvite").text("Interview Invite Sent")
        settings.rowContainer.find(".candidateRow[data-application-id="+applicationId+"] .inviteText").removeClass("underline").addClass("non-underline")
        $(".candidateRow[data-application-id="+applicationId+"] .interviewinvite").text("Interview Invite Sent")
        $(".candidateRow[data-application-id="+applicationId+"] .inviteText").removeClass("underline").addClass("non-underline")
    }

    function showComment(applicationId,len){
        if(len == 0) {
            settings.rowContainer.find(".candidateRow[data-application-id="+applicationId+"] .commentLink").addClass("no-after");
        }
        else {
            settings.rowContainer.find(".candidateRow[data-application-id="+applicationId+"] .commentLink").removeClass("no-after");
        }
        settings.rowContainer.find(".candidateRow[data-application-id="+applicationId+"] .commentLink").removeClass("hidden")
    }

    function showTag(applicationId, comment){
        if(comment != '') {
            settings.rowContainer.find(".candidateRow[data-application-id="+applicationId+"] .commentLink").removeClass("no-after");
        }
        settings.rowContainer.find(".candidateRow[data-application-id="+applicationId+"] .tagLink").removeClass("hidden")
    }

    function changeStatus(arr, newStatus) {
        arr.forEach(function(applicationId){
            settings.rowContainer.find(".candidateRow[data-application-id='"+applicationId+"']").attr("data-status", newStatus)
        })
    }

    function populateCheckInputDropdown(count, status) {

        var item = getJobsCategoryTabsElement();
        var str = ''
        if(count == 0) {
            str = "No Applications"
            return settings.bulkActionsDropdown.html(str)
        }

        if(parseInt(status) == 0) {

            var text;
            var dataLength;
            var from;
            var to;
            if(count >= 100) {
                text = "Select top 100 applications"
                dataLength = 100;
                from = "1";
                to = "100";
            }
            else if(count > 0 && count < 100){
                text = "Select "+count+" applications"
                dataLength = count
                from = "1";
                to = count;
            }

            var item = $(".bulkCheckInput.prototype").clone().removeClass("prototype hidden");
            item.find("input").attr("id", dataLength);
            item.find("label").attr("for",dataLength).text(text );
            item.find("input").attr("data-length", dataLength);
            item.find("input").attr("data-from", from);
            item.find("input").attr("data-to", to);
            str += item[0].outerHTML
            return settings.bulkActionsDropdown.html(str)
        }
        var slotDifference = 100;
        var divide = Math.floor(count/slotDifference);
        var remainder = count%slotDifference;
        var i=0;
        var start = 1;
        var end = 100;
        var str = '';
        var j;
        for(j = divide; j > 0; j--) {
            var item = $(".bulkCheckInput.prototype").clone().removeClass("prototype hidden");
            item.find("input").attr("id", i);
            item.find("label").attr("for",i).text(start + " - " + end );
            item.find("input").attr("data-length", end - start + 1);
            item.find("input").attr("data-from", start);
            item.find("input").attr("data-to", end);
            str += item[0].outerHTML
            start = end + 1;
            end = end + slotDifference;
            i++;
        }
        if(remainder == 0) {
            return settings.bulkActionsDropdown.html(str)
        }
        var item = $(".bulkCheckInput.prototype").clone().removeClass("prototype hidden");
        item.find("input").attr("id", i);
        item.find("label").attr("for",i).text(start + " - " + (( (start - 1) == 0 ? 0 : (start - 1)) + remainder) );
        item.find("input").attr("data-length", remainder);
        item.find("input").attr("data-from", start);
        item.find("input").attr("data-to", (( (start - 1) == 0 ? 0 : (start - 1)) + remainder));
        str += item[0].outerHTML
        settings.bulkActionsDropdown.html(str)
    }

    function getApplicationsLength() {
        return $(".candidateListing[data-status-attribute='"+settings.status+"']").find(".candidateRow").length;
    }

    function backToTop(){
        $(window).scroll(function() {
            if ($(window).scrollTop() > 500) {
              settings.topbutton.addClass('show');
            } else {
                settings.topbutton.removeClass('show');
            }
          });

          settings.topbutton.on('click', function(e) {
            e.preventDefault();
            $('html, body').animate({scrollTop:0}, '300');
          });
    }

    function changeTab(hash){
        if(hash=="view-cover-letter"){
            settings.candidateDetailsModal.find("#tabbed-content").tabs({active: 2});
            return
        }
        settings.candidateDetailsModal.find("#tabbed-content").tabs({active: 1});
    }
    
    return {
		init: init,
		addToList: addToList,
		setConfig : setConfig,
        initializeJqueryTabs: initializeJqueryTabs,
        setJqueryTab: setJqueryTab,
        setJobStats: setJobStats,
        activateStatsTab: activateStatsTab,
        onClickCandidate: onClickCandidate,
        onClickAddTag: onClickAddTag,
        onClickAddComment: onClickAddComment,
        onClickComment:onClickComment,
        onClickModal:onClickModal,
        closetooltipModal:closetooltipModal,
        onClickSendMessage: onClickSendMessage,
        onClickSaveCandidate: onClickSaveCandidate,
        onClickDownloadResume: onClickDownloadResume,
        onClickShortlistCandidate: onClickShortlistCandidate,
        onClickRejectCandidate: onClickRejectCandidate,
        onChangeCandidateCheckbox: onChangeCandidateCheckbox,
        candidateActionTransition: candidateActionTransition,
        onClickViewComment: onClickViewComment,
        onClickViewTag: onClickViewTag,
        addComment:addComment,
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
        changeStatus: changeStatus,
        populateCheckInputDropdown: populateCheckInputDropdown,
        getApplicationsLength: getApplicationsLength,
        hideEmptyScreen: hideEmptyScreen,
        contactMenu:contactMenu,
        showComment: showComment,
        showTag:showTag,
        onClickTag:onClickTag,
        showDropdownTags: showDropdownTags,
        onClickDeleteTag: onClickDeleteTag,
        removeTag: removeTag,
        onClickNewPost:onClickNewPost,
        appendCandidateTag: appendCandidateTag,
        showNewPost:showNewPost,
        hideNewPost:hideNewPost,
        onClickJqueryTabs: onClickJqueryTabs,
        getActiveTab: getActiveTab,
        onClickEducation:onClickEducation,
        onclickMoreOrganisation:onclickMoreOrganisation,
        onClickRecommendationLink:onClickRecommendationLink,
        onClickCoverLetterLink:onClickCoverLetterLink,
        changeTab:changeTab
    }
}
