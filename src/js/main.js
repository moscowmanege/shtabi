$(function() {
	var buttons = {40: 'down', 38: 'up', 37: 'left', 39: 'right'};
	var swipers = [];
	var activeV = 0;
	var key_pressed = false;
	banner_timeout = null;

	var swiperV = new Swiper('.swiper-container-v', {
		slidesPerView: 1,
		direction: 'vertical',
		loop: true,
		runCallbacksOnInit: false,
		// touchRatio: 0,
		// keyboardControl: true,
		on: {
			init: function() {
				$('.swiper-container-h').toArray().forEach(function(swH) {
					var swiperH = new Swiper(swH, {
						slidesPerView: 1,
						direction: 'horizontal',
						spaceBetween: 30,
						// autoHeight: true,
						// initialSlide: 1,
						// centeredSlides: true,
						// keyboardControl: true,
						loop: true,
						runCallbacksOnInit: false,

						preloadImages: false,
						lazy: {
							loadPrevNext: true,
							loadPrevNextAmount: 2
						},
						on: {
							slideChange: function() {
								var $lables = $('.swiper-container-v').find('.labels-block').eq(activeV).find('.label-item');
								$lables.removeClass('active').eq(this.realIndex).addClass('active');
							}
						}
					});

					swipers.push(swiperH);
				});
			},
			slideChange: function() {
				activeV = this.activeIndex;
				$('.navigate-block').removeClass('active').eq(this.realIndex).addClass('active');
				$('.description-block').scrollTop(0);
			}
		}
	});


	$(document).on('keydown', function(e) {
		if (!banner_timeout) return false;

		if (e.which === 38) {
			if (key_pressed == false) {
				var $desc = $('.description-block').eq(activeV);
				$desc.scrollTop($desc.scrollTop() + 300);

				key_pressed = true;
			} else {
				$('.description-block').eq(activeV).filter(':not(:animated)').animate({
					'scrollTop': 0
				}, 300);
			}
		}
	});


	$(document).on('keydown', function(e) {
		$('.banner-button').filter('.' + buttons[e.which]).addClass('active');
	});


	$(document).on('keyup', function(e) {
		$('.banner-button').removeClass('active');
		$('.banner-block').addClass('hidden');

		if (banner_timeout) {
			if (e.which == 38) {
				key_pressed = false;
			}

			if (e.which == 40) {
				swiperV.slideNext();
			}

			if (e.which == 37) {
				swipers[activeV].slidePrev();
			}

			if (e.which == 39) {
				swipers[activeV].slideNext();
			}
		}

		clearTimeout(banner_timeout);
		banner_timeout = setTimeout(function() {
			$('.banner-block').removeClass('hidden');
			banner_timeout = null;
		}, 1000 * 40);
	});


});