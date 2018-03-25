

function Candidate() {
    var settings = {}

    function init() {
        settings.candidateDetailsModal= $('.candidateDetailsModal')
        settings.candidateCommentContainerClass= '.candidateCommentContainer',
        settings.candidateTagContainerClass= '.candidateTagContainer',
        settings.mobCandidateTagContainerClass= '.mobCandidateTagContainer',
        settings.mobCandidateCommentContainerClass= '.mobCandidateCommentContainer',
        settings.candidateTagPrototype= $('.candidateTag.prototype'),
        settings.candidateAddCommentButtonClass= '.candidateAddCommentButton',
        settings.candidateAddTagButtonClass= '.candidateAddTagButton',
        settings.candidateCommentTextareaClass= '.candidateCommentTextarea',
        settings.candidateEditComment=$('.candidateAddEditButton'),
        settings.mobCandidateEditComment=$('.mobcandidateAddEditButton')
        settings.mobCommentBox=$('.mobCommentBox');
        settings.commentBox=$('.comment-box'),
        settings.commentTextarea=$('.comment-textarea'),
        settings.candidateTagInputClass = '.candidateTagInput',
        settings.candidateTagRemoveClass = '.tagRemove',
        settings.candidateTagListClass = '.candidateTagList',
        settings.mobCandidateTagInputClass = '.mobCandidateTagInput',
        settings.mobCandidateAddTagButtonClass = '.mobCandidateAddTagButton',
        settings.mobCandidateCommentTextareaClass = '.mobCandidateCommentTextarea',
        settings.mobCandidateAddCommentButtonClass = '.mobCandidateAddCommentButton',
        settings.candidateShortlistModal = $(".candidateShortlistModal"),
        settings.candidateRejectModal = $(".candidateRejectModal"),
        settings.candidateSaveModal = $("#candidateSaveModal"),
        settings.candidateChatModal = $("#candidateChatModal"),
        settings.tagListing = $(".recruiterTags"),
        settings.tagMobListing = $("#tagMobListing"),
        settings.tagInputError = $(".tagInputError"),
        settings.sendInterviewInviteF2FClass = ".inviteF2f",
        settings.sendInterviewInviteTelephonicClass = ".inviteTelephonic"

        jQuery("#tabbed-content").tabs({});
        // onClickAddPopulatedTags()

        jQuery(".body-overlay").on("click", function(e) {

        	if(jQuery(e.target).parents(".view-resume-modal").length) {
                e.stopPropagation()
        		e.stopImmediatePropagation();
        	}

            settings.candidateDetailsModal.scrollTop(0)
            resetCandidateData()
        	settings.candidateDetailsModal.addClass("hidden");

        });

        jQuery(".closeCandidateModal").on("click", function(e) {

            settings.candidateDetailsModal.scrollTop(0)
            resetCandidateData()
            jQuery(".body-overlay").addClass("hidden").removeClass("vieled");
            $("body").removeClass("posf")
        	settings.candidateDetailsModal.addClass("hidden");

        });

    }

    function showCandidateDetails(details, type, status){
        return populateCandidateData(details, type, status)
    }



    function onClickChatCandidateModal(fn) {
        settings.candidateChatModal.click(function(){
            var candidateId = $(this).closest(settings.candidateDetailsModal).attr("data-candidate-id")
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            fn(candidateId, applicationId);
        })
    }

    function onClickSendInterviewInviteF2F(fn) {
        settings.candidateDetailsModal.on('click', settings.sendInterviewInviteF2FClass, function(e){
            e.preventDefault()

            if(parseInt($(this).attr("data-clickable")) == 1) {
                window.location = "/booked-slots"

            }
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id");
            var inviteId = parseInt($(this).attr("data-invite-id"));
            fn(applicationId, inviteId);
            return false
        })
    }

    function onClickSendInterviewInviteTelephonic(fn) {
        settings.candidateDetailsModal.on('click', settings.sendInterviewInviteTelephonicClass, function(e){
            e.preventDefault()
            if(parseInt($(this).attr("data-clickable")) == 1) {
                window.location = "/booked-slots"

            }
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id");
            var inviteId =  parseInt($(this).attr("data-invite-id"));
            fn(applicationId, inviteId);
            return false
        })
    }

    function getElement(userID) {
        var modal = settings.candidateDetailsModal;
        modal.attr("data-candidate-id",userID)
        return {
            element: modal,
            image: modal.find(".js_img"),
            name: modal.find(".js_name"),
            location: modal.find(".js_loc"),
            preferredLocation: modal.find(".js_pref_loc"),
            experience: modal.find(".js_experience"),
            contact: modal.find(".js_contact"),
            salary: modal.find(".js_sal"),
            skillsList: modal.find(".js_skills_list"),
            candidateTagList: modal.find(settings.candidateTagListClass),
            lastActive: modal.find(".js_last_login"),
            eduList: modal.find(".js_edu_list"),
            profList: modal.find(".js_prof_list"),
            appliedOn: modal.find(".js_appliedOn"),
            notice: modal.find(".js_notice"),
            gender: modal.find(".js_gender"),
            age: modal.find(".js_age"),
            salary: modal.find(".js_sal"),
            expectedSalary: modal.find(".js_expected_sal"),
            maritalStatus: modal.find(".js_marital_status"),
            languages: modal.find(".js_languages"),
            workPermit: modal.find(".js_work_permit"),
            percentile: modal.find(".js_percentile"),
            teamHandling: modal.find(".js_handled_team"),
            workSixDays: modal.find(".js_six_days"),
            relocate: modal.find(".js_relocate"),
            differentlyAbled: modal.find(".js_different_abled"),
            startup: modal.find(".js_startup"),
            travel: modal.find(".js_travel"),
            resume: modal.find(".js_resume"),
            coverLetter: modal.find(".js_cover_letter"),
            comment: modal.find(".candidateCommentTextarea"),
            tag: modal.find(".candidateTagInput"),
            mobTag: modal.find(".mobCandidateTagInput"),
            mobComment: modal.find(".mobCandidateCommentTextarea"),
            firstName: modal.find("#firstName"),
            tabContent: modal.find("#tabbed-content"),
            shortlistButton: modal.find(".candidateShortlistModal"),
            rejectButton: modal.find(".candidateRejectModal"),
            savedButton : modal.find("#candidateSaveModal"),
            commentTextarea : modal.find('.comment-textarea'),
            commentBox: modal.find('.commentBox'),
            editButton: modal.find('.candidateAddEditButton'),
            addButton: modal.find('.candidateAddCommentButton'),
            commentAddBox: modal.find('.candidateCommentTextarea'),
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

    function populateCandidateData(aData, type, status) {
        var item = getElement(aData["userID"]);
        item.element.attr("data-application-id", aData["id"])
        item.image.attr("src", (aData["img"] || "/static/images/noimage.png"))
        item.name.text(aData["name"] || "NA");
        item.experience.text(aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m" || "NA");
        item.location.text(aData["currentLocation"] || "NA");
        var preferredLocationStr = "N.A."
        if(aData["preferredLocation"].length) {
            preferredLocationStr = aData["preferredLocation"].join(', ');
        }
        item.preferredLocation.text(preferredLocationStr);
        item.contact.text(aData["phone"] || "NA");
        item.appliedOn.text(moment(aData["timestamp"], "x").format('DD-MM-YYYY') || "NA")
        if(aData["notice"] == 7) {
            item.notice.text("Immediately Available");
        }
        else if(aData["notice"] == 1) {
            item.notice.text((aData["notice"] + " month"));
        }
        else {
            item.notice.text((aData["notice"] + " months"));
        }
        item.salary.text(formatSalary(aData['ctc']))
        item.firstName.text(aData["name"])
        // var lastActiveDays = getLastActiveDay(aData["lastActive"])

        // item.lastActive.text(lastActiveDays > 1 ? lastActiveDays + " days ago": lastActiveDays + " day ago");
        item.lastActive.text(moment(aData["lastActive"]).format("DD-MM-YYYY"))
        var eduStr = '';
        $.each(aData["education"],function(index, anObj) {

            var item = getEducationElement()
            item.name.text(anObj["institute"])
            item.tenure.text(anObj["batch"]["from"] + " - " + anObj["batch"]["to"] )
            item.degree.text(anObj["degree"] + "("+anObj["courseType"]+")")
            if(index != aData["education"].length - 1)
                item.seperator.removeClass("hidden")
            eduStr+=item.element[0].outerHTML
        })
        item.eduList.html(eduStr)
        var profStr = '';
        if(aData["jobs"].length == 0) {
            profStr = "<div style='line-height:1.5;'><span style='font-weight:bold;'>"+aData["name"]+"</span> does not have any work experience yet</div>"
        }
        else {
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
                if(index != aData["jobs"].length - 1)
                    item.seperator.removeClass("hidden")
                profStr+=item.element[0].outerHTML
            })
        }
        item.profList.html(profStr)

        var tagStr = '';
        $.each(aData["tags"],function(index, aTag) {
            var tag = getCandidateTag(aTag)
            tagStr+=tag[0].outerHTML
        })
        item.candidateTagList.html(tagStr)

        item.gender.text(gender[aData["sex"]])
        item.age.text(getAge(aData["dob"]) + " years")
        item.expectedSalary.text(formatSalary(aData["expectedCtc"]))
        item.maritalStatus.text(getMaritalStatus(aData["maritalStatus"]));
        item.languages.text((formatLanguages(aData["languages"]) || "N.A."));
        item.workPermit.text((workPermit[aData["permit"]] || "N.A."));
        item.teamHandling.text(binary[aData["handleTeam"]])
        item.workSixDays.text("no");
        item.relocate.text(binary[aData["relocate"]] )
        item.startup.text(binary[aData["joinStartup"]])
        item.travel.text(binary[aData["travel"]])
        item.percentile.text(aData["catScore"] || "N.A.")
        item.workSixDays.text(binary[aData["sixDays"]])
        if(isCanvasSupported()) {
            item.resume.addClass("hidden")
            $(".loaderScrollerResume").removeClass("hidden")
        	getBinaryData(aData["resume"],function(res){
                resumeCallback(res, aData["id"])
            });
        }
        else {
        	item.resume.html('<iframe src="'+aData["resume"]+'" class="resume-embed" type="application/pdf"></iframe>')
        }
        if(aData["cover"]) {
            item.coverLetter.html(nl2br(aData["cover"]))
            $(".coverLetterTab").removeClass("hidden")
        }
        if(aData["comment"]) {
            item.comment.val(aData["comment"]);
            item.mobComment.val(aData["comment"]);
            item.commentTextarea.val(aData["comment"])
            item.comment.addClass('hidden');
            item.commentTextarea.removeClass('hidden');
            item.addButton.addClass('hidden');
            item.editButton.removeClass('hidden');
        }
        item.shortlistButton.attr("data-action", 1);
        item.rejectButton.attr("data-action", 2);
        item.savedButton.attr("data-action", 3);
        var status = aData["status"];
        item.shortlistButton.attr("data-status", status);
        item.rejectButton.attr("data-status", status);
        item.savedButton.attr("data-status", status);
        if(status == 1) {
            item.shortlistButton.text("Shortlisted")
        }
        else if(status == 2) {
            item.rejectButton.text("Rejected")
        }
        else if(status == 3) {
            item.savedButton.html("<span class='icon'><i class='icon-star'></i></span>Saved for Later")
        }

        openModal(item)
        
        if(!type)
            return
        if(type == "tag") {
            if(window.innerWidth <= 1024)
                return focusOnElement(item.mobTag, settings.mobCandidateTagContainerClass)
            return focusOnElement(item.tag, settings.candidateTagContainerClass)
        }

        if(type == "comment") {
            if(window.innerWidth <= 1024)
                return focusOnElement(item.mobComment, settings.mobCandidateCommentContainerClass)
            return focusOnElement(item.comment, settings.candidateCommentContainerClass)
        }

    }

    function getCandidateTag(aTag) {
        var tag =  settings.candidateTagPrototype.clone().removeClass("prototype hidden");
        tag.find(".tagLabel").text(aTag["name"]);
        tag.find(".tagRemove").attr("data-tag-id", aTag["id"]);
        return tag
    }

    function appendCandidateTag(aTag){
        var tag = getCandidateTag(aTag);
        settings.candidateDetailsModal.find(settings.candidateTagListClass).append(tag)
        emptyInputElement($(settings.candidateTagInputClass));
        emptyInputElement($(settings.mobCandidateTagInputClass));
    }

    function emptyInputElement(element) {
        element.val("")
    }

    function resetCandidateData() {
        var item = getElement();
        item.element.attr("data-application-id", "0")
        item.image.attr("src", "")
        item.name.text("");
        item.experience.text("");
        item.location.text("");
        item.contact.text("");
        item.appliedOn.text("")
        item.notice.text("");
        item.salary.text("");
        item.lastActive.text("");
        item.gender.text("");
        item.age.text("")
        item.expectedSalary.text("")
        item.maritalStatus.text("");
        item.languages.text("");
        item.workPermit.text("");
        item.coverLetter.text("");
        item.preferredLocation.text("");
        item.tabContent.tabs({active: 0});
        item.shortlistButton.text("Shortlist");
        item.rejectButton.text("Reject");
        item.resume.empty()
        item.savedButton.html("<span class='icon'><i class='icon-star'></i></span>Save for Later");
        $(".coverLetterTab").addClass("hidden");

    }

    function openModal() {

    	$(".body-overlay").removeClass("hidden").addClass("veiled");
    	$("body").addClass("posf");
        settings.candidateDetailsModal.removeClass("hidden");
    }







    function onClickAddComment(fn) {
        // settings.candidateDetailsModal.on('keyup', settings.candidateCommentTextareaClass,function(event) {
        //     event.stopPropagation();
        //     if (event.which == 13) {
        //         return alert("k")
        //         var candidateId = $(this).closest(settings.candidateRow).attr("data-candidate-id")
        //         return fn(candidateId);
        //     }
        //
        // });
        settings.candidateDetailsModal.on('click', settings.candidateAddCommentButtonClass,function(event) {
            event.stopPropagation();
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id");
            var comment = ($(settings.candidateCommentTextareaClass).val()).trim();
            $(settings.candidateCommentTextareaClass).addClass("hidden");
            settings.commentBox.removeClass("hidden");
            settings.commentTextarea.text(comment);
            $(settings.candidateAddCommentButtonClass).addClass("hidden");
            settings.candidateEditComment.removeClass("hidden");
            if(!comment) {
                return
            }
            fn(applicationId, comment);
        });


        settings.candidateEditComment.on('click',function(event){
            $(settings.candidateCommentTextareaClass).removeClass("hidden").focus();
            settings.commentBox.addClass("hidden");
            $(settings.candidateAddCommentButtonClass).removeClass("hidden");
            settings.candidateEditComment.addClass("hidden");
        })
    }

    function onClickAddCommentMob(fn) {
        // settings.candidateDetailsModal.on('keyup', settings.candidateCommentTextareaClass,function(event) {
        //     event.stopPropagation();
        //     if (event.which == 13) {
        //         return alert("k")
        //         var candidateId = $(this).closest(settings.candidateRow).attr("data-candidate-id")
        //         return fn(candidateId);
        //     }
        //
        // });

        settings.candidateDetailsModal.on('click', settings.mobCandidateAddCommentButtonClass,function(event) {
            event.stopPropagation();
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id");
            var comment = ($(settings.mobCandidateCommentTextareaClass).val()).trim();
            $(settings.mobCandidateCommentTextareaClass).addClass("hidden");
            $(settings.mobCandidateAddCommentButtonClass).addClass("hidden");
            settings.mobCommentBox.removeClass("hidden");
            settings.commentTextarea.text(comment);
            settings.mobCandidateEditComment.removeClass("hidden");
            if(!comment) {
                return
            }
            fn(applicationId, comment);
        });

        settings.mobCandidateEditComment.on('click',function(event){
            $(settings.mobCandidateCommentTextareaClass).removeClass("hidden").focus();
            settings.mobCommentBox.addClass("hidden");
            $(settings.mobCandidateAddCommentButtonClass).removeClass("hidden");
            settings.mobCandidateEditComment.addClass("hidden");
         })
    }

    function onClickAddTag(fn, fn1) {
        settings.candidateDetailsModal.on('keyup', settings.candidateTagInputClass ,function(event) {
            event.stopPropagation();
            var tagName = $(this).val();
            if (event.which != 13) {
                 $(this).removeAttr("tag-id")
            }
            return fn1(tagName)
        });
        settings.candidateDetailsModal.on('click', settings.candidateAddTagButtonClass,function(event) {
            event.stopPropagation();
            var tagName = ($(settings.candidateTagInputClass).val()).trim();
            if(!tagName) {
                $(settings.candidateTagInputClass).addClass("error-border");
                return settings.tagInputError.removeClass("hidden")
            }
            else {
                $(settings.candidateTagInputClass).removeClass("error-border");
                settings.tagInputError.addClass("hidden")
            }
            var tagId = $(settings.candidateTagInputClass).attr("tag-id")
            $(this).removeAttr("tag-id")
            var parameters = {}
            if(tagId) {
                parameters.tagId = tagId;
            }
            parameters.tagName = tagName;
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            return fn(applicationId, parameters);
        });
    }

    function onClickAddTagMob(fn, fn1) {
        settings.candidateDetailsModal.on('keyup', settings.mobCandidateTagInputClass ,function(event) {
            event.stopPropagation();
            var tagName = $(this).val();
            if (event.which != 13) {
                 $(this).removeAttr("tag-id")
            }
            return fn1(tagName)
        });
        settings.candidateDetailsModal.on('click', settings.mobCandidateAddTagButtonClass,function(event) {
            event.stopPropagation();
            var tagName = ($(settings.mobCandidateTagInputClass).val()).trim();
            if(!tagName) {
                $(settings.mobCandidateTagInputClass).addClass("error-border");
                return settings.tagInputError.removeClass("hidden")
            }
            else {
                $(settings.mobCandidateTagInputClass).removeClass("error-border");
                settings.tagInputError.addClass("hidden")
            }
            var tagId = $(settings.mobCandidateTagInputClass).attr("tag-id")
            $(this).removeAttr("tag-id")
            var parameters = {}
            if(tagId) {
                parameters.tagId = tagId;
            }
            parameters.tagName = tagName;
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            return fn(applicationId, parameters);
        });
    }

    function onClickDeleteTag(fn) {
        settings.candidateDetailsModal.on('click', settings.candidateTagRemoveClass,function(event) {
            event.stopPropagation();
            var tagId = $(this).attr("data-tag-id");
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            return fn(applicationId, tagId);
        });
    }

    function removeTag(tagId) {
        $(settings.candidateTagListClass).find(".tagRemove[data-tag-id="+tagId+"]").closest(".candidateTag").remove()
    }

    function onClickShortlistCandidate(fn) {

        settings.candidateShortlistModal.click(function(event) {
            event.stopPropagation();
            var status = $(this).attr("data-status");
            var action = $(this).attr("data-action");
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            fn(applicationId, status, action);
        })
    }

    function onClickRejectCandidate(fn) {
        settings.candidateRejectModal.click(function(event) {
            event.stopPropagation();
            var status = $(this).attr("data-status");
            var action = $(this).attr("data-action");
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            fn(applicationId, status, action);
        })
    }

    function onClickSaveCandidate(fn) {
        settings.candidateSaveModal.click(function(event) {
            event.stopPropagation();
            var status = $(this).attr("data-status");
            var action = $(this).attr("data-action");
            var applicationId =$(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            fn(applicationId, status, action);
        })
    }

    function showDropdownTags(data) {
        initializeAutoCompleteComponent(settings.tagListing, data)
    }

    // function onClickAddPopulatedTags() {
    //     settings.tagListing.on('click', ".fetchTags", function(){
    //         $(settings.candidateTagInputClass).val($(this).text());
    //         $(settings.candidateTagInputClass).attr("tag-id", $(this).attr("data-tag-id"));
    //         settings.tagListing.addClass("hidden")
    //     })
    //     // settings.tagListing.on('keydown', ".fetchTags", function(e){
    //     //     if (e.which == 40) {
    //     //         $(settings.candidateTagInputClass).val($(this).text());
    //     //
    //     //         settings.tagListing.addClass("hidden")
    //     //     }
    //     // })
    // }

    function changeButtonText(arr, newStatus, dataAction) {

        arr.forEach(function(applicationId){

            settings.candidateDetailsModal.find(".candidateShortlistModal").attr("data-status", newStatus)
            settings.candidateDetailsModal.find(".candidateRejectModal").attr("data-status", newStatus)
            settings.candidateDetailsModal.find("#candidateSaveModal").attr("data-status", newStatus)
            if(newStatus == settings.candidateDetailsModal.find("#candidateSaveModal").attr("data-action")) {
                settings.candidateDetailsModal.find("#candidateSaveModal").html("<span class='icon'><i class='icon-star'></i></span>Saved for Later");
            }
            else {
                settings.candidateDetailsModal.find("#candidateSaveModal").html("<span class='icon'><i class='icon-star'></i></span>Save for Later");
            }
            if(newStatus == settings.candidateDetailsModal.find(".candidateRejectModal").attr("data-action")) {
                settings.candidateDetailsModal.find(".candidateRejectModal").text("Rejected")
            }
            else {
                settings.candidateDetailsModal.find(".candidateRejectModal").text("Reject")
            }
            if(newStatus == settings.candidateDetailsModal.find(".candidateShortlistModal").attr("data-action")) {
                settings.candidateDetailsModal.find(".candidateShortlistModal").text("Shortlisted")
            }
            else {
                settings.candidateDetailsModal.find(".candidateShortlistModal").text("Shortlist")
            }
        })
    }

    return {
        init: init,
        showCandidateDetails: showCandidateDetails,
        onClickAddComment: onClickAddComment,
        onClickAddTag: onClickAddTag,
        onClickDeleteTag: onClickDeleteTag,
        appendCandidateTag: appendCandidateTag,
        onClickAddTagMob: onClickAddTagMob,
        removeTag: removeTag,
        onClickAddCommentMob: onClickAddCommentMob,
        onClickShortlistCandidate: onClickShortlistCandidate,
        onClickRejectCandidate: onClickRejectCandidate,
        onClickSaveCandidate:onClickSaveCandidate,
        showDropdownTags: showDropdownTags,
        onClickSendInterviewInviteTelephonic: onClickSendInterviewInviteTelephonic,
        onClickSendInterviewInviteF2F: onClickSendInterviewInviteF2F,
        changeButtonText: changeButtonText,
        onClickChatCandidateModal: onClickChatCandidateModal,

	}

    function focusOnElement(element, container) {

        element.focus();
        settings.candidateDetailsModal.animate({
    		scrollTop: (element.closest(container).position().top)
    	},200);
    }
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
	selector.autocomplete({
      	source: suggestedTagsArray,
	    select: function( event, ui ) {
	        selector.attr("tag-id", ui.item.id);
            selector.val( ui.item.value);
	        return false;
	    }
    });
}


function getMaritalStatus(status) {

    switch (status) {
      case 1:
        maritalStatus = "Single";
        break;
      case 2:
        maritalStatus = "Married";
        break;
      case 3:
        maritalStatus = "Widow";
        break;
      case 4:
        maritalStatus = "Divorced";
        break;
      case 5:
        maritalStatus = "Seperated";
        break;
      case 6:
        maritalStatus = "Others";
        break;
      default:
        maritalStatus = "N.A.";
        break;
    }
    return maritalStatus
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
     return age;
}

function formatLanguages(data){
    if(!data)
        return
    var ob = JSON.parse(data);
    var langArray = [];
    for(var key in ob){
        langArray.push(ob[key]["language_text"]);
    }
    return langArray.join(", ");
}

function getLastActiveDay(date) {
    var todaysDate = moment(new Date());
    date = moment(date);
    return diffDays = todaysDate.diff(date, 'days');
}
