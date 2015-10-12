module.exports = function(grunt) {
	// LiveReload的默认端口号，你也可以改成你想要的端口号
	var lrPort = 35729;
	// 使用connect-livereload模块，生成一个与LiveReload脚本
	// <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
	var lrSnippet = require('connect-livereload')({
		port: lrPort
	});
	// 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	var lrMiddleware = function(connect, options, middlwares) {
		return [
			lrSnippet,
			// 静态文件服务器的路径
			serveStatic(options.base[0]),
			// 启用目录浏览(相当于IIS中的目录浏览)
			serveIndex(options.base[0])
		];
	};

	// 项目配置(任务配置)
	grunt.initConfig({
		// 读取我们的项目配置并存储到pkg属性中
		pkg: grunt.file.readJSON('package.json'),
		// 通过connect任务，创建一个静态服务器
		connect: {
			options: {
				// 服务器端口号
				port: 8000,
				// 服务器地址(可以使用主机名localhost，也能使用IP)
				hostname: 'localhost',
				// 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
				base: '.'
			},
			livereload: {
				options: {
					// 通过LiveReload脚本，让页面重新加载。
					middleware: lrMiddleware
				}
			}
		},
		// 通过watch任务，来监听文件是否有更改
		watch: {
			client: {
				// 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
				options: {
					livereload: lrPort
				},
				// '**' 表示包含所有的子目录
				// '*' 表示包含所有的文件
				files: ['build/*.html', 'build/css/*', 'build/js/*', 'build/images/**/*']
			}
		}
	}); // grunt.initConfig配置完毕

	// 加载插件
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// 自定义任务
	grunt.registerTask('live', ['connect', 'watch']);
};