/*
 * jquery.menu.js v1.0.1
 *
 * Description: This plugin is used to allow keyboard options on sub-menu navigation as requirement for ADA Compliance.
 */
( function() {

	var keyCodeMap = {
        48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";",
        65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l",
        77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z",
        96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9"
	}
	
	jQuery.fn.accessibleNav = function(settings) {
		
		settings = jQuery.extend({
		    menuHoverClass: 'show-menu',
		}, settings);
		  
		// Add ARIA role to menubar and menu items
		jQuery(this).attr('role', 'menubar').find('li').attr('role', 'menuitem');
		  
		var top_level_links = jQuery(this).find('> li > a');

		// Add tabindex="0" to all top-level links 
		// Without at least one of these, JAWS doesn't read widget as a menu, despite all the other ARIA
		//jQuery(top_level_links).attr('tabindex','0');
		  
		// Set tabIndex to -1 so that top_level_links can't receive focus until menu is open
		jQuery(top_level_links).next('ul').attr('data-test','true').attr({ 'aria-hidden': 'true', 'role': 'menu' }).find('a').attr('tabIndex',-1);
		  
		// Adding aria-haspopup for appropriate items
		jQuery(top_level_links).each(function(){
		    if(jQuery(this).next('ul').length > 0)
		    jQuery(this).parent('li').attr('aria-haspopup', 'true');
		});
		  
		jQuery(top_level_links).hover(function(){
		    jQuery(this).closest('ul').attr('aria-hidden', 'false').find('.'+settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
		    jQuery(this).next('ul').attr('aria-hidden', 'false').addClass(settings.menuHoverClass).find('a').attr('tabIndex',0);
		});

		jQuery(top_level_links).focus(function(){
		    jQuery(this).closest('ul').find('.'+settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
		    jQuery(this).next('ul').attr('aria-hidden', 'false').addClass(settings.menuHoverClass).find('a').attr('tabIndex',0);
		});
		  
		// Bind arrow keys for navigation
		jQuery(top_level_links).keydown(function(e){
		    if(e.keyCode == 37) {
		      	e.preventDefault();
		      	// This is the first item
			    if(jQuery(this).parent('li').prev('li').length == 0) {
			    	jQuery(this).parents('ul').find('> li').last().find('a').first().focus();
			    } else {
			        jQuery(this).parent('li').prev('li').find('a').first().focus();
			    }
		    } else if(e.keyCode == 38) {
		      	e.preventDefault();
		      	if(jQuery(this).parent('li').find('ul').length > 0) {
		        	jQuery(this).parent('li').find('ul').attr('aria-hidden', 'false').addClass(settings.menuHoverClass).find('a').attr('tabIndex',0).last().focus();
		      	}
		    } else if(e.keyCode == 39) {
		      	e.preventDefault();
		      	// This is the last item
		      	if(jQuery(this).parent('li').next('li').length == 0) {
		        	jQuery(this).parents('ul').find('> li').first().find('a').first().focus();
		      	} else {
		        	jQuery(this).parent('li').next('li').find('a').first().focus();
		      	}
		    } else if(e.keyCode == 40) {
		      	e.preventDefault();
		      	if(jQuery(this).parent('li').find('ul').length > 0) {
		        	jQuery(this).parent('li').find('ul').attr('aria-hidden', 'false').addClass(settings.menuHoverClass).find('a').attr('tabIndex',0).first().focus();
		      	}
		    } else if(e.keyCode == 13 || e.keyCode == 32) {
		      // If submenu is hidden, open it
		      	e.preventDefault();
		      	jQuery(this).parent('li').find('ul[aria-hidden=true]').attr('aria-hidden', 'false').addClass(settings.menuHoverClass).find('a').attr('tabIndex',0).first().focus();
		    } else if(e.keyCode == 27) {
		      	e.preventDefault();
		      	jQuery('.'+settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
		    } else {
		      	jQuery(this).parent('li').find('ul[aria-hidden=false] a').each(function(){
		        	if(jQuery(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
		          		jQuery(this).focus();
		          	return false;
		        	}
		      	});
		    }
		  });
		   
		  var links = jQuery(top_level_links).parent('li').find('ul').find('a');
		  jQuery(links).keydown(function(e){
		    if(e.keyCode == 38) {
		      	e.preventDefault();
		      	// This is the first item
		      	if(jQuery(this).parent('li').prev('li').length == 0) {
		        	jQuery(this).parents('ul').parents('li').find('a').first().focus();
		      	} else {
		        	jQuery(this).parent('li').prev('li').find('a').first().focus();
		      	}
		    } else if(e.keyCode == 40) {
		      	e.preventDefault();
		      	if(jQuery(this).parent('li').next('li').length == 0) {
		        	jQuery(this).parents('ul').parents('li').find('a').first().focus();
		      	} else {
		        	jQuery(this).parent('li').next('li').find('a').first().focus();
		      	}
		    } else if(e.keyCode == 27 || e.keyCode == 37) {
		      	e.preventDefault();
		      	jQuery(this).parents('ul').first().prev('a').focus().parents('ul').first().find('.'+settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
		    } else if(e.keyCode == 32) {
		      	e.preventDefault();
		      	window.location = jQuery(this).attr('href');
		    } else {
		      	var found = false;
		      	jQuery(this).parent('li').nextAll('li').find('a').each(function(){
		        	if(jQuery(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
		          		jQuery(this).focus();
		          		found = true;
		          		return false;
		        	}
		      	});
		      
		      	if(!found) {
		        	jQuery(this).parent('li').prevAll('li').find('a').each(function(){
		          		if(jQuery(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
		            		jQuery(this).focus();
		            		return false;
		          		}
		        	});
		      	}
		    }
		});

		// Hide menu if click or focus occurs outside of navigation
		jQuery(this).find('a').last().keydown(function(e){ 
		    if(e.keyCode == 9) {
		      	// If the user tabs out of the navigation hide all menus
		    	jQuery('.'+settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
		    }
		});

		jQuery(document).click(function(){ jQuery('.'+settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1); });
		  
		jQuery(this).click(function(e){
		    e.stopPropagation();
		});
	}

})();
