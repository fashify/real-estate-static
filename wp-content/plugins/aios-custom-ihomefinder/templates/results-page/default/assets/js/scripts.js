(function ($, w, d, h, b) {

    var app = {
        lazyLoad: {
            imageChecker: function ($image) {
                var $mainSrc = $image.attr('data-lazy');
                var $errorSrc = $image.attr('data-error');
                var $fakeImage = $('<img />', {
                    src: $mainSrc
                });

                $fakeImage.on({
                    load: function () {
                        $image
                            .attr('src', $mainSrc)
                            .animate({
                                opacity: 1,
                            })
                            .addClass('lazy-loaded')
                            .parent()
                            .addClass('hide-loader');
                    },
                    error: function () {
                        $image
                            .attr('src', $errorSrc)
                            .animate({
                                opacity: 1,
                            })
                            .addClass('lazy-error')
                            .parent()
                            .addClass('hide-loader');
                    }
                });
            },
            init: function () {
                var $html = $(h);
                var isMobile = w.matchMedia('(max-width: 991px)').matches;
                var lazyLoad = app.lazyLoad;

                if ($html.hasClass('mobile') || isMobile) {
                    $lazyImages = $('#listings-results img[data-lazy]');
                    $.each($lazyImages, function (i, image) {
                        var $image = $(image);
                        lazyLoad.imageChecker($image);
                    });
                }
                else {
                    $(d).on('aos:in', function ({detail}) {
                        var $detail = $(detail);
                        var $image = $detail.find('img[data-lazy]').not('lazy-loaded');

                        if ($image.length != 0) {
                            lazyLoad.imageChecker($image);
                        }
                    });
                }
            },
        },
        aosAnimation: function () {
            if (typeof AOS == 'undefined') {
                console.error('Please enqueue AOS library on AIOS Initial Setup');
                return;
            }
            
            AOS.init({
                disable: 'mobile',
                once: true,
                duration: 500,
                easing: 'ease-in-out'
            });
        },
        sortControls: function () {
            $('.listings-sort [data-ihf-sort-value]').on('click', function () {
                var $this = $(this);
                var value = $this.data('ihf-sort-value');
                var $parent = $this.closest('.listings-wrap');
                var $form = $parent.find('#ihf-sort-search-form');

                $form.find('input[name="sortBy"]').val(value);
                $form.submit();
            });
        },
        sortToggler: function () {
            $('[data-sort-view-control]').on('click', function () {
                var $this = $(this);
                var control = $this.data('sort-view-control');
                var $parent = $this.closest('.listings-wrap');
                var $target = $parent.find('[data-sort-view-content="' + control + '"]');

                if (!$target.hasClass('active')) {
                    $parent.find('[data-sort-view-control]').not($this).removeClass('active');
                    $this.addClass('active');

                    $parent.find('[data-sort-view-content]').not($target).removeClass('active').hide();
                    $target.addClass('active').hide().fadeIn();
                }
            });
        },
        sortDropdown: function () {
            var $target = $('[data-dropdown]');
            
            $target.on('click', function (e) {
                e.preventDefault();
                
                var $this = $(this);
                var $parent = $this.parent();
                
                $target.parent().not($parent).removeClass('open');
                $parent.toggleClass('open');
            });
            
            $(document).on('mouseup', function (e) {
                var $target = $('[data-dropdown]').parent();
                
                if (!$target.is(e.target) && $target.has(e.target).length === 0) {
                    $target.removeClass('open');
                }
            });
        },
        mediaLinks: function () {
            $('#listings-results [data-media]').on('click', function (e) {
                e.stopImmediatePropagation();
                e.preventDefault();

                var $this = $(this);
                var type = $this.data('media');
                var target = $this.data('target');

                if (type == 'virtual-tour') {
                    window.open(target);
                }

                if (type == 'photos') {
                    var boardID = $this.data('board');

                    if (boardID) {
                        var url = window.location.origin + '/wp-admin/admin-ajax.php?action=ihf_photo_tour&listingNumber=' + target + '&boardID=' + boardID;
                        var proxy = $this.data('proxy');

                        $.ajax({
                            url: url,
                            type: "GET",
                            success: function (b) {
                                var imgList = [];
                                $(b).find('img').each(function (i, v) {
                                    imgList[i] = {
                                        src: proxy + $(v).data('ihf-main-source'),   
                                    }
                                });
                                
                                var $aiosPopup = $.aiosPopup;

                                $aiosPopup.open({
                                    items: imgList,
                                    type: 'image',
                                    tLoading: 'Loading image #%curr%...',
                                    mainClass: 'aios-img-mobile',
                                    fixedContentPos: true,
                                    fixedBgPos: true,
                                    gallery: {
                                        enabled: true,
                                        navigateByImgClick: true,
                                        preload: [0,1] 
                                    },
                                    image: { tError: '<a href="%url%">The image #%curr%</a> could not be loaded.' }
                                }, 0);
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });
                    }
                }
            });
        },
        init: function () {
            this.lazyLoad.init();
            this.aosAnimation();
            this.sortControls();
            this.sortToggler();
            this.sortDropdown();
            this.mediaLinks();
        }
    }

    $(document).ready(function () {
        /* Initialize all app functions */
        app.init();
    });

    /** 
     *
     * Please do add your custom script functions similar to the current file structure.
     * You may also add your uncategorized script functions inside the `app.others` function.
     *
     */
})(jQuery, window, document, 'html', 'body');
