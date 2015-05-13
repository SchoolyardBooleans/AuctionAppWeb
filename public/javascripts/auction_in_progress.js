$(document).ready(function() {
	$('#last_updated').text("Last updated: " + new Date().toLocaleString());

	$('#refresh_btn').click(function() {
    	location.reload();
}	);
});