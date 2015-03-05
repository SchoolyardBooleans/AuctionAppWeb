$(document).ready(function() {
	$('#notifier-success').hide();
	$('#notifier-failure').hide();
	initializeClickListeners();
});

function initializeClickListeners() {
	$('#verify_payment').on('click', function(ev) {
		ev.preventDefault();
		$('#notifier-success').hide();
		$('#notifier-failure').hide();
		console.log('verify payment clicked');
	})

	$('#remove_top_bid').on('click', function(ev) {
		ev.preventDefault();
		$('#notifier').hide();
		console.log('remove top bid clicked');

        $.ajax({
            type:'POST',
            url:'/auction_summary/remove_top_bid',
            data: {
            	'item_id': '1234'
            },
            dataType: 'JSON',
            complete: function(data) {
            	if(data.status == 200) {
            		$('#notifier-success').hide().fadeIn(600);
            	}
            	else {
            		$('#notifier-failure').hide().fadeIn(600);	
            	}
			}
        });
	})
}