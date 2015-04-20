$(document).ready(function() {
    initializeValidation()
	initialize();
    initializeClickListeners();
    $('#location_picklist').multiselect();
});

function initializeValidation() {
    $('#edit_auction').formValidation({
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

        var name = $("#auction_name").val(),
            id = $('#auction_id').text(),
            start_date = $('#start_date_input').val(),
            end_date = $('#end_date_input').val(),
            location = $('#auction_location').val(),
            location_picklist = $('select#location_picklist').val();

        console.log('name: ' + name);
        console.log('id: ' + id);

        $.ajax({
            type:'POST',
            url:'/edit_auction',
            data: {
                'name': name,
                'id': id,
                'start_date': start_date,
                'end_date': end_date,
                'location': location,
                'location_picklist': location_picklist
            },
            dataType: 'JSON',
            complete: function(data) {
                if(data.status == 200) {
                    console.log('Auction updated successfully')
                    $('#notifier').html('<h4 style="color:#008A00">Auction Updated ✓</h4>');
                }
                else {
                    console.log('not saved')
                    $('#notifier').html('<h4 style="color:red">Unable To Update Auction</h4>');
                }
                $('#notifier').hide();
                $('#notifier').fadeIn(600);
            }
        });
    });
}

function initialize() {
	$('#notifier').hide();

	$("#start_date").datetimepicker({
        format: "mm/dd/yy, HH:ii P",
        showMeridian: true,
        autoclose: true,
        todayBtn: false
	}).on('changeDate', function(ev) {
		console.log('start date changed');

		$('#edit_auction').data('formValidation').updateStatus('start_date_input', 'NOT_VALIDATED').validateField('start_date_input');
	});

	 $("#end_date").datetimepicker({
        format: "mm/dd/yy, HH:ii P",
        showMeridian: true,
        autoclose: true,
        todayBtn: false
    }).on('changeDate', function(ev) {
    	console.log('end date changed');
    	$('#edit_auction').data('formValidation').updateStatus('end_date_input', 'NOT_VALIDATED').validateField('end_date_input');
    	console.log('end date changed 2');
	});

    $(".delete_button a").on('click', function(ev) {
        ev.preventDefault();
        console.log("delete clicked");

    });

    $('#delete_modal').on('show.bs.modal', function(event) {

        var item_id = $(event.relatedTarget).closest('tr').data('id'),
            item_name = $(event.relatedTarget).closest('tr').data('name');

        console.log("auction id is: " + item_id);
        console.log("auction name is: " + item_name);

        $('.modal-body').text('Are you sure you want to delete the item "' + item_name + '"? This action cannot be undone.');

        $("#confirm_delete").on('click', function(ev) {
            ev.preventDefault();

            $.ajax({ 
                type:'DELETE', 
                url: '/edit_auction/delete_item/' + item_id, 
                dataType: 'json',
                complete: function(data) {
                    if(data.status == 200) {
                        $('tr[data-id="'+ item_id +'"]').remove();
                        console.log('item deleted');

                    }
                    else {
                        alert('Something went wrong. Auction could not be deleted.');
                    }

                    $('#delete_modal').modal('hide');
                }

            });
        });
    });
}

function initializeClickListeners() {
    $(".clickableRow").click(function() {
        console.log("Row clicked");
        window.document.location = $(this).attr("href");
    });
}