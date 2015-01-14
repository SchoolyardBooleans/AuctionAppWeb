$(document).ready(function() {

	$('#dp_start').datepicker();
    $('#dp_end').datepicker();

    dropdown_title_changer("start_hour", "start_hour_btn");
    dropdown_title_changer("start_minute", "start_minute_btn");
    dropdown_title_changer("end_hour", "end_hour_btn");
    dropdown_title_changer("end_minute", "end_minute_btn");
    dropdown_title_changer("start_am_pm", "start_am_pm_btn");
    dropdown_title_changer("end_am_pm", "end_am_pm_btn");

    function dropdown_title_changer(id_name, id_btn_name) {
    	$(function() {
			$("#" + id_name + " li a").click(function() {
				$("#" + id_btn_name + ":first-child").text($(this).text() + ' ');
    			$("#" + id_btn_name + ":first-child").val($(this).text());
    			$("#" + id_btn_name + ":first-child").append('<span class="caret"></span>')

			});

		});
    }

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

    // $('#submit_auction').click(function() {
    	// var name = $("#name").val();
    	// var email = $('#email').val();
    	// var body = $('#body').val();

    	// if(email.length <= 0) {
	    //     $.ajax({
	    //         type:'POST',
	    //         url:'/erik/contact/submission',
	    //         data: {'name' : name, 'body' : body},
	    //         dataType: 'JSON',
	    //         complete: function(data) {
					// //$('#submit_button').before('<span id="notifier"><font color="#00FF00">Message sent ✓</font></span>');
					// $('#notifier').hide();
					// $('#notifier').fadeIn(600);

					// $("#submit_button").prop("disabled", true);
    	// 		}
	    //     });
    	// }
    // });
});