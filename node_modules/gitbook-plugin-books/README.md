# 为了节约空间而写的一个插件

[![npm](https://img.shields.io/npm/v/gitbook-plugin-books.svg) ![npm](https://img.shields.io/npm/dt/gitbook-plugin-books.svg)](https://www.npmjs.com/package/gitbook-plugin-books)

由于本人经常性的写一些文档，现有的很多插件版本各方面存在问题，甚至还有一些作者已经放弃维护了，所以决定自己写一个综合性的插件用来满足个人需求。

本插件只在 Windows 系统下进行测试，Linux 等其他环境不保证问题的存在！！！

本人环境【Windows 10 64bit，nodejs v8.11.3，gitbook 3】

## 前置条件

使用 `npm root -g`查看`npm`全局模块安装路径。

新建`NODE_PATH`环境变量。

将路径加入到`NODE_PATH`环境变量中。

全局安装相应模块。

```bash
npm install -g books-cli
```

>国内用户请使用`cnpm`安装

```bash
npm install -g cnpm
cnpm install -g books-cli
```

>请时刻关注 `books-cli` 的升级哦![npm](https://img.shields.io/npm/v/books-cli.svg)

## 编辑 book.json

```json
{
  "author": "刘士",
  "plugins": [
    "-lunr",
    "-search",
    "-highlight",
    "-sharing",
    "books"
  ],
  "pluginsConfig": {
    "books": {
      "prism_themes": "prismjs/themes/prism-okaidia.css",
      "github_url": "https://liushilive.github.io/"
    },
    "theme-default": {
      "showLevel": true
    }
  }
}
```

运行 `gitbook install`.

## 数学公式使用

>支持 [KaTeX](https://khan.github.io/KaTeX/docs/supported.html) 已支持的全部符号。

* 内联数学公式：

      $$\int_{-\infty}^\infty g(x) dx$$

      $$\fcolorbox{red}{aqua}{A}$$

      $$\textcolor{#228B22}{F=ma}$$

* 块级数学公式：

      $$
      \def\arraystretch{1.5}
      \begin{array}{c|c:c}
        a & b & c \\ \hline
        d & e & f \\
        \hdashline
        g & h & i
      \end{array}
      $$

## 流程图使用

* 支持 [mermaid](https://mermaidjs.github.io/) 以支持的流程图。

      ```mermaid
      graph TD;
        A-->B;
        A-->C;
        B-->D;
        C-->D;
      ```

* 支持 [PlantUML](http://plantuml.com/) 以支持的流程图。

  需要安装 [Graphviz](http://www.graphviz.org/) 以生成所有图表类型

  >`@startuml`与`@enduml` 如果存在，将采用默认样式。
  >
  >否则采用 18 号字体，除非需要采用个性化配置，否则不加。

      ```puml
      @startuml

      Class Stage
      Class Timeout {
        +constructor:function(cfg)
        +timeout:function(ctx)
        +overdue:function(ctx)
        +stage: Stage
      }
      Stage <|-- Timeout

      @enduml
      ```

## 代码高亮支持

>采用 [prism](https://prismjs.com/) 支持所有官方支持语言。

### 主题样式

* 支持官方所有主题

      prismjs/themes/prism.css

      prismjs/themes/prism-coy.css

      prismjs/themes/prism-dark.css

      prismjs/themes/prism-funky.css

      prismjs/themes/prism-okaidia.css

      prismjs/themes/prism-solarizedlight.css

      prismjs/themes/prism-tomorrow.css

      prismjs/themes/prism-twilight.css

* 配置

  ```json
  "pluginsConfig": {
    "books": {
      "prism_themes": [
        "prismjs/themes/prism-okaidia.css"
      ]
    }
  }
  ```

## 添加 github url 图标

* 配置

  ```json
  "pluginsConfig": {
    "books": {
      "github_url": "https://liushilive.github.io/"
    }
  }
  ```

## 鼠标悬浮可见

>用法：把要隐藏文本内容放在 `{%s%}` 和 `{%ends%}` 之间。

    {%s%}Hello World.{%ends%}

## 点击隐藏或显示片段

>可以使用标签定义一个新的片段：（默认隐藏）

```html
<!--sec data-title="点我隐藏答案" data-show=true ces-->
B
<!--endsec-->

<!--sec data-title="点我看分析" data-id="section2" data-show=false ces-->
CPU
<!--endsec-->

<!--sec data-title="点我看分析" ces-->
C
<!--endsec-->
```

>本标签包含以下参数：

* title：标题
* show：是否初始隐藏

## 导入外部代码文件

`@import "你的代码文件" {语言}`

`@import "你的代码文件"`

>如果没有指明相关语言，将默认根据文件后缀推断语言。
