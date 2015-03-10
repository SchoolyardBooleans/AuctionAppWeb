$(document).ready(function() {
//   initialize();
   initializeClickListeners();
   
});

// function initialize() {

// }

function initializeClickListeners() {
 $(".clickableRow").click(function() {
     console.log("Row clicked");
     window.document.location = $(this).attr("href");
 });
}