

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
        settings.tagListing = $("#tagListing")
        settings.tagMobListing = $("#tagMobListing")
        onClickChatCandidateModal()
        jQuery("#tabbed-content").tabs({});
        onClickAddPopulatedTags()
    }

    function showCandidateDetails(details, type, status){
        return populateCandidateData(details, type, status)
    }

    function onClickChatCandidateModal() {
        settings.candidateChatModal.click(function(){
            window.location.href = "/my-chat"
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
            savedButton : modal.find("#candidateSaveModal")
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
            preferredLocationStr = aData["preferredLocation"].toString();
        }
        item.preferredLocation.text(preferredLocationStr);
        item.contact.text(aData["phone"] || "NA");
        item.appliedOn.text(moment(aData["timestamp"], "x").format('DD-MM-YYYY') || "NA")
        item.notice.text(aData["notice"] + " months" || "NA");
        item.salary.text(aData["ctc"]+ " LPA" || "NA");
        item.firstName.text(aData["name"])
        var lastActiveDays = getLastActiveDay(aData["lastActive"])

        item.lastActive.text(lastActiveDays > 1 ? lastActiveDays + " days ago": lastActiveDays + " day ago");
        var eduStr = '';
        $.each(aData["education"],function(index, anObj) {

            var item = getEducationElement()
            item.name.text(anObj["institute"])
            item.tenure.text(anObj["batch"]["from"] + " - " + anObj["batch"]["to"] )
            item.degree.text(anObj["degree"] + "("+anObj["courseType"]+")")
            item.seperator.removeClass("hidden")
            eduStr+=item.element[0].outerHTML
        })
        item.eduList.html(eduStr)
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
            item.seperator.removeClass("hidden")
            profStr+=item.element[0].outerHTML
        })
        var tagStr = '';
        $.each(aData["tags"],function(index, aTag) {
            var tag = getCandidateTag(aTag)
            tagStr+=tag[0].outerHTML
        })
        item.candidateTagList.html(tagStr)
        item.profList.html(profStr)
        item.gender.text(gender[aData["sex"]])
        item.age.text(getAge(aData["dob"]) + " years")
        item.expectedSalary.text(aData["expectedCtc"]+ " LPA")
        item.maritalStatus.text(getMaritalStatus(aData["maritalStatus"]));
        item.languages.text((formatLanguages(aData["languages"]) || "N.A."));
        item.workPermit.text(binary[aData["permit"]]);
        item.teamHandling.text(binary[aData["permit"]])
        item.workSixDays.text("no");
        item.relocate.text(binary[aData["relocate"]] )
        item.startup.text(binary[aData["joinStartup"]])
        item.travel.text(binary[aData["travel"]])
        item.percentile.text(aData["catScore"] || "N.A.")
        item.workSixDays.text(binary[aData["sixDays"]])
        if(isCanvasSupported()) {
        	getBinaryData(aData["resume"],resumeCallback);
        }
        else {
        	item.resume.html('<iframe src="'+aData["resume"]+'" class="resume-embed" type="application/pdf"></iframe>')
        }
        item.coverLetter.text(aData["cover"]);
        if(aData["comment"]) {
            item.comment.val(aData["comment"]);
            item.mobComment.val(aData["comment"]);
        }
        item.shortlistButton.attr("data-status", "1");
        item.rejectButton.attr("data-status", "2");
        item.savedButton.attr("data-status", "3");
        if(status == "1") {
            console.log("1")
            item.shortlistButton.text("Shortlisted")
        }
        else if(status == "2") {
            item.rejectButton.text("Rejected")
        }
        else if(status == "3") {
            item.savedButton.html("<span class='icon'><i class='icon-star'></i></span>Saved for later")
        }

        openModal(item)
        console.log(type)
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
        item.tabContent.tabs({active: 0});
        item.shortlistButton.text("Shortlist");
        item.rejectButton.attr("Reject");
        item.savedButton.attr("Save for Later");
    }

    function openModal() {

    	$(".body-overlay").removeClass("hidden").addClass("veiled");
    	$("body").addClass("posf");

        settings.candidateDetailsModal.removeClass("hidden");
    }

    jQuery(".body-overlay").on("click", function(e) {
    	if(jQuery(e.target).parents(".view-resume-modal").length) {
    		e.stopImmediatePropagation();
    	}
        settings.candidateDetailsModal.scrollTop(0)
    	settings.candidateDetailsModal.addClass("hidden");
        resetCandidateData()
    });

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
            var comment = $(settings.candidateCommentTextareaClass).val();
            fn(applicationId, comment);
        });
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
            var comment = $(settings.mobCandidateCommentTextareaClass).val();
            fn(applicationId, comment);
        });
    }

    function onClickAddTag(fn, fn1) {
        settings.candidateDetailsModal.on('keyup', settings.candidateTagInputClass ,function(event) {
            event.stopPropagation();
            var tagName = $(this).val();
            if (event.which == 13) {

                var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
                return fn(applicationId, tagName);
            }
            return fn1(tagName)
        });
        settings.candidateDetailsModal.on('click', settings.candidateAddTagButtonClass,function(event) {
            event.stopPropagation();
            var tagName = $(settings.candidateTagInputClass).val();
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            return fn(applicationId, tagName);
        });
    }

    function onClickAddTagMob(fn, fn1) {
        settings.candidateDetailsModal.on('keyup', settings.mobCandidateTagInputClass ,function(event) {
            event.stopPropagation();
            var tagName = $(this).val();
            if (event.which == 13) {

                var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
                return fn(applicationId, tagName);
            }
            return fn1(tagName)
        });
        settings.candidateDetailsModal.on('click', settings.mobCandidateAddTagButtonClass,function(event) {
            event.stopPropagation();
            var tagName = $(settings.mobCandidateTagInputClass).val();
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            return fn(applicationId, tagName);
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
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id");
            var status = $(this).attr("data-status");
            fn(applicationId, status);
        })
    }

    function onClickRejectCandidate(fn) {
        settings.candidateRejectModal.click(function(event) {
            event.stopPropagation();
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            var status = $(this).attr("data-status");
            fn(applicationId, status);
        })
    }

    function onClickSaveCandidate(fn) {
        settings.candidateSaveModal.click(function(event) {
            event.stopPropagation();
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            var status = $(this).attr("data-status");
            fn(applicationId, status);
        })
    }

    function showDropdownTags(data) {
        var str = '';
        console.log(data.length)
        if(!data.length) {
            return settings.tagListing.addClass("hidden")
        }
		data.forEach(function(aData, index){
			var item = $(".fetchTags.prototype").clone().removeClass("prototype hidden");
            item.text(aData["name"]);
            item.attr("data-tag-id", aData["id"])
			str+=item[0].outerHTML;
            console.log(index)
		});
		settings.tagListing.html(str).removeClass("hidden");
    }

    function onClickAddPopulatedTags() {
        settings.tagListing.on('click', ".fetchTags", function(){
            $(settings.candidateTagInputClass).val($(this).text());
            settings.tagListing.addClass("hidden")
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
        showDropdownTags: showDropdownTags
	}

    function focusOnElement(element, container) {

        element.focus();
        settings.candidateDetailsModal.animate({
    		scrollTop: (element.closest(container).position().top)
    	},200);
    }
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
