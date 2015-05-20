$(document).ready(function() {
	initializeClickListeners();
});

function initializeClickListeners() {
	$(".delete_button a").on('click', function(ev) {
		ev.preventDefault();
		console.log("delete clicked");

	});

	$('#delete_modal').on('show.bs.modal', function(event) {

		var auction_id = $(event.relatedTarget).closest('tr').data('id'),
			auction_name = $(event.relatedTarget).closest('tr').data('name');

		console.log("auction id is: " + auction_id);
		console.log("auction name is: " + auction_name);

		$('.modal-body').text('Are you sure you want to delete the auction "' + auction_name + '"? This action cannot be undone.');

		$("#confirm_delete").on('click', function(ev) {
			ev.preventDefault();

			$.ajax({ 
				type:'DELETE', 
				url: '/delete_auction/' + auction_id, 
				dataType: 'json',
				complete: function(data) {
	            	if(data.status == 200) {
	            		$('tr[data-id="'+auction_id +'"]').remove();
	            		console.log('item deleted');

	            	}
	            	else {
	            		alert('Something went wrong. Auction could not be deleted.');
	            	}

	            	$('#confirm_delete').unbind('click')
	            	$('#delete_modal').modal('hide');
				}

			});
		});
	});
}