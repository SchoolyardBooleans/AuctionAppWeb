$(document).ready(function() {
	$('#bundled_items').multiselect();

	validate();

    $('#item_name').bind('input propertychange', function() {
    	validate();
    });

    $('#item_description').bind('input propertychange', function() {
    	validate();
    });

    $('#item_value').bind('input propertychange', function() {
    	validate();
    });


    $('#is_featured').change(function() {
	   	if($('#is_featured').prop('checked')) {
			console.log('is feature checked');
			$('#is_featured').val('true');
		}
		else {
		    console.log('is feature not checked');
		    $('#is_featured').val('false');
		}
    });


	$("#add_item").submit(function() {
		var item = {
			name: $('#item_name').val(),
			description: $('#item_description').val(),
			value: $('#item_min_value').val(),
			min_bid: $('#item_min_bid').val(),
			sponsor: $('#sponsor_input').val(),
			is_featured: $('#is_featured').val()
		};

	    $.ajax({
	        url: '',
	        type: 'POST',
	        data: item,
	        dataType: 'JSON',
            complete: function(data) {
				//$('#submit_button').before('<span id="notifier"><font color="#00FF00">Message sent ✓</font></span>');
				// $('#notifier').hide();
				// $('#notifier').fadeIn(600);
				console.log('item sent: ' + data);

				$("#submit_item").prop("disabled", true);
			}
	    });

	    return false;
	});
});

function validate(){
	var item_val = parseInt($('#item_value').val());
	console.log('item name is greater than zero: ' + ($('#item_name').val().length > 0));
	console.log('item description is greater than zero: ' + ($('#item_description').val().length > 0));
	console.log('item value is a number:' + !isNaN(item_val));
	console.log('item value is greater than 0: ' + (item_val > 0));
	if ($('#item_name').val().length > 0 && $('#item_description').val().length > 0 && !isNaN(item_val) && item_val > 0) {
		$("#submit_item").prop("disabled", false);
	}
	else {
		$("#submit_item").prop("disabled", true);
	}
}