(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[17],{dbe6:function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-page",{staticClass:"flex flex-center bg-primary"},[n("div",{staticClass:"text-center text-h4 text-white text-bold",staticStyle:{"max-width":"300px"}},[e._v("ESCANEA EL CÓDIGO QR DEL NEGOCIO")]),n("div",{staticStyle:{border:"4px dashed #6ee0ff","border-radius":"5%",width:"330px",height:"250px"}},[n("vue-qr-reader",{attrs:{"stop-on-scanned":!1},on:{"code-scanned":e.codeArrived}})],1)])},r=[],c=(n("8e6e"),n("8a81"),n("ac6a"),n("cadf"),n("06db"),n("456d"),n("28a5"),n("c47a")),a=n.n(c),s=n("d8f3"),i=n.n(s),l=n("bc3a"),d=n.n(l),u=(n("a7fe"),n("2f62")),p=n("2a19");function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function g(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(Object(n),!0).forEach((function(t){a()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var b={name:"Home",components:{VueQrReader:i.a},data:function(){return{}},methods:g(g({},Object(u["b"])("store",["setBusiness"])),{},{readQR:function(){var e=this,t="5f0f752e3caf9c78056d658d";d.a.get("/detect-qr/"+t).then((function(n){console.log(n.data),e.setBusiness(n.data),e.$router.push("/Welcome/"+t)})).catch((function(e){console.log(e.response),p["a"].create({message:"Lo sentimos. No se encontró ningun negocio registrado con el QR proporcionado.",color:"negative"})}))},codeArrived:function(e){var t=this,n=e.split("https://filasinfila.com/Welcome/"),o=n[1];void 0==o||null==o?p["a"].create({message:"Este QR no corresponde con ningun registro relacionado con FilaSinFila",color:"negative"}):d.a.get("/detect-qr/"+o).then((function(e){console.log(e.data),t.setBusiness(e.data),t.$router.push("/Welcome/"+o)})).catch((function(e){console.log(e.response),p["a"].create({message:"Lo sentimos. No se encontró ningun negocio registrado con el QR proporcionado.",color:"negative"})}))}})},h=b,O=n("2877"),m=n("9989"),v=n("eebe"),w=n.n(v),y=Object(O["a"])(h,o,r,!1,null,null,null);t["default"]=y.exports;w()(y,"components",{QPage:m["a"]})}}]);