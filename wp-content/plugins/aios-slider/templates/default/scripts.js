
;(function ($, w, d, h, b) {
    window.aiosSliderInstances = [];
    var playerInstance = [];
    var app = {
        playCustomVideo: function ($slider, options, splide, $currentSlide) {
            var isAutoplay = options.autoplay;
            var {Autoplay} = splide.Components;
            var type = $currentSlide.attr('data-slide-type');
            var speed = options.speed;
            var slides = splide.Components.Elements.slides;

            if (
                type == 'html5-video' && 
                isAutoplay == true
            ) {
                var $videoContainer = $currentSlide.find('.aios-slider-custom-video');
                var $video = $videoContainer.find('video');
                
                // pause autoplay
                Autoplay.pause();
                splide.autoplayWasPausedByVideo = true;

                var playPromise = $video[0].play();
                playPromise
                    .then(function (e) {
                        // adds is-playing class if successfully plays
                        $slider.addClass('is-playing');
                        $currentSlide.addClass('video-played-once');
                    })
                    .catch(function (e) {
                        // handle click event if autoplay doesn't work due to policies
                        $videoContainer
                            .find('button')[0]
                            .click();

                        // adds is-playing class if successfully plays
                        $slider.addClass('is-playing');
                    });

                // replay video if slides == 1
                if (slides.length === 1) {
                    $video.on('ended', function () {
                        // add transition effect when looping a video
                        $video.fadeOut( speed, function () {
                            $video[0].play();
                            $video.fadeIn( speed );
                        });
                    });
                }
                // proceed next slide after video ended
                else {
                    $video.one('ended', function () {
                        $slider.removeClass('is-playing');
                        splide.go('>');
                    });
                }
            }
        },        
        splide: function () {
            var $sliders = $('.aios-slider.aios-slider-template-default .aios-slider-splide');
            $.each($sliders, function (index, slider) {
                var $slider = $(slider);
                var options = JSON.parse($slider.attr('data-splide'));
                var isAutoplay = options.autoplay;

                var splide = new Splide($slider[0]);
                splide.autoplayWasPausedByVideo = false;

                // pause custom html5 video before move
                splide.on('move', function (newIndex, prevIndex, destIndex) {
                    var slides = splide.Components.Elements.slides;
                    var $prevSlide = $(slides[prevIndex]);
                    var type = $prevSlide.attr('data-slide-type');
                    var $video = $prevSlide.find('video');
                    
                    if (
                        type == 'html5-video' && 
                        $video.length > 0 && 
                        $video[0].paused == false
                    ) {
                        $video[0].pause();
                        $slider.removeClass('is-playing');
                    }
                });

                // resume autoplay after slide move if it was paused by video slide
                splide.on('moved', function (newIndex) {
                    var slides = splide.Components.Elements.slides;
                    var $currentSlide = $(slides[newIndex]);
                    var $video = $currentSlide.find('video');

                    // resume autoplay function
                    if (
                        splide.autoplayWasPausedByVideo == true &&
                        $video.length < 1
                    ) {
                        var {Autoplay} = splide.Components;

                        Autoplay.play();
                        splide.autoplayWasPausedByVideo = false;
                    }
                });
                
                // will stop autoplay if next slide uses video extension
                splide.on('video:play', function (player) {
                    var {Autoplay} = splide.Components;
                    var $currentSlide = $(splide.Components.Elements.slides[splide.index]);
                    var type = $currentSlide.attr('data-slide-type');
                    
                    if (
                        $currentSlide.hasClass('splide__slide--has-video') == true && 
                        Autoplay.isPaused() == false && 
                        isAutoplay == true && 
                        splide.Components.Slides.getLength() > 1
                    ) {
                        Autoplay.pause();
                        splide.autoplayWasPausedByVideo = true;
                    }
                    
                    // add class if video played once
                    $currentSlide.addClass('video-played-once');

                    // for player instance
                    if (!$currentSlide.hasClass('player-initialized')) {
                        $currentSlide.addClass('player-initialized');

                        // for youtube
                        if (type == 'youtube') {
                            playerInstance[splide.index] = player.player.player;
                        }

                        // for vimeo
                        if (type == 'vimeo') {
                            playerInstance[splide.index] = new Vimeo.Player($currentSlide.find('.splide__video iframe')[0]);
                        }
                    }
                });

                // video ended go to next slide if autoplay is true
                splide.on('video:ended', function (player) {
                    var $currentSlide = $(splide.Components.Elements.slides[splide.index]);

                    // go to next slide after video plays/ends
                    if (
                        isAutoplay == true && 
                        splide.Components.Slides.getLength() > 1
                    ) {
                        splide.go('>');
                    }
                    
                    // resume autoplay if avaible
                    if (splide.autoplayWasPausedByVideo == true) {
                        var {Autoplay} = splide.Components;

                        Autoplay.play();
                        splide.autoplayWasPausedByVideo = false;
                    }

                    // set play button to visible after video ended if autoplay is disabled
                    if (
                        isAutoplay == false &&
                        typeof player == 'object' &&
                        typeof player.slide == 'object' &&
                        $(player.slide).find('.splide__video__play').is(':visible') == false
                    ) {
                        $(player.slide).find('.splide__video__play').show();
                    }
                });

                splide.on('mounted', function () {
                    var {Autoplay} = splide.Components;
                    var $currentSlide = $(splide.Components.Elements.slides[splide.index]);

                    // video element poster
                    setTimeout(function () {
                        $.each(splide.Components.Elements.slides, function (i, v) {
                            var $slide = $(v);

                            if ($slide.hasClass('splide__slide--has-video')) {
                                var $target = $slide.find('.splide__video__wrapper div video');
                                $target.prop('poster', $slide.attr('data-splide-poster'));
                            }
                        });

                        // remove video play on splide click
                        if ($slider.hasClass('autoplay-enable')) {
                            $slider.find('.splide__video, .aios-slider-img, .aios-slider-tagline, .aios-slider-volume').on('click.onVideoClick click', function (e) {
                                e.stopImmediatePropagation();
                            });
                        }
                    }, 200);
                });

                // for tagline animation and video functions
                splide.on('mounted moved', function () {
                    var $currentSlide = $(splide.Components.Elements.slides[splide.index]);
                    var type = $currentSlide.attr('data-slide-type');
                    var slides = splide.Components.Elements.slides;
                    var index = $currentSlide.attr('data-slide-number');

                    $slider
                        .find('.splide__slide')
                        .not($currentSlide)
                        .find('.aios-slider-tagline')
                        .removeClass('tagline-active');

                    // for tagline
                    $currentSlide
                        .find('.aios-slider-tagline')
                        .addClass('tagline-active');

                    // video on load
                    if (
                        $slider.hasClass('video-on-load') && 
                        !$currentSlide.hasClass('video-played-once')
                    ) {
                        var $currentVideo = $currentSlide.find('video');
                        var $newVideo = $(`
                            <video preload="none" poster="${$currentVideo.attr('data-poster')}" muted playsinline>
                                <source src="${$currentVideo.attr('data-src')}" type="video/mp4">
                            </video>
                        `);

                        if (index === '1') {
                            // remove old video, prepend new video 
                            // then play on users scroll/mousemove/touchmove
                            $(w).one('scroll mousemove touchmove', function() {
                                // old
                                $currentVideo.remove();
    
                                // new
                                $newVideo
                                    .prependTo($currentSlide.find('.aios-slider-custom-video'))
                                    .hide()
                                    .fadeIn();
    
                                // html5 video autoplay
                                app.playCustomVideo($slider, options, splide, $currentSlide);
                            });
                        }
                        else {
                            // old
                            $currentVideo.remove();

                            // new
                            $newVideo
                                .prependTo($currentSlide.find('.aios-slider-custom-video'))
                                .hide()
                                .fadeIn();

                            // html5 video autoplay
                            app.playCustomVideo($slider, options, splide, $currentSlide);
                        }
                    }
                    else {
                        // html5 video autoplay
                        app.playCustomVideo($slider, options, splide, $currentSlide);
                    }
                });

                // mount splide with extensions
                splide.mount(w.splide.Extensions || null);

                // refresh splide if type == loop
                if (options.type == 'loop') splide.refresh();
                
                // add splide instance on global variables so that it can be easily access outside plugin
                window.aiosSliderInstances[$slider.closest('.aios-slider').attr('id')] = splide;
            });
        },
        video: function () {
            // custom html5 video button
            var $targets = $('.aios-slider.aios-slider-template-default .aios-slider-custom-video button, .aios-slider.aios-slider-template-default .aios-slider-custom-video video');
            $targets.on('click', function (e) {
                var $this = $(this);
                var $parent = $this.closest('.aios-slider-custom-video');
                var $splide = $this.closest('.aios-slider .splide');
                var $button = $parent.find('button');
                var $video = $parent.find('video');

                // clicked on button
                if ($this.prop('tagName') == 'BUTTON') {
                    $video[0].play();
                    $splide.addClass('is-playing');
                }
                
                // clicked on video
                if ($this.prop('tagName') == 'VIDEO') {
                    // play 
                    if ($video[0].paused == true) {
                        $video[0].play();
                        $splide.addClass('is-playing');
                    }
                    // pause
                    else {
                        $video[0].pause();
                        $splide.removeClass('is-playing');
                    }
                }
            });

            // volume
            $('.aios-slider.aios-slider-template-default .aios-slider-volume').on('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                var $this = $(this);
                var $parent = $this.closest('.splide__slide');
                var type = $parent.attr('data-slide-type');
                var index = $parent.attr('data-slide-number');
                var player = playerInstance[index - 1];
                var $video = '';

                if (type == 'html5-video') {
                    $video = $parent.find('.aios-slider-custom-video'); 
                }
                else {
                    $video = $this.next('.splide__video');
                }

                var fnIconChange = function (icon) {
                    if (icon == 'on') {
                        $this
                            .addClass('volume-on')
                            .find('.ai-font-mute')
                            .addClass('ai-font-volume-a')
                            .removeClass('ai-font-mute');
                    }

                    if (icon == 'off') {
                        $this
                            .removeClass('volume-on')
                            .find('.ai-font-volume-a')
                            .addClass('ai-font-mute')
                            .removeClass('ai-font-volume-a');
                    }
                }

                if ($this.hasClass('volume-on')) {
                    // youtube player 
                    if (type == 'youtube') {
                        player.mute();
                    }

                    // vimeo player
                    if (type == 'vimeo') {
                        player.setVolume(0);
                    }

                    // html5 player
                    if (type == 'html5-video') {
                        $video.find('video')[0].muted = true;
                    }

                    fnIconChange('off');
                }
                else {
                    // youtube player 
                    if (type == 'youtube') {
                        player.unMute();
                    }

                    // vimeo player
                    if (type == 'vimeo') {
                        player.setVolume(1);
                    }

                    // html5 player
                    if (type == 'html5-video') {
                        $video.find('video')[0].muted = false;
                    }

                    fnIconChange('on');
                }
            });
        },
        init: function () {
            this.splide();
            this.video();
        }
    }
    
    $(d).on('DOMContentLoaded', function () {
        app.init();
    });
})(jQuery, window, document, 'html', 'body');