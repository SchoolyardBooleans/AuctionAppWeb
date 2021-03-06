$(document).ready(function() {
	init();
	validate();
	initValidationListeners();
	initCheckboxChangedListener();
	initImageChangedListener();
	initFormSubmissionListener();
});

function init() {
	$("#image_input").filestyle();
	
	$('#sponsor_picklist').multiselect();

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
		console.log("sponsor picklist is: " + $('#sponsor_picklist').val());
    });
}

function initImageChangedListener() {
	$('#image_input').on('change', function() {
		$('#item_image_thumbnail').hide();
	});
}

function initFormSubmissionListener() {
	var form = $('#add_item');
	var fileSelect = $('#image_input');
	var uploadButton = $('#submit_item');

	console.log('hit!');
	form.onsubmit = function(event) {
  		event.preventDefault();
		var files = fileSelect.files;
		var formData = new FormData();

		// Loop through each of the selected files.
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			console.log('appended file to form data: ' + file.name);
			formData.append('photos[]', file, file.name);
		}

		// Set up the request.
		var xhr = new XMLHttpRequest();

		// Open the connection.
		xhr.open('POST', '', true);

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