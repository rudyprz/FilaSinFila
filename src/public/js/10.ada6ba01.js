(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{1:function(e,s){},"9a87":function(e,s,t){"use strict";t.r(s);var a=function(){var e=this,s=e.$createElement,a=e._self._c||s;return a("q-page",{attrs:{align:"center"}},[a("div",{staticClass:"bg-white text-center"},[a("div",{staticClass:"text-body1 text-grey-7 q-pa-md"},[e._v("FilaSinFila te ofrece de manera gratuita notificarles a tus clientes en tiempo real. Si lo deseas, puedes adquirir "),a("span",{staticClass:"text-primary text-bold"},[e._v("paquetes de mensajes")]),e._v(" para notificar a tus clientes por "),a("span",{staticClass:"text-primary text-bold"},[e._v("SMS")]),e._v(" también.")]),a("div",{staticClass:"q-ma-md"},[e.listBusiness.length>0?a("q-btn",{attrs:{label:"Cambiar Sucursal",color:"primary",outline:"",rounded:""},on:{click:function(s){e.modalSucursal=!0}}}):e._e()],1),a("q-dialog",{model:{value:e.modalSucursal,callback:function(s){e.modalSucursal=s},expression:"modalSucursal"}},[a("q-card",{},[a("q-card-section",{staticClass:"q-gutter-y-md"},[a("div",{staticClass:"text-primary text-h6 text-center"},[e._v("SELECCIONA TU SUCURSAL")]),a("q-card",{staticClass:"shadow-10 text-center q-pa-md",staticStyle:{border:"solid 1px #dddddd","border-radius":"20px"}},[a("div",{staticClass:"text-body2 text-grey-8"},[e._v("Sucursal Principal:"),a("br"),a("span",{staticClass:"text-body1 text-primary text-bold"},[e._v(e._s(e.businessDetails.nombreC))])]),e.businessDetails._id===e.selectedBusiness._id?a("div",{staticClass:"text-body1 text-primary"},[e._v("SUCURSAL SELECCIONADA")]):a("q-btn",{attrs:{label:"Seleccionar",unelevated:"",rounded:"",color:"primary"},on:{click:e.seleccionarPrincipal}})],1),a("div",{staticClass:"text-body2 text-grey-8 text-center"},[e._v("Sucursales adicionales:")]),e._l(e.listBusiness,(function(s,t){return a("q-card",{key:t,staticClass:"shadow-10 text-center q-pa-md",staticStyle:{border:"solid 1px #dddddd","border-radius":"20px"}},[a("div",{staticClass:"text-body1 text-primary text-bold"},[e._v(e._s(s.nombreC))]),s._id===e.selectedBusiness._id?a("div",{staticClass:"text-body1 text-primary"},[e._v("SUCURSAL SELECCIONADA")]):a("q-btn",{attrs:{label:"Seleccionar",unelevated:"",rounded:"",color:"primary"},on:{click:function(s){return e.seleccionarAdicional(t)}}})],1)}))],2),a("q-card-actions",{attrs:{align:"center"}},[a("q-btn",{attrs:{label:"Cerrar",outline:"",color:"negative"},on:{click:function(s){e.modalSucursal=!1}}})],1)],1)],1),a("div",{staticClass:"text-h6 text-primary text-bold"},[e._v(e._s(e.selectedBusiness.nombreC))]),a("div",{staticClass:"bg-primary q-pb-md q-ma-md",staticStyle:{"border-radius":"20px"}},[a("div",{staticClass:"q-pt-md text-white",staticStyle:{"font-size":"1.5em"}},[e._v("TURNO:")]),a("div",{staticClass:"text-white text-bold",staticStyle:{"font-size":"4em"}},[e._v(e._s(e.selectedBusiness.turnoActual))])]),a("div",{staticClass:"text-primary text-subtitle1 q-pa-sm"},[e._v("Personas en espera:")]),a("div",{staticClass:"text-primary text-bold",staticStyle:{"font-size":"2em"}},[e._v(e._s(e.selectedBusiness.turnosAcumulado-e.selectedBusiness.turnoActual))]),a("div",{staticClass:"text-primary text-subtitle1 q-pa-sm"},[e._v("Personas en el establecimiento:")]),a("div",{staticClass:"text-primary text-bold",staticStyle:{"font-size":"2em"}},[e._v(e._s(e.selectedBusiness.personasActual))]),a("div",{staticClass:"text-primary text-subtitle1 q-pa-sm"},[e._v("Máximo de personas:")]),a("div",{staticClass:"bg-white text-center text-primary text-bold",staticStyle:{"font-size":"2em"}},[e._v(e._s(e.selectedBusiness.maxPersonas))]),a("div",{staticClass:"q-pa-md q-ma-md bg-primary",staticStyle:{"border-radius":"20px"}},[a("img",{staticStyle:{"max-width":"200px"},attrs:{src:t("cca6")},on:{click:e.checkIn}})]),a("div",{staticClass:"q-pa-md q-ma-md bg-secondary",staticStyle:{"border-radius":"20px"}},[a("img",{staticStyle:{"max-width":"200px"},attrs:{src:t("f9eb")},on:{click:e.checkOut}})])],1)])},n=[],i=(t("8e6e"),t("8a81"),t("ac6a"),t("cadf"),t("06db"),t("456d"),t("c47a")),c=t.n(i),u=t("2a19"),r=t("2f62"),o=t("bc3a"),l=t.n(o),d=(t("a7fe"),t("8055")),p=t.n(d);function m(e,s){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);s&&(a=a.filter((function(s){return Object.getOwnPropertyDescriptor(e,s).enumerable}))),t.push.apply(t,a)}return t}function b(e){for(var s=1;s<arguments.length;s++){var t=null!=arguments[s]?arguments[s]:{};s%2?m(Object(t),!0).forEach((function(s){c()(e,s,t[s])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):m(Object(t)).forEach((function(s){Object.defineProperty(e,s,Object.getOwnPropertyDescriptor(t,s))}))}return e}var A=p()(),B={name:"HomeB",data:function(){return{modalSucursal:!1,currentPeople:2,currentTurn:42,pushMessage:"SECCIÓN DE PUSH Y COMUNICACIÓN INTERNA DEL NEGOCIO"}},computed:b({},Object(r["c"])("store",["maxPersonas","ownerDetails","businessDetails","selectedBusiness","listBusiness"])),methods:b(b({},Object(r["b"])("store",["updateBusiness","setSelectedBusinessDetails","updateSelectedBusiness"])),{},{seleccionarPrincipal:function(){this.setSelectedBusinessDetails(this.businessDetails),this.modalSucursal=!1},seleccionarAdicional:function(e){this.setSelectedBusinessDetails(this.listBusiness[e]),this.modalSucursal=!1},checkIn:function(){var e=this;if(this.selectedBusiness.personasActual===this.selectedBusiness.maxPersonas)u["a"].create({message:"Haz alcanzado el límite de personas en el establecimiento. Espera a que se retire una persona y realiza un checkout",color:"negative"});else{var s=this.selectedBusiness._id;l.a.post("/check-in/"+s,{personasActual:this.selectedBusiness.personasActual,turnoActual:this.selectedBusiness.turnoActual}).then((function(s){if(console.log(s.data),"ok-usuario"==s.data.mensaje){var t=e.selectedBusiness.tokens-1,a=e.selectedBusiness.personasActual+1,n=e.selectedBusiness.turnoActual+1;e.updateSelectedBusiness({personasActual:e.selectedBusiness.personasActual+1,turnoActual:e.selectedBusiness.turnoActual+1,tokens:t}),A.emit("update-turn",{turnoActual:e.selectedBusiness.turnoActual,businessID:e.selectedBusiness._id}),A.emit("tu-turno",{message:"¡Ya es tu turno!",userID:s.data.userID,businessID:e.selectedBusiness._id}),A.emit("update-token",{tokens:t,businessID:e.selectedBusiness._id}),A.emit("update-b",{personasActual:a,turnoActual:n,businessID:e.selectedBusiness._id}),u["a"].create({message:"Se mando mensaje SMS y notificación al usuario del siguiente turno.",color:"primary"})}else if("ok-usuario-nosms"==s.data.mensaje){a=e.selectedBusiness.personasActual+1,n=e.selectedBusiness.turnoActual+1;e.updateSelectedBusiness({personasActual:e.selectedBusiness.personasActual+1,turnoActual:e.selectedBusiness.turnoActual+1}),A.emit("update-turn",{turnoActual:e.selectedBusiness.turnoActual,businessID:e.selectedBusiness._id}),A.emit("tu-turno",{message:"¡Ya es tu turno!",userID:s.data.userID,businessID:e.selectedBusiness._id}),A.emit("update-b",{personasActual:a,turnoActual:n,businessID:e.selectedBusiness._id}),u["a"].create({message:"¡Se mandó notificación en tiempo real al usuario.",color:"primary"})}else if("ok-usuariodejado"==s.data.mensaje){a=e.selectedBusiness.personasActual,n=e.selectedBusiness.turnoActual+1;e.updateSelectedBusiness({personasActual:e.selectedBusiness.personasActual,turnoActual:e.selectedBusiness.turnoActual+1}),A.emit("update-turn",{turnoActual:e.selectedBusiness.turnoActual,businessID:e.selectedBusiness._id}),A.emit("update-b",{personasActual:a,turnoActual:n,businessID:e.selectedBusiness._id}),u["a"].create({message:"El usuario dejo el turno. Puedes hacer checkin, luego checkout de nuevo para llamar al siguiente turno.",color:"primary"})}else if("ok-nousuario"==s.data.mensaje){a=e.selectedBusiness.personasActual,n=e.selectedBusiness.turnoActual;e.updateSelectedBusiness({personasActual:e.selectedBusiness.personasActual}),A.emit("update-b",{personasActual:a,turnoActual:n,businessID:e.selectedBusiness._id}),u["a"].create({message:"El turno siguiente no tiene un usuario asignado aún",color:"primary"})}})).catch((function(e){console.log(e.response),u["a"].create({message:"Hubo un error. Favor de intentarlo de nuevo",color:"negative"})}))}},checkOut:function(){var e=this;if(0===this.selectedBusiness.personasActual)u["a"].create({message:"No hay ninguna persona dentro del establecimiento a realizar checkout.",color:"negative"});else{var s=this.selectedBusiness._id;l.a.post("/check-out/"+s,{personasActual:this.selectedBusiness.personasActual}).then((function(s){console.log(s.data);var t=e.selectedBusiness.personasActual-1,a=e.selectedBusiness.turnoActual;e.updateSelectedBusiness({personasActual:t}),A.emit("update-b",{personasActual:t,turnoActual:a,businessID:e.selectedBusiness._id})})).catch((function(e){console.log(e.response),u["a"].create({message:"Hubo un error. Favor de intentarlo de nuevo",color:"negative"})}))}}}),mounted:function(){this.currentPeople=this.selectedBusiness.personasActual,this.currentTurn=this.selectedBusiness.turnoActual},created:function(){var e=this;A.on("request-turn",(function(s){console.log(s),s.businessID==e.selectedBusiness._id&&(console.log("LETS UPDATE"),e.updateSelectedBusiness({turnosAcumulado:s.turnosAcumulado}),u["a"].create({message:"Nuevo turno asignado",color:"primary"}))})),A.on("update-token-2",(function(s){console.log(s),s.businessID==e.selectedBusiness._id&&e.updateSelectedBusiness({tokens:s.tokens})})),A.on("update-b-2",(function(s){console.log(s),s.businessID==e.selectedBusiness._id&&e.updateSelectedBusiness({personasActual:s.personasActual,turnoActual:s.turnoActual})}))}},v=B,x=t("2877"),y=t("9989"),g=t("9c40"),f=t("24e8"),S=t("f09f"),h=t("a370"),_=t("4b7e"),C=t("eebe"),D=t.n(C),k=Object(x["a"])(v,a,n,!1,null,null,null);s["default"]=k.exports;D()(k,"components",{QPage:y["a"],QBtn:g["a"],QDialog:f["a"],QCard:S["a"],QCardSection:h["a"],QCardActions:_["a"]})},cca6:function(e,s,t){e.exports=t.p+"img/checkin.e3c3210e.png"},f9eb:function(e,s,t){e.exports=t.p+"img/checkout.dce5790d.png"}}]);