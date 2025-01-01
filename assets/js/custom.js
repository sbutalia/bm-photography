// Custom JavaScript
$(document).ready(function() {
    "use strict";
	
 
    $(window).scroll(function() {
        if ($(this).scrollTop() > 20) {
            $('#gotoTop').fadeIn();
        } else {
            $('#gotoTop').fadeOut();
        }
    });

    // When the user clicks on the button, scroll to the top of the document
    $('#gotoTop').click(function() {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });
    

	// sticky header
	function headerSticky(){
		var windowPos=$(window).scrollTop();
		if( windowPos>20){
			$('.fixed-top').addClass("on-scroll");
			$('.light-nav-on-scroll').addClass("dtr-menu-light").removeClass("dtr-menu-dark");
			$('.dark-nav-on-scroll').addClass("dtr-menu-dark").removeClass("dtr-menu-light");
		} else {
			$('.fixed-top').removeClass("on-scroll");
			$('.light-nav-on-load').addClass("dtr-menu-light").removeClass("dtr-menu-dark");
			$('.dark-nav-on-load').addClass("dtr-menu-dark").removeClass("dtr-menu-light");
		}
	}
	headerSticky();
	$(window).scroll(headerSticky);
	
	// main menu
	$('.main-navigation .sf-menu').superfish({
		delay: 100,                   
		animation: { opacity: 'show', height: 'show' },
		speed: 300,      
	});
	
	// menudropdown auto align      
	var wapoMainWindowWidth = $(window).width();
	$('.sf-menu ul li').mouseover(function(){
		// checks if third level menu exist         
		var subMenuExist = $(this).find('.sub-menu').length;            
		if( subMenuExist > 0){
			var subMenuWidth = $(this).find('.sub-menu').width();
			var subMenuOffset = $(this).find('.sub-menu').parent().offset().left + subMenuWidth;
	
			// if sub menu is off screen, give new position
			if((subMenuOffset + subMenuWidth) > wapoMainWindowWidth){                  
				var newSubMenuPosition = subMenuWidth;
				$(this).find('.sub-menu').css({
					left: -newSubMenuPosition,
					top: '0',
				});
			}
		}
	 }); // menu ends
		 	
	// scrollspy
	$('body').scrollspy({
		offset:	120,
		target:	'.dtr-scrollspy'
	});
	
	// nav scroll	
	if($('#dtr-header-global').length){
		var navoffset = $('#dtr-header-global').height();
		$('.dtr-nav a[href^="#"], .dtr-scroll-link').on("click", function(e) {
			event.preventDefault();  
			$('html, body').animate({
				scrollTop: $($(this).attr('href')).offset().top - navoffset - 37
			}, "slow","easeInSine");
		});
	} else {
		$('.dtr-scroll-link').on("click", function(e) {
			event.preventDefault();  
			$('html, body').animate({
				scrollTop: $($(this).attr('href')).offset().top
			}, "slow","easeInSine");
		});
	}

	// responsive header nav scroll
	var mnavoffset = $('.dtr-responsive-header').height();
	var scroll = new SmoothScroll('.dtr-responsive-header-menu a', {
		speed: 500,
		speedAsDuration: true,
		offset: mnavoffset + 15
	});
		
	// responsive menu
	$('.main-navigation .dtr-nav').slicknav({
		label:"",
		prependTo: '.dtr-responsive-header-menu',
		closedSymbol: '',
		openedSymbol: '',
		allowParentLinks:"true",  
		menuButton: '#dtr-menu-button',
		closeOnClick:true
	});
	// responsive scrollspy
	$('.slicknav_nav').addClass("dtr-scrollspy")
			
	// responsive menu button
	$("#dtr-menu-button").on("click", function(e) { 
		$(".slicknav_nav").slideToggle(); 
	}); 
		
	// responsive menu hamburger
	var $hamburger = $("#dtr-menu-button");
		$hamburger.on("click", function(e) {
		$hamburger.toggleClass("is-active");
	});
	
	// sectionAnchor
	function sectionAnchor() {
	var navoffset = $('#dtr-header-global').height();
		var hash = window.location.hash;
		if (hash != '') {
			setTimeout(function() {
				$('html, body').stop().animate({
					scrollTop: $(hash).offset().top - navoffset - 37
				}, 800, 'easeInSine');
				history.pushState('', document.title, window.location.pathname);
			}, 500);
		}
	} sectionAnchor();
	
	// responsiveAnchor 
	var windowWidth=$(window).width();
	if(windowWidth<992){
		function responsiveAnchor() {
		var mnavoffset = $('.dtr-responsive-header').height();
			var hash = window.location.hash;
			if (hash != '') {
				setTimeout(function() {
					$('html, body').stop().animate({
						scrollTop: $(hash).offset().top - mnavoffset - 15
					}, 800, 'easeInSine');
					history.pushState('', document.title, window.location.pathname);
				}, 500);
			}
		} responsiveAnchor();
	}
	
	// testimonial
	$('.dtr-testimonial-style-center').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		infinite:true,
		autoplay: true,
		autoplaySpeed: 4000,
		fade: true,
		speed: 1000
	});
	
	// testimonial
	$('.dtr-testimonial-style-left').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		infinite:true,
		autoplay: true,
		autoplaySpeed: 4000,
		fade: true,
		speed: 1000
	});
	
	// img slider 3col
	$('.dtr-img-slider-3col').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		infinite:true,
		autoplay: true,
		autoplaySpeed: 4000,
		responsive: [
		{
		  breakpoint: 768,
		  settings: {
			slidesToShow: 2,
			slidesToScroll: 1
		  }
		},
	  ]
	});
	
	// img slider 2col
	$('.dtr-img-slider-2col').slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		infinite:true,
		autoplay: true,
		autoplaySpeed: 4500,
		responsive: [
		{
		  breakpoint: 768,
		  settings: {
			slidesToShow: 2,
			slidesToScroll: 1
		  }
		},
	  ]
	});
	
	// img slider 1col
	$('.dtr-img-slider-1col').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		infinite:true,
		autoplay: true,
		autoplaySpeed: 4500,
		responsive: [
		{
		  breakpoint: 768,
		  settings: {
			slidesToShow: 2,
			slidesToScroll: 1
		  }
		},
	  ]
	});

	// Dynamic Portfolio Grid Generator
	function generatePortfolioGrid(containerId, basePath, numImages, captions = []) {
		const container = document.getElementById(containerId);
		if (!container) return;

		let gridHTML = '<div class="dtr-portfolio-grid dtr-portfolio-grid-4col dtr-portfolio-style-1 dtr-rounded-img clearfix">';
		
		for (let i = 1; i <= numImages; i++) {
			const caption = captions[i-1] || ''; // Get caption if exists, otherwise empty string
			gridHTML += `
				<!-- portfolio item ${i} starts -->
				<div class="dtr-portfolio-item">
					<div class="dtr-portfolio-content">
						<img src="${basePath}/${i}.jpg" alt="Portfolio image ${i}">
						<div class="dtr-portfolio-overlay">
							<a class="media-zoom popup-gallery" href="${basePath}/${i}.jpg" aria-label="Portfolio Image ${i}"></a>
						</div>
						${caption ? `<div class="dtr-portfolio-caption text-center dtr-mt-10">${caption}</div>` : ''}
					</div>
				</div>
				<!-- portfolio item ${i} ends -->
			`;
		}
		
		gridHTML += '</div>';
		container.innerHTML = gridHTML;
		
		// Reinitialize popup gallery if needed
		if ($.fn.magnificPopup) {
			$('.popup-gallery').magnificPopup({
				delegate: 'a',
				type: 'image',
				gallery: {
					enabled: true
				}
			});
		}
	}

	// wow animations
	if( $(window).outerWidth() >= 767 ) {
		new WOW().init({
			mobile: false,
		});
	}
	
	// parallax
	if( $(window).outerWidth() >= 767 ) {	 
		$(".parallax").parallaxie({
			speed: 0.60,
			size: 'auto',
		});
		$(".parallax.parallax-slow").parallaxie({
			speed: 0.30,
		});
	}

	// video popup
	$('.dtr-video-popup').venobox(); 
	
	// Popup video
	$(".popup-video").magnificPopup({
		disableOn: 320,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 150,
		preloader: false,
		fixedContentPos: false
	});

	// Popup image
	$('.popup-image').magnificPopup({
		type: 'image',
	});
	
	// Popup gallery
	$('.popup-gallery').magnificPopup({
		type: 'image',
		mainClass: 'mfp-fade',
		removalDelay: 150,
		gallery: {
			enabled: true
		},
	});

	//Contact form
	$(function () {
		var v = $("#contactform").validate({
			submitHandler: function (form) {
				$(form).ajaxSubmit({
					target: "#result",
					clearForm: true
				});
			}
		});
	});
	//To clear message field on page refresh (you may clear other fields too, just give the 'id to input field' in html and mention it here, as below)
	$('#contactform #message').val('');
	
	//Quote form
	$(function () {
		var v = $("#quoteform").validate({
			submitHandler: function (form) {
				$(form).ajaxSubmit({
					target: "#quote-result",
					clearForm: true
				});
			}
		});
	});
	//To clear message field on page refresh (you may clear other fields too, just give the 'id to input field' in html and mention it here, as below)
	$('#quoteform #message').val('');

	const kidsCaptions = [
		'Rena as Tiger Lily in Peter Pan',
		'Kids Explore Music',
		'The Kids Traveled a Lot This Year',
		'Memorable Vacations',
		'Wave Riders in Action',
		'Rena Turns 10',
		'Manav Plays Soccer',
		'Manav\'s New Hairstyle',
		'Rena\'s New Hairstyle',
		'Manav Wins Chess Tournament',
		'Rena Receives Awards',
		'Their Unbreakable Bond',
		'Rena Learns Piano',
		'Theater Time Together',
		'Manav Learns Tabla'
	];

	const travelsCaptions = [
		'New York',
		'Starry Night',
		'Statue of Liberty',
		'We Got to the Crown!',
		'Atlantic City',
		'Liberty Bell',
		'Rocky!',
		'Rocky Steps',
		'Lincoln Memorial',
		'Ford Theater',
		'Washington Monument',
		'Hawaii',
		'Waikiki Beach',
		'Surfing as a Family',
		'Disneyland!',
		'California Adventure',
		'First Lakers Game',
		'Holi Time',
		'Attacked by a Dinosaur',
		'Attacked by a Shark',
		'Saw a Volcano Erupt!'
	];

	const shaileeSimranCaptions = [
			"Paris: Visited the Eiffel Tower",
			"Shailee got to hold it",
			"Summitted IT!",
			"Saw the Mona Lisa",
			"Missed the Train :(",
			"8 hrs in a overnight bus to catch our flight",
			"Chasing waterfalls together",
			"Aloha from Hawaii",
			"Hawaii was Awesome",
			"Rainbow made our day",
			"Amsterdam",
			"Brussels",
			"Continue to party together",
			"Halloween Horror nights",
			"Disneyland!",
			"Kiddos staring to find us to be fun",
			"Well Hello there ;)",
		  ];
		  

	setTimeout(() => {
		generatePortfolioGrid('kidsPortfolio', 'butaliamoments/2024/z_kids', 15, kidsCaptions);
	}, 0);

	setTimeout(() => {
		generatePortfolioGrid('travelsPortfolio', 'butaliamoments/2024/z_family', 21, travelsCaptions);
	}, 500);

	setTimeout(() => {
		generatePortfolioGrid('shaileeSimranPortfolio', 'butaliamoments/2024/z_shaileeSimran', 17, shaileeSimranCaptions);
	}, 1000);


	const famPhotosCaptions = []
	setTimeout(() => {
		generatePortfolioGrid('familyPhotosPortfolio', 'butaliamoments/2024/z_familyPhotos', 8, famPhotosCaptions);
	}, 1000);
}); // document ready'

// on load
$(window).on('load', function(){ 

	// preloader
	$('.dtr-preloader').delay(400).fadeOut(500);
	
	// portfolio		
	$('.dtr-portfolio-grid').imagesLoaded( function () {
		$('.dtr-portfolio-grid').isotope( 
			{
			itemSelector: '.dtr-portfolio-item',
			masonry: {},
			});
		});
		$('.dtr-filter-nav a').on('click', function () {
			$('.dtr-filter-nav a').removeClass('active');
			$(this).addClass('active');
			var selector = $(this).attr('data-filter');
			$('.dtr-portfolio-grid').isotope({
			filter: selector
		});
		return false;
	});

	

}); // close on load