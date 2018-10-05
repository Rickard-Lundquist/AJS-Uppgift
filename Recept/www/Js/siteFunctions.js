$(function () {
    let $background = $('#background'),
        $backgroundImage = $background.find('.backgroundImage'),
        $load = $background.find('.load'),

        $content = $('#content'),
        $title = $content.find('h1'),
        $menu = $content.find('.menu'),
        $mainNav = $menu.find('ul:first'),
        $menuItems = $mainNav.children('li'),
        totalItems = $menuItems.length,
        $ItemImages = new Array();

    $menuItems.each(function (i) {
        $ItemImages.push($(this).children('a:first').attr('href'));
    });
    $ItemImages.push($backgroundImage.attr('src'));

    let Menu = (function () {
        let init = function () {
                loadPage();
                initWindowEvent();
            },
            loadPage = function () {
                $load.show();
                $.when(loadImages()).done(function () {
                    $.when(showBGImage()).done(function () {
                        $load.hide();
                        $.when(slideOutMenu()).done(function () {
                            $.when(toggleMenuItems('up')).done(function () {
                                initEventsSubMenu();
                            });
                        });
                    });
                });
            },
            showBGImage = function () {
                return $.Deferred(
                    function (dfd) {
                        adjustImageSize($backgroundImage);
                        $backgroundImage.fadeIn(1000, dfd.resolve);
                    }
                ).promise();
            },
            slideOutMenu = function () {
                let new_w = $(window).width() - $title.outerWidth(true);
                return $.Deferred(
                    function (dfd) {
                        $menu.stop()
                            .animate({
                                width: new_w + 'px'
                            }, 700, dfd.resolve);
                    }
                ).promise();
            },
            toggleMenuItems = function (dir) {
                return $.Deferred(
                    function (dfd) {
                        $menuItems.each(function (i) {
                            let $el_title = $(this).children('a:first'),
                                marginTop, opacity, easing;
                            if (dir === 'up') {
                                marginTop = '0px';
                                opacity = 1;
                                easing = 'easeOutBack';
                            }
                            else if (dir === 'down') {
                                marginTop = '60px';
                                opacity = 0;
                                easing = 'easeInBack';
                            }
                            $el_title.stop()
                                .animate({
                                    marginTop: marginTop,
                                    opacity: opacity
                                }, 200 + i * 200, easing, function () {
                                    if (i === totalItems - 1)
                                        dfd.resolve();
                                });
                        });
                    }
                ).promise();
            },
            initEventsSubMenu = function () {
                $menuItems.each(function (i) {
                    let $item = $(this),
                        $el_title = $item.children('a:first'),
                        el_image = $el_title.attr('href'),
                        $sub_menu = $item.find('.subMenu'),
                        $close = $sub_menu.find('.close');
                    $el_title.bind('click.Menu', function (e) {
                        $.when(toggleMenuItems('down')).done(function () {
                            openSubMenu($item, $sub_menu, el_image);
                        });
                        return false;
                    });
                    $close.bind('click.Menu', function (e) {
                        closeSubMenu($sub_menu);
                        return false;
                    });
                });
            },
            openSubMenu = function ($item, $sub_menu, el_image) {
                $sub_menu.stop()
                    .animate({
                        height: '400px',
                        marginTop: '-200px'
                    }, 400, function () {
                        showItemImage(el_image);
                    });
            },
            showItemImage = function (source) {
                if ($backgroundImage.attr('src') === source)
                    return false;

                let $itemImage = $('<img src="' + source + '" alt="Background" class="backgroundImage"/>');
                $itemImage.insertBefore($backgroundImage);
                adjustImageSize($itemImage);
                $backgroundImage.fadeOut(1500, function () {
                    $(this).remove();
                    $backgroundImage = $itemImage;
                });
                $itemImage.fadeIn(1500);
            },
            closeSubMenu = function ($sub_menu) {
                $sub_menu.stop()
                    .animate({
                        height: '0px',
                        marginTop: '0px'
                    }, 400, function () {
                        //show items
                        toggleMenuItems('up');
                    });
            },
            initWindowEvent = function () {
                $(window).bind('resize.Menu', function (e) {
                    adjustImageSize($backgroundImage);
                    let new_w = $(window).width() - $title.outerWidth(true);
                    $menu.css('width', new_w + 'px');
                });
            },
            adjustImageSize = function ($img) {
                let w_w = $(window).width(),
                    w_h = $(window).height(),
                    r_w = w_h / w_w,
                    i_w = $img.width(),
                    i_h = $img.height(),
                    r_i = i_h / i_w,
                    new_w, new_h,
                    new_left, new_top;

                if (r_w > r_i) {
                    new_h = w_h;
                    new_w = w_h / r_i;
                }
                else {
                    new_h = w_w * r_i;
                    new_w = w_w;
                }

                $img.css({
                    width: new_w + 'px',
                    height: new_h + 'px',
                    left: (w_w - new_w) / 2 + 'px',
                    top: (w_h - new_h) / 2 + 'px'
                });
            },
            loadImages = function () {
                return $.Deferred(
                    function (dfd) {
                        let total_images = $ItemImages.length,
                            loaded = 0;
                        for (let i = 0; i < total_images; ++i) {
                            $('<img/>').load(function () {
                                ++loaded;
                                if (loaded === total_images)
                                    dfd.resolve();
                            }).attr('src', $ItemImages[i]);
                        }
                    }
                ).promise();
            };

        return {
            init: init
        };
    })();

    Menu.init();
});