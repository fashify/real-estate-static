;( function($, w, d, h, b) {
    
	var app = {
        countDownTimer: function () {
            var _this = this;
            
            _this.setupCountDown = function () {
                // Countdown timer container
                var $countdownTimer = $('.aios-thankyou-countdown-timer');
                var $redirectLink = $('.aios-thankyou-link');
                
                if ( ! $countdownTimer.length ) {
                    return false;
                }

                // Set the date we're counting down to
                var countDownDate = new Date();
                countDownDate = new Date( countDownDate.getTime() + 1000 * 7 ); // 5 seconds (always add 2)

                // Update the count down every 1 second
                var x = setInterval(function () {
                    
                    if (!$countdownTimer.is(':visible')) {
                        $countdownTimer.fadeIn();
                    }

                    // Get today's date and time
                    var now = new Date().getTime();

                    // Find the distance between now and the count down date
                    var distance = countDownDate - now;

                    // Time calculations for days, hours, minutes and seconds
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    
                    seconds = seconds > 1 ? seconds + ' seconds' : seconds + ' second';

                    $countdownTimer.find('span').text(seconds);

                    // If the count down is over, write some text 
                    if (parseInt(seconds) < 1) {
                        clearInterval(x);
                        $countdownTimer.html($countdownTimer.data('timer-success'));
                        $redirectLink.fadeIn();
                    }
                }, 1000);
            }
            
            $(w).on('load', function () {
                _this.setupCountDown();
            });
        },
		init: function() {
            this.countDownTimer();
		}
	}
    
	$(document).ready( function() {
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