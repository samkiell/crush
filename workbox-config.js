module.exports = {
  globDirectory: ".",
  globPatterns: [
    "public/**/*.{js,css,html,png,jpg,jpeg,svg,json,ico,woff,woff2}",
    ".next/static/**/*.{js,css,jpg,jpeg,png,svg}",
  ],
  globIgnores: [
    "**/node_modules/**/*",
    "public/sw.js",
    "public/workbox-*.js",
    "**/*.map",
  ],
  swDest: "public/sw.js",
  swSrc: "public/sw-source.js",
  modifyURLPrefix: {
    "public/": "/",
    ".next/": "/_next/",
  },
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
};
 