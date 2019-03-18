const path = require('path');
try {
    var books = require("books-cli");
} catch (error) {
    throw new Error("books-cli 未正确安装或版本过低，请查看说明文档前置条件一节");
}

if (books.version != "1.0.21") {
    throw new Error("books-cli 版本过低，请升级！！");
}

function getConfig(context, type, defaultValue) {
    return context.config.get('pluginsConfig.books.' + type, defaultValue);
}

function getAssets() {
    var cssNames = [
        'bootstrap.min.css',
        'stype.min.css',
        'lightbox.min.css'
    ];
    var jsNames = [
        'jquery.mark.js',
        'bootstrap.min.js',
        'main.min.js',
        'lightbox.min.js'
    ];
    cssNames = cssNames.concat(books.Katex.cssNames);
    cssNames = cssNames.concat(getConfig(this, 'prism_themes', books.Prism.cssNames));

    return {
        assets: './assets',
        css: cssNames,
        js: jsNames
    };
}

module.exports = {
    // book: getAssets,
    website: getAssets,

    // 钩子
    hooks: {
        "init": function () {
            // 1 在解析书籍之前调用，然后生成输出和页面，只运行一次
            try {
                var outputDirectory = path.join(this.output.root(), '/gitbook/gitbook-plugin-books');

                books.Tools.copy_assets(books.Katex.assets, outputDirectory);
                books.Tools.copy_assets(books.Prism.assets, outputDirectory);
                return books.ImageCaptions.onInit(this);
            } catch (error) {
                throw error;
            }
        },

        'page:before': function (page) {
            // 2 在页面上运行模板引擎之前调用
            try {
                page = books.file_imports.process(page);
                page = books.Mermaid.processMermaidBlockList(page);
                page = books.PlantUML.processPumlBlockList(page);
                return page;
            } catch (error) {
                throw error;
            }
        },
        "page": function (page) {
            // 4 在输出和索引页面之前调用
            try {
                page = books.ImageCaptions.onPage(this, page);
                page = books.Prism.hooks_page(page);
                page = books.page_footer_copyright(this, page);
                page = books.search_plus.hooks_page(this, page);
                page = books.anchor_navigation_ex.hooks_page(page);
                page = books.sectionx.hooks_page(page);
                return page;
            } catch (error) {
                throw error;
            }
        },
        "finish:before": function () {
            // 5 在生成页面之后调用，在复制资源之前，覆盖，只运行一次
        },
        'finish': function () {
            // 6 只运行一次
            try {
                return books.search_plus.hooks_finish(this);
            } catch (error) {
                throw error;
            }
        }
    },

    // 扩展块
    blocks: {
        // 3
        math: {
            shortcuts: books.Katex.shortcuts,
            process: books.Katex.process
        },
        mermaid: {
            process: function (block) {
                try {
                    var body = block.body;
                    return books.Mermaid.string2svgAsync(body);
                } catch (error) {
                    throw error;
                }
            }
        },
        puml: {
            process: function (block) {
                try {
                    var body = block.body;
                    return books.PlantUML.string2svgAsync(body);
                } catch (error) {
                    throw error;
                }
            }
        },
        code: function (block) {
            try {
                var body = block.body;
                var lang = block.kwargs.language;
                return books.Prism.code_highlighted(body, lang);
            } catch (error) {
                throw error;
            }
        },
        s: {
            process: function (block) {
                return '<span class="spoiler">' + block.body + '</span>';
            }
        }
    },

    // 扩展过滤器
    filters: {}
};