module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 240000,
      }
    }
  },
  // pwa: {
  //   name: 'watch3r',
  //   themeColor: '#000000',
  //   msTileColor: '#c00000',
  //   appleMobileWebAppCapable: 'yes',
  //   appleMobileWebAppStatusBarStyle: 'black',
  //   manifestPath: 'manifest.json',
  //   manifestOptions: {
  //     name: 'watch3r',
  //     short_name: 'watch3r',
  //     start_url: 'https://watch3r.ttntm.me',
  //     display: 'standalone',
  //     theme_color: '#000000',
  //     icons: [
  //       {
  //           "src": "/android-chrome-192x192.png",
  //           "sizes": "192x192",
  //           "type": "image/png"
  //       },
  //       {
  //           "src": "/android-chrome-512x512.png",
  //           "sizes": "512x512",
  //           "type": "image/png"
  //       }
  //     ]
  //   },
  //   // https://dev.to/drbragg/manifest-vs-head-icons-in-the-vue-cli-pwa-plugin-12fg
  //   iconPaths: {
  //     favicon32: 'favicon-32x32.png',
  //     favicon16: 'favicon-16x16.png',
  //     appleTouchIcon: 'apple-touch-icon.png',
  //     maskIcon: 'safari-pinned-tab.svg',
  //     msTileImage: 'mstile-144x144.png'
  //   },

  //   // configure the workbox plugin
  //   workboxPluginMode: 'InjectManifest',
	// 	workboxOptions: {
	// 		// swSrc is required in InjectManifest mode.
	// 		swSrc: 'sw.js',
	// 		// ...other Workbox options...
	// 		exclude: [/\.map$/, /_redirects/],
	// 	},
  // }
}