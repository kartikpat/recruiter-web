(function test(){

	var title =  $('#title'),
		location = $("#locationTags"),
		minExp= $("#min_experience"),
		maxExp= $("#max_experience"),
		description= $("#job_description"),
		videoUrl= $("#videoID"),
		industry= $("#industryTags"),
		category= $("#category"),
		functionalArea= $("#functional_area"),
		minSal= $("#min_salary"),
		maxSal= $("#max_salary"),
		showSal= $("#salary_show"),
		batchFrom= $("#graduating_start_year"),
		batchTo= $("#graduating_end_year"),
		tags= $("#jobTags"),
		courseType= $("#courseType"),
		preferences= $("#preferences"),
		isPremium= $("#isPremium");

	// setting title
	title.val('testing job data');

	// setting location tags

	$(location.find(".pill-listing ul li")[1]).mousedown()
	$(location.find(".pill-listing ul li")[2]).mousedown()
	$(location.find(".pill-listing ul li")[3]).mousedown()

	// setting minimum experience
	$(minExp.find('option')[3]).attr('selected', true)
	// setting maximum experience
	$(maxExp.find('option')[5]).attr('selected', true);

	// Setting for job description
	description.val('Hello, this is a dummy job description');

	//Setting video url
	videoUrl.val("https://www.youtube.com/watch?v=iHWIZsIBj3Q")

	videoUrl.change()

	// Setting industry
	$(industry.find('.pill-listing ul li')[0]).mousedown()
	$(industry.find(".pill-listing ul li")[0]).mousedown()
	$(industry.find(".pill-listing ul li")[1]).mousedown()
	$(industry.find(".pill-listing ul li")[2]).mousedown()
	$(industry.find(".pill-listing ul li")[3]).mousedown()

	// Setting category
	$(category.find('option')[3]).attr('selected', true)

	// Setting functional area
	$(functionalArea.find('option')[3]).attr('selected', true)

	// Setting min salary
	$(minSal.find('option')[3]).attr('selected', true)

	// Setting max salary
	$(maxSal.find('option')[5]).attr('selected', true)

	// Setting salary show
	showSal.click()

	//Setting bacthed
	$(batchTo.find('option')[3]).attr('selected', true)
	$(batchFrom.find('option')[5]).attr('selected', true)

	// Setting tags
	// $(tags.find('.pill-listing ul li')[0]).mousedown()
	// $(tags.find(".pill-listing ul li")[0]).mousedown()
	$(tags.find(".pill-listing ul li")[1]).mousedown()
	$(tags.find(".pill-listing ul li")[2]).mousedown()
	$(tags.find(".pill-listing ul li")[3]).mousedown()


	// setting preferences
	$(preferences.find('input')[0]).click()
	$(preferences.find('input')[1]).click()
	$(preferences.find('input')[2]).click()
	$(preferences.find('input')[3]).click()
	$(preferences.find('input')[4]).click()

	// setting courseType
	$(courseType.find('input')[0]).click()
	$(courseType.find('input')[1]).click()
	$(courseType.find('input')[2]).click()
	$(courseType.find('input')[3]).click()
	$(courseType.find('input')[4]).click()

	// Settings making the job premium
	isPremium.click();


})()
