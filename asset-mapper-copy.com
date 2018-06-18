{
	"job-details": {
		"styles": {
			"debug" : [
				"static/css/header.css",
        		"static/css/index.css",
				"static/css/buttons.css",
				"static/css/footer.css",
				"static/css/animate.css",
				"static/css/utilities.css",
				"static/css/job-details.css"
			],
			"prod": [
				"static/build/css/job-details.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/Utilities/common.js",
				"static/js/vendor/moment.min.js",
				"static/js/header.js",
				"static/js/utilities.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Services/fetchJob.js",
				"static/js/Services/fetchJobTags.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/JobDetails/model.js",
				"static/js/Components/JobDetails/mapping.js",
				"static/js/Components/JobDetails/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/job-details.min.js"
			]
		}
	},
	"reset-password": {
		"styles": {
			"debug" : [
				"static/css/header.css",
        		"static/css/reset-password.css",
				"static/css/buttons.css",
				"static/css/footer.css",
				"static/css/animate.css",
				"static/css/utilities.css"

			],
			"prod": [
				"static/build/css/reset-password.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/reset-password.js",
				"static/js/Services/SubmitResetPassword.js",
				"static/js/Components/ResetPassword/model.js",
				"static/js/Components/ResetPassword/index.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/reset-password.min.js"
			]
		}
	},
	"admin": {
		"styles": {
			"debug" : [
				"static/css/header.css",
        		"static/css/reset-password.css",
				"static/css/buttons.css",
				"static/css/footer.css",
				"static/css/animate.css",
				"static/css/utilities.css"

			],
			"prod": [
				"static/build/css/reset-password.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Services/submitAdminLogin.js",
				"static/js/Components/Admin/model.js",
				"static/js/Components/Admin/index.js"
			],
			"prod" : [
				"static/build/js/admin.min.js"
			]
		}
	},
	"mass-resume": {
		"styles": {
			"debug" : [
				"static/css/header.css",
				"static/css/mass-resume.css",
				"static/css/global-search.css",
				"static/css/buttons.css",
				"static/css/spacings.css",
				"static/css/footer.css",
				"static/css/animate.css",
				"static/css/utilities.css"

			],
			"prod": [
				"static/build/css/mass-resume.min.css"

			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Services/fetchRecruiterResume.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/MassResume/model.js",
				"static/js/Components/MassResume/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/mass-resume.min.js"
			]
		}
	},
	"post-job": {
		"styles": {
			"debug" : [
				"static/css/header.css",
				"static/css/footer.css",
				"static/css/utilities.css",
				"static/css/colors.css",
				"static/css/spacings.css",
				"static/css/vendor/medium-editor.min.css",
				"static/css/post_job.css",
				"static/css/modal.css"
			],
			"prod": [
				"static/build/css/index.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/header.js",
				"static/js/utilities.js",
				"static/js/tags/industry.js",
				"static/js/tags/current-location.js",
				"static/js/tags/preferred-location.js",
				"static/js/tags/language.js",
				"static/js/tags/functional-area.js",
				"static/js/tags/institute.js",
				"static/js/Components/PostJob/global.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/vendor/medium-editor.min.js",
				"static/js/ui-components.js",
				"static/js/Utilities/request.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Utilities/modal.js",
				"static/js/Services/fetchJob.js",
				"static/js/Services/submitNewJob.js",
				"static/js/Services/fetchJobTags.js",
				"static/js/Services/submitEditJob.js",
				"static/js/Components/PostJob/model.js",
				"static/js/Components/PostJob/index.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/post-job.min.js"
			]
		}
	},
	"premium-posting": {
		"styles": {
			"debug" : [
				"static/css/header.css",
        		"static/css/premium-posting.css",
				"static/css/footer.css",
				"static/css/buttons.css",
				"static/css/utilities.css",
				"static/css/colors.css",
				"static/css/modal.css"
			],
			"prod": [
				"static/build/css/premium-posting.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/common.js",
				"static/js/header.js",
				"static/js/utilities.js",
				"static/js/vendor/swipe.js",
				"static/js/premium-posting.js",
				"static/js/vendor/slick.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Services/buyPlans.js",
				"static/js/Services/buyPlanClick.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/RecruiterPlan/model.js",
				"static/js/Components/RecruiterPlan/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/premium-posting.min.js"
			]
		}
	},
	"ui-components": {
		"styles": {
			"debug" : [
				"static/css/header.css",
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/ui-components.css",
				"static/css/utilities.css",
				"static/css/footer.css"
			],
			"prod": [
				"static/build/css/ui-components.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/change-password.js",
				"static/js/ui-components.js",
				"static/js/utilities.js"
			],
			"prod" : [
				"static/build/js/ui-components.min.js"
			]
		}
	},
	"my-jobs": {
		"styles": {
			"debug" : [
				"static/css/header.css",
				"static/css/my-jobs.css",
				"static/css/footer.css",
				"static/css/modal.css",
				"static/css/vendor/tooltipster.css",
				"static/css/jquery-ui.min.css",
        		"static/css/index.css",
				"static/css/buttons.css",
				"static/css/footer.css",
				"static/css/chat-sticky.css",
				"static/css/utilities.css",
				"static/css/animate.css",
				"static/css/jquery-chatbox.css"
			],
			"prod": [
				"static/build/css/my-jobs.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Utilities/request.js",
				"static/js/utilities.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Utilities/modal.js",
				"static/js/vendor/moment.min.js",
				"static/js/header.js",
				"static/js/Services/fetchJobs.js",
				"static/js/Services/submitUnpublishJob.js",
				"static/js/Services/submitPremiumJob.js",
				"static/js/Services/submitRefreshJob.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/MyJobs/model.js",
				"static/js/Components/MyJobs/index.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/chat-pubnub-sticky.js",
				"static/js/chat-sticky.js",
 				"static/js/Services/submitChatMessage.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js",
				"static/js/Tracker/tracker.js"
			],
			"prod" : [
				"static/build/js/my-jobs.min.js"
			]
		}
	},
	"settings": {
		"styles": {
			"debug" : [
				"static/css/colors.css",
				"static/css/settings.css",
				"static/css/utilities.css",
				"static/css/vendor/medium-editor.min.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/modal.css"
			],
			"prod": [
				"static/build/css/settings.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/Utilities/pubsub.js",
				"static/js/header.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/common.js",
				"static/js/change-password.js",
				"static/js/settings.js",
				"static/js/vendor/medium-editor.min.js",
				"static/js/Services/updateRecruiterProfile.js",
				"static/js/Services/setPassword.js",
				"static/js/Services/fetchRecruiterCredits.js",
				"static/js/Services/reclaimCredits.js",
				"static/js/Services/submitCredits.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Utilities/modal.js",
				"static/js/utilities.js",
				"static/js/Components/RecruiterProfile/model.js",
				"static/js/Components/RecruiterProfile/index.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/settings.min.js"
			]
		}
	},
	"tagged-candidates": {
		"styles": {
			"debug" : [
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/tagged-candidates.css",
				"static/css/modal.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/chat-sticky.css",
				"static/css/utilities.css",
				"static/css/animate.css",
				"static/css/jquery-chatbox.css",
				"static/css/vendor/tooltipster.css"
			],
			"prod": [
				"static/build/css/tagged-candidates.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/change-password.js",
				"static/js/utilities.js",
				"static/js/tagged-candidates.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/vendor/moment.min.js",
				"static/js/Services/fetchCandidatesByTags.js",
				"static/js/Services/fetchRecruiterTags.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/TaggedCandidates/model.js",
				"static/js/Components/TaggedCandidates/index.js",
				"static/js/chat-pubnub-sticky.js",
				"static/js/chat-sticky.js",
 				"static/js/Services/submitChatMessage.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/tagged-candidates.min.js"
			]
		}
	},
	"global-search": {
		"styles": {
			"debug" : [
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/global-search.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/chat-sticky.css",
				"static/css/utilities.css",
				"static/css/animate.css",
				"static/css/jquery-chatbox.css"
			],
			"prod": [
				"static/build/css/global-search.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/change-password.js",
				"static/js/utilities.js",
				"static/js/tagged-candidates.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/chat-pubnub-sticky.js",
				"static/js/chat-sticky.js",
 				"static/js/Services/submitChatMessage.js",
				"static/js/vendor/moment.min.js",
				"static/js/Services/globalSearch.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/GlobalSearch/model.js",
				"static/js/Components/GlobalSearch/index.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/global-search.min.js"
			]
		}
	},
	"dashboard": {
		"styles": {
			"debug" : [
				"static/css/header.css",
				"static/css/colors.css",
				"static/css/footer.css",
				"static/css/modal.css",
				"static/css/utilities.css",
				"static/css/chat-sticky.css",
				"static/css/utilities.css",
				"static/css/animate.css",
				"static/css/jquery-chatbox.css",
				"static/css/dashboard.css",
				"static/css/vendor/tooltipster.css"
			],
			"prod": [
				"static/build/css/dashboard.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/request.js",
				"static/js/Utilities/common.js",
				"static/js/vendor/moment.min.js",
				"static/js/Utilities/modal.js",
				"static/js/Tracker/tracker.js",
				"static/js/Services/fetchDashboardStats.js",
				"static/js/Services/fetchActiveJobStats.js",
				"static/js/Services/fetchJobs.js",
				"static/js/Services/fetchFollowUps.js",
				"static/js/Services/fetchInterviews.js",
				"static/js/Services/submitUnpublishJob.js",
				"static/js/Services/submitRefreshJob.js",
				"static/js/Services/setCandidateAction.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/Dashboard/index.js",
				"static/js/header.js",
				"static/js/vendor/slick.js",
				"static/js/vendor/google-charts-loader.min.js",
				"static/js/charts/bar-chart-stacked.js",
				"static/js/new-jobs-chart.js",
				"static/js/dashboard.js",
				"static/js/utilities.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Utilities/chatEngine.js",
				"static/js/Services/fetchRecruiterChats.js",
				"static/js/Components/StickyChat/store.js",
				"static/js/Components/StickyChat/model.js",
				"static/js/Components/StickyChat/index.js",
				"static/js/Services/submitChatMessage.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Services/fetchRecruiterCalendar.js",
				"static/js/Tracker/tracker.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/dashboard.min.js"
			]
		}
	},
	"shortlisted-candidates": {
		"styles": {
			"debug" : [
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/shortlisted-candidates.css",
				"static/css/modal.css",
				"static/css/chat-sticky.css",
				"static/css/utilities.css",
				"static/css/animate.css",
				"static/css/jquery-chatbox.css",
				"static/css/vendor/tooltipster.css"
			],
			"prod": [
				"static/build/css/shortlisted-candidates.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/chat-pubnub-sticky.js",
				"static/js/chat-sticky.js",
 				"static/js/Services/submitChatMessage.js",
				"static/js/change-password.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/shortlisted-candidates.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/vendor/moment.min.js",
				"static/js/Services/fetchCandidatesByStatus.js",
				"static/js/Services/fetchJobs.js",
				"static/js/Services/fetchJobApplications.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/ShortlistedCandidates/model.js",
				"static/js/Components/ShortlistedCandidates/index.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/shortlisted-candidates.min.js"
			]
		}
	},
	"follow-up": {
		"styles": {
			"debug" : [
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/follow-up.css",
				"static/css/chat-sticky.css",
				"static/css/utilities.css",
				"static/css/animate.css",
				"static/css/jquery-chatbox.css",
				"static/css/vendor/tooltipster.css"
			],
			"prod": [
				"static/build/css/follow-up.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/vendor/jquery-ui.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/chat-pubnub-sticky.js",
				"static/js/chat-sticky.js",
 				"static/js/Services/submitChatMessage.js",
				"static/js/change-password.js",
				"static/js/utilities.js",
				"static/js/shortlisted-candidates.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/vendor/moment.min.js",
				"static/js/Services/setCandidateAction.js",
				"static/js/Services/fetchFollowUps.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/FollowUps/model.js",
				"static/js/Components/FollowUps/index.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/follow-up.min.js"
			]
		}
	},
	"my-chat": {
		"styles": {
			"debug" : [
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/my-chat.css",
				"static/css/modal.css",
				"static/css/vendor/tooltipster.css"
			],
			"prod": [
				"static/build/css/my-chat.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/change-password.js",
				"static/js/utilities.js",
				"static/js/Utilities/common.js",
				"static/js/my-chat.js",
				"static/js/Services/submitChatMessage.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/chatEngine.js",
				"static/js/vendor/moment.min.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Services/fetchRecruiterChats.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/MyChat/model.js",
				"static/js/Components/MyChat/index.js",
				"static/js/Components/MyChat/store.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/my-chat.min.js"
			]
		}
	},
	"candidate-apply-list": {
		"styles": {
			"debug" : [
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/vendor/tooltipster.css",
				"static/css/vendor/pdf_viewer.css",
				"static/css/candidateMixin.css",
				"static/css/animate.css",
				"static/css/candidate-apply-list.css",
				"static/css/chat-sticky.css",
				"static/css/utilities.css",
				"static/css/animate.css",
				"static/css/jquery-chatbox.css"

			],
			"prod": [
				"static/build/css/candidate-apply-list.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/vendor/page.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/change-password.js",
				"static/js/utilities.js",
				"static/js/vendor/pdf.js",
				"static/js/vendor/pdf.worker.js",
				"static/js/tags/industry.js",
				"static/js/tags/current-location.js",
				"static/js/tags/preferred-location.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/tags/language.js",
				"static/js/tags/functional-area.js",
				"static/js/tags/institute.js",
				"static/js/vendor/moment.min.js",
				"static/js/pdfJs.js",
				"static/js/Services/fetchRecruiterChats.js",
				"static/js/candidate-apply-list.js",
				"static/js/vendor/jquery-ui.min.js",
				"static/js/modal.js",
				"static/js/Utilities/chatEngine.js",
				"static/js/chat-pubnub-sticky.js",
				"static/js/Components/StickyChat/store.js",
				"static/js/Components/StickyChat/model.js",
				"static/js/Components/StickyChat/index.js",
				"static/js/Services/fetchRecruiterChats.js",
 				"static/js/Services/submitChatMessage.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Services/sendInterviewInvite.js",
				"static/js/Services/submitChatProfile.js",
				"static/js/Services/fetchJobApplications.js",
				"static/js/Services/fetchJob.js",
				"static/js/Services/fetchjobCalendars.js",
				"static/js/Services/setCandidateAction.js",
				"static/js/Services/fetchRecruiterTags.js",
				"static/js/Services/setDefaultCalendar.js",
				"static/js/Services/downloadMassResume.js",
				"static/js/Services/submitUnpublishJob.js",
				"static/js/Services/submitRefreshJob.js",
				"static/js/Services/submitPremiumJob.js",
				"static/js/Services/setBulkCandidateActions.js",
				"static/js/Services/getJobApplicationCount.js",
				"static/js/Services/fetchFiltersCount.js",
				"static/js/Services/submitPageVisit.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Components/CandidateApplyList/store.js",
				"static/js/Components/CandidateApplyList/mapping.js",
				"static/js/Components/CandidateApplyList/filtersModel.js",
				"static/js/Components/CandidateApplyList/candidateModel.js",
				"static/js/Components/CandidateApplyList/model.js",
				"static/js/Components/CandidateApplyList/jobModel.js",
				"static/js/Components/CandidateApplyList/index.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/candidate-apply-list.min.js"
			]
		}
	},
	"candidate-apply-list-copy": {
		"styles": {
			"debug" : [
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/vendor/tooltipster.css",
				"static/css/vendor/pdf_viewer.css",
				"static/css/candidate-apply-list-copy.css",
				"static/css/chat-sticky.css",
				"static/css/utilities.css",
				"static/css/animate.css",
				"static/css/jquery-chatbox.css"

			],
			"prod": [
				"static/build/css/candidate-apply-list-copy.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/vendor/page.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/change-password.js",
				"static/js/utilities.js",
				"static/js/vendor/pdf.js",
				"static/js/vendor/pdf.worker.js",
				"static/js/tags/industry.js",
				"static/js/tags/current-location.js",
				"static/js/tags/preferred-location.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/tags/language.js",
				"static/js/tags/functional-area.js",
				"static/js/tags/institute.js",
				"static/js/vendor/moment.min.js",
				"static/js/pdfJs.js",
				"static/js/candidate-apply-list.js",
				"static/js/vendor/jquery-ui.min.js",
				"static/js/modal.js",
				"static/js/chat-pubnub-sticky.js",
				"static/js/chat-sticky.js",
 				"static/js/Services/submitChatMessage.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Services/sendInterviewInvite.js",
				"static/js/Services/fetchJobApplications.js",
				"static/js/Services/fetchJob.js",
				"static/js/Services/fetchjobCalendars.js",
				"static/js/Services/setCandidateAction.js",
				"static/js/Services/fetchRecruiterTags.js",
				"static/js/Services/setDefaultCalendar.js",
				"static/js/Services/downloadMassResume.js",
				"static/js/Services/submitUnpublishJob.js",
				"static/js/Services/submitRefreshJob.js",
				"static/js/Services/submitPremiumJob.js",
				"static/js/Services/setBulkCandidateActions.js",
				"static/js/Services/getJobApplicationCount.js",
				"static/js/Services/fetchFiltersCount.js",
				"static/js/Services/submitPageVisit.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Components/CandidateApplyList/store.js",
				"static/js/Components/CandidateApplyList/mapping.js",
				"static/js/Components/CandidateApplyList/filtersModel.js",
				"static/js/Components/CandidateApplyList/candidateModel.js",
				"static/js/Components/CandidateApplyList/model-copy.js",
				"static/js/Components/CandidateApplyList/jobModel.js",
				"static/js/Components/CandidateApplyList/index-copy.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/candidate-apply-list-copy.min.js"
			]
		}
	},
	"reports": {
		"styles": {
			"debug" : [
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/reports.css"
			],
			"prod": [
				"static/build/css/reports.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/change-password.js",
				"static/js/vendor/moment.min.js",
				"static/js/utilities.js",
				"static/js/reports.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Services/fetchRecruiterReports.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/Reports/model.js",
				"static/js/Components/Reports/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/reports.min.js"
			]
		}
	},
	"landing": {
		"styles": {
			"debug" : [
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/landing.css"
			],
			"prod": [
				"static/build/css/landing.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/Utilities/modal.js",
				"static/js/header.js",
				"static/js/change-password.js",
				"static/js/utilities.js",
				"static/js/landing.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Services/submitLogin.js",
				"static/js/Services/submitRegister.js",
				"static/js/Components/Landing/model.js",
				"static/js/Components/Landing/registerModel.js",
				"static/js/Components/Landing/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/landing.min.js"
			]
		}
	},
	"welcome": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/welcome.css"
			],
			"prod": [
				"static/build/css/welcome.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/utilities.js",
				"static/js/welcome.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Services/resendActivationLink.js",
				"static/js/Components/ResendActivationLink/model.js",
				"static/js/Components/ResendActivationLink/index.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/welcome.min.js"
			]
		}
	},

	"verify-email": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/verify-email.css"
			],
			"prod": [
				"static/build/css/verify-email.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/utilities.js",
				"static/js/welcome.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Services/resendActivationLink.js",
				"static/js/Components/ResendActivationLink/model.js",
				"static/js/Components/ResendActivationLink/index.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/verify-email.min.js"
			]
		}
	},


	"about-us": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/about-us.css",
				"static/css/footer.css"
			],
			"prod": [
				"static/build/css/about-us.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Components/Header/model.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"

			],
			"prod" : [
				"static/build/js/about-us.min.js"
			]
		}
	},

	"refund": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/refund.css",
				"static/css/footer.css"
			],
			"prod": [
				"static/build/css/refund.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"

			],
			"prod" : [
				"static/build/js/refund.min.js"
			]
		}
	},


	"contact-us": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/contact-us.css",
				"static/css/footer.css"
			],
			"prod": [
				"static/build/css/contact-us.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/contact-us.min.js"
			]
		}
	},

	"privacy": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/privacy.css",
				"static/css/footer.css"
			],
			"prod": [
				"static/build/css/privacy.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Utilities/hideHeader.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"

			],
			"prod" : [
				"static/build/js/privacy.min.js"
			]
		}
	},

	"terms-condition": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/terms-condition.css",
				"static/css/footer.css"
			],
			"prod": [
				"static/build/css/terms-condition.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/terms-condition.min.js"
			]
		}
	},

	"error404": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/footer.css"
			],
			"prod": [
				"static/build/css/error404.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/error404.min.js"
			]
		}
	},
	"redirectForIE": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/footer.css"
			],
			"prod": [
				"static/build/css/redirectForIE.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/redirectForIE.min.js"
			]
		}
	},
	"error503":{
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/footer.css",
				"static/css/error503.css"
			],
			"prod": [
				"static/build/css/error503.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/error503.min.js"
			]
		}
	},
	"ieScreen":{
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/footer.css",
				"static/css/ieScreen.css"
			],
			"prod": [
				"static/build/css/ieScreen.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/ieScreen.min.js"
			]
		}
	},
	"account-verified": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/account-verified.css"
			],
			"prod": [
				"static/build/css/account-verified.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/account-verified.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/account-verified.min.js"
			]
		}
	},
	"forgot-password": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/forgot-password.css"
			],
			"prod": [
				"static/build/css/forgot-password.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/utilities.js",
				"static/js/forgot-password.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Services/SubmitForgotPassword.js",
				"static/js/Components/ForgotPassword/model.js",
				"static/js/Components/ForgotPassword/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/forgot-password.min.js"
			]
		}
	},
	"account-created": {
		"styles": {
			"debug" : [
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/account-created.css"
			],
			"prod": [
				"static/build/css/account-created.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/request.js",
				"static/js/header.js",
				"static/js/utilities.js",
				"static/js/account-created.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Services/submitLogin.js",
				"static/js/Components/AccountCreated/model.js",
				"static/js/Components/AccountCreated/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/account-created.min.js"
			]
		}
	},
	"candidate-profile": {
		"styles": {
			"debug" : [
				"static/css/jquery-ui.min.css",
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/candidate-profile.css",
				"static/css/chat-sticky.css",
				"static/css/utilities.css",
				"static/css/animate.css",
				"static/css/jquery-chatbox.css",
				"static/css/vendor/tooltipster.css"
			],
			"prod": [
				"static/build/css/candidate-profile.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/vendor/jquery-ui.min.js",
				"static/js/Utilities/request.js",
				"static/js/vendor/moment.min.js",
				"static/js/vendor/page.js",
				"static/js/vendor/pdf.js",
				"static/js/vendor/pdf.worker.js",
				"static/js/pdfJs.js",
				"static/js/header.js",
				"static/js/candidate-apply-list.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/chat-pubnub-sticky.js",
				"static/js/chat-sticky.js",
 				"static/js/Services/submitChatMessage.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Services/setCandidateAction.js",
				"static/js/Services/fetchCandidateProfile.js",
				"static/js/Services/fetchRecruiterTags.js",
				"static/js/Services/fetchjobCalendars.js",
				"static/js/Services/sendInterviewInvite.js",
				"static/js/Services/setDefaultCalendar.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/CandidateProfile/model.js",
				"static/js/Components/CandidateProfile/index.js",
				"static/js/Components/CandidateProfile/mapping.js",
				"static/js/Components/CandidateProfile/store.js",
				"static/js/Services/submitPageVisit.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Tracker/tracker.js",
				"static/js/Utilities/chatEngine.js",
				"static/js/Services/fetchRecruiterChats.js",
				"static/js/eventMapping.js",
				"static/js/Components/StickyChat/store.js",
				"static/js/Components/StickyChat/model.js",
				"static/js/Components/StickyChat/index.js"
			],
			"prod" : [
				"static/build/js/candidate-profile.min.js"
			]
		}
	},

	"candidate": {
		"styles": {
			"debug" : [
				"static/css/jquery-ui.min.css",
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/utilities.css",
				"static/css/footer.css",
				"static/css/header.css",
				"static/css/modal.css",
				"static/css/candidate.css",
				"static/css/chat-sticky.css",
				"static/css/utilities.css",
				"static/css/animate.css",
				"static/css/jquery-chatbox.css",
				"static/css/vendor/tooltipster.css"
			],
			"prod": [
				"static/build/css/candidate.min.css"
			]
		},
		"scripts": {
			"debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/vendor/jquery-ui.min.js",
				"static/js/Utilities/request.js",
				"static/js/vendor/moment.min.js",
				"static/js/vendor/pdf.js",
				"static/js/vendor/pdf.worker.js",
				"static/js/pdfJs.js",
				"static/js/header.js",
				"static/js/candidate-apply-list.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/chat-pubnub-sticky.js",
				"static/js/chat-sticky.js",
 				"static/js/Services/submitChatMessage.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Services/setCandidateAction.js",
				"static/js/Services/fetchCandidateChatProfile.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/StickyChat/store.js",
				"static/js/Components/StickyChat/model.js",
				"static/js/Components/StickyChat/index.js",
				"static/js/Utilities/chatEngine.js",
				"static/js/Components/Candidate/model.js",
				"static/js/Components/Candidate/index.js",
				"static/js/Components/Candidate/mapping.js",
				"static/js/Components/Candidate/store.js",
				"static/js/Services/fetchRecruiterChats.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
			],
			"prod" : [
				"static/build/js/candidate.min.js"
			]
		}
	},
	"no-calendar-setup": {
        "styles": {
            "debug" : [
                "static/css/footer.css",
                "static/css/header.css",
                "static/css/no-calendar-setup.css"
            ],
            "prod": [
                "static/build/css/no-calendar-setup.min.css"
            ]
        },
        "scripts": {
            "debug": [
                "static/js/Components/no-calendar-setup/index.js",
				"static/js/header.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
            ],
            "prod" : [
                "static/build/js/no-calendar-setup.min.js"
            ]
        }
	},

    "Interview-scheduler-updated": {
        "styles": {
            "debug" : [
				"static/css/header.css",
                "static/css/footer.css",
				"static/css/global-search.css",
                "static/css/fullcalendar.min.css",
				"static/css/fullcalendar.css",
				"static/css/vendor/medium-editor.min.css",
                "static/css/Interview-scheduler-updated.css"
            ],
            "prod":[
                "static/build/css/Interview-scheduler-updated.min.css"
            ]
        },
        "scripts": {
            "debug": [
				"static/js/vendor/moment.min.js",
				"static/js/vendor/medium-editor.min.js",
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/header.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/vendor/jquery-ui.min.js",
				"static/js/vendor/fullcalendar.min.js",
				"static/js/Utilities/request.js",
				"static/js/Services/submitCalendar.js",
				"static/js/Services/fetchCalendars.js",
                "static/js/Components/Interview-scheduler-updated/index.js",
                "static/js/Components/Interview-scheduler-updated/model.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
            ],
            "prod" : [
                "static/build/js/Interview-scheduler-updated.min.js"
            ]
        }
	},
    "calendarIe": {
        "styles": {
            "debug" : [
				"static/css/header.css",
                "static/css/footer.css",
				"static/css/global-search.css",
                "static/css/fullcalendar.min.css",
				"static/css/fullcalendar.css",
				"static/css/old-header.css",
				"static/css/vendor/medium-editor.min.css",
		        "static/css/calendarIe.css"

            ],
            "prod":[
                "static/build/css/calendarIe.min.css"
            ]
        },
        "scripts": {
            "debug": [
				"static/js/Utilities/ie-polyfill.js",
				"static/js/vendor/moment.min.js",
				"static/js/vendor/jquery-1.9.1.min.js",
				"static/js/vendor/jquery-ui.min.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/header.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Utilities/request.js",
				"static/js/Services/submitCalendarIe.js",
				"static/js/Services/fetchCalendarsIe.js",
				"static/js/Tracker/tracker.js",
                "static/js/Components/calendarIe/index.js",
                "static/js/Components/calendarIe/model.js",
				"static/js/eventMapping.js"
            ],
            "prod" : [
                "static/build/js/calendarIe.min.js"
            ]
        }
    },
    "booked-slots": {
        "styles": {
            "debug" : [
				"static/css/buttons.css",
				"static/css/colors.css",
				"static/css/utilities.css",
				"static/css/modal.css",
				"static/css/header.css",
                "static/css/booked-slots.css",
                "static/css/footer.css",
				"static/css/vendor/tooltipster.css"

            ],
            "prod": [
                "static/build/css/booked-slots.min.css"
            ]
        },
        "scripts": {
            "debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/vendor/jquery-ui.min.js",
				"static/js/vendor/tooltipster.main.min.js",
				"static/js/utilities.js",
				"static/js/modal.js",
				"static/js/header.js",
				"static/js/ui-components.js",
				"static/js/Utilities/request.js",
				"static/js/vendor/moment.min.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Services/fetchRecruiterCalendar.js",
				"static/js/Services/fetchInterviews.js",
				"static/js/Services/cancelInvite.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/BookedSlots/model.js",
				"static/js/Components/BookedSlots/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
            ],
            "prod" :[
                "static/build/js/booked-slots.min.js"
            ]
        }

	},
	"calendar-manage": {
        "styles": {
            "debug":[
				"static/css/header.css",
				"static/css/calendar-manage.css",
				"static/css/modal.css",
                "static/css/footer.css"
            ],
            "prod": [
                "static/build/css/calendar-manage.min.css"
            ]
        },
        "scripts": {
            "debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/utilities.js",
				"static/js/modal.js",
				"static/js/header.js",
				"static/js/ui-components.js",
				"static/js/Utilities/request.js",
				"static/js/vendor/moment.min.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Services/fetchRecruiterCalendar.js",
				"static/js/Components/calendar-manage/model.js",
				"static/js/Components/calendar-manage/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"

            ],
            "prod" :[
                "static/build/js/calendar-manage.min.js"
            ]
        }

	},
	"dashboardview": {
        "styles": {
            "debug" : [
                "static/css/header.css",
                "static/css/dashboardview.css",
                "static/css/footer.css",
				"static/css/modal.css"
            ],
            "prod": [
                "static/build/css/dashboardview.min.css"
            ]
        },
        "scripts": {
            "debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/utilities.js",
				"static/js/modal.js",
				"static/js/header.js",
				"static/js/Utilities/request.js",
				"static/js/vendor/moment.min.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/Components/onBoarding/model.js",
				"static/js/Components/onBoarding/index.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js"
            ],
            "prod" :[
                "static/build/js/dashboardview.min.js"
            ]
        }

	},
	"transition": {
        "styles": {
            "debug" : [
                "static/css/header.css",
                "static/css/footer.css",
				"static/css/transition.css",
				"static/css/animate.css"
            ],
            "prod": [
                "static/build/css/transition.min.css"
            ]
        },
        "scripts": {
            "debug": [
				"static/js/vendor/jquery.min.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/request.js",
				"static/js/Utilities/common.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/header.js",
				"static/js/Components/Transition/model.js",
				"static/js/Tracker/tracker.js",
				"static/js/eventMapping.js",
				"static/js/Services/verifyLogin.js"
            ],
            "prod" :[
                "static/build/js/transition.min.js"
            ]
        }

	},
	"transitionIe": {
        "styles": {
            "debug" : [
                "static/css/header.css",
                "static/css/footer.css",
				"static/css/transition.css",
				"static/css/animate.css"
            ],
            "prod": [
                "static/build/css/transitionIe.min.css"
            ]
        },
        "scripts": {
            "debug": [
				"static/js/Utilities/ie-polyfill.js",
				"static/js/vendor/moment.min.js",
				"static/js/vendor/jquery-1.9.1.min.js",
				"static/js/vendor/jquery-ui.min.js",
				"static/js/Utilities/pubsub.js",
				"static/js/Utilities/common.js",
				"static/js/utilities.js",
				"static/js/Utilities/modal.js",
				"static/js/Utilities/toastNotifier.js",
				"static/js/header.js",
				"static/js/Utilities/request.js",
				"static/js/Services/verifyLoginIe.js",
				"static/js/Components/Header/model.js",
				"static/js/Components/Header/index.js",
				"static/js/header.js",
				"static/js/Components/TransitionIe/model.js"
			],
            "prod" :[
                "static/build/js/transitionIe.min.js"
            ]
        }

	},
	"old-header":{
        "styles": {
            "debug" : [
                "static/css/header.css",
                "static/css/footer.css",
				"static/css/old-header.css"
            ],
            "prod": [
                "static/build/css/old-header.min.css"
            ]
        },
        "scripts": {
            "debug": [
				"static/js/header.js"
			],
            "prod" :[
                "static/build/js/old-header.min.js"
            ]
        }

    }
}
