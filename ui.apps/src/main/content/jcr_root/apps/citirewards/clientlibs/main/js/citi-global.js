/* Jquery-UI selectmenu placeholder */
$.widget( 'app.selectmenu', $.ui.selectmenu, {
    _drawButton: function() {"use strict";
        this._super();
        
        var selected = this.element
                .find( '[selected]' )
                .length,
            placeholder = this.options.placeholder;
        
        if ( !selected && placeholder ) {
            this.buttonText.text( placeholder );    
        }
    }
});
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 */
(function(e) {
	"use strict";

	function t(e) {
		return new RegExp("(^|\\s+)" + e + "(\\s+|$)");
	}

	function s(e, t) {
		var s = n(e, t) ? i : r;
		s(e, t);
	}
	var n, r, i;
	if ("classList" in document.documentElement) {
		n = function(e, t) {
			return e.classList.contains(t);
		};
		r = function(e, t) {
			e.classList.add(t);
		};
		i = function(e, t) {
			e.classList.remove(t);
		};
	} else {
		n = function(e, n) {
			return t(n).test(e.className);
		};
		r = function(e, t) {
			if (!n(e, t)) {
				e.className = e.className + " " + t;
			}
		};
		i = function(e, n) {
			e.className = e.className.replace(t(n), " ");
		};
	}
	var o = {
		hasClass: n,
		addClass: r,
		removeClass: i,
		toggleClass: s,
		has: n,
		add: r,
		remove: i,
		toggle: s
	};
	if (typeof define === "function" && define.amd) {
		define(o);
	} else {
		e.classie = o;
	}
})(window);

(function() {
	'use strict';

	var Keyboard = {
		ENTER: 13,
		TAB: 9,
		ESCAPE: 27,
		SPACE: 32,
		LEFT: 37,
		RIGHT: 39
	};
	var mobileMenuInstantiated = false;
	var desktopMenuInstantiated = false;
	var windowWidth = window.innerWidth || $(window).width();
	var openedSubNav;
	var searchOpen = false;
	var isResizing = false;
	var resizingTimeout;
	var $searchIcon = $('#desktop-header-search .control i, #mobile-header-search .control i');

	function init() {
		$(window).bind('resize', function() {
			isResizing = true;
			windowWidth = window.innerWidth || $(window).width();

			if (windowWidth < 960 && !mobileMenuInstantiated) {
				initMobile();
			}
			if (windowWidth >= 960 && !desktopMenuInstantiated) {
				initDesktop();
			}

			if ($("#header-desktop").css("display") === "block" && $(".oc-container").hasClass("oc-push")) {
				$('#menu-button').click();
			}
			
			if(resizingTimeout) {
				clearTimeout(resizingTimeout);
			}
			resizingTimeout = setTimeout(function(){
				isResizing = false;
			}, 2000);
			
		}).trigger('resize');
		setupMenus();
		setupMobileTabletSearch();
		setupAccountNameOverflow();
	}


	function setupMenus() {
		if (windowWidth < 960) {
			initMobile();
		} else {
			initDesktop();
		}
	}


	function initMobile() {
		setupMobileMenu();
		$('body').removeClass('init');
		mobileMenuInstantiated = true;
	}

	function initDesktop() {
		$('body').addClass('init');
		setupDesktopMenu();
		desktopMenuInstantiated = true;
	}


	function setupDesktopMenu() {
		$('.megamenu').accessibleMegaMenu();
		// hack so that the megamenu doesn't show flash of css animation after the page loads.
		$('body').removeClass('init');

	}


	// Enables hamburger off screen sliding menu && mobile sub menus

	function setupMobileMenu() {

		$('.mobile-subnav-control').bind('click', function(e) {
			var $this = $(this);
			var $subnav = $('#' + $this.attr('aria-controls'));

			openSubNav($subnav, $this);

			$subnav.find('.sub-nav-back').bind('click touchend', function(e) {
				closeSubNav($subnav, $this);
				$(this).unbind('click');
				setTimeout(function() {
					$('#mobile-menu a:visible:first').focus();
				}, 25);
				e.preventDefault();
				return false;
			});

			e.preventDefault();
			return false;
		});

        /**
         * Triggers close search and removes padding top when
         * browser is resized to larger than tablet 960px
         *
         * Conditions: If the browser width is larger than tablet,
         * and search bar is opened (true state set in openSearch())
         */
		$(window).bind('resize', function() {

            if (windowWidth > 960 && searchOpen) {
				closeSearch();
			}
		});
		initMenu();
	}

	// Opens sub nav in mobile view (i.e. merchandise, cash rewards, my account etc)

	function openSubNav(subnav, subnavTitle) {
		subnav.attr('aria-expanded', true).attr('aria-hidden', false).addClass('opened');
		subnavTitle.attr('aria-expanded', true);
		subnavTitle.addClass('sub-menu-opened').attr('aria-hidden', true);
		openedSubNav = subnavTitle;

		setTimeout(function() {
			$('#mobile-menu > ol > li > a').not('.sub-menu-opened').parent().each(function(i, elem) {
				$(elem).attr('aria-hidden', true);
			});
			$('#oc-trigger').attr('aria-hidden', true);
			$('.sub-nav-back:visible:first').focus();
		}, 25);
	}

	// Closes sub navs in mobile view

	function closeSubNav(subnav, subnavTitle) {
		subnav.removeClass('opened').attr('aria-expanded', false).attr('aria-hidden', true);
		subnavTitle.attr('aria-expanded', true).blur();
		$('#mobile-menu > ol > li > a').not('.sub-menu-opened').parent().each(function(i, elem) {
			$(elem).removeAttr('aria-hidden');
		});
		$('#oc-trigger').removeAttr('aria-hidden');

		subnavTitle.removeClass('sub-menu-opened').attr('aria-hidden', false);
		setTimeout(function() {
			openedSubNav.focus();
		}, 50);
	}



	// Enables click toggle of showing/hiding search input for mobile/tablet

	function setupMobileTabletSearch() {

        var searchForm = $('#desktop-search-form, #mobile-search-form');

		$("#desktop-header-search a, #mobile-header-search a").on('click', function() {
			
			if (windowWidth < 1260) {
				if ($searchIcon.hasClass('hide-search')) {
					openSearch();
				} else {
					closeSearch();
				}
			} else {
				closeSearch();
			}
		});
		$(window).bind('resize', function(){

			if(windowWidth >= 1260) {
				$('#desktop-search-form').attr('aria-hidden', false);

                /**
                 * If the search form is opened from mobile view,
                 * and the browser is resized to desktop view,
                 * close the opened search form.
                 */
                if ( searchForm.hasClass("opened") ){
                    return searchForm.removeClass("opened");
                }
			} else {
				$('#desktop-search-form').attr('aria-hidden', true);
			}
		}).trigger('resize');
	}

	// closes search in mobile/tablet view

	function openSearch() {
		$searchIcon.removeClass('hide-search');
		searchOpen = true;
		$searchIcon.removeClass('icon_search').addClass('icon_x close-search');
		
		if(windowWidth < 960) {
			var height = $('#search-mobile').height()+25;
			$('main.oc-content').css({
				'padding-top':height+'px'
			});
		}
		
		$('#mobile-header-account-info').addClass('search-open');
		$('#mobile-account-menu-logged-out').addClass('search-open');
		$('#desktop-header-search a, #desktop-header-search, #mobile-header-search a, #mobile-header-search').addClass('opened');
		$('#desktop-search-form, #mobile-search-form').addClass('opened');
		$('#desktop-search-form, #mobile-search-form').attr('aria-hidden', 'false');
		$('#desktop-search-form input, #mobile-header-search input').focus();
		setTimeout(function() {
			$('#desktop-search-form input, #mobile-header-search input').focus();
		}, 50);
		
		$("#mobile-header-search input").css({'padding':'0', 'margin-left':'10px'});
	}

	// opens search in mobile/tablet view
	function closeSearch() {
		
		searchOpen = false;
		$("#mobile-header-search input").css({'padding':'13px 16px 12px 10px', 'margin-left':'0'});
		$searchIcon.addClass('hide-search');
		$searchIcon.removeClass('icon_x').addClass('icon_search');
		$('#desktop-header-search a, #mobile-header-search a').removeClass('opened');
		$('#mobile-header-account-info').removeClass('search-open');
		$('#mobile-account-menu-logged-out').removeClass('search-open');
		$('main.oc-content').css({
		  'padding-top':0
		});
		$('#desktop-search-form, #mobile-search-form').removeClass('opened');
		$('#desktop-header-search input, #mobile-header-search input').blur();
		$('#desktop-header-search a, #mobile-header-search a').blur();
		$('#desktop-search-form, #mobile-search-form').attr('aria-hidden', 'true');
		$('#desktop-search-form input, #mobile-header-search input').unbind('blur');
		$(window).unbind('keyup');
		
	}


	// Initializes the off-canvas hamburger menu

	function initMenu() {

		var $menu = $('#mobile-menu');
		var $menuTrigger = $('#oc-trigger');
		var $trigger = $('#menu-button');
		var isOpen = false;

		$('#mobile-menu > ol > li').not('.activated').remove();

		$trigger.attr('aria-expanded', 'false');
		$trigger.attr('aria-label', 'Menu');
		$trigger.attr('aria-controls', 'menu');

		$menu.attr('aria-hidden', 'true');
		$menu.attr('aria-labelledby', 'menu-button');

		var $container = $('#oc-container');


		function resetMenu() {
			$menuTrigger.find('> a, > div').not('#menu-button').removeAttr('aria-hidden');
			$trigger.attr('aria-expanded', 'false');
			$menu.attr('aria-hidden', 'true');
			$menu.find('a').attr('aria-hidden','true');
			$container.removeClass('oc-menu-open');
			$container.removeClass('oc-push');
			isOpen = false;
			$trigger.removeClass('opened');
			$trigger.attr('aria-expanded', 'false');
			$menu.attr('aria-hidden', 'true');
			$menu.attr('aria-expanded', 'false');
			$('#menu-button').blur();
			$('.oc-content').removeAttr('aria-hidden');
			$trigger.attr('aria-label', 'Menu');
		}

		function bodyClickFn() {
			if (isOpen) {
				resetMenu();
			}
		}


		$('#mobile-menu a:last').bind('blur', function() {
			$trigger.focus();
		});
		$trigger.bind('blur', function() {
			if ($('.oc-menu-open').length > 0) {
				$('#mobile-menu a:first').focus();
			}
		});

		$('#menu-button').bind('click touchstart', function(ev) {
			if (isOpen) {
				resetMenu();
				return false;
			}
			isOpen = true;
			$menuTrigger.find('> a, > div').not('#menu-button').attr('aria-hidden',true);
			ev.stopPropagation();
			ev.preventDefault();

			$trigger.attr('aria-label', 'Close Menu');
			$trigger.addClass('opened');
			$trigger.attr('aria-expanded', 'true');
			$menu.removeAttr('aria-hidden');
			$menu.find('a').attr('aria-hidden','false');
			$menu.attr('aria-expanded', 'true');
			$('.oc-content').attr('aria-hidden', true);
			setTimeout(function() {
				$('#mobile-menu a:visible:first').focus();
			}, 25);

			$container.addClass('oc-container'); // clear
			$container.addClass('oc-push');
			$container.addClass('oc-menu-open');

			$('.oc-content').bind('click touchstart', bodyClickFn);
		});


		// Handle 'esc' event
		// Keyboard Tweaks via Scott Vinkle
		var escapeMenu = function(ev) {
			if (ev.which === Keyboard.ESCAPE) {
				ev.stopPropagation();
				ev.preventDefault();
				resetMenu();
				$trigger.focus();
			}
		};

		$trigger.bind('keydown', function(ev) {
			escapeMenu(ev);
		});

		$menu.bind('keydown', function(ev) {
			escapeMenu(ev);
		});
	}

	function setupAccountNameOverflow() {
		
		// Desktop name
		var height = '30px';
		var $name = $('#account-menu-logged-in .greeting');
		var $points = $('#account-menu-logged-in .points');
		var $parent = $('#account-menu-logged-in > a');
		if ($name.length <= 0) {
			return false;
		}

		$name.bind('change', function() {
			console.log($name.text().length);
		});
		var len = $name.text().length;
		//var initDDD = false;

		var elem = $name.get(0);
		//if text is overflowing container
		if(len < 36 ) {
			$name.css({
				'font-size':'13px'
			});
			$points.css({
				'font-size':'13px'
			});
		}
		if (elem.offsetWidth < elem.scrollWidth) {
		
			
			if ( len >= 37 && len < 86) {
				$name.css({
					'height': 'auto',
					'padding-right': '7px',
					'white-space': 'normal',
					'word-break': 'break-word'
				});
				$parent.css({
					'padding': '6px 10px 3px 10px'
				});
				$points.css({
					'font-size': '11px'
				});

			} 
			//two lines needs dotdotdot
			if (len >= 86) {

				$parent.css({
					'padding': '5px 10px'
				});
				$name.css({
					'height': '25px',
					'font-size': '9px',
					'padding-right': '7px'
				});

				$name.dotdotdot();
				$('#account-menu-logged-in').hover(
					function() {
						$name.css({
							'height': 'auto',
							'margin-bottom': '10px',
							'font-size': '11px'
						});
						//$name.trigger('originalContent');
						$name.trigger("originalContent", function(content) {
							$name.empty().append(content);
						});
					},
					function() {
						$name.css({
							'height': height
						});
						$name.dotdotdot();
					}
				);
			}

		}
		
		// Mobile name
		var $mobileGreeting = $('#mobile-header-account-info .greeting');
		if($mobileGreeting.length > 0 && $mobileGreeting.text().length > 64) {
			$mobileGreeting.css({
				height:'40px',
				'word-wrap':'break-word'
			});
			$mobileGreeting.dotdotdot({
				watch:true
			});
		}

	}
	
	
	// Global carousel options
  window.CitiCarousel = function($elem, settings){
		var _hasInited = false;
		var _carousel = $elem;
	  	var _nextArrow = '<button class="next-arrow" aria-label="Next Items"><label>Next Items</label><i class="icon icon_next-arrow"></button>';
		var _prevArrow = '<button class="prev-arrow" aria-label="Previous Items"><label>Previous Items</label><i class="icon icon_prev-arrow"></button>';
		var slickSettings = {
			dots:true,
			customPaging: function(slider, i) { 
	            if(i === 0){
	                return '<a href="#" role="button"><span>Page '+parseInt(i+1)+' of '+Math.ceil(slider.slideCount/slider.options.slidesToShow)+' Selected</span></a>';
	            } else {
	                return '<a href="#" role="button"><span>Page '+parseInt(i+1)+' of '+Math.ceil(slider.slideCount/slider.options.slidesToShow)+'</span></a>';
	            }
	      },
			adaptiveHeight: true,
			accessibility: false,
			nextArrow:_nextArrow,
			prevArrow:_prevArrow,
			rows:1,
			swipe:true,
			touchMove:true,
			mobileFirst:true,
			slidesToShow:2,
			slidesToScroll:2,
			responsive:[
				{
					breakpoint:768,
					settings:{
						slidesToShow:4,
						slidesToScroll:4
					}
				}
			]
		};
		

		var _settings = $.extend({}, slickSettings, settings);
		//console.dir(_settings);
		
		function _refresh() {
			console.log('refreshing');
			_carousel.slick('slickFilter', '.activated');
		}

		function _init(){
			/*jshint unused:false */
			_carousel.on('afterChange', function(event, slick, currentSlide) {
				
				//_carousel.find('a').removeAttr('aria-hidden');
				setTimeout(function(){
					if(isResizing === false) {
						_carousel.find('.slick-slide').each(function(i, elem){
							if($(elem).hasClass('slick-active')) {
								$(elem).removeAttr('tabindex');
								
							} else {
								$(elem).attr('tabindex',-1);
							}
							_carousel.find('.slick-slide.slick-active:visible:first').focus();
						});
						_updateAriaAttributes();
					}
					
				}, 100);
				_carousel.find('.slick-dots li').removeAttr('aria-hidden');
				
				_carousel.find(".slick-dots a").each(function() {
					var word = $(this).find('span').html().replace('Selected','');
					$(this).find('span').html(word);
				});
				
				_carousel.find(".slick-dots li").each(function() {
					if($(this).hasClass('slick-active')){
						var word = $(this).find('a span:first-child').html() + " Selected";
						$(this).find('a span:first-child').html(word);
					}
				});
			});
		
			_carousel.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
				_carousel.find('.slick-dots a').blur();
				_carousel.find('.slick-dots li').removeAttr('aria-hidden');
			});
		
			_carousel.on('init', function(event, slick) {
			  
				setTimeout(function(){
					_carousel.find('.slick-list').removeAttr('tabindex');
				  	_carousel.slick('slickFilter', '.activated');
					_carousel.find('.slick-dots a').bind('click', function(e){
						$('.slick-dots li').removeAttr('aria-hidden');
					
						_carousel.find(".slick-dots a").each(function() {
							var word = $(this).find('span').html().replace('Selected','');
							$(this).find('span').html(word);
						});
						
						var word = $(this).children('span').html() + " Selected";
						$(this).children('span').html(word);
					
					});
					
					_carousel.find('.slick-dots li').removeAttr('aria-hidden');
				
					_carousel.find('.slick-slide').each(function(i, elem){
						if($(elem).hasClass('slick-active')) {
							$(elem).removeAttr('tabindex');
						} else {
							$(elem).attr('tabindex',-1);
						}
					});
					_updateAriaAttributes();
				}, 100);
			});
			
			_carousel = _carousel.slick(_settings);
		
			$('.slick-dots li').removeAttr('aria-hidden');
			_hasInited = true;
		}
		
		// Sets up carousel for shopping section on mobile
		function _setupShopCarousel(){
			//remove any carousel item that isn't visible to prevent slick carousel from showing it
			
			if($('#shop-carousel').length){
				$('#shop-carousel > a').each(function(i, elem){
					if($(elem).css('display') === 'none') {
						$(elem).remove();
					}
				});
			}
		}
	
		function _setupCardsCarousel(){
			//remove hidden cards
			if($('#cards-carousel').length){
				$('#cards-carousel > a').each(function(i, elem){
					if($(elem).css('display') === 'none') {
						$(elem).remove();
					}
				});
			}
			
		}
	
		function _setupDoMoreCarousel(){
			if($('#domore-carousel').length){
				$('#domore-carousel > a').each(function(i, elem){
					if($(elem).css('display') === 'none') {
						$(elem).remove();
					}
				});
			}
		}

		function _setupCategoryIndex(){
			if($('#category-index').length){
				$('#category-index > a').each(function(i, elem){
					if($(elem).css('display') === 'none') {
						$(elem).remove();
					}
				});
			}
		}
		
		
		function _updateAriaAttributes() {
			
		}
		
		function _destroy() {
			if(_hasInited) {
				_carousel.slick('unslick');
			}
		}
		
		function _set(option) {
			_carousel.slick(option);
		}
		
		return {
			carousel: _carousel,
			init:_init,
			set:_set,
			destroy:_destroy,
			refresh:_refresh,
			setupDoMoreCarousel: _setupDoMoreCarousel,
			setupShopCarousel: _setupShopCarousel,
			setupCardsCarousel: _setupCardsCarousel,
			setupCategoryIndex: _setupCategoryIndex
		};
  };

	init();
})();
