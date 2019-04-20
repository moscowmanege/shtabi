$(function() {
	// var buttons = {40: 'down', 38: 'up', 37: 'left', 39: 'right'};
	var swipers = [];
	var activeV = 0;

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
			}
		}
	});

	$(document).on('keyup', function(e) {

		if (e.which == 40) {
			swiperV.slideNext();
		}

		if (e.which == 37) {
			swipers[activeV].slidePrev();
		}

		if (e.which == 39) {
			swipers[activeV].slideNext();
		}
	});

});