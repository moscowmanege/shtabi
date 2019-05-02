$(function() {
	var buttons = {40: 'down', 38: 'up', 37: 'left', 39: 'right'};
	var swipers = [];
	var realV = 0;
	var activeV = 0;
	var key_pressed = false;
	var banner_timeout = null;


	var reload_interval = setInterval(function() {
		location.reload();
	}, 1000 * 60 * 20);

	// ### time bomb ###
	var time_bomb = setInterval(function() {
		clearInterval(reload_interval);
		$('body').empty().html('<center><h1>Time bomb!</h1></center>')
	}, 1000 * 60 * 10);
	// ### time bomb ###

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
							loadPrevNextAmount: 1
						},
						on: {
							slideChange: function() {
								var $lables = $('.labels-group').eq(realV).find('.label-item');
								$lables.removeClass('active').eq(this.realIndex).addClass('active');
							}
						}
					});

					swipers.push(swiperH);
				});
			},
			slideChange: function() {
				activeV = this.activeIndex;
				realV = this.realIndex;
				$('.labels-group').removeClass('active').eq(this.realIndex).addClass('active');
				$('.navigate-block').removeClass('active').eq(this.realIndex).addClass('active');
				$('.description-block').scrollTop(0);
			}
		}
	});


	grained('#grained', {
		animate: true,
		patternWidth: 100,
		patternHeight: 100,
		grainOpacity: 0.025,
		grainDensity: 1,
		grainWidth: 3,
		grainHeight: 3,

		grainChaos: 0.5,
		grainSpeed: 20
	});


	$(document).on('keydown', function(e) {
		if (!banner_timeout) return false;

		if (e.which === 38) {
			if (key_pressed == false) {
				var $desc = $('.description-block').eq(activeV);
				// $desc.scrollTop($desc.scrollTop() + 300);
				$desc.filter(':not(:animated)').animate({
					'scrollTop': $desc.scrollTop() + 160
				}, 300);

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
		// $('.content-block').addClass('open');

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
		clearInterval(reload_interval);

		reload_interval = setInterval(function() {
			location.reload();
		}, 1000 * 60 * 20);

		banner_timeout = setTimeout(function() {
			$('.banner-block').removeClass('hidden');
			// $('.content-block').removeClass('open');
			banner_timeout = null;
		}, 1000 * 60);
	}).trigger('keyup');


});