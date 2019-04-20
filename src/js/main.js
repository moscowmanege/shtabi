$(function() {
	// var buttons = {40: 'down', 38: 'up', 37: 'left', 39: 'right'};

	var swiperV = new Swiper('.swiper-container-v', {
		slidesPerView: 1,
		direction: 'vertical',
		loop: true,
		runCallbacksOnInit: false,
		// touchRatio: 0,
		// keyboardControl: true,
		on: {
			slideChange: function() {
				$('.navigate-block').removeClass('active').eq(this.realIndex).addClass('active');
			}
		}
	});

	var swiperH = new Swiper('.swiper-container-h', {
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

	$(document).on('keydown', function(e) {
		if (e.which == 40) {
			swiperV.slideNext();
		}
	});

});