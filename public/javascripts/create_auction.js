$(document).ready(function() {

	initialize();

	/*Validate the form*/
    $('#create_auction').bootstrapValidator(
    {
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
	            	notEmpty: {
	                	message: "The auction's end date is required"
	            	},
	            	callback: {
                        message: "The auction's end date must be after the start date",
                        callback: function (value, validator, $field) {
                            var start_date = $('#start_date_input').value(),
                            	end_date = $('#end_date_input').value();
                            console.log(start_date);
                            console.log(end_date);

                            return false;
                        }
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

});

function initialize() {
	$("#start_date").datetimepicker({
        format: "mm/dd/yy, HH:ii P",
        showMeridian: true,
        autoclose: true,
        todayBtn: false
	});

	 $("#end_date").datetimepicker({
        format: "mm/dd/yy, HH:ii P",
        showMeridian: true,
        autoclose: true,
        todayBtn: false
    });

	var today = new Date();
	var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	var todayStr = today.toLocaleString(navigator.language, {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'});
	var tomorrowStr = tomorrow.toLocaleString(navigator.language, {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'});
	
	$("#start_date_input").attr("placeholder", todayStr);
	$("#end_date_input").attr("placeholder", tomorrowStr);
}