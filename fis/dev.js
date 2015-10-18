/**
 * Created by julien.zhang on 2015/2/6.
 */


//fis.config.set('project.include', /^\/(?:html|js|css|img)\/.*\.(?:html|js|css|swf|mp4|jpg|png|gif|ico|cur|otf|eot|svg|ttf|woff|woff2)$/i);
//fis.config.set('project.include', /^\/(?:html|js|css|img)\/.*$/img);

//处理sass
//fis.config.set('modules.parser.scss', 'sass');
//fis.config.set('modules.parser.sass', 'sass');
//fis.config.set('roadmap.ext.scss', 'css');
//fis.config.set('roadmap.ext.sass', 'css');


//静态资源文件域名设置
fis.config.merge({
    roadmap: {
        domain:''
    }
});

//部署设置
fis.config.set('roadmap.path', [

    {
        reg: /.+\.(?:cmd|bat|json)$/i,
        release: false
    },
    {
        reg: /\/bower_components\/.*$/i,
        release: false
    },
    {
        reg: /\/(?:html|js|css)\/.*(?:[-_]tpl\.html)$/i,
        release: false
    },
    {
        reg: /\/css\/.*\/include\/.*\.(?:css|scss|less)$/i,
        release: false
    },

    //所有已_开头的文件，不发布
    {
        reg: /.*?\/_[-_\w]+\.(?:html|js|less|scss|css|png|gif|jpg)$/i,
        release: false
    },

    //css目录下css文件
    {
        reg: /^\/css\/.+\.(?:css|scss)$/i,
        release: '$&',
        url: '/static$&',
        useDomain: true,
        useSprite: true,
        useHash: true
    },
    //其它css文件
    {
        reg: /.*\/(.+\.(?:css|scss))/i,
        release: '/css$&',
        url: '/static/css$&',
        useDomain: true,
        useSprite: true,
        isCssLike: true,
        useHash: true
    },
    //js目录下js文件
    {
        reg: /^\/js\/.+\.js/i,
        release: '$&',
        url: '/static$&',
        useDomain: true,
        isJsLike: true,
        useHash: true
    },
    //其它js文件
    {
        reg: '**.js',
        release: '/js$&',
        url: '/static/js$&',
        useDomain: true,
        isJsLike: true,
        useHash: true
    },

    //模板html
    {
        reg: /^\/html\/(.+\.tpl\.html)$/i,
        release: 'view/$1',
        url: '',
        useDomain: false,
        useHash: false
    },

    //静态html
    {
        reg: /^\/html\/.+\.html$/i,
        release: '$&',
        url: '/static$&',
        useDomain: true,
        useHash: false
    },

    //所有文件名包含pic的图片, 如： pic_0.png pic-0.png 0-pic.jpg a-pic.jpg
    {
        reg: /.*\/((?:[\w_-]+\/)*(?:pic[-_]\w+|\w+[-_]pic[-_\w]*)\.(?:jpg|png|gif))$/i,
        release: 'img/$1',
        url: '/static/img/$1',
        useDomain: true,
        useHash: false
    },
    //所有文件名包含css-,css_,-css,_css 图片,
    {
        reg: /.*\/((?:[\w_-]+\/)*(?:css[-_]\w+|\w+[-_]css[-_\w]*)\.(?:jpg|png|gif))$/i,
        release: 'img/$1',
        url: '/static/img/$1',
        useDomain: false,
        useHash: false
    },

    //img目录下背景图片,css中被引用
    {
        reg: /^\/img\/.+/i,
        release: '$&',
        url: '/static$&',
        useDomain: false,
        useHash: true
    },

    //html目录下图片,在html页面被引用
    {
        reg: /.*\/(.+\.(?:jpg|png|gif))/i,
        release: 'img$&',
        url: '/static/img$&',
        useDomain: true,
        useHash: true
    },

    //other
    {
        reg: /.+$/i,
        release: false
    }

]);

//使用fis release --dest local来使用这个配置
fis.config.merge({
    deploy: {
        local: {
            to: '../app/static',
            exclude: /(?:\/(?:demo|example|data|test)\/.+\.(?:html|js|css))|(?:\/_[-_\w\d]+\.html)|(?:\/.+\.md)/i
        }
    }
});