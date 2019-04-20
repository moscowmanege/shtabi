$(function() {
	// var buttons = {40: 'down', 38: 'up', 37: 'left', 39: 'right'};
	var swipers = [];
	var currentV = 0;

	var swiperV = new Swiper('.swiper-container-v', {
		slidesPerView: 1,
		direction: 'vertical',
		loop: true,
		runCallbacksOnInit: false,
		// touchRatio: 0,
		// keyboardControl: true,
		on: {
			slideChange: function() {
				currentV = this.realIndex;
				$('.navigate-block').removeClass('active').eq(this.realIndex).addClass('active');
			}
		}
	});

	$('.swiper-container-h').toArray().forEach(function(swiper) {
		var swiperH = new Swiper(swiper, {
			slidesPerView: 1,
			direction: 'horizontal',
			// spaceBetween: 30,
			// autoHeight: true,
			// initialSlide: 1,
			// centeredSlides: true,
			// keyboardControl: true,
			loop: true,
			runCallbacksOnInit: false,

			// preloadImages: false,
			// lazyLoading: true,
			// lazyLoadingInPrevNext: true,
			// lazyLoadingInPrevNextAmount: 2,

		});

		swipers.push(swiperH);
	});

	$(document).on('keyup', function(e) {

		if (e.which == 40) {
			swiperV.slideNext();
		}

		if (e.which == 37) {
			swipers[currentV].slidePrev();
		}

		if (e.which == 39) {
			swipers[currentV].slideNext();
		}
	});

});