if(!self.define){let e,c={};const i=(i,n)=>(i=new URL(i+".js",n).href,c[i]||new Promise((c=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=c,document.head.appendChild(e)}else e=i,importScripts(i),c()})).then((()=>{let e=c[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(c[o])return;let r={};const t=e=>i(e,o),d={module:{uri:o},exports:r,require:t};c[o]=Promise.all(n.map((e=>d[e]||t(e)))).then((e=>(s(...e),r)))}}define(["./workbox-c668f40e"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"favicon.ico",revision:"5c5b0329fbcccf5f934d91ded1bc807b"},{url:"favicon/favicon.ico",revision:"5c5b0329fbcccf5f934d91ded1bc807b"},{url:"manifest-1aa3e79651.webmanifest",revision:"5e72579d8bea5c2edc09cce52237c8e5"},{url:"script-8971778a9c.js",revision:"8971778a9cc0ad74eeea6d9ed8a7b87f"},{url:"style-9d7563432d.css",revision:"9d7563432dd65205c8d7838bdc7f3d9e"}],{}),e.registerRoute(/\.(?:png|jpg|avif|svg|ico)$/,new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:30})]}),"GET"),e.registerRoute(/(\.(?:html))|(\/)$/,new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:20})]}),"GET")}));