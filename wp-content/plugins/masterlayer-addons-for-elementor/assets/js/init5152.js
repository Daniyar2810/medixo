(function($) {
    'use strict';
    
    var popupVideo = function() {
        if ( $().magnificPopup ) {
            var $el = $('.popup-video');
            if ($el.length) {
                new IntersectionObserver(
                    function e(i, n) {
                        i.forEach(function (e) {
                            if (e.isIntersecting) {
                                $el.magnificPopup({
                                    disableOn: 700,
                                    type: 'iframe',
                                    mainClass: 'mfp-fade',
                                    removalDelay: 160,
                                    preloader: false,
                                    fixedContentPos: true
                                });
                                n.unobserve(e.target)
                            }
                        });
                    }
                ).observe($el.get(0));
            }
        }
    };
    
    var popupImages = function () {
        if ($().magnificPopup) {
            var $el = $('.master-galleries, .master-portfolio');
            if ($el.length) {
                new IntersectionObserver(
                    function e(i, n) {
                        i.forEach(function (e) {
                            if (e.isIntersecting) {
                                $el.each(function () {
                                    $(this).find('.zoom-popup-mfp').magnificPopup({
                                        disableOn: 700,
                                        type: 'image',
                                        gallery: {
                                            enabled: true
                                        },
                                        mainClass: 'mfp-fade',
                                        removalDelay: 160,
                                        preloader: false,
                                        fixedContentPos: true
                                    });
                                    
                                });
                                n.unobserve(e.target)
                            }
                        });
                    }
                ).observe($el.get(0));
            }
        }
    };

    var getDevice = function() {
        var bp = elementorFrontend.config.responsive.activeBreakpoints;
        var vw = $(window).width();
        var d = 'desktop';

        if ( bp.hasOwnProperty('widescreen') ) {
            if (vw >= bp.widescreen.value) { return 'widescreen' };
        }

        if ( bp.hasOwnProperty('laptop') ) {
            if (vw > bp.laptop.value) { return d; } 
            d = 'laptop';
        }

        if ( bp.hasOwnProperty('tablet_extra') ) {
            if (vw > bp.tablet_extra.value) { return d; } 
            d = 'tablet_extra';
        }

        if ( bp.hasOwnProperty('tablet') ) {
            if (vw > bp.tablet.value) { return d; } 
            d = 'tablet';
        }

        if ( bp.hasOwnProperty('mobile_extra') ) {
            if (vw > bp.mobile_extra.value) { return d; } 
            d = 'mobile_extra';
        }

        if ( bp.hasOwnProperty('mobile') ) {
            if (vw > bp.mobile.value) { return d; } 
            d = 'mobile';
        }
        return d;
    };

    /**
     * Elementor JS Hooks
     */
    $(window).on("elementor/frontend/init", function() {
        var $device = 'desktop';
        $device = getDevice();

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-cause-carousel.default", 
            function( $scope ) { 
                $scope.find('.master-carousel-box').masterCarouselBox(); 
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-cause-grid.default", 
            function( $scope ) { 
                $scope.find('.master-portfolio').masterPortfolio(); 
            });
        
        elementorFrontend.hooks.addAction("frontend/element_ready/mae-pie-chart.default", 
            function( $scope ) { $scope.find('.master-pie-chart').masterPieChart(); }
            );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-countdown.default", 
            function( $scope ) { 
                $scope.find('.master-countdown').masterCountdown(); 
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-counter.default", 
            function( $scope ) { 
                var $el = $scope.find('.master-counter').get(0);
                new IntersectionObserver(
                    function e(i, n) {
                        i.forEach(function (e) {
                            if ( e.isIntersecting ) {
                                let $format = $scope.find('.master-counter').data('format');
                                if ($format == 'default') {
                                    $scope.find('.number').countTo({ 
                                        speed: $scope.find('.number').data('time')
                                    });
                                } else {
                                    $scope.find('.number').countTo({ 
                                        speed: $scope.find('.number').data('time'),
                                        formatter: function (value, options) {
                                            switch($format) {
                                            case 'separator':
                                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            case 'decimal':
                                                return value.toFixed(2);
                                            case 'both':
                                                return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            default:
                                                return value;
                                            }
                                        }
                                    });
                                }
                                n.unobserve(e.target)
                            }
                        })
                    }
                ).observe($el);
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-tabs.default", 
            function( $scope ) { 
                var number = $scope.find('.tab-link').length;
                var toggle = $scope.find('.toggle');
                var lines = $scope.find('.interactive-line');

                if ( $scope.is('.tabs-horizontal') ) {
                    $scope.find('.tab-link-wrap .tab-link').first().addClass('active');
                } else {
                    $scope.find('.tab-link-wrap .tab-link').css('max-width', (100 / number) + '%').first().addClass('active');
                }
                
                $scope.find('.tab-content').first().addClass('active');

                $scope.find('.tab-link-wrap .tab-link').on('click', function() {
                    var
                    t = $(this),
                    id = t.attr('data-tab');
                    if ( !$(this).is('.active') ) {
                        t.addClass('active')
                            .siblings('.tab-link').removeClass('active')
                            .closest('.master-tabs')
                            .find('.tab-content').removeClass('active').hide();

                        if ( toggle.length ) toggle.toggleClass('active');

                        $("#" + id).addClass('active').fadeIn("slow");
                        
                        if (lines.length) {
                            var w = t.width();
                            var x = t.offset().left - $scope.offset().left;
                            lines.find('.line').css({'width':w +'px','transform': 'translateX(' + x + 'px)'})
                        }
                    }
                });

                if (toggle.length) {
                    toggle.on('click', function () {
                        toggle.toggleClass('active');
                        $scope.find('.tab-link-wrap .tab-link').toggleClass('active');
                        $scope.find('.tab-content').toggleClass('active');
                        $scope.find('.tab-content.active').fadeIn("slow");
                    })
                }
                
                if (lines.length) {
                    var w = $scope.find('.tab-link-wrap .tab-link').width();
                    lines.find('.line').width(w);
                }
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-accordion.default", 
            function( $scope ) { 
                var args = {easing:'easeOutExpo', duration:300};
                var t = $scope.find('.master-accordions');

                var items = t.find('.item');

                items.each(function(idx, el) {
                    if ( $(el).is('.active') ) $(el).children('.content').show();

                    var btn = $(el).find('.title');
                    btn.on('click', function() {
                        var currentItem = items.eq(idx);

                        if ( !currentItem.is('.active') ) {
                            currentItem.siblings('.active').removeClass('active')
                                .children('.content').slideToggle(args);
                            currentItem.addClass('active')
                                .children('.content').slideToggle(args);
                        }
                    })
                })
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-progress-bar.default", 
            function( $scope ) {  
                var
                t = $scope,
                v = t.find(".progress"),
                c = t.find(".percent"),
                p = v.data('percent');

                new IntersectionObserver(
                    function e(i, n) {
                        i.forEach(function (e) {
                            if (e.isIntersecting) {
                                v.css({ 'width': p }, "slow");
                                c.css({ 'width': p }, "slow");

                                n.unobserve(e.target)
                            }
                        });
                    }
                ).observe(t.get(0));
            });

        // Carousel & Cube & Slider
        elementorFrontend.hooks.addAction("frontend/element_ready/mae-testimonial-vertical-slider.default", 
            function( $scope ) { $scope.find('.master-vertical-slider').masterVerticalSlider(); }
            );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-testimonial-vertical-carousel.default", 
            function( $scope ) { $scope.find('.master-carousel-box').masterCarouselBox(); }
            );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-event-vertical-slider.default", 
            function( $scope ) { $scope.find('.master-vertical-slider').masterVerticalSlider(); }
            );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-event-carousel.default", 
            function( $scope ) { 
                $scope.find('.master-carousel-box').masterCarouselBox(); 
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-slider.default", 
            function( $scope ) { 
                $scope.find('.master-slider').masterSlider(); }
            );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-horizontal-timeline.default", 
            function( $scope ) { 
                $scope.find('.master-carousel-box').masterCarouselBox();
                var calcHeight = function() {
                    var items = $scope.find('.master-timeline');
                    var even = [];
                    var odd = [];
                    
                    
                    if ($scope.is('.timeline-style-1')) {
                        items.even().each(function(idx, item) {
                            even.push($(item).find('.content-wrap').outerHeight());
                        })
                        items.odd().each(function(idx, item) {
                            odd.push($(item).find('.content-wrap').outerHeight());
                        })
                        var height = Math.max.apply(null, even) + Math.max.apply(null, odd) + 10;
                        $scope.find('.flickity-viewport').css({'min-height': height});
                        $scope.find('.master-timeline .inner-wrap').css({'min-height': Math.max.apply(null, even), 'margin-bottom': Math.max.apply(null, odd)});
                        $scope.find('.timeline-line').css({'top': Math.max.apply(null, even)});
                    } else {
                        items.each(function(idx, item) {
                            even.push($(item).find('.inner-wrap').outerHeight());
                        })
                        var height = Math.max.apply(null, even);
                        $scope.find('.flickity-viewport').css({'min-height': height});
                        $scope.find('.master-timeline .inner-wrap').css({'min-height': Math.max.apply(null, even)});
                    }

                };
                
                $(window).on('load resize', function() {
                    setTimeout(function() {
                        calcHeight();
                    }, 100)
                });
                
                new IntersectionObserver(
                    function e(i, n) {
                        i.forEach(function (e) {
                            if (e.isIntersecting) {
                                setTimeout(function() {
                                    calcHeight();
                                })
                                n.unobserve(e.target)
                            }
                        }, {rootMargin: "1000px 0px 1000px 0px"});
                    }
                ).observe($scope.get(0));

                
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-portfolio-carousel.default", 
            function( $scope ) { 
                $scope.find('.master-carousel-box').masterCarouselBox(); 
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-portfolio-related.default", 
            function( $scope ) { 
                $scope.find('.master-carousel-box').masterCarouselBox(); 
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-testimonial-carousel.default", 
            function( $scope ) { 
                $scope.find('.master-carousel-box').masterCarouselBox(); 
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-carousel-box.default", 
            function( $scope ) { 
                $scope.find('.master-carousel-box').masterCarouselBox(); 
            });
            
        elementorFrontend.hooks.addAction("frontend/element_ready/mae-loop-carousel.default", 
            function( $scope ) { 
                $scope.find('.master-carousel-box').masterCarouselBox(); 
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-svg-drawing.default", 
            function( $scope ) { 
                var paths = $scope.find('path');

                var duration = $scope.find('.master-svg-drawing').data('duration');
                var delay = $scope.find('.master-svg-drawing').data('delay');
                var direction = $scope.find('.master-svg-drawing').data('direction');
                var type = $scope.find('.master-svg-drawing').data('type');
                var totalLength = 0;

                duration ? duration = duration / 1000 : duration = 1,
                delay ? delay = delay / 1000 : delay = 0.3

                var tl = gsap.timeline({ paused: true, delay: delay });
                paths.each(function(idx, el) {
                    var a = el.getTotalLength();
                    totalLength += a;
                    if (direction == 'revert') {
                        gsap.set(el, {strokeDasharray: a, strokeDashoffset: -a, opacity: 0});
                    } else {
                        gsap.set(el, {strokeDasharray: a, strokeDashoffset: a, opacity: 0});
                    }   
                })
                
                switch (type) {
                    case 'sequential':
                        paths.each(function(idx, el) {
                            var a = el.getTotalLength();
                            var time = a / totalLength * duration;
                            tl.set(el, { opacity: 1 });
                            tl.to(el, time, {strokeDashoffset: 0} )
                        })
                        
                        new IntersectionObserver(
                            function e(i, n) {
                                i.forEach(function (e) {
                                    if (e.isIntersecting) {
                                        tl.play();
                                        n.unobserve(e.target)
                                    }
                                });
                            }
                        ).observe($scope.get(0));
                        break;
                    case 'custom':
                        paths.each(function(idx, el) {
                            var a = el.getTotalLength();
                            //var time = a / totalLength * duration;
                            gsap.set(el, { opacity: 1 });
                            //tl.to(el, time, {strokeDashoffset: 0} )
                        })
                        
                        var arr = $scope.find('.master-svg-drawing').data('custom');
                        
                        new IntersectionObserver(
                            function e(i, n) {
                                i.forEach(function (e) {
                                    if (e.isIntersecting) {
                                        $(arr).each(function(idx, el) {
                                            var target = $scope.find(el['selector']);
                                            var duration = 1;
                                            var delay = 0;
                                            duration = $.isNumeric(el['duration']) ? el['duration'] / 1000 : 1;
                                            delay = $.isNumeric(el['delay']) ? el['delay'] / 1000 : 1;
                                            gsap.to(target, duration, {strokeDashoffset: 0, delay: delay, ease: 'none'});
                                        })
                                        n.unobserve(e.target)
                                    }
                                });
                            }
                        ).observe($scope.get(0));
                        break;
                    default:
                        new IntersectionObserver(
                            function e(i, n) {
                                i.forEach(function (e) {
                                    if (e.isIntersecting) {
                                        gsap.set(paths, {opacity: 1});
                                        gsap.to(paths, duration ,{strokeDashoffset: 0, delay: delay} );
                                        n.unobserve(e.target)
                                    }
                                });
                            }
                        ).observe($scope.get(0));
                }
               
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-team-carousel.default", 
            function( $scope ) { 
                $scope.find('.master-carousel-box').masterCarouselBox(); 
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-gallery-carousel.default", 
            function( $scope ) { $scope.find('.master-carousel-box').masterCarouselBox();
                $scope.find('a').on('click', function(e) {e.stopPropagation();})
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-news-carousel.default", 
            function( $scope ) { 
                $scope.find('.master-carousel-box').masterCarouselBox(); 
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-partner-carousel.default", 
            function( $scope ) { $scope.find('.master-carousel-box').masterCarouselBox(); }
            );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-news-grid.default", 
            function( $scope ) { $scope.find('.master-portfolio').masterPortfolio(); }
            );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-portfolio-grid.default", 
            function( $scope ) { $scope.find('.master-portfolio').masterPortfolio(); }
            );
            
        elementorFrontend.hooks.addAction("frontend/element_ready/mae-team-grid.default", 
            function( $scope ) { $scope.find('.master-portfolio').masterPortfolio(); }
            );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-gallery-grid.default",
            function ($scope) { 
                $scope.find('.master-portfolio').masterPortfolio(); 
                $scope.find('a').on('click', function(e) {e.stopPropagation();})
            });
        
        elementorFrontend.hooks.addAction("frontend/element_ready/mae-loop-grid.default", 
            function( $scope ) { $scope.find('.master-portfolio').masterPortfolio(); }
            );
            
        elementorFrontend.hooks.addAction("frontend/element_ready/mae-loop-list.default", 
            function( $scope ) {  
                var items = $scope.find('.item-wrap');
                
                items.each(function (idx, el) {
                    $(el).on('mouseenter', function() {
                        items.children().removeClass('active');
                        $(el).children().addClass('active');
                    })
                })
    
                $scope.on('mouseleave', function () {
                    items.children().removeClass('active');
                })
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-animated-text.default",
            function ($scope) { $scope.find('.master-animated-text').masterTextEfx(); }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-animated-text-scroll.default",
            function ($scope) { $scope.find('.master-animated-text').masterTextScroll(); }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-before-after.default",
            function ($scope) { $scope.find('.master-before-after').beforeAfter(); }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-news-block.default", 
            function( $scope ) { 
                var items = $scope.find('.master-news');
                items.each(function(idx, el) {
                    $(el).on('mouseenter', function() {
                        items.removeClass('active');
                        $(el).addClass('active')
                    })
                })
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-gallery-stack.default", 
            function( $scope ) { 
                var calcHeight = function() {
                    $scope.waitForImages(function() {
                        var 
                        arr = [],
                        wrap = $scope.find('.master-gallery-stack'),
                        items = wrap.find('[data-calcheight="yes"]');
                        
                        if (items.length) {
                            items.each(function(idx, item) {
                                var 
                                top = $(item).data('top');
                                if (!top) top = '0px';
                                if (top.indexOf("%") >= 0) {
                                    var height = $(item).height()/(100 - parseFloat(top))*100;
                                    isNaN(height) && (height = 0)
                                    arr.push(height);
                                } else {
                                    arr.push(parseInt(top) + $(item).height());
                                }
                            })
                        }
                        wrap.css("min-height", Math.max.apply(null, arr));
                    }) 
                }
                
                calcHeight();
                $(window).on('resize', function() {
                     calcHeight();
                })
                
                // Entrance Animation
                if ($scope.find('.master-animation').length) {
                    new IntersectionObserver(
                        function e(i, n) {
                            i.forEach(function (e) {
                                if (e.isIntersecting) {
                                    var $el = $scope.find('.master-animation');
                                    $el.each(function(idx, ele) {
                                        $(ele).addClass($(ele).data('animation'));
                                    });
                                    n.unobserve(e.target)
                                }
                            });
                        }
                    ).observe($scope.get(0));
                }
                
                // Parallax Hover
                if ($scope.find('.parallax-hover').length && !matchMedia( 'only screen and (max-width: 991px)' ).matches) {
                    new IntersectionObserver(function e(i, n) {
                        i.forEach(function (e) {
                            if (e.isIntersecting) {
                                var $wrap = $scope;
                                if ($scope.parents('.section-parallax-hover').length)
                                    $wrap = $scope.parents('.section-parallax-hover');

                                $wrap.on('mousemove', function(e) {
                                    var items = $scope.find('.parallax-hover');
                                    items.each(function(idx, el) {
                                        var 
                                        r = $(el).data('range'),
                                        d = $(el).data('direction'),
                                        w = el.getBoundingClientRect(),
                                        ox = e.clientX - w.x - w.width/2,
                                        oy = e.clientY - w.y - w.height/2;
                                        !r ? r = 0 : r = r / 10;
                                        (d == 'opposite') && (r = r * -1)

                                        gsap.to(el, 1, { x: ox * r, y: oy * r, ease: 'Expo.easeOut', overwrite: 'all' })
                                    })
                                })

                                $wrap.on('mouseleave', function(e) {
                                    var items = $scope.find('.parallax-hover');
                                    gsap.to(items, 1, {x: 0, y: 0, ease: 'Expo.easeOut', overwrite: 'all' })
                                })
                                n.unobserve(e.target)
                            }
                        }) }, {rootMargin: "200px 0px 200px 0px"}
                    ).observe($scope.get(0));
                }
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-png-dots.default", 
            function( $scope ) { 
                // disable on mobile for better performance
                if ( !matchMedia( 'only screen and (max-width: 991px)' ).matches ) {
                    $scope.find('.master-png-dots').masterPngDots(); 
                }
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-particles.default", 
            function( $scope ) {
                $scope.css('position', 'static'); 
                if ( $('body').is('.elementor-editor-active') ) $device = 'desktop';
                if ( !$scope.is('.elementor-hidden-' + $device) ) {
                    $scope.find('.master-particles').masterParticles();
                }
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-image-morphing.default", 
            function( $scope ) {
                $scope.find('.master-image-morphing').masterImageMorphing();
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-megamenu.default", 
            function( $scope ) { 
                $scope.find('.medixo-menu .custom-megamenu').each(function(idx, el) {
                    var navPos = function() {
                        let offset = - $(el).find('>a>span').offset().left - 10;
                        $(el).find('> .sub-menu').css('left', offset + 'px');
                    }
                    
                    navPos();

                    $(window).on('resize', function() {
                        navPos();
                    })
                })
            });
            
        elementorFrontend.hooks.addAction("frontend/element_ready/mae-menu.default", 
            function( $scope ) { 
                if ( $scope.find('.magic-line').length ) {
                    if ( $scope.is('#menu-onepage') ) {
                        var menu = $scope.find('.master-menu'),
                        items = $scope.find('.master-menu > .menu > li'),
                        line = $scope.find('.magic-line'),
                        first = $scope.find('.master-menu > .menu > li:first-child > a, .master-menu > .menu > li:first-child > a'),
                        active = first;
                        var scrollPos = $(window).scrollTop();
                        
                        $scope.find('.master-menu > ul > li> a').each(function(idx, el) {
                            var block = $(el).attr("href");
                            if ( $(block).length ) {
                                if ( $(block).offset().top - 32 <= scrollPos ) {
                                    active = $(el);
                                }
                            }
                        })
                        
                        if (active.length) {
                            let x = active.get(0).getBoundingClientRect().x - menu.get(0).getBoundingClientRect().x;
                            line.css({'width': active.width(), 'transform': 'translateX(' + x + 'px)'});
                        } else {
                            let x = first.get(0).getBoundingClientRect().x - menu.get(0).getBoundingClientRect().x;
                            line.css({'width': 0, 'transform': 'translateX(' + x + 'px)'});
                        }
                        
                        items.each(function(idx, el) {
                            $(el).on('mouseenter', function() {
                                let x = el.getBoundingClientRect().x - menu.get(0).getBoundingClientRect().x;
                                line.css({'width': $(el).width(), 'transform': 'translateX(' + x + 'px)', 'display': 'inline-block'});
                            })
                        })
                        
                        menu.on('mouseleave', function() { 
                            if (active.length) {
                                let x = active.get(0).getBoundingClientRect().x - menu.get(0).getBoundingClientRect().x;
                                line.css({'width': active.width(), 'transform': 'translateX(' + x + 'px)'});
                            } else {
                                line.css({'display': 'none'});
                            }
                        })
                        
                        $(window).on('scroll', function() {
                            scrollPos = $(window).scrollTop();
                            $scope.find('.master-menu > ul > li> a').each(function(idx, el) {
                                var block = $(el).attr("href");
                                if ( $(block).length ) {
                                    if ( $(block).offset().top - 32 <= scrollPos ) {
                                        if ($(el) !== active) {
                                            active = $(el);
                                            let x = el.getBoundingClientRect().x - menu.get(0).getBoundingClientRect().x;
                                            line.css({'width': $(el).width(), 'transform': 'translateX(' + x + 'px)', 'display': 'inline-block'});
                                        }
                                    }
                                }
                            })
                        })
                    } else {
                        var menu = $scope.find('.master-menu'),
                        items = $scope.find('.master-menu > .menu > li'),
                        line = $scope.find('.magic-line'),
                        first = $scope.find('.master-menu > .menu > li:first-child > a, .master-menu > .menu > li:first-child > a'),
                        active = $scope.find('.master-menu > .menu > .current-menu-item > a, .master-menu > .menu > .current-menu-parent > a');
                        
                        if (active.length) {
                            let x = active.get(0).getBoundingClientRect().x - menu.get(0).getBoundingClientRect().x;
                            line.css({'width': active.width(), 'transform': 'translateX(' + x + 'px)'});
                        } else {
                            let x = first.get(0).getBoundingClientRect().x - menu.get(0).getBoundingClientRect().x;
                            line.css({'width': 0, 'transform': 'translateX(' + x + 'px)'});
                        }
                        
                        items.each(function(idx, el) {
                            $(el).on('mouseenter', function() {
                                let x = el.getBoundingClientRect().x - menu.get(0).getBoundingClientRect().x;
                                line.css({'width': $(el).width(), 'transform': 'translateX(' + x + 'px)', 'display': 'inline-block'});
                            })
                        })
                        
                        menu.on('mouseleave', function() { 
                            if (active.length) {
                                let x = active.get(0).getBoundingClientRect().x - menu.get(0).getBoundingClientRect().x;
                                line.css({'width': active.width(), 'transform': 'translateX(' + x + 'px)'});
                            } else {
                                line.css({'display': 'none'});
                            }
                        })
                    }  
                }  
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/mae-button-popup.default", 
            function( $scope ) {
                var wrap = $scope.find('.master-popup'),
                    header = $('#site-header-wrap'),
                    btn = $scope.find('.popup-btn'),
                    overlay = $scope.find('.popup-overlay'),
                    close = $scope.find('.close-btn');

                btn.on('click', function () {
                    header.addClass('low-index');
                    wrap.addClass('active');
                    $('html').addClass( 'disable-scroll' );
                })

                close.on('click', function () {
                    wrap.removeClass('active');
                    $('html').removeClass( 'disable-scroll' );
                    header.removeClass('low-index');
                })

                overlay.on('click', function () {
                    wrap.removeClass('active');
                    $('html').removeClass( 'disable-scroll' );
                    header.removeClass('low-index');
                })
            });
            
        elementorFrontend.hooks.addAction("frontend/element_ready/mae-line-dot-animation.default", 
            function( $scope ) {
                $scope.find('.master-line-dot-animation').masterLinesDotsPattern();
            });
            
        elementorFrontend.hooks.addAction("frontend/element_ready/mae-ripple.default", 
            function( $scope ) {
                var el = $scope.find('.master-ripple');
                var perturbance;
              
              	new IntersectionObserver(function e(i, n) {
                        i.forEach(function (e) {
                            if (e.isIntersecting) {
                                  perturbance == $.isNumeric(el.data('perturbance')) ? el.data('perturbance') : 0.01;
                                  try {
                                      el.ripples({
                                          resolution: 256,
                                          perturbance: perturbance
                                      });
                                  }
                                  catch (e) {
                                      console.log(e);
                                  }
                                n.unobserve(e.target)
                            }
                        }) }, {rootMargin: "200px 0px 200px 0px"}
                    ).observe(el.get(0));
            });

        elementorFrontend.hooks.addAction("frontend/element_ready/container", 
            function( $scope ) {
                if ( $scope.is('.e-parent')) {
                    new IntersectionObserver(
                        function e(i, n) {
                            i.forEach(function (e) {
                                if (e.isIntersecting) {
                                    $scope.addClass('inview');
                                    
                                    // Progress step line
                                    if ( $scope.find('.progress-step-line').length ) {
                                        var item = $scope.find('.progress-step');
                                        var line = $scope.find('.progress-step-line');
                                        var active = 1;
                                        var next = 0;
                                        if ( $scope.find('.progress-step.active').length ) {
                                            active = $scope.find('.progress-step.active').index() + 1;
                                        }
                                        line.addClass('step-' + active);
                                        
                                        item.each(function(idx, el) {
                                            $(el).on('mouseenter', function() {
                                                next = idx + 1;
                                                item.removeClass('active');
                                                $(el).addClass('active');
                                                line.removeClass('step-' + active).addClass('step-' + next);
                                                active = next;
                                            })
                                        })
                                    }
                                    n.unobserve(e.target)
                                }
                            });
                        }
                    ).observe($scope.get(0));
                    
                    // Button Hover
                    if ( $scope.find('.master-button.btn-hover-2').length ) {
                        $scope.find('.master-button.btn-hover-2').each(function (idx, el) {
                            var $el = $(el);
                            new IntersectionObserver(
                                function e(i, n) {
                                    i.forEach(function (e) {
                                        if (e.isIntersecting) {
                                            $el.mouseenter(function(e) {
                                               var parentOffset = $el.offset(); 
                                              
                                               var relX = e.pageX - parentOffset.left;
                                               var relY = e.pageY - parentOffset.top;
                                               $el.find('.bg-hover').css({"left": relX, "top": relY });
                                            });
    
                                            $el.mouseleave(function(e) {
    
                                                 var parentOffset = $el.offset(); 
    
                                                 var relX = e.pageX - parentOffset.left;
                                                 var relY = e.pageY - parentOffset.top;
                                                 $el.find('.bg-hover').css({"left": relX, "top": relY });
                                            });
    
                                            n.unobserve(e.target)
                                        }
                                    });
                                }
                            ).observe($el.get(0));
                        })
                    }
                    
                    // Header Sticky
                    if ( $scope.parents('.medixo-header').length && $scope.is('.is-sticky') ) {
                        var header = $scope.parents('.medixo-header');
                        var sticky = header.find('.is-sticky');
                        if ( sticky.length ) {
                            var headerHeight = sticky.height(),
                                offsetTop = sticky.offset().top;

                            if ( $('.header-float').length ) {
                                headerHeight = 0;
                            }

                            if (!sticky.find('.inject-space').length) {
                                var injectSpace = $('<div />', {
                                    height: headerHeight
                                }).insertAfter(sticky).addClass('inject-space');
                            }

                            if ( $('.header-float').length ) {
                                if ($('#wpadminbar').length) {
                                    offsetTop = offsetTop - $('#wpadminbar').height();
                                }
                            } else {
                                sticky.find('>div').addClass('position-absolute');
                            }
                            
                            if ( !$('.header-float').length ) {
                                // recalculate height
                                $(window).ready(function() {
                                    var s = $('.inject-space');
                                    s.height(sticky.find('>div').height());
                                    offsetTop = s.offset().top;
                                })
                                
                                $(window).on('resize', function() {
                                    setTimeout(function() {
                                        var s = $('.inject-space');
                                        s.height(sticky.find('>div').height());
                                        offsetTop = s.offset().top;
                                    },50) 
                                })
                            }

                            $(window).on('load scroll', function() {
                                if ( $(window).scrollTop() > offsetTop ) {
                                    sticky.addClass('fixed-show');
                                } else {
                                    sticky.removeClass('fixed-show');
                                }
                            })  
                        }
                    }

                    // Hover group
                    if ( $scope.is('.hover-group') ) {
                        var $items = $scope.find('.hover-item');
                        $items.each(function(idx, el) {
                            $(el).on('mouseenter', function () {
                                $items.removeClass('active');
                                $(el).addClass('active');
                            })
                        })
                    }
    
                    // Random Moving
                    if ($scope.find('.random-move').length) {
                        new IntersectionObserver(
                            function e(i, n) {
                                i.forEach(function (e) {
                                    if (e.isIntersecting) {
                                        var $el = $scope.find('.random-move path');
                                        gsap.to($el, {
                                            x: "random(-30, 30)",
                                            y: "random(-30, 30)",
                                            ease: "linear",
                                            duration: 5, 
                                            repeat: -1,
                                            repeatRefresh: true,
                                            delay: 0.5
                                        });
                                        n.unobserve(e.target)
                                    }
                                });
                            }
                        ).observe($scope.get(0));
                    }
                    
                    // Random appear
                    if ($scope.find('.random-appear').length) {
                        var $el = $scope.find('.random-appear path');
                        gsap.set($el, {opacity: 0, scale: "random(0.3, 0.5)"});
                        new IntersectionObserver(
                            function e(i, n) {
                                i.forEach(function (e) {
                                    if (e.isIntersecting) {
                                        gsap.to($el, {
                                            opacity: 1,
                                            scale: 1,
                                            ease: "power2.out",
                                            duration: 5, 
                                            repeat: -1,
                                            repeatRefresh: true,
                                            delay: "random(0.3, 3)"
                                        });
                                        n.unobserve(e.target)
                                    }
                                });
                            }
                        ).observe($scope.find('.random-appear').get(0));
                    }

                    // Active 
                    if ( $('body').is('.elementor-editor-active') ) {
                        if (!$scope.find('.master-portfolio, .master-carousel-box').length) {
                            $scope.on('mouseenter', function() { $scope.parent().addClass('active'); })
                            $scope.on('mouseleave', function() { $scope.parent().removeClass('active'); })
                        }
                    }
                }

                
            });
            
        elementorFrontend.hooks.addAction("frontend/element_ready/mae-image-transition.default", 
            function( $scope ) {
                $scope.find('.master-image-transition').masterImageTransition();
            });


        popupVideo();
        popupImages();

    });


})(jQuery);


