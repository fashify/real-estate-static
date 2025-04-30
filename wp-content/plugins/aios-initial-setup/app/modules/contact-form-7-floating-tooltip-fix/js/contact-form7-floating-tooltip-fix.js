(function (jQuery) {
	jQuery(document).ready( function() {
		// Adds a hover event listener to elements with the class "wpcf7-form-control-wrap"
		jQuery(".wpcf7-form-control-wrap").hover(function() {
			// Fades out any child element with the class "wpcf7-not-valid-tip" within the hovered element
			jQuery(this).children(".wpcf7-not-valid-tip").fadeOut();
		 });
		 // Adds "mouseover" and "mouseenter" event listeners for the same fade-out functionality
		 jQuery(".wpcf7-form-control-wrap").on("mouseover mouseenter", function() {
			// Fades out the validation message (".wpcf7-not-valid-tip") when mouse enters the element
			jQuery(this).children(".wpcf7-not-valid-tip").fadeOut();
		 });
	});
})(jQuery);