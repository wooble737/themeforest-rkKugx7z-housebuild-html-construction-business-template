/*jshint jquery:true */
/*global $:true */

var $ = jQuery.noConflict();

$(document).ready(function($) {
	"use strict";

	/* global google: false */
	/*jshint -W018 */

	/*-------------------------------------------------*/
	/* =  portfolio isotope
	/*-------------------------------------------------*/

	var winDow = $(window);
		// Needed variables
		var $container=$('.iso-call');
		var $filter=$('.filter');

		try{
			$container.imagesLoaded( function(){
				$container.trigger('resize');
				$container.isotope({
					filter:'*',
					layoutMode:'masonry',
					animationOptions:{
						duration:750,
						easing:'linear'
					}
				});
			});
		} catch(err) {
		}

		winDow.bind('resize', function(){
			var selector = $filter.find('a.active').attr('data-filter');

			try {
				$container.isotope({ 
					filter	: selector,
					animationOptions: {
						duration: 750,
						easing	: 'linear',
						queue	: false,
					}
				});
			} catch(err) {
			}
			return false;
		});
		
		// Isotope Filter 
		$filter.find('a').click(function(){
			var selector = $(this).attr('data-filter');

			try {
				$container.isotope({ 
					filter	: selector,
					animationOptions: {
						duration: 750,
						easing	: 'linear',
						queue	: false,
					}
				});
			} catch(err) {

			}
			return false;
		});


	var filterItemA	= $('.filter li a');

		filterItemA.on('click', function(){
			var $this = $(this);
			if ( !$this.hasClass('active')) {
				filterItemA.removeClass('active');
				$this.addClass('active');
			}
		});

	/*-------------------------------------------------*/
	/* =  browser detect
	/*-------------------------------------------------*/
	try {
		$.browserSelector();
		// Adds window smooth scroll on chrome.
		if($("html").hasClass("chrome")) {
			$.smoothScroll();
		}
	} catch(err) {

	}

	/*-------------------------------------------------*/
	/* =  Search animation
	/*-------------------------------------------------*/
	
	var searchToggle = $('.open-search'),
		inputAnime = $(".form-search"),
		body = $('body');

	searchToggle.on('click', function(event){
		event.preventDefault();

		if ( !inputAnime.hasClass('active') ) {
			inputAnime.addClass('active');
		} else {
			inputAnime.removeClass('active');			
		}
	});

	body.on('click', function(){
		inputAnime.removeClass('active');
	});

	var elemBinds = $('.open-search, .form-search');
	elemBinds.bind('click', function(e) {
		e.stopPropagation();
	});

	/* ---------------------------------------------------------------------- */
	/*	Accordion
	/* ---------------------------------------------------------------------- */
	var clickElem = $('a.accord-link');

	clickElem.on('click', function(e){
		e.preventDefault();

		var $this = $(this),
			parentCheck = $this.parents('.accord-elem'),
			accordItems = $('.accord-elem'),
			accordContent = $('.accord-content');
			
		if( !parentCheck.hasClass('active')) {

			accordContent.slideUp(400, function(){
				accordItems.removeClass('active');
			});
			parentCheck.find('.accord-content').slideDown(400, function(){
				parentCheck.addClass('active');
			});

		} else {

			accordContent.slideUp(400, function(){
				accordItems.removeClass('active');
			});

		}
	});

	/*-------------------------------------------------*/
	/* =  Animated content
	/*-------------------------------------------------*/

	try {
		/* ================ ANIMATED CONTENT ================ */
        if ($(".animated")[0]) {
            $('.animated').css('opacity', '0');
        }

        $('.triggerAnimation').waypoint(function() {
            var animation = $(this).attr('data-animate');
            $(this).css('opacity', '');
            $(this).addClass("animated " + animation);

        },
                {
                    offset: '75%',
                    triggerOnce: true
                }
        );
	} catch(err) {

	}

	/*-------------------------------------------------*/
	/* =  remove animation in mobile device
	/*-------------------------------------------------*/
	if ( winDow.width() < 992 ) {
		$('div.triggerAnimation').removeClass('animated');
		$('div.triggerAnimation').removeClass('triggerAnimation');
	}

	try {

		var SliderPost = $('.flexslider');

		SliderPost.flexslider({
			slideshowSpeed: 3000,
			easing: "swing"
		});
	} catch(err) {

	}
	
	/*-------------------------------------------------*/
	/* = slider Testimonial
	/*-------------------------------------------------*/

	var slidertestimonial = $('.bxslider');
	try{		
		slidertestimonial.bxSlider({
			mode: 'vertical'
		});
	} catch(err) {
	}

	/* ---------------------------------------------------------------------- */
	/*	Contact Form
	/* ---------------------------------------------------------------------- */

	var submitContact = $('#submit_contact'),
		message = $('#msg');

	submitContact.on('click', function(e){
		e.preventDefault();

		var $this = $(this);
		
		$.ajax({
			type: "POST",
			url: 'contact.php',
			dataType: 'json',
			cache: false,
			data: $('#contact-form').serialize(),
			success: function(data) {

				if(data.info !== 'error'){
					$this.parents('form').find('input[type=text],textarea,select').filter(':visible').val('');
					message.hide().removeClass('success').removeClass('error').addClass('success').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				} else {
					message.hide().removeClass('success').removeClass('error').addClass('error').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				}
			}
		});
	});

	/* ---------------------------------------------------------------------- */
	/*	Header animate after scroll
	/* ---------------------------------------------------------------------- */

	(function() {

		var docElem = document.documentElement,
			didScroll = false,
			changeHeaderOn = 50;
			document.querySelector( 'header' );
		function init() {
			window.addEventListener( 'scroll', function() {
				if( !didScroll ) {
					didScroll = true;
					setTimeout( scrollPage, 100 );
				}
			}, false );
		}
		
		function scrollPage() {
			var sy = scrollY();
			if ( sy >= changeHeaderOn ) {
				$( 'header' ).addClass('active');
			}
			else {
				$( 'header' ).removeClass('active');
			}
			didScroll = false;
		}
		
		function scrollY() {
			return window.pageYOffset || docElem.scrollTop;
		}
		
		init();
		
	})();

	/* ---------------------------------------------------------------------- */
	/*	Image Zoom (Bootstrap modal)
	/* ---------------------------------------------------------------------- */
	$(document).on('click', 'img.zoomable', function(e) {
		// Prevent any parent link navigation
		e.preventDefault();
		e.stopPropagation();

		var $img = $(this);
		var fullSrc = $img.attr('data-full') || $img.attr('src') || '';
		var altText = $img.attr('alt') || '';

		if (!fullSrc) return;

		$('#imageModalImg').attr('src', fullSrc).attr('alt', altText);
		$('#imageModal').modal('show');
	});

	$('#imageModal').on('hidden.bs.modal', function () {
		// Clear to free memory and avoid flashing previous image
		$('#imageModalImg').attr('src', '').attr('alt', '');
	});

});

/* ---------------------------------------------------------------------- */
/*	map street view mode function
/* ---------------------------------------------------------------------- */
function initialize() {
	var bryantPark = new google.maps.LatLng(49.999631, 36.185510); //Change a map street view cordinate here!
	var panoramaOptions = {
		position: bryantPark,
		pov: {
			heading: 165,
			pitch: 0
		},
		zoom: 1
	};
	var myPano = new google.maps.StreetViewPanorama(
		document.getElementById('map'),
		panoramaOptions);
	myPano.setVisible(true);
}

try {
	google.maps.event.addDomListener(window, 'load', initialize);
} catch(err) {

}

	//Quote Form
	var submitQuote = $('#submit-quote'),
		message = $('#quote-msg');

	submitQuote.on('click', function(e){
		e.preventDefault();

		var $this = $(this);
		
		$.ajax({
			type: "POST",
			url: 'quote.php',
			dataType: 'json',
			cache: false,
			data: $('#quote-form').serialize(),
			success: function(data) {

				if(data.info !== 'error'){
					$this.parents('form').find('input[type=text],textarea').filter(':visible').val('');
					$this.parents('form').find('select').filter(':visible');
					message.hide().removeClass('success').removeClass('error').addClass('success').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				} else {
					message.hide().removeClass('success').removeClass('error').addClass('error').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				}
			}
		});
	});

function downloadPDF(fileName) {
    if (!fileName) return;
    // encode filename for URL safety (spaces, non-latin chars)
    var safeFile = encodeURIComponent(fileName) + '.pdf';
    var url = 'upload/projects/' + safeFile;
    var link = document.createElement('a');
    link.href = url;
    link.download = fileName + '.pdf';
    link.target = '_blank';
    // append to DOM so click works in all browsers
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadMagnumPur790() {
    downloadPDF('Eмаль MAGNUM PUR 790');
}

function downloadGruntMagnum015() {
    downloadPDF('Грунт MAGNUM 015');
}

function downloadGruntMagnum015T() {
    downloadPDF('Грунт MAGNUM 015T');
}

function downloadGruntMagnum120WT() {
    downloadPDF('Грунт MAGNUM 120WT');
}
function downloadGruntMagnumEp022() {
    downloadPDF('Грунт MAGNUM EP 022');
}

function downloadGruntMagnumEp022HS() {
    downloadPDF('Грунт MAGNUM EP 022HS');
}

function downloadGruntMagnumEp052() {
    downloadPDF('Грунт MAGNUM EP 052');
}

function downloadGruntMagnum010() {
	downloadPDF('Грунт воднодисперсійний MAGNUM 010');
}

function downloadGruntMagnum011() {
	downloadPDF('Грунт воднодисперсійний MAGNUM 011');
}

function downloadGruntMagnumPur031() {
    downloadPDF('Грунт поліуретановий MAGNUM PUR 031');
}

function downloadGruntEmalMagnum740G35() {
	downloadPDF('Грунт-емаль 2К MAGNUM 740 G35');
}

function downloadGruntEmalMagnum740G70() {
	downloadPDF('Грунт-емаль 2К MAGNUM 740 G70');
}

function downloadGruntEmalMagnum120() {
    downloadPDF('Грунт-емаль MAGNUM 120');
}

function downloadGruntEmalMagnum120W() {
    downloadPDF('Грунт-емаль MAGNUM 120W');
}

function downloadGruntEmalMagnum120WT() {
	downloadPDF('Грунт-емаль MAGNUM 120WT');
}

function downloadGruntEmalMagnumEp770() {
    downloadPDF('Грунт-емаль MAGNUM EP 770');
}

function downloadGruntKvant035() {
	downloadPDF('Грунтовка укривна KVANT-035');
}

function downloadEmalMagnumPUR790() {
	downloadPDF('Емаль MAGNUM PUR 790');
}

function downloadEmalMagnumPur790T() {
    downloadPDF('Емаль MAGNUM  PUR 790T');
}

function downloadEmalMagnum140() {
    downloadPDF('Емаль MAGNUM 140');
}

function downloadEmalMagnum140W() {
    downloadPDF('Емаль MAGNUM 140W');
}

function downloadEmalMagnum760() {
	downloadPDF('Емаль MAGNUM 760');
}

function downloadEmalMagnumMl12() {
    downloadPDF('Емаль MAGNUM ML-12');
}

function downloadLakVodnodispersiyniyMagnum111() {
    downloadPDF('Лак воднодисперсійний MAGNUM 111');
}

function downloadGruntEmalMagnum120W() {
    downloadPDF('грунт-емаль MAGNUM 120W');
}

function downloadGruntEmalMagnum120WT() {
    downloadPDF('грунт-емаль MAGNUM 120WT');
}

function downloadSpetsgruntMagnum007() {
    downloadPDF('спецгрунт MAGNUM 007');
}

function downloadFarbaAkrilatnaKvant125() {
	downloadPDF('фарба акрилатна KVANT-125');
}