(function() {
  'use strict';

  // var Keyboard = {
  //   ENTER: 13,
  //   TAB: 9,
  //   ESCAPE: 27,
  //   SPACE: 32,
  //   LEFT: 37,
  //   RIGHT: 39
  // };
  //var shopCarousel;
  var cardsCarousel;
  //var doMoreCarousel;
  //var categoryIndex = null;
  var windowWidth = window.innerWidth || $(window).width();
  //var giftCardsForm;
  //var doMoreSlides = 5;
  //var alpha = 27;
  var $gridContainer;
  var $mainMenuOL;
  var $secondaryMenu;
  var $headerSignon;
  var $headerSignoff;
  var $gridPadding;

  var $sideLinkTravel;
  var $sideLinkShop;
  var $sideLinkRedeem;
  var $sideLinkRedeemBillPay;
  var $sideLinkRedeemDonate;

  //var tierParam = citiShare.getParameterByName("tier");
  //var stateParam = citiShare.getParameterByName("state");



  function init() {

    $(window).bind('resize', function() {
      windowWidth = window.innerWidth || $(window).width();

      setupSectionSubNavs(); //Different from citiShare
      // setupShopCarousel();
      // setupCardsCarousel();
      $gridContainer = $(".grid-container").width();
      $mainMenuOL = $(".main-menu-ol").width();
      $secondaryMenu = $(".secondary-menu").width();
      $headerSignon = $("#header-signon").width();
      $headerSignoff = $("#header-signoff").width();

      var mainMenuOlSelector = $(".main-menu-ol");
      if(mainMenuOlSelector.length > 0) {
        $gridPadding = $(".main-menu-ol").offset().left - $(".grid-container").offset().left;
      }

      var modifier = 0;
      if(windowWidth < 1260){
        modifier = 0;
        $headerSignon = 0;
      }
      //Travel
      $sideLinkTravel = $(".side-link-travel");
      $sideLinkTravel.css("left", ( $mainMenuOL - 4 - modifier ) + "px");
      $sideLinkTravel.css("width", ( $gridContainer - $mainMenuOL - ($gridPadding * 2) ) - 1  + "px");

      //Shop
      $sideLinkShop = $(".side-link-shop");
      $sideLinkShop.css("left", ( $mainMenuOL - 4 - modifier ) + "px");
      $sideLinkShop.css("width", ( $gridContainer - $mainMenuOL - ($gridPadding * 2) ) - 1  + "px");

      //Redeem
      $sideLinkRedeem = $(".side-link-redeem");
      $sideLinkRedeem.css("left", ( $mainMenuOL - 4 - modifier ) + "px");
      $sideLinkRedeem.css("width", ( $gridContainer - $mainMenuOL - ($gridPadding * 2) ) - 1  + "px");

      //Redeem Bill Pay
      $sideLinkRedeemBillPay = $(".side-link-redeem-billpay");
      $sideLinkRedeemBillPay.css("left", ( $mainMenuOL - 4 - modifier ) + "px");
      $sideLinkRedeemBillPay.css("width", ( $gridContainer - $mainMenuOL - ($gridPadding * 2) ) - 1  + "px");

      //Redeem Donate
      $sideLinkRedeemDonate = $(".side-link-redeem-donate");
      $sideLinkRedeemDonate.css("left", ( $mainMenuOL - 4 - modifier ) + "px");
      $sideLinkRedeemDonate.css("width", ( $gridContainer - $mainMenuOL - ($gridPadding * 2) ) - 1  + "px");

    }).trigger('resize');

    citiShare.pagination.init();
    citiShare.homepage().init();

    $( "#mainmenu-shopwithpoints h2 a, #mainmenu-redeem h2 a" ).mouseover(function() {
      setTimeout(callResize, 50);
    });

    //only three subsections, add expanded class
    $('.section-sub-nav.mobile').each(function(){
      if($(this).find('.sub-section.activated').length === 3) {
        $(this).find('.sub-section.activated').addClass('expanded');
      }
    });

    setupIEBackgroundFallback();
    citiShare.setupTravelValidation();

    citiShare.formValidation.formatPointsInputValue($(".js-points-requested"));
    citiShare.formValidation.formInputValidation($(".form-input"));

    // determines if side-link-redeem may or may not be visible
    // if($('.side-link-redeem').is(":visible") || $('.side-link-redeem-billpay').is(":visible") || $('.side-link-redeem-donate').is(":visible")){
    //   $('#mainmenu-redeem .accessible-megamenu-panel').css('height','275px');
    // }else{
    //   $('#mainmenu-redeem .accessible-megamenu-panel').css('height','auto');
    // }

    // determines if side-link-travel may or may not be visible
    // if($('.side-link-travel').is(":visible")){
    //   $('#mainmenu-travel .accessible-megamenu-panel').css('height','275px');
    // }else{
    //   $('#mainmenu-travel .accessible-megamenu-panel').css('height','auto');
    // }

    // if($('.slider-gift-card').length){
    //   cardsCarousel = new citiShare.citiCarousel($('.slider-gift-card'));
    //   cardsCarousel.init();
    // }
    //
    // if($('.slider-cash-rewards-and-charity').length){
    //   cardsCarousel = new citiShare.citiCarousel($('.slider-cash-rewards-and-charity'),{
    //     dots: false
    //   });
    //   cardsCarousel.init();
    // }
    //
    // if($('.slider-gift-cards-and-cash').length){
    //   cardsCarousel = new citiShare.citiCarousel($('.slider-gift-cards-and-cash'),{
    //     dots: false
    //   });
    //   cardsCarousel.init();
    // }

    if($('.slider-module').length){
      cardsCarousel = new citiShare.citiCarousel($('.slider-module'),{
        slidesToShow:2,
        slidesToScroll:2
      });
      cardsCarousel.init();
    }

    // if($('.slider-merchandise').length){
    //   cardsCarousel = new citiShare.citiCarousel($('.slider-merchandise'));
    //   cardsCarousel.init();
    // }

    // if($('.slider-do-more-with-points').length){
    //   doMoreCarousel = new citiShare.citiCarousel($('.slider-do-more-with-points'),{
    //     slidesToShow:2,
    //     slidesToScroll:2,
    //     responsive:[
    //       {
    //         breakpoint:768,
    //         settings:{
    //           slidesToShow:doMoreSlides
    //         }
    //       }
    //     ]
    //   });
    //
    //   doMoreCarousel.init();
    // }

    // if($('.category-index').length) {
    //   categoryIndex = new citiShare.citiCarousel($('.category-index'), {
    //     dots: false,
    //     slidesToShow: 9,
    //     slidesToScroll: 9,
    //     responsive:[
    //       {
    //         breakpoint:768,
    //         settings:{
    //           slidesToShow:alpha
    //         }
    //       }
    //     ]
    //   });
    //
    //   categoryIndex.init();
    // }

    // CLP alphabetical index event handler.
    // $('.category-index').on('click', function(event) {
    //   event.preventDefault();
    //   var categoryListContainer = $('.category-list-container');
    //   var $selectedLink = $(event.target).closest('.category-index-link');
    //
    //   // Default to the letter 'A' on load
    //   if ($selectedLink.length === 0) {
    //     $selectedLink = $(this).find('[data-selected-index="a"]').not('.slick-cloned');
    //   }
    //
    //   var $selectedLabel = $selectedLink.children().first();
    //   // Get selected brand list index
    //   var selectedIndex = $selectedLink.data('selected-index');
    //
    //   // Update category list.
    //   if (selectedIndex) {
    //     citiShare.populateCategoryList(categoryListContainer, selectedIndex);
    //     $(this).find('.active').removeClass('active');
    //     $selectedLabel.addClass('active');
    //   }
    // });

    // Prepolulate the band list on load.
    // $('.category-index').trigger('click');

    // Populate PLP product list.
    // if($('#js-product-list-template').length){
    //   citiShare.populateProductList($('.js-product-list-placeholder'), '#js-product-list-template', json);// jshint ignore:line
    // }
  }

  // Enables full width backgrounds in browsers that don't support background-size css property

  function setupIEBackgroundFallback() {
    /** Travel section **/
    $(".no-backgroundsize #travel").backstretch("../unitedstates/img/hero.jpg", {
      centeredX: false
    });

    $(".no-backgroundsize #holiday").backstretch("../unitedstates/img/hero_holiday.jpg", {
      centeredX: false
    });

    $(".no-backgroundsize #points").backstretch("../unitedstates/img/pay-with-points-bg.jpg", {
      centeredX: true
    });

    $(".no-backgroundsize #domore").backstretch("../img/hero_domore.jpg", {
      centeredX: true
    });
  }

  citiShare.showHideSubSections();
  citiShare.addKeyboardEnterKey();
  citiShare.addKeyboardLeftRightToggle();

  // sets up section sub-navs (i.e. travel section cars/hotels/points)

  function setupSectionSubNavs() {
    var defaultTab = 0;
    // look for default tab class
    if ($('#travel-tabs .default-tab').length > 0) {
      defaultTab = $('#travel-tabs .default-tab').index();
    }

    $('#travel-tabs li').not('.activated').remove();

    if($('#travel-tabs .ui-state-active').length > 0) {
      defaultTab = $('#travel-tabs .ui-state-active').index();
    }

    if($('.section-sub-nav').css('display') !== 'none'){
      $("#travel-tabs").tabs({
        active: defaultTab
      });
    }

  }

  function callResize(){
    $( window ).resize();
  }

  init();
})();
