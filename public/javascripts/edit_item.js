$(document).ready(function() {
	init();
	validate();
	initValidationListeners();
	initCheckboxChangedListener();
	initFormSubmissionListener();
});

function init() {
	$('#bundled_items').multiselect({buttonClass: 'btn-default btn-sm'});
	$("#image_input").filestyle('buttonName', 'btn-default btn-sm');

	if($('#is_featured').val() == 'true') {
		console.log('is feature checked');
		$('#is_featured').prop('checked', true);
	}
	else {
	    console.log('is feature not checked');
	    $('#is_featured').prop('checked', false);
	}
}

function validate(){
	var item_val = parseInt($('#item_value').val());
	if ($('#item_name').val().length > 0 && $('#item_description').val().length > 0 && !isNaN(item_val) && item_val > 0) {
		$("#submit_item").prop("disabled", false);
	}
	else {
		$("#submit_item").prop("disabled", true);
	}
}

function initValidationListeners() {
	$('#item_name').bind('input propertychange', function() {
    	validate();
    });

    $('#item_description').bind('input propertychange', function() {
    	validate();
    });

    $('#item_value').bind('input propertychange', function() {
    	validate();
    });
}

function initCheckboxChangedListener() {
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
}

function initFormSubmissionListener() {
	var form = $('#add_item');
	var fileSelect = $('#image_input');
	var uploadButton = $('#submit_item');

	form.onsubmit = function(event) {
  		event.preventDefault();
  		// Update button text.
  		uploadButton.innerHTML = 'Uploading...';

  		// Get the selected files from the input.
		var files = fileSelect.files;

		// Create a new FormData object.
		var formData = new FormData();

		// Loop through each of the selected files.
		for (var i = 0; i < files.length; i++) {
			var file = files[i];

			// Add the file to the request.
			formData.append('photos[]', file, file.name);
		}

		// Set up the request.
		var xhr = new XMLHttpRequest();

		console.log('xhr hit 1');

		// Open the connection.
		xhr.open('POST', '', true);

		console.log('xhr hit 2');

		// Set up a handler for when the request finishes.
		xhr.onload = function () {
			if (xhr.status === 200) {
				// File(s) uploaded.
				uploadButton.innerHTML = 'Upload';
			}
			else {
				alert('An error occurred!');
			}
		};

		// Send the Data.
		xhr.send(formData);

		return false;
	}
}