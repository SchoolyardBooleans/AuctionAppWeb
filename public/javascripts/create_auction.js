$(document).ready(function() {

	/*Validate the form*/
    $('#create_auction').bootstrapValidator({
	    message: 'This value is not valid',
		fields: {
	    	auction_name: {
	        	message: 'The auction name is not valid',
	        	validators: {
	            	notEmpty: {
	                	message: 'An auction name is required'
	            	}
	        	}
	    	},
	    	start_date_input: {
	        	message: "The auction's start date is not valid",
	        	validators: {
	            	notEmpty: {
	                	message: "The auction's start date is required"
	            	}
	        	}
	    	},
	    	end_date_input: {
	        	message: "The auction's end date is not valid",
	        	validators: {
	            	callback: {
                        message: "The auction's end date must be after the start date",
                        callback: function(value, validator, $field) {
                            var start_str = $('#start_date_input').val(),
                            	end_str = $('#end_date_input').val();

                            var start = new Date(start_str),
                            	end = new Date(end_str);

                            console.log('start: ' + start.getTime() + ' , end ' + end.getTime());

                            return start.getTime() < end.getTime();
                        }
                    },
					notEmpty: {
	                	message: "The auction's end date is required"
	            	}
	        	}
	    	},
	    	auction_location: {
	        	message: "The auction's location is not valid",
	        	validators: {
	            	notEmpty: {
	                	message: 'An auction location is required'
	            	}
	        	}
	    	}
	    }
	});

	initialize();

	initializeSubmitButton();

});

function initialize() {
	$("#start_date").datetimepicker({
        format: "mm/dd/yy, HH:ii P",
        showMeridian: true,
        autoclose: true,
        todayBtn: false
	}).on('changeDate', function(ev) {
		console.log('start date changed');

		$('#create_auction').data('bootstrapValidator').updateStatus('start_date_input', 'NOT_VALIDATED').validateField('start_date_input');
	});

	 $("#end_date").datetimepicker({
        format: "mm/dd/yy, HH:ii P",
        showMeridian: true,
        autoclose: true,
        todayBtn: false
    }).on('changeDate', function(ev) {
    	console.log('end date changed');
    	$('#create_auction').data('bootstrapValidator').updateStatus('end_date_input', 'NOT_VALIDATED').validateField('end_date_input');
    	console.log('end date changed 2');
	});

	var today = new Date();
	var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	var todayStr = today.toLocaleString(navigator.language, {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'});
	var tomorrowStr = tomorrow.toLocaleString(navigator.language, {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'});
	
	$("#start_date_input").attr("placeholder", todayStr);
	$("#end_date_input").attr("placeholder", tomorrowStr);
}

function initializeSubmitButton() {
	$('#create_auction').submit(function(event) {
		event.preventDefault();

    	var name = $("#auction_name").val(),
    		start_date = $('#start_date_input').val(),
    		end_date = $('#end_date_input').val(),
    		location = $('#auction_location').val();

        $.ajax({
            type:'POST',
            url:'/auction',
            data: {
            	'name': name,
            	'start_date': start_date,
            	'end_date': end_date,
            	'location': location
            },
            dataType: 'JSON',
            complete: function(data) {
				//$('#submit_button').before('<span id="notifier"><font color="#00FF00">Message sent ✓</font></span>');
				// $('#notifier').hide();
				// $('#notifier').fadeIn(600);

				// $("#submit_button").prop("disabled", true);
				console.log('Submitted!');
			}
        });
    });
}