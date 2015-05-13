$(document).ready(function() {
	init();
	initializeClickListeners();
});

function init() {
	hideNotifiers();
	$("#bid_list").trigger('change');

	/*if the payment is verified then highlight the verified payer's bid green*/
	if($('#payment_is_verified').text() == "true") {
		$("#bid_list li:first-child").addClass('list-group-item-success');
	}
}

function hideNotifiers() {
	$('#verified-notifier-success').hide();
	$('#verified-notifier-failure').hide();
	$('#bid-removed-notifier-success').hide();
	$('#bid-removed-notifier-failure').hide();
}

function initializeClickListeners() {
	$('#verify_payment').on('click', function(ev) {
		ev.preventDefault();
		hideNotifiers();

		var item_id = $("#item_id").text();
		console.log('item id is: ' + item_id);

        $.ajax({
            type:'POST',
            url:'/auction_summary/payment_verified',
            data: {
            	'item_id': item_id,
            	'item_verified' : true
            },
            dataType: 'JSON',
            complete: function(data) {
            	if(data.status == 200) {
            		$("#verify_payment").prop("disabled", true);
            		$("#verify_payment").text("Payment Verified");
            		$('#verified-notifier-success').hide().fadeIn(600);
            		$('#remove_top_bid').fadeOut(600);
            		$("#bid_list li:first-child").addClass('list-group-item-success');

            		
            	}
            	else {
            		$('#verified-notifier-failure').hide().fadeIn(600);
            	}
			}
        });
	});

	$('#remove_top_bid').on('click', function(ev) {
		ev.preventDefault();
		hideNotifiers();

		var item_id = $("#item_id").text();

        $.ajax({
            type:'POST',
            url:'/auction_summary/remove_top_bid',
            data: {
            	'item_id': item_id
            },
            dataType: 'JSON',
            complete: function(data) {
            	if(data.status == 200) {
            		$('#bid-removed-notifier-success').hide().fadeIn(600);
            		$("#bid_list li:first-child").remove();
            		$("#bid_list").trigger('change');
            	}
            	else {
            		$('#bid-removed-notifier-failure').hide().fadeIn(600);	
            	}
			}
        });
	});

	/*disables 'Remove Top Bid' button if there are no bids*/
	$("#bid_list").on('change', function() {
  		if($("#bid_list li").length == 0) {
  			$("#remove_top_bid").prop("disabled", true);
  		}
	});
}