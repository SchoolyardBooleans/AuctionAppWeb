$(document).ready(function() {

	$('#dp_start').datepicker();
    $('#dp_end').datepicker();

    setDefaultDates();

    dropdown_title_changer("start_hour", "start_hour_btn");
    dropdown_title_changer("start_minute", "start_minute_btn");
    dropdown_title_changer("end_hour", "end_hour_btn");
    dropdown_title_changer("end_minute", "end_minute_btn");
    dropdown_title_changer("start_am_pm", "start_am_pm_btn");
    dropdown_title_changer("end_am_pm", "end_am_pm_btn");

	/*Validate the form*/
    $('#create_auction').bootstrapValidator(
    {
	    message: 'This value is not valid',
		fields: {
	    	name: {
	        	message: 'The auction name is not valid',
	        	validators: {
	            	notEmpty: {
	                	message: 'The auction name is required and can\'t be empty'
	            	}
	        	}
	    	}
	    }
	});

});

function dropdown_title_changer(id_name, id_btn_name) {
	$(function() {
		$("#" + id_name + " li a").click(function() {
			$("#" + id_btn_name + ":first-child").text($(this).text() + ' ');
			$("#" + id_btn_name + ":first-child").val($(this).text());

		});

	});
}

function prettifyDateString(month, day, year) {
	if(day < 10) {
    	day = '0'+ day;
	} 

	if(month < 10) {
    	month = '0' + month;
	} 

	return month + '/' + day + '/' + year;
}

function setDefaultDates() {
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1; //January is 0!
	var year = today.getFullYear();

	var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
	var tDay = tomorrow.getDate();
	var tMonth = tomorrow.getMonth() + 1;
	var tYear = tomorrow.getFullYear();

	var todayStr = prettifyDateString(month, day, year);
	var tomorrowStr = prettifyDateString(tMonth, tDay, tYear);

	$('#dp_start').text(todayStr);
	$('#dp_start').val(todayStr);
	$('#dp_start').attr("placeholder", todayStr);
	$('#start_hour_btn').text('12');
	$('#start_hour_btn').val('12');
	$('#start_minute_btn').text('00');
	$('#start_minute_btn').val('00');
	$('#start_am_pm_btn').text('PM');
	$('#start_am_pm_btn').val('PM');

	$('#dp_end').text(tomorrowStr);
	$('#dp_end').val(tomorrowStr);
	$('#dp_end').attr("placeholder", tomorrowStr);
	$('#end_hour_btn').text('12');
	$('#end_hour_btn').val('12');
	$('#end_minute_btn').text('00');
	$('#end_minute_btn').val('00');
	$('#end_am_pm_btn').text('PM');
	$('#end_am_pm_btn').val('PM');

}