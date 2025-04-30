( function() {

	var app = {
		
		initNavigation: function() {
			var $nav = jQuery( '#nav' );
			if ( $nav.length > 0 ) $nav.navTabDoubleTap();
		},
		initFeaturedProperties: function() {
		  var $slides = jQuery('.home-properties-slides');
      
      $slides.slick({
        infinite: true,
        rows: 2,
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              rows: 1,
              slidesToShow: 1,
              slidesToScroll: 1,
            }
          }
        ]
      });
      
      jQuery('.home-properties-prev').on('click', function() {
        $slides.slick('slickPrev');
      });
      
      jQuery('.home-properties-next').on('click', function() {
        $slides.slick('slickNext');
      });
    },
		initFeaturedCommunities: function() {
			/* Put featured communities code here */
		},
		initTestimonials: function() {
      var $slides = jQuery('.home-testimonial-items');
      
      $slides.slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        prevArrow: '<span class="home-testimonial-actions home-testimonial-prev ai-font-arrow-i-p"></span>',
        nextArrow: '<span class="home-testimonial-actions home-testimonial-next ai-font-arrow-i-n"></span>',
        responsive: [
          {
            breakpoint: 992,
            settings: {
              arrows: false
            }
          }
        ]
      });
      
      jQuery('.home-testimonial-prev').on('click', function() {
        $slides.slick('slickPrev');
      });
      
      jQuery('.home-testimonial-next').on('click', function() {
        $slides.slick('slickNext');
      });
		},
		initQuickSearch: function() {
			/* Put quick search code here */
      var $btnOpen = jQuery('.qsearch-button'),
        $btnClose = jQuery('.qsearch-close'),
        $container = jQuery('.slider-qsearch');
      
      $btnOpen.on('click', function() {
        $container.addClass('open');
      });
      
      $btnClose.on('click', function() {
        $container.removeClass('open');
      });
		},
		initFixHeader: function() {
      var $window = jQuery(window),
        $header = jQuery('#site-header'),
        $showFixed = 50;
      
      $window.on('load resize scroll', function() {
        setTimeout(function() {
          var currentScrollPos = $window.scrollTop(),
            currentWindowWid = $window.width();
          
          if (currentWindowWid > 991) {
            if (currentScrollPos > $showFixed) {
              $header.stop(true, true).addClass('onscroll position-fixed fade-in-down');
            } else {
              if ($header.hasClass('onscroll')) {
                $header.stop(true, true).addClass( 'fade-out-up' ).delay(100).queue(function(next) {
                  $(this).removeClass('onscroll position-fixed fade-in-down fade-out-up');
                  next();
                });
              }
            }
          } else {
            $header.stop(true, true).removeClass('onscroll position-fixed fade-in-down');
          }
        }, 30);
      });
    },
    initIhfPaginate: function(){
        if(jQuery('body').hasClass('aios-custom-ihomefinder-shortcode')){
            var url = window.location.href;
            if( jQuery('.listings-pagination').length) {
                jQuery('.listings-pagination li').each(function(){
                    $link = jQuery(this).find('a').attr('href');
                    if ( $link == '#') {
                        /* skip this item */
                    } else {
                        $link = $link.split('?');
                        $new_link = location.origin+location.pathname+'?'+$link[1];
                        jQuery(this).find('a').attr('href', $new_link);
                    }
                })
            }
            jQuery('#ihf-sort-search-form').attr('action', url );
            jQuery('.sort-dropdown form').attr('action', url );
            jQuery('.listings-pagination .active a').removeAttr('href');
            jQuery('.listings-pagination .ellipsis a').removeAttr('href');
        }
    }
		
	}

	
	jQuery(document).ready( function() {
		
		/* Initialize navigation */
		app.initNavigation();
		
		/* Initialize featured properties */
		app.initFeaturedProperties();

		/* Initialize featured communities */
		app.initFeaturedCommunities();
		
		/* Initialize testimonials */
		app.initTestimonials();
		
		/* Initialize quick search */
		app.initQuickSearch();
		
		/* Initialize quick search */
		app.initFixHeader();

    app.initIhfPaginate();
    
    
    AOS.init();

    jQuery('#nav .sub-menu').accessibleNav();
		
	});
	
	jQuery(window).on('load', function(){


	})


})();
