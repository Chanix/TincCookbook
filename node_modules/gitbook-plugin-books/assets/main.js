/**
 * 搜索框加入
 */
function search_layouts() {
    require(['gitbook', 'jQuery'], function (gitbook, $) {
        var init = function () {
            $('<div id="book-search-input" role="search"><input type="text" placeholder="Type to search" /></div>').prependTo(".book-summary");
            $(".markdown-section").wrap('<div class="search-plus" id="book-search-results"><div class="search-noresults"></div></div>');
            $('<div class="search-results"><div class="has-results"><h1 class="search-results-title"><span class="search-results-count"></span> results matching "<span class="search-query"></span>"</h1><ul class="search-results-list"></ul></div><div class="no-results"><h1 class="search-results-title">No results matching "<span class="search-query"></span>"</h1></div></div>').appendTo("#book-search-results");
        };
        gitbook.events.bind('page.change', function () {
            init();
        });
    });
}

/**
 * 章节扩展
 */
function ExpandableChapters() {
    require(['gitbook', 'jQuery'], function (gitbook, $) {
        var TOGGLE_CLASSNAME = 'expanded',
            CHAPTER = '.chapter',
            ARTICLES = '.articles',
            TRIGGER_TEMPLATE = '<i class="exc-trigger fa"></i>',
            LS_NAMESPACE = 'expChapters';
        var init = function () {
            // 将触发器元素添加到每个ARTICLES父元素并绑定事件
            $(ARTICLES)
                .parent(CHAPTER)
                .children('a, span')
                .append(
                    $(TRIGGER_TEMPLATE)
                    .on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle($(e.target).closest(CHAPTER));
                    })
                );
            // hacky解决方案，使跨可点击时，结合使用“ungrey”插件
            $(CHAPTER + ' > span')
                .on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle($(e.target).closest(CHAPTER));
                });
            expand(lsItem());
            // 展开当前选定的章节与它的父母
            var activeChapter = $(CHAPTER + '.active');
            expand(activeChapter);
            expand(activeChapter.parents(CHAPTER));
        };
        var toggle = function ($chapter) {
            if ($chapter.hasClass('expanded')) {
                collapse($chapter);
            } else {
                expand($chapter);
            }
        };
        var collapse = function ($chapter) {
            if ($chapter.length && $chapter.hasClass(TOGGLE_CLASSNAME)) {
                $chapter.removeClass(TOGGLE_CLASSNAME);
                lsItem($chapter);
            }
        };
        var expand = function ($chapter) {
            if ($chapter.length && !$chapter.hasClass(TOGGLE_CLASSNAME)) {
                $chapter.addClass(TOGGLE_CLASSNAME);
                lsItem($chapter);
            }
        };
        var lsItem = function () {
            var map = JSON.parse(localStorage.getItem(LS_NAMESPACE)) || {};
            if (arguments.length) {
                var $chapters = arguments[0];
                $chapters.each(function (index, element) {
                    var level = $(this).data('level');
                    var value = $(this).hasClass(TOGGLE_CLASSNAME);
                    map[level] = value;
                });
                localStorage.setItem(LS_NAMESPACE, JSON.stringify(map));
            } else {
                return $(CHAPTER).map(function (index, element) {
                    if (map[$(this).data('level')]) {
                        return this;
                    }
                });
            }
        };
        gitbook.events.bind('page.change', function () {
            init();
        });
    });
}

/**
 * Github 按钮
 */
function GitHubButtons() {
    require(['gitbook'], function (gitbook) {
        gitbook.events.bind('start', function (e, config) {
            var githubURL = config.books && config.books.github_url ? config.books.github_url : null;
            if (githubURL) {
                gitbook.toolbar.createButton({
                    icon: 'fa fa-github',
                    label: 'GitHub',
                    position: 'right',
                    onClick: function () {
                        window.open(githubURL);
                    }
                });
            }
        });
    });
}

/**
 * 隐藏答案分块
 */
function sectionx() {
    require(["gitbook", "jquery"], function (gitbook, $) {

        var sectionToggle = function (tar, button) {
            var $target = $('#' + tar);
            $target.collapse('toggle');
            if (button)
                $target.parents('.panel').toggle('slow');
        };

        var clickAction = function ($source, tar) {
            $source.click(function () {
                sectionToggle(tar, !$(this).hasClass('atTitle'));
                if (!$(this).hasClass('atTitle'))
                    $(this).toggleClass('btn-info').toggleClass('btn-success');
            });

            $('#' + tar).on('show.bs.collapse', function () {
                $source.html($source.attr('hide') ?
                    ('<b>' + $source.attr('hide') + '</b><span class="fa fa-angle-up pull-left"/>') :
                    '<span class="fa fa-angle-up"/>');
            });

            $('#' + tar).on('hide.bs.collapse', function () {
                $source.html($source.attr('show') ?
                    ('<b>' + $source.attr('show') + '</b><span class="fa fa-angle-down pull-left"/>') : '<span class="fa fa-angle-down"/>');
            });
        };

        gitbook.events.bind("page.change", function () {
            $('.section').each(function () {
                clickAction($(this), $(this).attr('target'));
            });
        });
    });
}

/**
 * 左侧分离
 */
function splitter() {
    require(['gitbook', 'jQuery'], function (gitbook, $) {
        if ($(window).width() <= 600) {
            return;
        }

        gitbook.events.bind('start', function () {});

        gitbook.events.bind('page.change', function () {
            var KEY_SPLIT_STATE = 'gitbook_split';

            var isDraggable = false;
            var splitState = null;
            var grabPointWidth = null;

            var $body = $('body');
            var $book = $('.book');
            var $summary = $('.book-summary');
            var $bookBody = $('.book-body');
            var $divider = $('<div class="divider-content-summary">' +
                '<div class="divider-content-summary__icon">' +
                '<i class="fa fa-ellipsis-v"></i>' +
                '</div>' +
                '</div>');

            $summary.append($divider);

            // restore split state from sessionStorage
            splitState = getSplitState();
            setSplitState(
                splitState.summaryWidth,
                splitState.summaryOffset,
                splitState.bookBodyOffset
            );

            setTimeout(function () {
                var isGreaterThanEqualGitbookV2_5 = !Boolean($('.toggle-summary').length);

                var $toggleSummary = isGreaterThanEqualGitbookV2_5 ? $('.fa.fa-align-justify').parent() : $('.toggle-summary');

                $toggleSummary.on('click', function () {

                    var summaryOffset = null;
                    var bookBodyOffset = null;

                    var isOpen = isGreaterThanEqualGitbookV2_5 ? !gitbook.sidebar.isOpen() : $book.hasClass('with-summary');

                    if (isOpen) {
                        summaryOffset = -($summary.outerWidth());
                        bookBodyOffset = 0;
                    } else {
                        summaryOffset = 0;
                        bookBodyOffset = $summary.outerWidth();
                    }

                    setSplitState($summary.outerWidth(), summaryOffset, bookBodyOffset);
                    saveSplitState($summary.outerWidth(), summaryOffset, bookBodyOffset);
                });

                $('.on-toolbar-action').on('click', function () {
                    $('.fa.fa-align-justify').parent()[0].click();
                });

                function fixationTopHight() {
                    var h = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
                    $(".divider-content-summary").css({
                        top: ($('.book-summary').scrollTop()),
                        hight: h
                    });
                }

                $('.book-summary').scroll(
                    function () {
                        fixationTopHight();
                    }
                );
                window.onscroll = fixationTopHight;
                window.onresize = fixationTopHight;

            }, 1);

            $divider.on('mousedown', function (event) {
                event.stopPropagation();
                isDraggable = true;
                grabPointWidth = $summary.outerWidth() - event.pageX;
            });

            $body.on('mouseup', function (event) {
                event.stopPropagation();
                isDraggable = false;
                saveSplitState(
                    $summary.outerWidth(),
                    $summary.position().left,
                    $bookBody.position().left
                );
            });

            $body.on('mousemove', function (event) {
                if (!isDraggable) {
                    return;
                }
                event.stopPropagation();
                event.preventDefault();
                $summary.outerWidth(event.pageX + grabPointWidth);
                $bookBody.offset({
                    left: event.pageX + grabPointWidth
                });
            });

            function getSplitState() {
                var splitState = JSON.parse(sessionStorage.getItem(KEY_SPLIT_STATE));
                splitState = splitState || {};
                splitState.summaryWidth = splitState.summaryWidth || $summary.outerWidth();
                splitState.summaryOffset = splitState.summaryOffset || $summary.position().left;
                splitState.bookBodyOffset = splitState.bookBodyOffset || $bookBody.position().left;
                return splitState;
            }

            function saveSplitState(summaryWidth, summaryWidthOffset, bookBodyOffset) {
                sessionStorage.setItem(KEY_SPLIT_STATE, JSON.stringify({
                    summaryWidth: summaryWidth,
                    summaryOffset: summaryWidthOffset,
                    bookBodyOffset: bookBodyOffset,
                }));
            }

            function setSplitState(summaryWidth, summaryOffset, bookBodyOffset) {
                $summary.outerWidth(summaryWidth);
                $summary.offset({
                    left: summaryOffset
                });
                $bookBody.offset({
                    left: bookBodyOffset
                });
                $summary.css({
                    position: 'absolute'
                });
                $bookBody.css({
                    position: 'absolute'
                });
            }
        });
    });
}

/**
 * 划过显示
 */
function spoiler() {
    require(["gitbook", "jquery"], function (gitbook, $) {
        gitbook.events.bind("page.change", function () {
            $('.spoiler').hover(function () {
                $(this).addClass('hover');
            }, function () {
                $(this).removeClass('hover');
            });

        });
    });
}

/**
 * 复制代码
 */
function copyCode() {
    require(["gitbook", "jQuery"], function (gitbook, $) {
        function selectElementText(el) {
            var range = document.createRange();
            range.selectNodeContents(el);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }

        function getSelectedText() {
            var t = '';
            if (window.getSelection) {
                t = window.getSelection();
            } else if (document.getSelection) {
                t = document.getSelection();
            } else if (document.selection) {
                t = document.selection.createRange().text;
            }
            return t;
        }

        function copyToClipboard(text) {
            if (window.clipboardData && window.clipboardData.setData) {
                // IE specific code path to prevent textarea being shown while dialog is visible.
                return clipboardData.setData("Text", text);

            } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                var textarea = document.createElement("textarea");
                textarea.textContent = text;
                textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    return document.execCommand("copy"); // Security exception may be thrown by some browsers.
                } catch (ex) {
                    console.warn("复制到剪贴板失败。", ex);
                    return false;
                } finally {
                    document.body.removeChild(textarea);
                }
            }
        }

        function expand(chapter) {
            chapter.show();
            if (chapter.parent().attr('class') != 'summary' && chapter.parent().attr('class') != 'book-summary' && chapter.length != 0) {
                expand(chapter.parent());
            }
        }

        gitbook.events.bind("page.change", function () {
            $("pre").each(function () {
                $(this).css("position", "relative");

                var $copyCodeButton = $("<button class='copy-code-button'>Copy</button>");
                $copyCodeButton.css({
                    "position": "absolute",
                    "top": "5px",
                    "right": "5px",
                    "padding": "3px",
                    "background-color": "#313E4E",
                    "color": "white",
                    "border-radius": "5px",
                    "-moz-border-radius": "5px",
                    "-webkit-border-radius": "5px",
                    "border": "2px solid #CCCCCC"
                });
                $copyCodeButton.click(function () {
                    var $codeContainer = $(this).siblings("code");
                    if ($codeContainer) {
                        selectElementText($codeContainer.get(0));
                        var selectedText = getSelectedText();

                        var buttonNewText = "";
                        if (copyToClipboard(selectedText) == true) {
                            buttonNewText = "Copied";
                            selectElementText($codeContainer.get(0));
                        } else {
                            buttonNewText = "Unable to copy";
                            selectElementText($codeContainer.get(0));
                        }

                        $(this).text(buttonNewText);
                        var that = this;
                        setTimeout(function () {
                            $(that).text("Copy");
                        }, 2000);
                    }
                });

                $(this).append($copyCodeButton);
            });
        });
    });
}

/**
 * 搜索
 */
function search() {
    require([
        'gitbook',
        'jquery'
    ], function (gitbook, $) {
        var MAX_DESCRIPTION_SIZE = 500;
        var state = gitbook.state;
        var INDEX_DATA = {};
        var usePushState = (typeof window.history.pushState !== 'undefined');

        // DOM Elements
        var $body = $('body');
        var $bookSearchResults;
        var $searchList;
        var $searchTitle;
        var $searchResultsCount;
        var $searchQuery;

        // Throttle search
        function throttle(fn, wait) {
            var timeout;

            return function () {
                var ctx = this;
                var args = arguments;
                if (!timeout) {
                    timeout = setTimeout(function () {
                        timeout = null;
                        fn.apply(ctx, args);
                    }, wait);
                }
            };
        }

        function displayResults(res) {
            $bookSearchResults = $('#book-search-results');
            $searchList = $bookSearchResults.find('.search-results-list');
            $searchTitle = $bookSearchResults.find('.search-results-title');
            $searchResultsCount = $searchTitle.find('.search-results-count');
            $searchQuery = $searchTitle.find('.search-query');

            $bookSearchResults.addClass('open');

            var noResults = res.count === 0;
            $bookSearchResults.toggleClass('no-results', noResults);

            // Clear old results
            $searchList.empty();

            // Display title for research
            $searchResultsCount.text(res.count);
            $searchQuery.text(res.query);

            // Create an <li> element for each result
            res.results.forEach(function (item) {
                var $li = $('<li>', {
                    'class': 'search-results-item'
                });

                var $title = $('<h3>');

                var $link = $('<a>', {
                    'href': gitbook.state.basePath + '/' + item.url + '?h=' + encodeURIComponent(res.query),
                    'text': item.title,
                    'data-is-search': 1
                });

                if ($link[0].href.split('?')[0] === window.location.href.split('?')[0]) {
                    $link[0].setAttribute('data-need-reload', 1);
                }

                var content = item.body.trim();
                if (content.length > MAX_DESCRIPTION_SIZE) {
                    content = content + '...';
                }
                var $content = $('<p>').html(content);

                $link.appendTo($title);
                $title.appendTo($li);
                $content.appendTo($li);
                $li.appendTo($searchList);
            });
            $('.body-inner').scrollTop(0);
        }

        function escapeRegExp(keyword) {
            // escape regexp prevserve word
            return String(keyword).replace(/([-.*+?^${}()|[\]/\\])/g, '\\$1');
        }

        function query(originKeyword) {
            if (originKeyword == null || originKeyword.trim() === '') return;
            var keyword;
            var results = [];
            var index = -1;
            for (var page in INDEX_DATA) {
                var store = INDEX_DATA[page];
                keyword = originKeyword.toLowerCase(); // ignore case
                var hit = false;
                if (store.keywords && ~store.keywords.split(/\s+/).indexOf(keyword.split(':').pop())) {
                    if (/.:./.test(keyword)) {
                        keyword = keyword.split(':').slice(0, -1).join(':');
                    } else {
                        hit = true;
                    }
                }
                var keywordRe = new RegExp('(' + escapeRegExp(keyword) + ')', 'gi');
                if (
                    hit || ~(index = store.body.toLowerCase().indexOf(keyword))
                ) {
                    results.push({
                        url: page,
                        title: store.title,
                        body: store.body.substr(Math.max(0, index - 50), MAX_DESCRIPTION_SIZE)
                            .replace(/^[^\s,.]+./, '').replace(/(..*)[\s,.].*/, '$1') // prevent break word
                            .replace(keywordRe, '<span class="search-highlight-keyword">$1</span>')
                    });
                }
            }
            displayResults({
                count: results.length,
                query: keyword,
                results: results
            });
        }

        function launchSearch(keyword) {
            // Add class for loading
            $body.addClass('with-search');
            $body.addClass('search-loading');

            function doSearch() {
                query(keyword);
                $body.removeClass('search-loading');
            }

            throttle(doSearch)();
        }

        function closeSearch() {
            $body.removeClass('with-search');
            $('#book-search-results').removeClass('open');
        }

        function bindSearch() {
            // Bind DOM
            var $body = $('body');

            // Launch query based on input content
            function handleUpdate() {
                var $searchInput = $('#book-search-input input');
                var keyword = $searchInput.val();

                if (keyword.length === 0) {
                    closeSearch();
                } else {
                    launchSearch(keyword);
                }
            }

            $body.on('keyup', '#book-search-input input', function (e) {
                if (e.keyCode === 13) {
                    if (usePushState) {
                        var uri = updateQueryString('q', $(this).val());
                        window.history.pushState({
                            path: uri
                        }, null, uri);
                    }
                }
                handleUpdate();
            });

            // Push to history on blur
            $body.on('blur', '#book-search-input input', function (e) {
                // Update history state
                if (usePushState) {
                    var uri = updateQueryString('q', $(this).val());
                    window.history.pushState({
                        path: uri
                    }, null, uri);
                }
            });
        }

        gitbook.events.on('start', function () {
            bindSearch();
            $.getJSON(state.basePath + '/search_plus_index.json').then(function (data) {
                INDEX_DATA = data;
                showResult();
                closeSearch();
            });
        });

        var markConfig = {
            'ignoreJoiners': true,
            'acrossElements': true,
            'separateWordSearch': false
        };
        // highlight
        var highLightPageInner = function (keyword) {
            var pageInner = $('.page-inner');
            if (/(?:(.+)?\:)(.+)/.test(keyword)) {
                pageInner.mark(RegExp.$1, markConfig);
            }
            pageInner.mark(keyword, markConfig);

            setTimeout(function () {
                var mark = $('mark[data-markjs="true"]');
                if (mark.length) {
                    mark[0].scrollIntoView();
                }
            }, 100);
        };

        function showResult() {
            var keyword, type;
            if (/\b(q|h)=([^&]+)/.test(window.location.search)) {
                type = RegExp.$1;
                keyword = decodeURIComponent(RegExp.$2);
                if (type === 'q') {
                    launchSearch(keyword);
                } else {
                    highLightPageInner(keyword);
                }
                $('#book-search-input input').val(keyword);
            }
        }

        gitbook.events.on('page.change', showResult);

        function updateQueryString(key, value) {
            value = encodeURIComponent(value);

            var url = window.location.href.replace(/([?&])(?:q|h)=([^&]+)(&|$)/, function (all, pre, value, end) {
                if (end === '&') {
                    return pre;
                }
                return '';
            });
            var re = new RegExp('([?&])' + key + '=.*?(&|#|$)(.*)', 'gi');
            var hash;

            if (re.test(url)) {
                if (typeof value !== 'undefined' && value !== null) {
                    return url.replace(re, '$1' + key + '=' + value + '$2$3');
                } else {
                    hash = url.split('#');
                    url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                    if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                        url += '#' + hash[1];
                    }
                    return url;
                }
            } else {
                if (typeof value !== 'undefined' && value !== null) {
                    var separator = url.indexOf('?') !== -1 ? '&' : '?';
                    hash = url.split('#');
                    url = hash[0] + separator + key + '=' + value;
                    if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                        url += '#' + hash[1];
                    }
                    return urll;
                } else {
                    return url;
                }
            }
        }
        window.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('data-need-reload')) {
                setTimeout(function () {
                    window.location.reload();
                }, 100);
            }
        }, true);
    });
}

search_layouts();
ExpandableChapters();
GitHubButtons();
sectionx();
splitter();
spoiler();
copyCode();
search();