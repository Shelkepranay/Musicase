/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "b08b48ed47f1db15cfd8892cb574ce58"
  }, {
    "url": "pwa-512x512.png",
    "revision": "4e01f530e176207759c5480b5cdd2207"
  }, {
    "url": "pwa-192x192.png",
    "revision": "83ee7434d08bed4dd57626b32f9af965"
  }, {
    "url": "index.html",
    "revision": "d20fa5b8f0360378bc2f270ba6e6c994"
  }, {
    "url": "icon.svg",
    "revision": "321d3f01ad96b9687c9e94d8d3f4306b"
  }, {
    "url": "icon-maskable.svg",
    "revision": "40c7a64d6ff6e31a75fe213fceeffd7a"
  }, {
    "url": "favicon.ico",
    "revision": "57290c5b4a10df42757f5b0cc06ad2cc"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "95a43c3e0950f1279b2a5a9daca92efa"
  }, {
    "url": "assets/web-CFtee9tD.js",
    "revision": null
  }, {
    "url": "assets/index-C_5-Got5.css",
    "revision": null
  }, {
    "url": "assets/index-Bq9DmkLh.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "95a43c3e0950f1279b2a5a9daca92efa"
  }, {
    "url": "favicon.ico",
    "revision": "57290c5b4a10df42757f5b0cc06ad2cc"
  }, {
    "url": "icon-maskable.svg",
    "revision": "40c7a64d6ff6e31a75fe213fceeffd7a"
  }, {
    "url": "icon.svg",
    "revision": "321d3f01ad96b9687c9e94d8d3f4306b"
  }, {
    "url": "pwa-192x192.png",
    "revision": "83ee7434d08bed4dd57626b32f9af965"
  }, {
    "url": "pwa-512x512.png",
    "revision": "4e01f530e176207759c5480b5cdd2207"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "b08b48ed47f1db15cfd8892cb574ce58"
  }, {
    "url": "manifest.webmanifest",
    "revision": "a2c7ef85d7f79d71511d560158ae8d53"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
