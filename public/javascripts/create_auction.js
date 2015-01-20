var validationOptions =
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
	            	callback: {
                        message: "The auction's end date must be after the start date",
                        callback: function(value, validator, $field) {
                            console.log('Work please');
                            console.log(value);
                            var start = $('#start_date_input').val();
                            var end = $('#end_date_input').val();
                            console.log('start: ' + start + ' , end ' + end);

                            return value == 'hello';
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
	};

$(document).ready(function() {

	/*Validate the form*/
    $('#create_auction').bootstrapValidator(validationOptions);

	initialize();

});

function initialize() {
	$("#start_date").datetimepicker({
        format: "mm/dd/yy, HH:ii P",
        showMeridian: true,
        autoclose: true,
        todayBtn: false
	}).on('changeDate', function(ev) {
		console.log('start date changed');
		//$('#create_auction').data('bootstrapValidator').validate();
		$('#create_auction').data('bootstrapValidator').validateField('start_date_input');
	});

	 $("#end_date").datetimepicker({
        format: "mm/dd/yy, HH:ii P",
        showMeridian: true,
        autoclose: true,
        todayBtn: false
    }).on('changeDate', function(ev) {
    	console.log('end date changed');
    	$('#create_auction').data('bootstrapValidator').validateField('end_date_input');
	});

	var today = new Date();
	var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	var todayStr = today.toLocaleString(navigator.language, {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'});
	var tomorrowStr = tomorrow.toLocaleString(navigator.language, {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'});
	
	$("#start_date_input").attr("placeholder", todayStr);
	$("#end_date_input").attr("placeholder", tomorrowStr);
}