// default vars
var year = 1985;
var month = 11;
var content = "calendar";


// if local storage...
if (typeof(Storage) !== "undefined") {
	// first time setting
	if (!localStorage.year || !localStorage.month || !localStorage.content) {
		localStorage.year = year;
		localStorage.month = month;
		localStorage.content = content;
	// load from storage
	} else { 
		year = Number(localStorage.year);
		month = Number(localStorage.month);
		content = String(localStorage.content);
	}
}
	

// months names list
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// comic calendar
var calendar = {
	1985: [0,0,0,0,0,0,0,0,0,0,30,31],
	1986: [31,28,31,30,31,30,31,31,30,31,30,31],
	1987: [31,28,31,30,31,30,31,31,30,31,30,31],
	1988: [31,29,31,30,31,30,31,31,30,31,30,31],
	1989: [31,28,31,30,31,30,31,31,30,31,30,31],
	1990: [31,28,31,30,31,30,31,31,30,31,30,31],
	1991: [31,28,31,30,31,30,31,31,30,31,30,31],
	1992: [31,29,31,30,31,30,31,31,30,31,30,31],
	1993: [31,28,31,30,31,30,31,31,30,31,30,31],
	1994: [31,28,31,30,31,30,31,31,30,31,30,31],
	1995: [31,28,31,30,31,30,31,31,30,31,30,31],
}


// main
$(function() {
	changeContent(content);
	updateDisplayDate();

	// float navbar
	$(window).scroll(function() {
		if (($("#navbar").offset().top - $(window).scrollTop()) < 8 && !$("#navbar").hasClass("floating")) {
			$("#navbar").addClass("floating")
		} else if (($("#navbar").offset().top - $(window).scrollTop()) >= 8 && $("#navbar").hasClass("floating")) {
			$("#navbar").removeClass("floating")
		}
	});

	// keyboard shortcuts
	$("body").keydown(function(e) {
		if(e.keyCode == 37 && content == "comics") { // left
			comicBrowse("prev");
		}
		else if(e.keyCode == 39 && content == "comics") { // right
			comicBrowse("next");
		}
		else if(e.keyCode == 67) { // c
			changeContent(content == "comics" ? "calendar" : "comics");
		}
	  });
});


// update local storage
function updateLocalStorage() {
	localStorage.year = year;
	localStorage.month = month;
	localStorage.content = content;
}


// update and draw calendar - hella inefficient and unnecessary but I can't be bothered rn
function drawCalendar() {
	// empty calendar
	$("#calendar").empty();

	// generate grid
	for (let i = 1; i <= 143; i++) {
		// if year column
		if (i % 13 == 1) {
			var cal_y = 1985 + (i - 1) / 13;
			$("#calendar").append("<div class='calendar-year'>" + cal_y + "</div>");
		// draw month card
		} else {
			var cal_m = (i - 1) % 13;
			var current_date = cal_y == year && cal_m == month ? " current" : "";
			var date_data = i < 12 ? " disabled'" : " comic-border' data-year='" + cal_y + "' data-month='" + cal_m + "' onclick='comicJump(this);'";
			$("#calendar").append("<div class='calendar-month" + current_date + date_data + ">" + cal_m + "</div>");
		}
	}
}


// fetch comics for given date
function generateComics() {
	// empty comics container
	$("#comics").empty();

	// special start case
	var start_date = year == 1985 && month == 11 ? 18 : 1;

	// fetch comics
	for (let date = start_date; date <= calendar[year][month-1]; date++) {
		$("#comics").append("<img src='Comic/" + String(year) + String(month).padStart(2, "0") + String(date).padStart(2, "0") + ".gif'>");
	}

	// scroll to top
	window.scrollTo(0, 0);
}


// update navbar display date and attributes
function updateDisplayDate() {
	$("#navbar_date")
		.attr("data-year", year)
		.attr("data-month", month)
		.text(months[month - 1] + ", " + year);
}


// check whether to disable navigation buttons
function checkDisabled() {
	// disable back button
	if (year == 1985 && month == 11) {
		$("#nav_prev").addClass("disabled");
	} 
	// disable forward button
	if (year == 1995 && month == 12) {
		$("#nav_next").addClass("disabled");
	} 

	// undisable forward button
	if (year != 1995 || month != 12 && $("#nav_next").hasClass("disabled")) {
		$("#nav_next").removeClass("disabled");
	} 
	// undisable back button
	if (year != 1985 || month != 11 && $("#nav_prev").hasClass("disabled")) {
		$("#nav_prev").removeClass("disabled");
	}
}


// browse comic month-wise
function comicBrowse(direction) {
	// go back
	if (direction == "prev" && (year != 1985 || month != 11)) {
		year = month > 1 ? year : year - 1;
		month = month > 1 ? month - 1 : 12;
	// go forward
	} else if (direction == "next" && (year != 1995 || month != 12)) { 
		year = month < 12 ? year : year + 1;
		month = month < 12 ? month + 1 : 1;
	}

	// update page
	updateDisplayDate();
	checkDisabled();
	generateComics();

	updateLocalStorage();
}


// jump to part of comic with element - not very well generalized, but who cares
function comicJump(element) {
	// update date
	year = Number($(element).attr("data-year"));
	month = Number($(element).attr("data-month"));

	// update page
	updateLocalStorage();
	updateDisplayDate();
	changeContent("comics");
}


// change page content
function changeContent(new_content) {
	// set content
	content = new_content;

	// hide all content pages
	$(".content, .content-specific").addClass("hidden");

	// unhide the ones selected
	$("#" + String(content)).removeClass("hidden");
	$("." + String(content) + "-specific").removeClass("hidden");

	// special actions
	switch (content) {
		case "comics":
			generateComics();
			checkDisabled();
		case "calendar":
			drawCalendar();
	}

	updateLocalStorage();

	// scroll to top
	window.scrollTo(0, 0);
}