$(document).ready(function() {

	$('#dp_start').datepicker();
    $('#dp_end').datepicker();

    dropdown_title_changer("start_hour", "start_hour_btn");
    dropdown_title_changer("start_minute", "start_minute_btn");
    dropdown_title_changer("end_hour", "end_hour_btn");
    dropdown_title_changer("end_minute", "end_minute_btn");

 //    $(function() {
	// 	$("#start_hour li a").click(function() {
	// 		$("#start_hour_btn:first-child").text($(this).text() + ' ');
 //    		$("#start_hour_btn:first-child").val($(this).text());
 //    		$("#start_hour_btn:first-child").append('<span class="caret"></span>')

	// 	});

	// });

    function dropdown_title_changer(id_name, id_btn_name) {
    	$(function() {
			$("#" + id_name + " li a").click(function() {
				$("#" + id_btn_name + ":first-child").text($(this).text() + ' ');
    			$("#" + id_btn_name + ":first-child").val($(this).text());
    			$("#" + id_btn_name + ":first-child").append('<span class="caret"></span>')

			});

		});
    }

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