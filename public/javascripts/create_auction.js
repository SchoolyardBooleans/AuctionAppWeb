$(document).ready(function() {
	initializeValidator();
	initialize();
	initModal();
});

function initializeValidator() {
    $('#create_auction').formValidation({
	    framework: 'bootstrap',
	     icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
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

                            return start.getTime() < end.getTime();
                        }
                    },
					notEmpty: {
	                	message: "The auction's end date is required"
	            	}
	        	}
	    	},
	    	location_picklist: {
	        	message: "The auction's location is not valid",
	        	validators: {
	            	notEmpty: {
	                	message: 'An auction location is required'
	            	}
	        	}
	    	}
	    }
	}).on('success.form.fv', function(e) {
        /*Called when form button is pressed, and form is validated*/
        
        e.preventDefault();

        var name = $('#auction_name').val(),
			start_date = $('#start_date_input').val(),
			end_date = $('#end_date_input').val(),
         location_picklist = $('select#location_picklist').val();

        $.ajax({
            type:'POST',
            url:'/create_auction',
            data: {
            	'name': name,
            	'start_date': start_date,
            	'end_date': end_date,
               'location_picklist': location_picklist
            },
            dataType: 'JSON',
            complete: function(data) {
            	if(data.status == 200) {
            		$('#notifier').html('<h4 style="color:#008A00">Auction Created ✓</h4>');
            	}
            	else {
            		$('#notifier').html('<h4 style="color:red">Unable To Save Auction</h4>');
            	}
				$('#notifier').hide();
				$('#notifier').fadeIn(600);
			}
        });
    });
}

function initialize() {
	$('#notifier').hide();

	$('#location_picklist').on('change', function() {
		$('#create_auction').data('formValidation').validateField('location_picklist');
	});

	$('#start_date').datetimepicker({
        format: 'mm/dd/yy, HH:ii P',
        showMeridian: true,
        autoclose: true,
        todayBtn: false
	}).on('changeDate', function(ev) {
		$('#create_auction').data('formValidation').updateStatus('start_date_input', 'NOT_VALIDATED').validateField('start_date_input');
	});

	 $('#end_date').datetimepicker({
        format: 'mm/dd/yy, HH:ii P',
        showMeridian: true,
        autoclose: true,
        todayBtn: false
    }).on('changeDate', function(ev) {
    	$('#create_auction').data('formValidation').updateStatus('end_date_input', 'NOT_VALIDATED').validateField('end_date_input');
	});

	var today = new Date(),
		tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
		todayStr = today.toLocaleString(navigator.language, {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'}),
		tomorrowStr = tomorrow.toLocaleString(navigator.language, {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'});
	
	$('#start_date_input').attr('placeholder', todayStr);
	$('#end_date_input').attr('placeholder', tomorrowStr);
}

function initModal() {
	$("#add_loc_btn").on('click', function(ev) {
        ev.preventDefault();

    });

    $('#add_location_modal').on('show.bs.modal', function(event) {
        $("#confirm_add_loc").on('click', function(ev) {
            ev.preventDefault();

			var new_location_name = $('#location_input_new').val();

            $.ajax({ 
                type:'POST', 
                url: '/location',
                data: {
            		'new_location_name': new_location_name
            	},
                dataType: 'json',
                complete: function(data) {
                    if(data.status == 200) {
                        $("#location_picklist").append('<option selected value="' + data.responseJSON.id + '">' + new_location_name + "</option>");
                        $('#create_auction').data('formValidation').validateField('location_picklist');

                    }
                    else {
                        alert('Something went wrong. Location could not be created.');
                    }

                    $('#add_location_modal').modal('hide');
                }

            });
        });
    });
}