(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{dbe6:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-page",{staticClass:"flex flex-center bg-primary"},[n("div",{staticClass:"text-center text-h4 text-white text-bold",staticStyle:{"max-width":"300px"}},[e._v("ESCANEA EL CÓDIGO QR DEL NEGOCIO")]),n("div",{staticStyle:{border:"4px dashed #6ee0ff","border-radius":"5%",width:"330px",height:"250px"},on:{click:e.readQR}},[n("vue-qr-reader",{on:{"code-scanned":e.codeArrived}})],1)])},o=[],a=n("d8f3"),c=n.n(a),d={name:"Home",components:{VueQrReader:c.a},data:function(){return{}},methods:{readQR:function(){this.$router.push("/Welcome")},codeArrived:function(e){console.log(e),this.$router.push("/Welcome")}}},s=d,i=n("2877"),l=n("9989"),u=n("eebe"),p=n.n(u),h=Object(i["a"])(s,r,o,!1,null,null,null);t["default"]=h.exports;p()(h,"components",{QPage:l["a"]})}}]);