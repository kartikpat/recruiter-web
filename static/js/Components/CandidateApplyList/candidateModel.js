function Candidate() {
    var settings = {
        modal: $('.js_candidate_modal'),
        candidateList: $('.js_candidate_listing')
    }


    function showCandidateDetails(details){
        populateCandidateData(details)
    }

    function getElement() {
        modal = settings.modal;
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
            jobTagList: modal.find('.js_job_tag_list'),
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
            coverLetter: modal.find(".js_cover_letter")
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

    function populateCandidateData(aData) {
        var item = getElement();
        item.image.attr("src", aData["img"])
        item.name.text(aData["name"]);
        item.experience.text(aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m");
        item.location.text(aData["preferredLocation"]);
        item.contact.text(aData["phone"]);
        item.appliedOn.text(moment(aData["timestamp"]).format('DD-MM-YYYY'))
        item.notice.text(aData["notice"] + " months");
        item.salary.text(aData["ctc"]+ " LPA");
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
            var tag =  $('.js_job_tag.prototype').clone().text(aTag["name"]).removeClass("prototype hidden");
            tagStr+=tag[0].outerHTML
        })
        item.jobTagList.html(tagStr)
        item.profList.html(profStr)
        item.gender.text(gender[aData["sex"]])
        item.age.text(getAge(aData["dob"]) + " years")
        item.expectedSalary.text(aData["expectedCtc"]+ " LPA")
        item.maritalStatus.text("Single");
        item.languages.text(formatLanguages(aData["languages"]));
        item.workPermit.text(binary["permit"]);
        if(isCanvasSupported()) {
        	getBinaryData(aData["resume"],resumeCallback);
        }
        else {
        	item.resume.html('<iframe src="'+aData["resume"]+'" class="resume-embed" type="application/pdf"></iframe>')
        }
        item.coverLetter.text(aData["cover"]);

        openModal()
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

    }

    function openModal() {

    	$(".body-overlay").removeClass("hidden").addClass("veiled");
    	$("body").addClass("posf");
        jQuery("#tabbed-content").tabs({});
        modal.removeClass("hidden");

    }

    jQuery(".body-overlay").on("click", function(e) {
    	if(jQuery(e.target).parents(".view-resume-modal").length) {
    		e.stopImmediatePropagation();
    	}

    	jQuery(".view-resume-modal").addClass("hidden");
        resetCandidateData()
    });

    return {
        showCandidateDetails: showCandidateDetails
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
}
