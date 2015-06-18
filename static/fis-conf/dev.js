/**
 * Created by julien.zhang on 2015/2/6.
 */

//开启simple插件，注意需要先进行插件安装 npm install -g fis-postpackager-simple
fis.config.set('modules.postpackager', 'simple');


//通过pack设置干预自动合并结果，将公用资源合并成一个文件，更加利于页面间的共用
/*fis.config.merge({
 pack: {
 '/js/pkg/lib.before.js': [
 '/js/vendor/modernizr-2.6.2.min.js'
 ],
 '/js/pkg/lib.after.js': [
 '/js/vendor/underscore-1.6.0.min.js',
 '/js/vendor/jquery/jquery-1.10.2.min.js',
 '/js/vendor/plugins.js'],
 '/js/pkg/brick.js': ['/js/brick/brick.js'],
 '/js/pkg/common.js' : ['/js/common/lang.js', '/js/common/common.js'],
 '/css/pkg/lib.css': [
 '/css/vendor/normalize.css',
 '/css/vendor/main.css',
 '/css/vendor/animations.css'
 ]
 }
 });*/


fis.config.set('project.include', /^\/(?:html|js|css|img)\/.*\.(?:html|js|css|swf|mp4|jpg|png|gif|ico|cur)$/i);

fis.config.set('project.fileType.image', 'swf, mp4, ico, cur');

//静态资源文件域名设置
fis.config.merge({
    roadmap : {
        domain : ''
    }
});

//部署设置
fis.config.set('roadmap.path', [

    //css目录下css文件
    {
        reg: /^\/css\/.+\.css/i,
        release: 'assets$&',
        url: '/assets$&',
        useDomain:true,
        useSprite: true,
        useHash: true
    },
    //其它css文件
    {
        reg: /.*\/(.+\.css)/i,
        release: 'assets/css$&',
        url: '/assets/css$&',
        useDomain:true,
        useSprite: true,
        isCssLike: true,
        useHash: true
    },
    //js目录下js文件
    {
        reg:/^\/js\/bower_components\/.+$/i,
        release:false
    },
    {
        reg: /^\/js\/.+\.js/i,
        release: 'assets$&',
        url: '/assets$&',
        useDomain:true,
        isJsLike: true,
        useHash: true
    },
    //其它js文件
    {
        reg: '**.js',
        release: 'assets/js$&',
        url: '/assets/js$&',
        useDomain:true,
        isJsLike: true,
        useHash: true
    },

    //静态html
    {
        reg: /^\/html\/.+\.html$/i,
        release: '$&',
        url: '$&',
        useDomain:true,
        useHash: false
    },

    //pic目录下图片,pic目录用于放置img标签图片
    {
        reg: /^\/(?:img|html)\/((?:[\w_-]+\/)*pic\/.+)$/i,
        release: 'assets/img/$1',
        url: '/assets/img/$1',
        useDomain:true,
        useHash: true
    },
    //html目录下图片,在html页面被引用
    {
        reg: /\/html\/(.+\.(?:jpg|png|gif|cur))/i,
        release: 'assets/img/$1',
        url: '/assets/img/$1',
        useDomain:true,
        useHash: true
    },

    //img目录下背景图片,css中被引用
    {
        reg: /^\/img\/.+/i,
        release: 'assets$&',
        url: '/assets$&',
        useDomain:false,
        useHash: true
    },

    //css目录里的sprite图片
    {
        reg: /^\/css\/(.+\.png)/i,
        release: 'assets/img/$1',
        url:'/assets/img/$1',
        useDomain:false,
        useHash: true
    },

    //任何_开头的img文件
    {
        reg: /^\/.*\/(_[-_\w]+\.(?:jpg|png|gif|cur))/i,
        release: 'assets/img/$1',
        url: '/assets/img/$1',
        useDomain:false
    }

]);

//背景图片sprite设置
//fis.config.set('settings.spriter.csssprites.margin', 10);
//fis.config.set('settings.spriter.csssprites.layout', 'matrix');
//fis.config.set('settings.spriter.csssprites.htmlUseSprite', true);
//fis.config.set('settings.spriter.csssprites.styleReg', /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig);


//使用fis release --dest local来使用这个配置
fis.config.merge({
    deploy : {
        local : {
            to : './publish',
            exclude : /(?:\/(?:include|src|demo|example|data|test)\/.+\.(?:html|js|css))|(?:\/_[-_\w\d]+\.html)|(?:\/.+\.md)/i
        }
    }
});