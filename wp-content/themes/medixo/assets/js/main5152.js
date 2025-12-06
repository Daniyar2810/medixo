;(function($) {
    'use strict';

    var medixoTheme = {

        // Main init function
        init : function() {
            this.config();
            this.events();
        },

        // Define vars for caching
        config : function() {
            this.config = {
                $window : $( window ),
                $document : $( document ),
            };
        },

        // Events
        events : function() {
            var self = this;
            $(window).on('load', function() {
                // Smooth scrolling initialization (using Lenis https://github.com/studio-freight/lenis)
                const lenis = new Lenis({
                    lerp: 0.1,
                    smooth: true
                })

                lenis.on('scroll', (e) => {
                })

                function raf(time) {
                  lenis.raf(time)
                  requestAnimationFrame(raf)
                }

                requestAnimationFrame(raf)
            })  

            // Run on document ready
            $(document).ready(function () {
                // Custom Cursor
                self.customCursor();
            });

            // PreLoader
            self.preLoader();

            // Menu Search Icon
            self.searchIcon();
            
            // Cart Icon
            self.cartIcon();

            // Header Fixed
            self.headerFixed();

            //Scroll to Top
            self.scrollToTop();

            // Hamburger Menu
            self.hamburgerMenu(); 

            // Quantity Button
            self.quantityButton();

            // Responsive Videos
            self.responsiveVideos();
            
            // Footer Fixed
            self.footerFixed();

            // Form Reveal
            self.formReveal();

            // Progress Bar
            self.progressBar();
            
            // Megamenu
            self.megaMenu();
        },

        // PreLoader
        preLoader: function() {
           if ( $().animsition ) {
                var $defaults = {
                    inClass: 'fade-in',
                    outClass: 'fade-out',
                    inDuration: 500,
                    outDuration: 500,
                    loading: true,
                    loadingParentElement: 'body',
                    loadingClass: 'animsition-loading',
                    loadingInner: '',
                    timeout: true,
                    timeoutCountdown: 5000,
                    onLoadEvent: true,
                    browser: [
                        '-webkit-animation-duration',
                        '-moz-animation-duration',
                        'animation-duration'
                        ],
                    overlay: false,
                    overlayClass: 'animsition-overlay-slide',
                    overlayParentElement: 'body',
                    transition: function(url){ window.location.href = url; },
                    wooble: false
                },
                $config = $('.animsition').data('anim'),
                $opts = $.extend({}, $defaults, $opts, $config);
                $('.animsition').animsition($opts);
                
                if ( $opts.wooble ) {
                    var wrapper = $('.medixo-ptrans'),
                        overlay = $('.animsition-overlay-slide'),
                        snap = Snap($('.svg-wooble').get(0)),
                        path = snap.select('.svg-wooble-normal'),
                        origin = $('.svg-wooble-normal').data('original'),
                        top = $('.svg-wooble-top.desktop').attr('d'),
                        bottom = $('.svg-wooble-bottom.desktop').attr('d');
                    path.attr('d', top);
                    
                    $('.animsition').on('animsition.inStart', function(){
                        path.animate({ 'path' : origin }, 500, mina.bounce);
                        wrapper.addClass('slide-up-fade-out');
                        overlay.addClass('hide-out');
                    })
                }
            } 
        },

        // Responsive Videos
        responsiveVideos: function() {
            if ( $().fitVids ) {
                $('.medixo-container').fitVids();
            }
        },

        // Menu Search Icon
        searchIcon: function() {
            if ( $('.search-trigger').length ) {
                var search_wrap = $('.search-style-fullscreen');
                var search_trigger = $('.search-trigger');
                var search_field = search_wrap.find('.search-field');

                search_trigger.on('click', function(e) {
                    if ( ! search_wrap.hasClass('search-opened') ) {
                        search_wrap.addClass('search-opened');
                        search_field.get(0).focus();

                    } else if (search_field.val() === '') {
                        if ( search_wrap.hasClass('search-opened') )
                            search_wrap.removeClass('search-opened');
                        else search_field.get(0).focus();

                    } else {
                         search_wrap.find('form').get(0).submit();
                    }

                    $('html').addClass( 'disable-scroll' );
                    e.preventDefault();
                    return false;
                });

                search_wrap.find('.search-close').on('click', function(e) {
                    search_wrap.removeClass('search-opened');
                    $('html').removeClass( 'disable-scroll' );
                    e.preventDefault();
                    return false;
                });
            }
        },

        // Menu Cart Icon
        cartIcon: function() {
            $( document ).on( 'woocommerce-cart-changed', function( e, data ) {
                if ( parseInt(data.items_count,10) >= 0 ) {
                    $('.shopping-cart-items-count')
                        .text( data.items_count )
                }
            } );
        },

        // Header Fixed
        headerFixed: function() {
            var nav = $('.medixo-header-fixed');
            var sp = 0;
            
            // Header Fixed
            if ( nav.length ) {
                var showHeader = function() {
                    var np = $('body')[0].getBoundingClientRect().top;
                    var st = $(window).scrollTop();

                    if (np > sp) {
                        if (st > 400) {
                            nav.addClass('fixed-show');
                        }
                        if (st < 400) {
                            nav.removeClass('fixed-show');
                        }
                    } else {
                        if (st > nav.height()) {
                            nav.addClass('fixed-show');
                        }
                    }

                    sp = np
                }

                $(window).on('scroll', showHeader);  
            }
        },

        // Footer Fixed
        footerFixed: function() {
            if ( $('body').is('.footer-fixed') && window.matchMedia('(min-width: 1025px)').matches ) {
                var content = $('#main-content'),
                footer = $('.medixo-footer'),
                height = footer.height();

                content.css('margin-bottom', height + 'px');
            }
        },

        // Scroll to Top
        scrollToTop: function() {
            $(window).scroll(function() {
                if ( $(this).scrollTop() > 800 ) {
                    $('#scroll-top').addClass('show');
                } else {
                    $('#scroll-top').removeClass('show');
                }
            });

            $('#scroll-top').on('click', function() {
                var rocket = $(this);
                $('html, body').animate({ scrollTop: 0 }, 700 , 'easeInCubic'); 
            });
        },

        // Hamburger Menu
        hamburgerMenu: function() {
            $('.medixo-menu-panel').each(function () {
                var 
                t = $(this),
                btn = t.siblings('.medixo-hamburger-icon'),
                c = t.find('.close-menu'),
                o = t.find('.menu-panel-overlay'),
                w = t.find('.menu-panel-wrap');

                t.find('.menu-item-has-children').children('ul').before('<span class="arrow"></span>');

                t.find('.menu-item-has-children > .arrow').on('click', function() {
                    $(this).parent().toggleClass("active").siblings().removeClass("active");
                    $(this).next("ul").slideToggle();
                    $(this).parent().siblings().find("ul").slideUp();
                })

                o.on('click', function() {
                    btn.removeClass('hide');
                    o.removeClass('show');
                    w.animate({ right: "-100%" }, 300, 'easeInOutExpo')
                    $('html').removeClass( 'disable-scroll' );
                } );

                c.on('click', function() {
                    btn.removeClass('hide');
                    o.removeClass('show');
                    w.animate({ right: "-100%" }, 300, 'easeInOutExpo')
                    $('html').removeClass( 'disable-scroll' );
                } );

                btn.on('click', function() {
                    btn.addClass('hide');
                    o.addClass('show');
                    $('html').addClass( 'disable-scroll' );
                    w.animate({ right: "0"}, 300, 'easeInOutExpo');
                })   
            })      
        },

        // Custom Cursor
        customCursor: function () {
            if ( $('.medixo-cursor').length ) {
                $('.medixo-cursor').masterCursor();
            }
        },

        // Quantity Button
        quantityButton: function() {
            if ( $('.woocommerce-page .quantity').length ) {
                if ( ! String.prototype.getDecimals ) {
                    String.prototype.getDecimals = function() {
                        var num = this,
                            match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                        if ( ! match ) {
                            return 0;
                        }
                        return Math.max( 0, ( match[1] ? match[1].length : 0 ) - ( match[2] ? +match[2] : 0 ) );
                    }
                }
                // Quantity "plus" and "minus" buttons
                $( document.body ).on( 'click', '.plus, .minus', function() {
                    var $qty        = $( this ).closest( '.quantity' ).find( '.qty'),
                        currentVal  = parseFloat( $qty.val() ),
                        max         = parseFloat( $qty.attr( 'max' ) ),
                        min         = parseFloat( $qty.attr( 'min' ) ),
                        step        = $qty.attr( 'step' );

                    // Format values
                    if ( ! currentVal || currentVal === '' || currentVal === 'NaN' ) currentVal = 0;
                    if ( max === '' || max === 'NaN' ) max = '';
                    if ( min === '' || min === 'NaN' ) min = 0;
                    if ( step === 'any' || step === '' || step === undefined || parseFloat( step ) === 'NaN' ) step = 1;

                    // Change the value
                    if ( $( this ).is( '.plus' ) ) {
                        if ( max && ( currentVal >= max ) ) {
                            $qty.val( max );
                        } else {
                            $qty.val( ( currentVal + parseFloat( step )).toFixed( step.getDecimals() ) );
                        }
                    } else {
                        if ( min && ( currentVal <= min ) ) {
                            $qty.val( min );
                        } else if ( currentVal > 0 ) {
                            $qty.val( ( currentVal - parseFloat( step )).toFixed( step.getDecimals() ) );
                        }
                    }

                    // Trigger change event
                    $qty.trigger( 'change' );
                });
            }
        },

        // Form Reveal
        formReveal: function () {
            if ( $('.page-give-forms').length ) {
                $('.give-btn-reveal').on('click', function() {
                    $(this).hide();
                    $('#give-payment-mode-select, #give_purchase_form_wrap').show();
                })
            }
        },

        // Progress Bar
        progressBar: function () {
            if ( $('.give-progress-bar').length ) {
                $('.give-progress-bar').each(function(idx, el) {
                    var bar = $(el).find('>span');
                    bar.css('width', '0%');

                    new IntersectionObserver(
                        function e(i, n) {
                            i.forEach(function (e) {
                                if (e.isIntersecting) {
                                    let w = $(el).attr('aria-valuenow');
                                    bar.css('width', w + '%');
                                    n.unobserve(e.target)
                                }
                            });
                        }
                    ).observe(el);
                })
            }
        },
        
        // Mega Menu
        megaMenu: function() {
            $('.medixo-menu .megamenu').each(function(idx, el) {
                var navPos = function() {
                    let offset = $(el).closest('.elementor-container, .medixo-container').offset().left - $(el).offset().left;
                    $(el).find('> .sub-menu').css('left', offset + 'px');
                }
                
                navPos();

                $(window).on('resize', function() {
                    navPos();
                })
            })
        },
        
    }; // end medixoTheme

    // Start things up
    medixoTheme.init();

})(jQuery);