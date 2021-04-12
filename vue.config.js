// vue-cli配置
const path = require('path')
const glob = require('glob')
const srcConfig = require('./src/config')
const titleConfig = require('./src/pages/title')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve (dir) {
	return path.join(__dirname, dir)
}

function getEntry(globPath) {
	let entries = {};
	glob.sync(globPath).forEach(function(entry) {
		var tmp = entry.split('/').splice(-3);
		entries[tmp[1]] = {
			entry: 'src/' + tmp[0] + '/' + tmp[1] + '/' + 'index.js',
			template: 'src/' + tmp[0] + '/' + tmp[1] + '/' + 'index.html',
			// template: 'public/index.html',
			filename: `${tmp[1]}.html`,
			title: titleConfig[tmp[1]] ? `${titleConfig[tmp[1]]}-${srcConfig.projectName}` : srcConfig.projectName
		};
	});
	return entries;
}

let pages = getEntry('./src/pages/**?/*.js');

module.exports = {
	publicPath: srcConfig.isProd ? '././' : '',
	lintOnSave: false, // elint
	productionSourceMap: false, // 关闭ource map，加速生产环境构建
  pages,
  outputDir: 'dist', // 构建输出目录
	devServer: {
		port: 8786, // 本地端口
		// 代理
		proxy: {
			'/proxy': {
				target: srcConfig.baseUrl,
				changeOrigin: true,
				pathRewrite: {
					'^/proxy': ``
				}
			}
		}
	},
	chainWebpack: config => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('_images', resolve('src/assets/images'))
			.set('_c', resolve('src/components'))
      .end()
		config.module
			.rule('images')
			.use('url-loader')
			.loader('url-loader')
			.tap(options => {
				// 修改它的选项...
				// options.limit = 100
				return options
			})
		// 移除prefetch
		Object.keys(pages).forEach(entryName => {
			config.plugins.delete(`prefetch-${entryName}`);
		});

		if(process.env.NODE_ENV === "production") {
			config.plugin("extract-css").tap(() => [{
				path: path.join(__dirname, "./dist"),
				filename: "css/[name].[contenthash:8].css"
			}]);
    }
    // HMR(热更新)
    config.resolve.symlinks(true);
	},
	configureWebpack: config => {
		plugins: [
			new BundleAnalyzerPlugin()
		]
	},
	css: {
		loaderOptions: {
			less: {
				// 若使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
				lessOptions: {
					modifyVars: {
						// 覆盖变量
						// 'text-color': '#111',
						// 'border-color': '#eee',
						// 'swipe-indicator-active-background-color': '#FFD100', // 轮播指示器颜色
						// 或者可以通过 less 文件覆盖（文件路径为绝对路径）
						hack: `true; @import "${path.join(__dirname, './src/assets/style/reset-vant.less')}";`,
					}
				}
			},
			postcss: {
					plugins: [
					// require('postcss-px2rem')({
					// 	remUnit: 37.5
					// })
					require('postcss-px2rem-exclude')({
						remUnit: 37.5,
						// exclude: /node_modules|vant/i
					})
				]
			},
		}
	}
}
