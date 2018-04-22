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
        settings.candidateSaveModal = $(".candidateSaveModal"),
        settings.candidateChatModal = $(".candidateChatModal"),
        settings.tagListing = $(".recruiterTags"),
        settings.tagMobListing = $("#tagMobListing"),
        settings.tagInputError = $(".tagInputError"),
        settings.sendInterviewInviteF2FClass = ".inviteF2f",
        settings.sendInterviewInviteTelephonicClass = ".inviteTelephonic"
        settings.seeMoreRec = $(".seeMoreRec");
        settings.recommendationListSecond = $(".recommendationListSecond");
        settings.tagArr = [];
        settings.calendarSelect = $(".calendarSelect");
        settings.candidateDownloadResume = $(".candidateDownloadResume");
        settings.selectDefaultCalendar = $(".selectDefaultCalendar")

        jQuery("#tabbed-content").tabs({
            create: function(){
                $(this).removeClass("hidden")
            }
        });

        // onClickAddPopulatedTags()
    }

    function onClickSeeMoreRec(fn) {
        settings.seeMoreRec.click(function() {
            var data =
                [{
                            "name": "ankur saini",
                            "url": "https://www.linkedin.com/in/ankur-saini-b60686141",
                            "text": "hello<br/><br/>thanks and regards",
                            "img": null
                        },
                        {
                            "name": "Ritu Bala",
                            "url": "https://www.linkedin.com/in/balaritu",
                            "text": "Testing"
                        }]
            if($(this).attr("data-clicked") == "false") {
                addRecommendations(data)
                $(this).attr("data-clicked", "true")
            }
            settings.recommendationListSecond.slideToggle()
            $(this).toggleClass("active");
            if($(this).hasClass("active") ) {
                $(this).text("See Less")
                $(this).next().addClass("icon-up_arrow").removeClass("icon-down_arrow")
                return
            }
            $(this).text("See More")
            $(this).next().addClass("icon-down_arrow").removeClass("icon-up_arrow")
            return
            fn()
        })
    }

    function onClickChatCandidateModal(fn) {
        settings.candidateChatModal.click(function(){
            var candidateId = $(this).closest(settings.candidateDetailsModal).attr("data-candidate-id")
            var applicationId =  $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            fn(candidateId, applicationId);
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
            savedButton : modal.find(".candidateSaveModal"),
            contact:modal.find('.contact'),
            email:modal.find('.email-address'),
            recommendationList: modal.find('.recommendationList'),
            iitScore: modal.find(".js_iit"),
            gmatScore: modal.find(".js_gmat"),
            iconTelephoneVer : modal.find(".iconTelephoneVer"),
            iconEmailVer :modal.find(".iconEmailVer")
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

    function getRecommendationElement() {
        var card = $('.recommendationWrapper.prototype').clone().removeClass("prototype hidden");
        return {
            element: card,
            name: card.find('.userName'),
			link: card.find('.userLink'),
			body: card.find('.userBody'),
            seperator: card.find('.jsSeperator')
        }
    }

    function addRecommendations(data) {
        var recStr = '';

        $.each(data,function(index, anObj) {

            var item = getRecommendationElement()
            item.name.text(anObj["name"])
            item.link.attr("href",anObj["url"]);
            item.link.text(anObj["url"]);
            item.body.text(anObj["text"])

            item.seperator.removeClass("hidden")
            recStr+=item.element[0].outerHTML
        })
        settings.recommendationListSecond.html(recStr)

    }

    function populateCandidateData(aData, type, status) {
        var item = getElement(aData["userID"]);
        item.element.attr("data-application-id", aData["id"])
        item.image.attr("src", (aData["img"] || "/static/images/noimage.png"))
        item.name.text(aData["name"] || "NA").removeClass("shell");
        item.experience.text(aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m" || "NA").removeClass("shell");
        item.location.text(aData["currentLocation"] || "NA").removeClass("shell");
        var preferredLocationStr = "N.A."
        if(aData["preferredLocation"].length) {
            preferredLocationStr = aData["preferredLocation"].join(', ');;
        }
        item.preferredLocation.text(preferredLocationStr).removeClass("shell");
        // item.contact.text(aData["phone"] || "NA").removeClass("shell");
        item.appliedOn.text(moment(aData["timestamp"], "x").format('DD-MM-YYYY') || "NA").removeClass("shell");
        if(aData["notice"] == 7) {
            item.notice.text("Immediately Available").removeClass("shell");
        }
        else if(aData["notice"] == 1) {
            item.notice.text((aData["notice"] + " month")).removeClass("shell");
        }
        else {
            item.notice.text((aData["notice"] + " months")).removeClass("shell");
        }
        item.salary.text(formatSalary(aData["ctc"])).removeClass("shell");
        item.firstName.text(aData["name"]).removeClass("shell");
        item.contact.text(aData["phone"] || "NA");
        item.email.text(aData["email"]||"NA");
        // var lastActiveDays = getLastActiveDay(aData["lastActive"])
        //
        // item.lastActive.text(lastActiveDays > 1 ? lastActiveDays + " days ago": lastActiveDays + " day ago");

        var lastActiveDate = moment(aData["lastActive"]).format("DD-MM-YYYY");
        if(lastActiveDate == "Invalid date") {
            lastActiveDate = "N.A";
        }
        item.lastActive.text(lastActiveDate).removeClass("shell");
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

        aData["jobs"] = sortArrayOfObjectsByMultipleKey(aData["jobs"])

        if(aData["jobs"].length == 0) {
            profStr = "<div style='line-height:1.5;'><span style='font-weight:bold;'>"+aData["name"]+"</span> does not have any work experience yet</div>"
        }
        else {
            aData["jobs"] = sortArrayOfObjectsByMultipleKey(aData["jobs"])
            $.each(aData["jobs"],function(index, anObj) {

                var item = getProfessionalElement()
                item.name.text(anObj["organization"])
                item.designation.text(anObj["designation"]);

                if(anObj["exp"]["from"]["month"] && anObj["exp"]["to"]["month"] && anObj["exp"]["from"]["year"] && anObj["exp"]["to"]["year"]) {
                    var fromMon = getMonthName(anObj["exp"]["from"]["month"]);
                    var toMon = getMonthName(anObj["exp"]["to"]["month"]);
                    var fromYear = anObj["exp"]["from"]["year"];
                    var toYear = anObj["exp"]["to"]["year"];
                    var str = (anObj["is_current"]) ? fromMon + " - " + fromYear + " to Present": fromMon + " - " + fromYear + " to " + toMon + " - " + toYear;
                }
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

        item.gender.text(gender[aData["sex"]]).removeClass("shell")
        item.age.text(getAge(aData["dob"]) + " years").removeClass("shell")
        item.expectedSalary.text(formatSalary(aData["expectedCtc"])).removeClass("shell")
        item.maritalStatus.text(getMaritalStatus(aData["maritalStatus"])).removeClass("shell")
        item.languages.text((formatLanguages(aData["languages"]) || "N.A.")).removeClass("shell")
        item.workPermit.text((workPermit[aData["permit"]] || "N.A.")).removeClass("shell")
        item.teamHandling.text(binary[aData["permit"]]).removeClass("shell")
        item.workSixDays.text("no").removeClass("shell")
        item.relocate.text(binary[aData["relocate"]] ).removeClass("shell")
        item.startup.text(binary[aData["joinStartup"]]).removeClass("shell")
        item.travel.text(willingTravel[aData["travel"]]).removeClass("shell")
        item.differentlyAbled.text(binary[aData["differentlyAbled"]]).removeClass("shell")
        item.workSixDays.text(binary[aData["sixDays"]]).removeClass("shell")
        if(aData["score"]) {
            item.percentile.text(aData["score"]["cat"] || "N.A.").removeClass("shell")
            item.iitScore.text(aData["score"]["iit"] || "N.A.").removeClass("shell")
            item.gmatScore.text(aData["score"]["gmat"] || "N.A.").removeClass("shell")
        }
        if(aData["cover"]) {
            item.coverLetter.html(nl2br(aData["cover"]))
            $(".coverLetterTab").removeClass("hidden")
        }
        if(aData["comment"]) {

            settings.commentTextarea.val(aData["comment"]).removeClass("hidden");
            $(settings.candidateCommentTextareaClass).val(aData["comment"]).addClass("hidden");
            $(settings.mobCandidateCommentTextareaClass).val(aData["comment"]).addClass("hidden");
            $(settings.candidateAddCommentButtonClass).addClass("hidden");
            $(settings.mobCandidateAddCommentButtonClass).addClass("hidden");
            settings.candidateEditComment.removeClass("hidden");
            settings.mobCandidateEditComment.removeClass("hidden");
        }
        else {
            settings.commentTextarea.val('').addClass("hidden")
            $(settings.candidateCommentTextareaClass).val('').removeClass("hidden");
         //   $(settings.mobCandidateCommentTextareaClass).val('').addClass("hidden");
            $(settings.candidateAddCommentButtonClass).removeClass("hidden")
            $(settings.mobCandidateAddCommentButtonClass).removeClass("hidden");
            settings.candidateEditComment.addClass("hidden")
            settings.mobCandidateEditComment.addClass("hidden");
        }

        if(aData["recommendation"].length > 0) {
            var recStr = '';

            $.each(aData["recommendation"],function(index, anObj) {

                var item = getRecommendationElement()
                item.name.text(anObj["name"])
                item.link.attr("href",anObj["url"]);
                item.link.text(anObj["url"]);
                item.body.html(anObj["text"])
                if(index != aData["recommendation"].length - 1)
                    item.seperator.removeClass("hidden")
                if(aData["extraRecom"]) {
                    item.seperator.removeClass("hidden")
                }
                recStr+=item.element[0].outerHTML
            })
            item.recommendationList.html(recStr)
            if(aData["extraRecom"]) {
                settings.seeMoreRec.removeClass("hidden");
                settings.seeMoreRec.next().removeClass("hidden");
            }
            item.recommendationList.closest(".recommendations").removeClass("hidden");
        }
        settings.candidateDownloadResume.attr("data-href", baseUrl + aData["resume"])

        item.shortlistButton.attr("data-action", 1);
        item.rejectButton.attr("data-action", 2);
        item.savedButton.attr("data-action", 3);
        var status = aData["status"];
        item.shortlistButton.attr("data-status", status);
        item.rejectButton.attr("data-status", status);
        item.savedButton.attr("data-status", status);
        settings.candidateDownloadResume.attr("data-status", status);
        if(status == 1) {
            item.shortlistButton.text("Shortlisted")
        }
        else if(status == 2) {
            item.rejectButton.text("Rejected")
        }
        else if(status == 3) {
            item.savedButton.html("<span class='icon'><i class='icon-star'></i></span>Saved for Later")
        }
        if(ifKeyExists("emailVer", aData) && aData["emailVer"]) {
            item.iconEmailVer.removeClass("hidden")
        }
        if(ifKeyExists("phoneVer", aData) && aData["phoneVer"]) {
            item.iconTelephoneVer.removeClass("hidden")
        }
        if(isCanvasSupported()) {

           getBinaryData(baseUrl + aData["resume"],resumeCallback);
        }
        else {
           item.resume.html('<iframe src="'+baseUrl + aData["resume"]+'" class="resume-embed" type="application/pdf"></iframe>')
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

    function onClickAddComment(fn) {
        // debugger
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
            // debugger
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id");
            var comment = ($(settings.candidateCommentTextareaClass).val()).trim();
            if(!comment) {
                return
            }
            $(settings.candidateCommentTextareaClass).addClass("hidden");
            settings.commentTextarea.val(comment).removeClass("hidden");
            $(settings.candidateAddCommentButtonClass).addClass("hidden");
            settings.candidateEditComment.removeClass("hidden");
            fn(applicationId, comment);
        });

        settings.candidateEditComment.on('click',function(event){
            settings.commentTextarea.addClass("hidden");
            $(settings.candidateCommentTextareaClass).removeClass("hidden").focus();
            $(settings.candidateAddCommentButtonClass).removeClass("hidden");
            settings.candidateEditComment.addClass("hidden");
        })
    }

    function onClickAddCommentMob(fn) {

        settings.candidateDetailsModal.on('click', settings.mobCandidateAddCommentButtonClass,function(event) {
            event.stopPropagation();

            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id");
            var comment = ($(settings.mobCandidateCommentTextareaClass).val()).trim();
            if(!comment) {
                return
            }
            $(settings.mobCandidateCommentTextareaClass).addClass("hidden");
            settings.commentTextarea.val(comment).removeClass("hidden");
            $(settings.mobCandidateAddCommentButtonClass).addClass("hidden");

            settings.mobCandidateEditComment.removeClass("hidden");

            fn(applicationId, comment);
        });

        settings.mobCandidateEditComment.on('click',function(event){
            settings.commentTextarea.addClass("hidden");
            $(settings.mobCandidateCommentTextareaClass).removeClass("hidden").focus();

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
            var obj = searchObjByKey(settings.tagArr, tagName, "name")
            var tagId = $(settings.mobCandidateTagInputClass).attr("tag-id");
            if(obj) {
                tagId = obj["id"]
            }
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
            var obj = searchObjByKey(settings.tagArr, tagName, "name")
            var tagId = $(settings.mobCandidateTagInputClass).attr("tag-id");
            if(obj) {
                tagId = obj["id"]
            }
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

    function onClickSendInterviewInviteF2F(fn) {
        settings.candidateDetailsModal.on('click', settings.sendInterviewInviteF2FClass, function(e){
            e.preventDefault()

            if(parseInt($(this).attr("data-clickable")) == 1) {
                window.location = "/Interview-scheduler-updated"
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
                window.location = "/Interview-scheduler-updated"
            }
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id");
            var inviteId =  parseInt($(this).attr("data-invite-id"));

            fn(applicationId, inviteId);
            return false
        })
    }

    function setInvite() {
        $(settings.sendInterviewInviteF2FClass).attr("data-clickable","1")
        $(settings.sendInterviewInviteTelephonicClass).attr("data-clickable","1")
        $(settings.sendInterviewInviteF2FClass).attr("title","You need to set up your calendar before sending an invite. Click to set up calendar")
        $(settings.sendInterviewInviteTelephonicClass).attr("title","You need to set up your calendar before sending an invite. Click to set up calendar")

        settings.candidateDetailsModal.find(".tooltip").tooltipster({
			animation: 'fade',
			delay: 0,
			side:['bottom'],
            theme: 'tooltipster-borderless',
        
		})

    }

    function showDropdownTags(data) {
        settings.tagArr = data;
        initializeAutoCompleteComponent(settings.tagListing, data)
    }

    function changeButtonText(arr, newStatus, dataAction) {

        arr.forEach(function(applicationId){

            settings.candidateDetailsModal.find(".candidateShortlistModal").attr("data-status", newStatus)
            settings.candidateDetailsModal.find(".candidateRejectModal").attr("data-status", newStatus)
            settings.candidateDetailsModal.find(".candidateSaveModal").attr("data-status", newStatus)
            if(newStatus == settings.candidateDetailsModal.find(".candidateSaveModal").attr("data-action")) {
                settings.candidateDetailsModal.find(".candidateSaveModal").html("<span class='icon'><i class='icon-star'></i></span>Saved for Later");
            }
            else {
                settings.candidateDetailsModal.find(".candidateSaveModal").html("<span class='icon'><i class='icon-star'></i></span>Save for Later");
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

    function openSelectDefaultCalendarModal() {
		addBodyFixed()
		settings.selectDefaultCalendar.removeClass("hidden")
	}

    function closeModal() {
        removeBodyFixed()
		$(".modal").addClass("hidden")
    }

    function onChangeDefaultCalendar(fn) {
		settings.calendarSelect.on('change', function(e) {
			var calendarId = $(this).val();
			if(parseInt(calendarId) == -1) {
				return
			}
			return fn(calendarId)
		})
	}

    function onClickDownloadResume(fn) {
        settings.candidateDownloadResume.click(function(event) {
            debugger
            event.preventDefault()
            var status = $(this).attr("data-status");
            var url = $(this).attr("data-href");
            window.open(url);
            var applicationId = $(this).closest(settings.candidateDetailsModal).attr("data-application-id")
            debugger
            fn(applicationId, status)
        })
    }

    function changeStatus(status) {
        settings.candidateDownloadResume.attr("data-status", status);
    }

    return {
        init: init,
        populateCandidateData: populateCandidateData,
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
        changeButtonText: changeButtonText,
        addRecommendations: addRecommendations,
        onClickSeeMoreRec: onClickSeeMoreRec,
        onClickChatCandidateModal : onClickChatCandidateModal,
        onClickSendInterviewInviteTelephonic: onClickSendInterviewInviteTelephonic,
        onClickSendInterviewInviteF2F: onClickSendInterviewInviteF2F,
        setInvite: setInvite,
        openSelectDefaultCalendarModal: openSelectDefaultCalendarModal,
        closeModal: closeModal,
        onChangeDefaultCalendar: onChangeDefaultCalendar,
        onClickDownloadResume: onClickDownloadResume,
        changeStatus: changeStatus
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
