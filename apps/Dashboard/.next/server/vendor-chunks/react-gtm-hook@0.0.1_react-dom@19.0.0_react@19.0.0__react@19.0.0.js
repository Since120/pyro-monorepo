"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/react-gtm-hook@0.0.1_react-dom@19.0.0_react@19.0.0__react@19.0.0";
exports.ids = ["vendor-chunks/react-gtm-hook@0.0.1_react-dom@19.0.0_react@19.0.0__react@19.0.0"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/react-gtm-hook@0.0.1_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/react-gtm-hook/dist/index.esm.js":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/react-gtm-hook@0.0.1_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/react-gtm-hook/dist/index.esm.js ***!
  \*******************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DEFAULT_DATA_LAYER_NAME: () => (/* binding */ u),\n/* harmony export */   DEFAULT_DOMAIN: () => (/* binding */ f),\n/* harmony export */   DEFAULT_SCRIPT_NAME: () => (/* binding */ p),\n/* harmony export */   GTMContext: () => (/* binding */ g),\n/* harmony export */   GTMContextDispatch: () => (/* binding */ v),\n/* harmony export */   GTMProvider: () => (/* binding */ h),\n/* harmony export */   initGTM: () => (/* binding */ m),\n/* harmony export */   initialState: () => (/* binding */ y),\n/* harmony export */   sendToDataLayer: () => (/* binding */ d),\n/* harmony export */   useGTMDispatch: () => (/* binding */ w)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/.pnpm/next@15.1.4_@babel+core@7.26.7_babel-plugin-macros@3.1.0_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js\");\nvar r,n={exports:{}},o={};var a,i,c={};\n/**\n * @license React\n * react-jsx-runtime.development.js\n *\n * Copyright (c) Meta Platforms, Inc. and affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */function l(){return a||(a=1, true&&function(){function e(t){if(null==t)return null;if(\"function\"==typeof t)return t.$$typeof===A?null:t.displayName||t.name||null;if(\"string\"==typeof t)return t;switch(t){case $:return\"Fragment\";case _:return\"Portal\";case x:return\"Profiler\";case N:return\"StrictMode\";case D:return\"Suspense\";case C:return\"SuspenseList\"}if(\"object\"==typeof t)switch(\"number\"==typeof t.tag&&console.error(\"Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.\"),t.$$typeof){case R:return(t.displayName||\"Context\")+\".Provider\";case O:return(t._context.displayName||\"Context\")+\".Consumer\";case E:var r=t.render;return(t=t.displayName)||(t=\"\"!==(t=r.displayName||r.name||\"\")?\"ForwardRef(\"+t+\")\":\"ForwardRef\"),t;case L:return null!==(r=t.displayName||null)?r:e(t.type)||\"Memo\";case T:r=t._payload,t=t._init;try{return e(t(r))}catch(e){}}return null}function r(e){return\"\"+e}function n(e){try{r(e);var t=!1}catch(e){t=!0}if(t){var n=(t=console).error,o=\"function\"==typeof Symbol&&Symbol.toStringTag&&e[Symbol.toStringTag]||e.constructor.name||\"Object\";return n.call(t,\"The provided key is an unsupported type %s. This value must be coerced to a string before using it here.\",o),r(e)}}function o(){}function a(e){if(void 0===J)try{throw Error()}catch(e){var t=e.stack.trim().match(/\\n( *(at )?)/);J=t&&t[1]||\"\",W=-1<e.stack.indexOf(\"\\n    at\")?\" (<anonymous>)\":-1<e.stack.indexOf(\"@\")?\"@unknown:0:0\":\"\"}return\"\\n\"+J+e+W}function i(e,t){if(!e||G)return\"\";var r=K.get(e);if(void 0!==r)return r;G=!0,r=Error.prepareStackTrace,Error.prepareStackTrace=void 0;var n;n=M.H,M.H=null,function(){if(0===U){y=console.log,g=console.info,v=console.warn,b=console.error,h=console.group,w=console.groupCollapsed,S=console.groupEnd;var e={configurable:!0,enumerable:!0,value:o,writable:!0};Object.defineProperties(console,{info:e,log:e,warn:e,error:e,group:e,groupCollapsed:e,groupEnd:e})}U++}();try{var i={DetermineComponentFrameRoot:function(){try{if(t){var r=function(){throw Error()};if(Object.defineProperty(r.prototype,\"props\",{set:function(){throw Error()}}),\"object\"==typeof Reflect&&Reflect.construct){try{Reflect.construct(r,[])}catch(e){var n=e}Reflect.construct(e,[],r)}else{try{r.call()}catch(e){n=e}e.call(r.prototype)}}else{try{throw Error()}catch(e){n=e}(r=e())&&\"function\"==typeof r.catch&&r.catch((function(){}))}}catch(e){if(e&&n&&\"string\"==typeof e.stack)return[e.stack,n.stack]}return[null,null]}};i.DetermineComponentFrameRoot.displayName=\"DetermineComponentFrameRoot\";var c=Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot,\"name\");c&&c.configurable&&Object.defineProperty(i.DetermineComponentFrameRoot,\"name\",{value:\"DetermineComponentFrameRoot\"});var l=i.DetermineComponentFrameRoot(),s=l[0],u=l[1];if(s&&u){var f=s.split(\"\\n\"),p=u.split(\"\\n\");for(l=c=0;c<f.length&&!f[c].includes(\"DetermineComponentFrameRoot\");)c++;for(;l<p.length&&!p[l].includes(\"DetermineComponentFrameRoot\");)l++;if(c===f.length||l===p.length)for(c=f.length-1,l=p.length-1;1<=c&&0<=l&&f[c]!==p[l];)l--;for(;1<=c&&0<=l;c--,l--)if(f[c]!==p[l]){if(1!==c||1!==l)do{if(c--,0>--l||f[c]!==p[l]){var m=\"\\n\"+f[c].replace(\" at new \",\" at \");return e.displayName&&m.includes(\"<anonymous>\")&&(m=m.replace(\"<anonymous>\",e.displayName)),\"function\"==typeof e&&K.set(e,m),m}}while(1<=c&&0<=l);break}}}finally{G=!1,M.H=n,function(){if(0==--U){var e={configurable:!0,enumerable:!0,writable:!0};Object.defineProperties(console,{log:H({},e,{value:y}),info:H({},e,{value:g}),warn:H({},e,{value:v}),error:H({},e,{value:b}),group:H({},e,{value:h}),groupCollapsed:H({},e,{value:w}),groupEnd:H({},e,{value:S})})}0>U&&console.error(\"disabledDepth fell below zero. This is a bug in React. Please file an issue.\")}(),Error.prepareStackTrace=r}return f=(f=e?e.displayName||e.name:\"\")?a(f):\"\",\"function\"==typeof e&&K.set(e,f),f}function l(e){if(null==e)return\"\";if(\"function\"==typeof e){var t=e.prototype;return i(e,!(!t||!t.isReactComponent))}if(\"string\"==typeof e)return a(e);switch(e){case D:return a(\"Suspense\");case C:return a(\"SuspenseList\")}if(\"object\"==typeof e)switch(e.$$typeof){case E:return e=i(e.render,!1);case L:return l(e.type);case T:t=e._payload,e=e._init;try{return l(e(t))}catch(e){}}return\"\"}function s(){var e=M.A;return null===e?null:e.getOwner()}function u(){var t=e(this.type);return Y[t]||(Y[t]=!0,console.error(\"Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.\")),void 0!==(t=this.props.ref)?t:null}function f(t,r,o,a,i,c){if(\"string\"==typeof t||\"function\"==typeof t||t===$||t===x||t===N||t===D||t===C||t===P||\"object\"==typeof t&&null!==t&&(t.$$typeof===T||t.$$typeof===L||t.$$typeof===R||t.$$typeof===O||t.$$typeof===E||t.$$typeof===I||void 0!==t.getModuleId)){var l=r.children;if(void 0!==l)if(a)if(B(l)){for(a=0;a<l.length;a++)p(l[a],t);Object.freeze&&Object.freeze(l)}else console.error(\"React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.\");else p(l,t)}else l=\"\",(void 0===t||\"object\"==typeof t&&null!==t&&0===Object.keys(t).length)&&(l+=\" You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.\"),null===t?a=\"null\":B(t)?a=\"array\":void 0!==t&&t.$$typeof===j?(a=\"<\"+(e(t.type)||\"Unknown\")+\" />\",l=\" Did you accidentally export a JSX literal instead of a component?\"):a=typeof t,console.error(\"React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s\",a,l);if(z.call(r,\"key\")){l=e(t);var f=Object.keys(r).filter((function(e){return\"key\"!==e}));a=0<f.length?\"{key: someKey, \"+f.join(\": ..., \")+\": ...}\":\"{key: someKey}\",q[l+a]||(f=0<f.length?\"{\"+f.join(\": ..., \")+\": ...}\":\"{}\",console.error('A props object containing a \"key\" prop is being spread into JSX:\\n  let props = %s;\\n  <%s {...props} />\\nReact keys must be passed directly to JSX without using spread:\\n  let props = %s;\\n  <%s key={someKey} {...props} />',a,l,f,l),q[l+a]=!0)}if(l=null,void 0!==o&&(n(o),l=\"\"+o),function(e){if(z.call(e,\"key\")){var t=Object.getOwnPropertyDescriptor(e,\"key\").get;if(t&&t.isReactWarning)return!1}return void 0!==e.key}(r)&&(n(r.key),l=\"\"+r.key),\"key\"in r)for(var m in o={},r)\"key\"!==m&&(o[m]=r[m]);else o=r;return l&&function(e,t){function r(){X||(X=!0,console.error(\"%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)\",t))}r.isReactWarning=!0,Object.defineProperty(e,\"key\",{get:r,configurable:!0})}(o,\"function\"==typeof t?t.displayName||t.name||\"Unknown\":t),function(e,t,r,n,o,a){return r=a.ref,e={$$typeof:j,type:e,key:t,props:a,_owner:o},null!==(void 0!==r?r:null)?Object.defineProperty(e,\"ref\",{enumerable:!1,get:u}):Object.defineProperty(e,\"ref\",{enumerable:!1,value:null}),e._store={},Object.defineProperty(e._store,\"validated\",{configurable:!1,enumerable:!1,writable:!0,value:0}),Object.defineProperty(e,\"_debugInfo\",{configurable:!1,enumerable:!1,writable:!0,value:null}),Object.freeze&&(Object.freeze(e.props),Object.freeze(e)),e}(t,l,c,0,s(),o)}function p(e,t){if(\"object\"==typeof e&&e&&e.$$typeof!==V)if(B(e))for(var r=0;r<e.length;r++){var n=e[r];m(n)&&d(n,t)}else if(m(e))e._store&&(e._store.validated=1);else if(null===e||\"object\"!=typeof e?r=null:r=\"function\"==typeof(r=F&&e[F]||e[\"@@iterator\"])?r:null,\"function\"==typeof r&&r!==e.entries&&(r=r.call(e))!==e)for(;!(e=r.next()).done;)m(e.value)&&d(e.value,t)}function m(e){return\"object\"==typeof e&&null!==e&&e.$$typeof===j}function d(t,r){if(t._store&&!t._store.validated&&null==t.key&&(t._store.validated=1,r=function(t){var r=\"\",n=s();return n&&(n=e(n.type))&&(r=\"\\n\\nCheck the render method of `\"+n+\"`.\"),r||(t=e(t))&&(r=\"\\n\\nCheck the top-level render call using <\"+t+\">.\"),r}(r),!Q[r])){Q[r]=!0;var n=\"\";t&&null!=t._owner&&t._owner!==s()&&(n=null,\"number\"==typeof t._owner.tag?n=e(t._owner.type):\"string\"==typeof t._owner.name&&(n=t._owner.name),n=\" It was passed a child from \"+n+\".\");var o=M.getCurrentStack;M.getCurrentStack=function(){var e=l(t.type);return o&&(e+=o()||\"\"),e},console.error('Each child in a list should have a unique \"key\" prop.%s%s See https://react.dev/link/warning-keys for more information.',r,n),M.getCurrentStack=o}}var y,g,v,b,h,w,S,k=react__WEBPACK_IMPORTED_MODULE_0__,j=Symbol.for(\"react.transitional.element\"),_=Symbol.for(\"react.portal\"),$=Symbol.for(\"react.fragment\"),N=Symbol.for(\"react.strict_mode\"),x=Symbol.for(\"react.profiler\"),O=Symbol.for(\"react.consumer\"),R=Symbol.for(\"react.context\"),E=Symbol.for(\"react.forward_ref\"),D=Symbol.for(\"react.suspense\"),C=Symbol.for(\"react.suspense_list\"),L=Symbol.for(\"react.memo\"),T=Symbol.for(\"react.lazy\"),P=Symbol.for(\"react.offscreen\"),F=Symbol.iterator,A=Symbol.for(\"react.client.reference\"),M=k.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,z=Object.prototype.hasOwnProperty,H=Object.assign,I=Symbol.for(\"react.client.reference\"),B=Array.isArray,U=0;o.__reactDisabledLog=!0;var J,W,X,G=!1,K=new(\"function\"==typeof WeakMap?WeakMap:Map),V=Symbol.for(\"react.client.reference\"),Y={},q={},Q={};c.Fragment=$,c.jsx=function(e,t,r,n,o){return f(e,t,r,!1,0,o)},c.jsxs=function(e,t,r,n,o){return f(e,t,r,!0,0,o)}}()),c}var s=(i||(i=1, false?0:n.exports=l()),n.exports);const u=\"dataLayer\",f=\"https://www.googletagmanager.com\",p=\"gtm.js\";function m({dataLayer:e,dataLayerName:t,environment:r,nonce:n,id:o,customDomain:a,customScriptName:i}){const{getDataLayerScript:c,getScript:l,getNoScript:s}=function(e){const t=()=>{const t=document.createElement(\"script\");return e.nonce&&t.setAttribute(\"nonce\",e.nonce),t.innerHTML=function(e,t){return`window.${t} = window.${t} || [];${e?`window.${t}.push(${JSON.stringify(e)})`:\"\"}`}(e.dataLayer,e.dataLayerName),t},r=()=>{const t=document.createElement(\"script\");return e.nonce&&t.setAttribute(\"nonce\",e.nonce),t.innerHTML=function(e,t,r,n=f,o=p){let a=\"\";if(r){const{gtm_auth:e,gtm_preview:t}=r;a=`+\"&gtm_auth=${e}&gtm_preview=${t}&gtm_cookies_win=x\"`}return`\\n    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\\n      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\\n      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\\n      '${n}/${o}?id='+i+dl${a};f.parentNode.insertBefore(j,f);\\n    })(window,document,'script','${e}','${t}');\\n  `}(e.dataLayerName,e.id,e.environment,e.customDomain,e.customScriptName),t},n=()=>{const t=document.createElement(\"noscript\");return t.innerHTML=function(e,t,r=f){let n=\"\";if(t){const{gtm_auth:e,gtm_preview:r}=t;n=`&gtm_auth=${e}&gtm_preview=${r}&gtm_cookies_win=x`}return`<iframe src=\"${r}/ns.html?id=${e}${n}\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\" id=\"tag-manager\"></iframe>`}(e.id,e.environment,e.customDomain),t};return{getDataLayerScript:t,getNoScript:n,getScript:r}}({dataLayer:e,dataLayerName:t,environment:r,nonce:n,id:o,customDomain:a,customScriptName:i}),u=c(),m=l(),d=s();document.head.insertBefore(u,document.head.childNodes[0]??null),document.head.insertBefore(m,document.head.childNodes[1]??null),document.body.insertBefore(d,document.body.childNodes[0]??null)}function d({dataLayerName:e,data:t}){const r=window[e];r?r.push(t):console.warn(`dataLayer ${e} does not exist, make sure to initialize it`)}const y={dataLayer:void 0,dataLayerName:u,environment:void 0,nonce:void 0,id:\"\",injectScript:!0,customDomain:f,customScriptName:p},g=react__WEBPACK_IMPORTED_MODULE_0__.createContext(y),v=react__WEBPACK_IMPORTED_MODULE_0__.createContext(void 0);function b(e,t){return d({dataLayerName:e.dataLayerName||u,data:t}),e}function h({config:t,children:r}){const[n,o]=react__WEBPACK_IMPORTED_MODULE_0__.useReducer(b,{...y,...t});return react__WEBPACK_IMPORTED_MODULE_0__.useEffect((()=>{t&&!1!==t.injectScript&&m({...n,...t})}),[t,n]),s.jsx(g.Provider,{value:n,children:s.jsx(v.Provider,{value:o,children:r})})}function w(){const t=react__WEBPACK_IMPORTED_MODULE_0__.useContext(v);if(void 0===t)throw new Error(\"useGTMDispatch must be used within a GTMProvider\");return t}\n//# sourceMappingURL=index.esm.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vcmVhY3QtZ3RtLWhvb2tAMC4wLjFfcmVhY3QtZG9tQDE5LjAuMF9yZWFjdEAxOS4wLjBfX3JlYWN0QDE5LjAuMC9ub2RlX21vZHVsZXMvcmVhY3QtZ3RtLWhvb2svZGlzdC9pbmRleC5lc20uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBNkMsU0FBUyxXQUFXLE1BQU07QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixlQUFlLEtBQW1DLGFBQWEsY0FBYyx1QkFBdUIsK0VBQStFLCtCQUErQixVQUFVLHdCQUF3QixzQkFBc0Isd0JBQXdCLDBCQUEwQix3QkFBd0IsNEJBQTRCLG9NQUFvTSxvREFBb0QsNkRBQTZELHNCQUFzQixtR0FBbUcsaUVBQWlFLDhCQUE4QixJQUFJLGVBQWUsV0FBVyxZQUFZLGNBQWMsV0FBVyxjQUFjLElBQUksS0FBSyxTQUFTLFNBQVMsS0FBSyxNQUFNLDZIQUE2SCxvSUFBb0ksY0FBYyxjQUFjLGtCQUFrQixjQUFjLFNBQVMsMkNBQTJDLDBHQUEwRyxpQkFBaUIsZ0JBQWdCLGtCQUFrQixlQUFlLHVCQUF1Qiw4REFBOEQsTUFBTSwwQkFBMEIsVUFBVSx3SEFBd0gsT0FBTyxtREFBbUQsaUNBQWlDLGdFQUFnRSxFQUFFLElBQUksR0FBRyxJQUFJLE9BQU8sdUNBQXVDLElBQUksTUFBTSxpQkFBaUIsZUFBZSw4Q0FBOEMsZUFBZSxlQUFlLCtDQUErQyxJQUFJLHdCQUF3QixTQUFTLFFBQVEsMEJBQTBCLEtBQUssSUFBSSxTQUFTLFNBQVMsSUFBSSxxQkFBcUIsS0FBSyxJQUFJLGNBQWMsU0FBUyxJQUFJLDBEQUEwRCxJQUFJLFNBQVMsMERBQTBELG9CQUFvQix3RUFBd0UsNEVBQTRFLCtFQUErRSxvQ0FBb0MsRUFBRSxvREFBb0QsU0FBUyxvQ0FBb0MsVUFBVSwwREFBMEQsS0FBSyxLQUFLLDBEQUEwRCxLQUFLLDREQUE0RCx3QkFB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XFxEb2N1bWVudHNcXERpc2NvcmQgQm90XFxQeXJvQm90UG9seVJlcG9cXERhc2hib2FyZFxcbm9kZV9tb2R1bGVzXFwucG5wbVxccmVhY3QtZ3RtLWhvb2tAMC4wLjFfcmVhY3QtZG9tQDE5LjAuMF9yZWFjdEAxOS4wLjBfX3JlYWN0QDE5LjAuMFxcbm9kZV9tb2R1bGVzXFxyZWFjdC1ndG0taG9va1xcZGlzdFxcaW5kZXguZXNtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCphcyBlIGZyb21cInJlYWN0XCI7aW1wb3J0IHQgZnJvbVwicmVhY3RcIjt2YXIgcixuPXtleHBvcnRzOnt9fSxvPXt9O3ZhciBhLGksYz17fTtcbi8qKlxuICogQGxpY2Vuc2UgUmVhY3RcbiAqIHJlYWN0LWpzeC1ydW50aW1lLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBNZXRhIFBsYXRmb3JtcywgSW5jLiBhbmQgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL2Z1bmN0aW9uIGwoKXtyZXR1cm4gYXx8KGE9MSxcInByb2R1Y3Rpb25cIiE9PXByb2Nlc3MuZW52Lk5PREVfRU5WJiZmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7aWYobnVsbD09dClyZXR1cm4gbnVsbDtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiB0KXJldHVybiB0LiQkdHlwZW9mPT09QT9udWxsOnQuZGlzcGxheU5hbWV8fHQubmFtZXx8bnVsbDtpZihcInN0cmluZ1wiPT10eXBlb2YgdClyZXR1cm4gdDtzd2l0Y2godCl7Y2FzZSAkOnJldHVyblwiRnJhZ21lbnRcIjtjYXNlIF86cmV0dXJuXCJQb3J0YWxcIjtjYXNlIHg6cmV0dXJuXCJQcm9maWxlclwiO2Nhc2UgTjpyZXR1cm5cIlN0cmljdE1vZGVcIjtjYXNlIEQ6cmV0dXJuXCJTdXNwZW5zZVwiO2Nhc2UgQzpyZXR1cm5cIlN1c3BlbnNlTGlzdFwifWlmKFwib2JqZWN0XCI9PXR5cGVvZiB0KXN3aXRjaChcIm51bWJlclwiPT10eXBlb2YgdC50YWcmJmNvbnNvbGUuZXJyb3IoXCJSZWNlaXZlZCBhbiB1bmV4cGVjdGVkIG9iamVjdCBpbiBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUoKS4gVGhpcyBpcyBsaWtlbHkgYSBidWcgaW4gUmVhY3QuIFBsZWFzZSBmaWxlIGFuIGlzc3VlLlwiKSx0LiQkdHlwZW9mKXtjYXNlIFI6cmV0dXJuKHQuZGlzcGxheU5hbWV8fFwiQ29udGV4dFwiKStcIi5Qcm92aWRlclwiO2Nhc2UgTzpyZXR1cm4odC5fY29udGV4dC5kaXNwbGF5TmFtZXx8XCJDb250ZXh0XCIpK1wiLkNvbnN1bWVyXCI7Y2FzZSBFOnZhciByPXQucmVuZGVyO3JldHVybih0PXQuZGlzcGxheU5hbWUpfHwodD1cIlwiIT09KHQ9ci5kaXNwbGF5TmFtZXx8ci5uYW1lfHxcIlwiKT9cIkZvcndhcmRSZWYoXCIrdCtcIilcIjpcIkZvcndhcmRSZWZcIiksdDtjYXNlIEw6cmV0dXJuIG51bGwhPT0ocj10LmRpc3BsYXlOYW1lfHxudWxsKT9yOmUodC50eXBlKXx8XCJNZW1vXCI7Y2FzZSBUOnI9dC5fcGF5bG9hZCx0PXQuX2luaXQ7dHJ5e3JldHVybiBlKHQocikpfWNhdGNoKGUpe319cmV0dXJuIG51bGx9ZnVuY3Rpb24gcihlKXtyZXR1cm5cIlwiK2V9ZnVuY3Rpb24gbihlKXt0cnl7cihlKTt2YXIgdD0hMX1jYXRjaChlKXt0PSEwfWlmKHQpe3ZhciBuPSh0PWNvbnNvbGUpLmVycm9yLG89XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJmVbU3ltYm9sLnRvU3RyaW5nVGFnXXx8ZS5jb25zdHJ1Y3Rvci5uYW1lfHxcIk9iamVjdFwiO3JldHVybiBuLmNhbGwodCxcIlRoZSBwcm92aWRlZCBrZXkgaXMgYW4gdW5zdXBwb3J0ZWQgdHlwZSAlcy4gVGhpcyB2YWx1ZSBtdXN0IGJlIGNvZXJjZWQgdG8gYSBzdHJpbmcgYmVmb3JlIHVzaW5nIGl0IGhlcmUuXCIsbykscihlKX19ZnVuY3Rpb24gbygpe31mdW5jdGlvbiBhKGUpe2lmKHZvaWQgMD09PUopdHJ5e3Rocm93IEVycm9yKCl9Y2F0Y2goZSl7dmFyIHQ9ZS5zdGFjay50cmltKCkubWF0Y2goL1xcbiggKihhdCApPykvKTtKPXQmJnRbMV18fFwiXCIsVz0tMTxlLnN0YWNrLmluZGV4T2YoXCJcXG4gICAgYXRcIik/XCIgKDxhbm9ueW1vdXM+KVwiOi0xPGUuc3RhY2suaW5kZXhPZihcIkBcIik/XCJAdW5rbm93bjowOjBcIjpcIlwifXJldHVyblwiXFxuXCIrSitlK1d9ZnVuY3Rpb24gaShlLHQpe2lmKCFlfHxHKXJldHVyblwiXCI7dmFyIHI9Sy5nZXQoZSk7aWYodm9pZCAwIT09cilyZXR1cm4gcjtHPSEwLHI9RXJyb3IucHJlcGFyZVN0YWNrVHJhY2UsRXJyb3IucHJlcGFyZVN0YWNrVHJhY2U9dm9pZCAwO3ZhciBuO249TS5ILE0uSD1udWxsLGZ1bmN0aW9uKCl7aWYoMD09PVUpe3k9Y29uc29sZS5sb2csZz1jb25zb2xlLmluZm8sdj1jb25zb2xlLndhcm4sYj1jb25zb2xlLmVycm9yLGg9Y29uc29sZS5ncm91cCx3PWNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQsUz1jb25zb2xlLmdyb3VwRW5kO3ZhciBlPXtjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCx2YWx1ZTpvLHdyaXRhYmxlOiEwfTtPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjb25zb2xlLHtpbmZvOmUsbG9nOmUsd2FybjplLGVycm9yOmUsZ3JvdXA6ZSxncm91cENvbGxhcHNlZDplLGdyb3VwRW5kOmV9KX1VKyt9KCk7dHJ5e3ZhciBpPXtEZXRlcm1pbmVDb21wb25lbnRGcmFtZVJvb3Q6ZnVuY3Rpb24oKXt0cnl7aWYodCl7dmFyIHI9ZnVuY3Rpb24oKXt0aHJvdyBFcnJvcigpfTtpZihPYmplY3QuZGVmaW5lUHJvcGVydHkoci5wcm90b3R5cGUsXCJwcm9wc1wiLHtzZXQ6ZnVuY3Rpb24oKXt0aHJvdyBFcnJvcigpfX0pLFwib2JqZWN0XCI9PXR5cGVvZiBSZWZsZWN0JiZSZWZsZWN0LmNvbnN0cnVjdCl7dHJ5e1JlZmxlY3QuY29uc3RydWN0KHIsW10pfWNhdGNoKGUpe3ZhciBuPWV9UmVmbGVjdC5jb25zdHJ1Y3QoZSxbXSxyKX1lbHNle3RyeXtyLmNhbGwoKX1jYXRjaChlKXtuPWV9ZS5jYWxsKHIucHJvdG90eXBlKX19ZWxzZXt0cnl7dGhyb3cgRXJyb3IoKX1jYXRjaChlKXtuPWV9KHI9ZSgpKSYmXCJmdW5jdGlvblwiPT10eXBlb2Ygci5jYXRjaCYmci5jYXRjaCgoZnVuY3Rpb24oKXt9KSl9fWNhdGNoKGUpe2lmKGUmJm4mJlwic3RyaW5nXCI9PXR5cGVvZiBlLnN0YWNrKXJldHVybltlLnN0YWNrLG4uc3RhY2tdfXJldHVybltudWxsLG51bGxdfX07aS5EZXRlcm1pbmVDb21wb25lbnRGcmFtZVJvb3QuZGlzcGxheU5hbWU9XCJEZXRlcm1pbmVDb21wb25lbnRGcmFtZVJvb3RcIjt2YXIgYz1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGkuRGV0ZXJtaW5lQ29tcG9uZW50RnJhbWVSb290LFwibmFtZVwiKTtjJiZjLmNvbmZpZ3VyYWJsZSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KGkuRGV0ZXJtaW5lQ29tcG9uZW50RnJhbWVSb290LFwibmFtZVwiLHt2YWx1ZTpcIkRldGVybWluZUNvbXBvbmVudEZyYW1lUm9vdFwifSk7dmFyIGw9aS5EZXRlcm1pbmVDb21wb25lbnRGcmFtZVJvb3QoKSxzPWxbMF0sdT1sWzFdO2lmKHMmJnUpe3ZhciBmPXMuc3BsaXQoXCJcXG5cIikscD11LnNwbGl0KFwiXFxuXCIpO2ZvcihsPWM9MDtjPGYubGVuZ3RoJiYhZltjXS5pbmNsdWRlcyhcIkRldGVybWluZUNvbXBvbmVudEZyYW1lUm9vdFwiKTspYysrO2Zvcig7bDxwLmxlbmd0aCYmIXBbbF0uaW5jbHVkZXMoXCJEZXRlcm1pbmVDb21wb25lbnRGcmFtZVJvb3RcIik7KWwrKztpZihjPT09Zi5sZW5ndGh8fGw9PT1wLmxlbmd0aClmb3IoYz1mLmxlbmd0aC0xLGw9cC5sZW5ndGgtMTsxPD1jJiYwPD1sJiZmW2NdIT09cFtsXTspbC0tO2Zvcig7MTw9YyYmMDw9bDtjLS0sbC0tKWlmKGZbY10hPT1wW2xdKXtpZigxIT09Y3x8MSE9PWwpZG97aWYoYy0tLDA+LS1sfHxmW2NdIT09cFtsXSl7dmFyIG09XCJcXG5cIitmW2NdLnJlcGxhY2UoXCIgYXQgbmV3IFwiLFwiIGF0IFwiKTtyZXR1cm4gZS5kaXNwbGF5TmFtZSYmbS5pbmNsdWRlcyhcIjxhbm9ueW1vdXM+XCIpJiYobT1tLnJlcGxhY2UoXCI8YW5vbnltb3VzPlwiLGUuZGlzcGxheU5hbWUpKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZLLnNldChlLG0pLG19fXdoaWxlKDE8PWMmJjA8PWwpO2JyZWFrfX19ZmluYWxseXtHPSExLE0uSD1uLGZ1bmN0aW9uKCl7aWYoMD09LS1VKXt2YXIgZT17Y29uZmlndXJhYmxlOiEwLGVudW1lcmFibGU6ITAsd3JpdGFibGU6ITB9O09iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNvbnNvbGUse2xvZzpIKHt9LGUse3ZhbHVlOnl9KSxpbmZvOkgoe30sZSx7dmFsdWU6Z30pLHdhcm46SCh7fSxlLHt2YWx1ZTp2fSksZXJyb3I6SCh7fSxlLHt2YWx1ZTpifSksZ3JvdXA6SCh7fSxlLHt2YWx1ZTpofSksZ3JvdXBDb2xsYXBzZWQ6SCh7fSxlLHt2YWx1ZTp3fSksZ3JvdXBFbmQ6SCh7fSxlLHt2YWx1ZTpTfSl9KX0wPlUmJmNvbnNvbGUuZXJyb3IoXCJkaXNhYmxlZERlcHRoIGZlbGwgYmVsb3cgemVyby4gVGhpcyBpcyBhIGJ1ZyBpbiBSZWFjdC4gUGxlYXNlIGZpbGUgYW4gaXNzdWUuXCIpfSgpLEVycm9yLnByZXBhcmVTdGFja1RyYWNlPXJ9cmV0dXJuIGY9KGY9ZT9lLmRpc3BsYXlOYW1lfHxlLm5hbWU6XCJcIik/YShmKTpcIlwiLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJksuc2V0KGUsZiksZn1mdW5jdGlvbiBsKGUpe2lmKG51bGw9PWUpcmV0dXJuXCJcIjtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBlKXt2YXIgdD1lLnByb3RvdHlwZTtyZXR1cm4gaShlLCEoIXR8fCF0LmlzUmVhY3RDb21wb25lbnQpKX1pZihcInN0cmluZ1wiPT10eXBlb2YgZSlyZXR1cm4gYShlKTtzd2l0Y2goZSl7Y2FzZSBEOnJldHVybiBhKFwiU3VzcGVuc2VcIik7Y2FzZSBDOnJldHVybiBhKFwiU3VzcGVuc2VMaXN0XCIpfWlmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXN3aXRjaChlLiQkdHlwZW9mKXtjYXNlIEU6cmV0dXJuIGU9aShlLnJlbmRlciwhMSk7Y2FzZSBMOnJldHVybiBsKGUudHlwZSk7Y2FzZSBUOnQ9ZS5fcGF5bG9hZCxlPWUuX2luaXQ7dHJ5e3JldHVybiBsKGUodCkpfWNhdGNoKGUpe319cmV0dXJuXCJcIn1mdW5jdGlvbiBzKCl7dmFyIGU9TS5BO3JldHVybiBudWxsPT09ZT9udWxsOmUuZ2V0T3duZXIoKX1mdW5jdGlvbiB1KCl7dmFyIHQ9ZSh0aGlzLnR5cGUpO3JldHVybiBZW3RdfHwoWVt0XT0hMCxjb25zb2xlLmVycm9yKFwiQWNjZXNzaW5nIGVsZW1lbnQucmVmIHdhcyByZW1vdmVkIGluIFJlYWN0IDE5LiByZWYgaXMgbm93IGEgcmVndWxhciBwcm9wLiBJdCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgSlNYIEVsZW1lbnQgdHlwZSBpbiBhIGZ1dHVyZSByZWxlYXNlLlwiKSksdm9pZCAwIT09KHQ9dGhpcy5wcm9wcy5yZWYpP3Q6bnVsbH1mdW5jdGlvbiBmKHQscixvLGEsaSxjKXtpZihcInN0cmluZ1wiPT10eXBlb2YgdHx8XCJmdW5jdGlvblwiPT10eXBlb2YgdHx8dD09PSR8fHQ9PT14fHx0PT09Tnx8dD09PUR8fHQ9PT1DfHx0PT09UHx8XCJvYmplY3RcIj09dHlwZW9mIHQmJm51bGwhPT10JiYodC4kJHR5cGVvZj09PVR8fHQuJCR0eXBlb2Y9PT1MfHx0LiQkdHlwZW9mPT09Unx8dC4kJHR5cGVvZj09PU98fHQuJCR0eXBlb2Y9PT1FfHx0LiQkdHlwZW9mPT09SXx8dm9pZCAwIT09dC5nZXRNb2R1bGVJZCkpe3ZhciBsPXIuY2hpbGRyZW47aWYodm9pZCAwIT09bClpZihhKWlmKEIobCkpe2ZvcihhPTA7YTxsLmxlbmd0aDthKyspcChsW2FdLHQpO09iamVjdC5mcmVlemUmJk9iamVjdC5mcmVlemUobCl9ZWxzZSBjb25zb2xlLmVycm9yKFwiUmVhY3QuanN4OiBTdGF0aWMgY2hpbGRyZW4gc2hvdWxkIGFsd2F5cyBiZSBhbiBhcnJheS4gWW91IGFyZSBsaWtlbHkgZXhwbGljaXRseSBjYWxsaW5nIFJlYWN0LmpzeHMgb3IgUmVhY3QuanN4REVWLiBVc2UgdGhlIEJhYmVsIHRyYW5zZm9ybSBpbnN0ZWFkLlwiKTtlbHNlIHAobCx0KX1lbHNlIGw9XCJcIiwodm9pZCAwPT09dHx8XCJvYmplY3RcIj09dHlwZW9mIHQmJm51bGwhPT10JiYwPT09T2JqZWN0LmtleXModCkubGVuZ3RoKSYmKGwrPVwiIFlvdSBsaWtlbHkgZm9yZ290IHRvIGV4cG9ydCB5b3VyIGNvbXBvbmVudCBmcm9tIHRoZSBmaWxlIGl0J3MgZGVmaW5lZCBpbiwgb3IgeW91IG1pZ2h0IGhhdmUgbWl4ZWQgdXAgZGVmYXVsdCBhbmQgbmFtZWQgaW1wb3J0cy5cIiksbnVsbD09PXQ/YT1cIm51bGxcIjpCKHQpP2E9XCJhcnJheVwiOnZvaWQgMCE9PXQmJnQuJCR0eXBlb2Y9PT1qPyhhPVwiPFwiKyhlKHQudHlwZSl8fFwiVW5rbm93blwiKStcIiAvPlwiLGw9XCIgRGlkIHlvdSBhY2NpZGVudGFsbHkgZXhwb3J0IGEgSlNYIGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNvbXBvbmVudD9cIik6YT10eXBlb2YgdCxjb25zb2xlLmVycm9yKFwiUmVhY3QuanN4OiB0eXBlIGlzIGludmFsaWQgLS0gZXhwZWN0ZWQgYSBzdHJpbmcgKGZvciBidWlsdC1pbiBjb21wb25lbnRzKSBvciBhIGNsYXNzL2Z1bmN0aW9uIChmb3IgY29tcG9zaXRlIGNvbXBvbmVudHMpIGJ1dCBnb3Q6ICVzLiVzXCIsYSxsKTtpZih6LmNhbGwocixcImtleVwiKSl7bD1lKHQpO3ZhciBmPU9iamVjdC5rZXlzKHIpLmZpbHRlcigoZnVuY3Rpb24oZSl7cmV0dXJuXCJrZXlcIiE9PWV9KSk7YT0wPGYubGVuZ3RoP1wie2tleTogc29tZUtleSwgXCIrZi5qb2luKFwiOiAuLi4sIFwiKStcIjogLi4ufVwiOlwie2tleTogc29tZUtleX1cIixxW2wrYV18fChmPTA8Zi5sZW5ndGg/XCJ7XCIrZi5qb2luKFwiOiAuLi4sIFwiKStcIjogLi4ufVwiOlwie31cIixjb25zb2xlLmVycm9yKCdBIHByb3BzIG9iamVjdCBjb250YWluaW5nIGEgXCJrZXlcIiBwcm9wIGlzIGJlaW5nIHNwcmVhZCBpbnRvIEpTWDpcXG4gIGxldCBwcm9wcyA9ICVzO1xcbiAgPCVzIHsuLi5wcm9wc30gLz5cXG5SZWFjdCBrZXlzIG11c3QgYmUgcGFzc2VkIGRpcmVjdGx5IHRvIEpTWCB3aXRob3V0IHVzaW5nIHNwcmVhZDpcXG4gIGxldCBwcm9wcyA9ICVzO1xcbiAgPCVzIGtleT17c29tZUtleX0gey4uLnByb3BzfSAvPicsYSxsLGYsbCkscVtsK2FdPSEwKX1pZihsPW51bGwsdm9pZCAwIT09byYmKG4obyksbD1cIlwiK28pLGZ1bmN0aW9uKGUpe2lmKHouY2FsbChlLFwia2V5XCIpKXt2YXIgdD1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGUsXCJrZXlcIikuZ2V0O2lmKHQmJnQuaXNSZWFjdFdhcm5pbmcpcmV0dXJuITF9cmV0dXJuIHZvaWQgMCE9PWUua2V5fShyKSYmKG4oci5rZXkpLGw9XCJcIityLmtleSksXCJrZXlcImluIHIpZm9yKHZhciBtIGluIG89e30scilcImtleVwiIT09bSYmKG9bbV09clttXSk7ZWxzZSBvPXI7cmV0dXJuIGwmJmZ1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gcigpe1h8fChYPSEwLGNvbnNvbGUuZXJyb3IoXCIlczogYGtleWAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCBpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lIHZhbHVlIHdpdGhpbiB0aGUgY2hpbGQgY29tcG9uZW50LCB5b3Ugc2hvdWxkIHBhc3MgaXQgYXMgYSBkaWZmZXJlbnQgcHJvcC4gKGh0dHBzOi8vcmVhY3QuZGV2L2xpbmsvc3BlY2lhbC1wcm9wcylcIix0KSl9ci5pc1JlYWN0V2FybmluZz0hMCxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImtleVwiLHtnZXQ6cixjb25maWd1cmFibGU6ITB9KX0obyxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3QuZGlzcGxheU5hbWV8fHQubmFtZXx8XCJVbmtub3duXCI6dCksZnVuY3Rpb24oZSx0LHIsbixvLGEpe3JldHVybiByPWEucmVmLGU9eyQkdHlwZW9mOmosdHlwZTplLGtleTp0LHByb3BzOmEsX293bmVyOm99LG51bGwhPT0odm9pZCAwIT09cj9yOm51bGwpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwicmVmXCIse2VudW1lcmFibGU6ITEsZ2V0OnV9KTpPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcInJlZlwiLHtlbnVtZXJhYmxlOiExLHZhbHVlOm51bGx9KSxlLl9zdG9yZT17fSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5fc3RvcmUsXCJ2YWxpZGF0ZWRcIix7Y29uZmlndXJhYmxlOiExLGVudW1lcmFibGU6ITEsd3JpdGFibGU6ITAsdmFsdWU6MH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX2RlYnVnSW5mb1wiLHtjb25maWd1cmFibGU6ITEsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCx2YWx1ZTpudWxsfSksT2JqZWN0LmZyZWV6ZSYmKE9iamVjdC5mcmVlemUoZS5wcm9wcyksT2JqZWN0LmZyZWV6ZShlKSksZX0odCxsLGMsMCxzKCksbyl9ZnVuY3Rpb24gcChlLHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlJiZlJiZlLiQkdHlwZW9mIT09VilpZihCKGUpKWZvcih2YXIgcj0wO3I8ZS5sZW5ndGg7cisrKXt2YXIgbj1lW3JdO20obikmJmQobix0KX1lbHNlIGlmKG0oZSkpZS5fc3RvcmUmJihlLl9zdG9yZS52YWxpZGF0ZWQ9MSk7ZWxzZSBpZihudWxsPT09ZXx8XCJvYmplY3RcIiE9dHlwZW9mIGU/cj1udWxsOnI9XCJmdW5jdGlvblwiPT10eXBlb2Yocj1GJiZlW0ZdfHxlW1wiQEBpdGVyYXRvclwiXSk/cjpudWxsLFwiZnVuY3Rpb25cIj09dHlwZW9mIHImJnIhPT1lLmVudHJpZXMmJihyPXIuY2FsbChlKSkhPT1lKWZvcig7IShlPXIubmV4dCgpKS5kb25lOyltKGUudmFsdWUpJiZkKGUudmFsdWUsdCl9ZnVuY3Rpb24gbShlKXtyZXR1cm5cIm9iamVjdFwiPT10eXBlb2YgZSYmbnVsbCE9PWUmJmUuJCR0eXBlb2Y9PT1qfWZ1bmN0aW9uIGQodCxyKXtpZih0Ll9zdG9yZSYmIXQuX3N0b3JlLnZhbGlkYXRlZCYmbnVsbD09dC5rZXkmJih0Ll9zdG9yZS52YWxpZGF0ZWQ9MSxyPWZ1bmN0aW9uKHQpe3ZhciByPVwiXCIsbj1zKCk7cmV0dXJuIG4mJihuPWUobi50eXBlKSkmJihyPVwiXFxuXFxuQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYFwiK24rXCJgLlwiKSxyfHwodD1lKHQpKSYmKHI9XCJcXG5cXG5DaGVjayB0aGUgdG9wLWxldmVsIHJlbmRlciBjYWxsIHVzaW5nIDxcIit0K1wiPi5cIikscn0ociksIVFbcl0pKXtRW3JdPSEwO3ZhciBuPVwiXCI7dCYmbnVsbCE9dC5fb3duZXImJnQuX293bmVyIT09cygpJiYobj1udWxsLFwibnVtYmVyXCI9PXR5cGVvZiB0Ll9vd25lci50YWc/bj1lKHQuX293bmVyLnR5cGUpOlwic3RyaW5nXCI9PXR5cGVvZiB0Ll9vd25lci5uYW1lJiYobj10Ll9vd25lci5uYW1lKSxuPVwiIEl0IHdhcyBwYXNzZWQgYSBjaGlsZCBmcm9tIFwiK24rXCIuXCIpO3ZhciBvPU0uZ2V0Q3VycmVudFN0YWNrO00uZ2V0Q3VycmVudFN0YWNrPWZ1bmN0aW9uKCl7dmFyIGU9bCh0LnR5cGUpO3JldHVybiBvJiYoZSs9bygpfHxcIlwiKSxlfSxjb25zb2xlLmVycm9yKCdFYWNoIGNoaWxkIGluIGEgbGlzdCBzaG91bGQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiIHByb3AuJXMlcyBTZWUgaHR0cHM6Ly9yZWFjdC5kZXYvbGluay93YXJuaW5nLWtleXMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxyLG4pLE0uZ2V0Q3VycmVudFN0YWNrPW99fXZhciB5LGcsdixiLGgsdyxTLGs9dCxqPVN5bWJvbC5mb3IoXCJyZWFjdC50cmFuc2l0aW9uYWwuZWxlbWVudFwiKSxfPVN5bWJvbC5mb3IoXCJyZWFjdC5wb3J0YWxcIiksJD1TeW1ib2wuZm9yKFwicmVhY3QuZnJhZ21lbnRcIiksTj1TeW1ib2wuZm9yKFwicmVhY3Quc3RyaWN0X21vZGVcIikseD1TeW1ib2wuZm9yKFwicmVhY3QucHJvZmlsZXJcIiksTz1TeW1ib2wuZm9yKFwicmVhY3QuY29uc3VtZXJcIiksUj1TeW1ib2wuZm9yKFwicmVhY3QuY29udGV4dFwiKSxFPVN5bWJvbC5mb3IoXCJyZWFjdC5mb3J3YXJkX3JlZlwiKSxEPVN5bWJvbC5mb3IoXCJyZWFjdC5zdXNwZW5zZVwiKSxDPVN5bWJvbC5mb3IoXCJyZWFjdC5zdXNwZW5zZV9saXN0XCIpLEw9U3ltYm9sLmZvcihcInJlYWN0Lm1lbW9cIiksVD1TeW1ib2wuZm9yKFwicmVhY3QubGF6eVwiKSxQPVN5bWJvbC5mb3IoXCJyZWFjdC5vZmZzY3JlZW5cIiksRj1TeW1ib2wuaXRlcmF0b3IsQT1TeW1ib2wuZm9yKFwicmVhY3QuY2xpZW50LnJlZmVyZW5jZVwiKSxNPWsuX19DTElFTlRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfV0FSTl9VU0VSU19USEVZX0NBTk5PVF9VUEdSQURFLHo9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxIPU9iamVjdC5hc3NpZ24sST1TeW1ib2wuZm9yKFwicmVhY3QuY2xpZW50LnJlZmVyZW5jZVwiKSxCPUFycmF5LmlzQXJyYXksVT0wO28uX19yZWFjdERpc2FibGVkTG9nPSEwO3ZhciBKLFcsWCxHPSExLEs9bmV3KFwiZnVuY3Rpb25cIj09dHlwZW9mIFdlYWtNYXA/V2Vha01hcDpNYXApLFY9U3ltYm9sLmZvcihcInJlYWN0LmNsaWVudC5yZWZlcmVuY2VcIiksWT17fSxxPXt9LFE9e307Yy5GcmFnbWVudD0kLGMuanN4PWZ1bmN0aW9uKGUsdCxyLG4sbyl7cmV0dXJuIGYoZSx0LHIsITEsMCxvKX0sYy5qc3hzPWZ1bmN0aW9uKGUsdCxyLG4sbyl7cmV0dXJuIGYoZSx0LHIsITAsMCxvKX19KCkpLGN9dmFyIHM9KGl8fChpPTEsXCJwcm9kdWN0aW9uXCI9PT1wcm9jZXNzLmVudi5OT0RFX0VOVj9uLmV4cG9ydHM9ZnVuY3Rpb24oKXtpZihyKXJldHVybiBvO3I9MTt2YXIgZT1TeW1ib2wuZm9yKFwicmVhY3QudHJhbnNpdGlvbmFsLmVsZW1lbnRcIiksdD1TeW1ib2wuZm9yKFwicmVhY3QuZnJhZ21lbnRcIik7ZnVuY3Rpb24gbih0LHIsbil7dmFyIG89bnVsbDtpZih2b2lkIDAhPT1uJiYobz1cIlwiK24pLHZvaWQgMCE9PXIua2V5JiYobz1cIlwiK3Iua2V5KSxcImtleVwiaW4gcilmb3IodmFyIGEgaW4gbj17fSxyKVwia2V5XCIhPT1hJiYoblthXT1yW2FdKTtlbHNlIG49cjtyZXR1cm4gcj1uLnJlZix7JCR0eXBlb2Y6ZSx0eXBlOnQsa2V5Om8scmVmOnZvaWQgMCE9PXI/cjpudWxsLHByb3BzOm59fXJldHVybiBvLkZyYWdtZW50PXQsby5qc3g9bixvLmpzeHM9bixvfSgpOm4uZXhwb3J0cz1sKCkpLG4uZXhwb3J0cyk7Y29uc3QgdT1cImRhdGFMYXllclwiLGY9XCJodHRwczovL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbVwiLHA9XCJndG0uanNcIjtmdW5jdGlvbiBtKHtkYXRhTGF5ZXI6ZSxkYXRhTGF5ZXJOYW1lOnQsZW52aXJvbm1lbnQ6cixub25jZTpuLGlkOm8sY3VzdG9tRG9tYWluOmEsY3VzdG9tU2NyaXB0TmFtZTppfSl7Y29uc3R7Z2V0RGF0YUxheWVyU2NyaXB0OmMsZ2V0U2NyaXB0OmwsZ2V0Tm9TY3JpcHQ6c309ZnVuY3Rpb24oZSl7Y29uc3QgdD0oKT0+e2NvbnN0IHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtyZXR1cm4gZS5ub25jZSYmdC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLGUubm9uY2UpLHQuaW5uZXJIVE1MPWZ1bmN0aW9uKGUsdCl7cmV0dXJuYHdpbmRvdy4ke3R9ID0gd2luZG93LiR7dH0gfHwgW107JHtlP2B3aW5kb3cuJHt0fS5wdXNoKCR7SlNPTi5zdHJpbmdpZnkoZSl9KWA6XCJcIn1gfShlLmRhdGFMYXllcixlLmRhdGFMYXllck5hbWUpLHR9LHI9KCk9Pntjb25zdCB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7cmV0dXJuIGUubm9uY2UmJnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIixlLm5vbmNlKSx0LmlubmVySFRNTD1mdW5jdGlvbihlLHQscixuPWYsbz1wKXtsZXQgYT1cIlwiO2lmKHIpe2NvbnN0e2d0bV9hdXRoOmUsZ3RtX3ByZXZpZXc6dH09cjthPWArXCImZ3RtX2F1dGg9JHtlfSZndG1fcHJldmlldz0ke3R9Jmd0bV9jb29raWVzX3dpbj14XCJgfXJldHVybmBcXG4gICAgKGZ1bmN0aW9uKHcsZCxzLGwsaSl7d1tsXT13W2xdfHxbXTt3W2xdLnB1c2goeydndG0uc3RhcnQnOlxcbiAgICAgIG5ldyBEYXRlKCkuZ2V0VGltZSgpLGV2ZW50OidndG0uanMnfSk7dmFyIGY9ZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcXG4gICAgICBqPWQuY3JlYXRlRWxlbWVudChzKSxkbD1sIT0nZGF0YUxheWVyJz8nJmw9JytsOicnO2ouYXN5bmM9dHJ1ZTtqLnNyYz1cXG4gICAgICAnJHtufS8ke299P2lkPScraStkbCR7YX07Zi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqLGYpO1xcbiAgICB9KSh3aW5kb3csZG9jdW1lbnQsJ3NjcmlwdCcsJyR7ZX0nLCcke3R9Jyk7XFxuICBgfShlLmRhdGFMYXllck5hbWUsZS5pZCxlLmVudmlyb25tZW50LGUuY3VzdG9tRG9tYWluLGUuY3VzdG9tU2NyaXB0TmFtZSksdH0sbj0oKT0+e2NvbnN0IHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm5vc2NyaXB0XCIpO3JldHVybiB0LmlubmVySFRNTD1mdW5jdGlvbihlLHQscj1mKXtsZXQgbj1cIlwiO2lmKHQpe2NvbnN0e2d0bV9hdXRoOmUsZ3RtX3ByZXZpZXc6cn09dDtuPWAmZ3RtX2F1dGg9JHtlfSZndG1fcHJldmlldz0ke3J9Jmd0bV9jb29raWVzX3dpbj14YH1yZXR1cm5gPGlmcmFtZSBzcmM9XCIke3J9L25zLmh0bWw/aWQ9JHtlfSR7bn1cIiBoZWlnaHQ9XCIwXCIgd2lkdGg9XCIwXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmU7dmlzaWJpbGl0eTpoaWRkZW5cIiBpZD1cInRhZy1tYW5hZ2VyXCI+PC9pZnJhbWU+YH0oZS5pZCxlLmVudmlyb25tZW50LGUuY3VzdG9tRG9tYWluKSx0fTtyZXR1cm57Z2V0RGF0YUxheWVyU2NyaXB0OnQsZ2V0Tm9TY3JpcHQ6bixnZXRTY3JpcHQ6cn19KHtkYXRhTGF5ZXI6ZSxkYXRhTGF5ZXJOYW1lOnQsZW52aXJvbm1lbnQ6cixub25jZTpuLGlkOm8sY3VzdG9tRG9tYWluOmEsY3VzdG9tU2NyaXB0TmFtZTppfSksdT1jKCksbT1sKCksZD1zKCk7ZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUodSxkb2N1bWVudC5oZWFkLmNoaWxkTm9kZXNbMF0/P251bGwpLGRvY3VtZW50LmhlYWQuaW5zZXJ0QmVmb3JlKG0sZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzWzFdPz9udWxsKSxkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShkLGRvY3VtZW50LmJvZHkuY2hpbGROb2Rlc1swXT8/bnVsbCl9ZnVuY3Rpb24gZCh7ZGF0YUxheWVyTmFtZTplLGRhdGE6dH0pe2NvbnN0IHI9d2luZG93W2VdO3I/ci5wdXNoKHQpOmNvbnNvbGUud2FybihgZGF0YUxheWVyICR7ZX0gZG9lcyBub3QgZXhpc3QsIG1ha2Ugc3VyZSB0byBpbml0aWFsaXplIGl0YCl9Y29uc3QgeT17ZGF0YUxheWVyOnZvaWQgMCxkYXRhTGF5ZXJOYW1lOnUsZW52aXJvbm1lbnQ6dm9pZCAwLG5vbmNlOnZvaWQgMCxpZDpcIlwiLGluamVjdFNjcmlwdDohMCxjdXN0b21Eb21haW46ZixjdXN0b21TY3JpcHROYW1lOnB9LGc9ZS5jcmVhdGVDb250ZXh0KHkpLHY9ZS5jcmVhdGVDb250ZXh0KHZvaWQgMCk7ZnVuY3Rpb24gYihlLHQpe3JldHVybiBkKHtkYXRhTGF5ZXJOYW1lOmUuZGF0YUxheWVyTmFtZXx8dSxkYXRhOnR9KSxlfWZ1bmN0aW9uIGgoe2NvbmZpZzp0LGNoaWxkcmVuOnJ9KXtjb25zdFtuLG9dPWUudXNlUmVkdWNlcihiLHsuLi55LC4uLnR9KTtyZXR1cm4gZS51c2VFZmZlY3QoKCgpPT57dCYmITEhPT10LmluamVjdFNjcmlwdCYmbSh7Li4ubiwuLi50fSl9KSxbdCxuXSkscy5qc3goZy5Qcm92aWRlcix7dmFsdWU6bixjaGlsZHJlbjpzLmpzeCh2LlByb3ZpZGVyLHt2YWx1ZTpvLGNoaWxkcmVuOnJ9KX0pfWZ1bmN0aW9uIHcoKXtjb25zdCB0PWUudXNlQ29udGV4dCh2KTtpZih2b2lkIDA9PT10KXRocm93IG5ldyBFcnJvcihcInVzZUdUTURpc3BhdGNoIG11c3QgYmUgdXNlZCB3aXRoaW4gYSBHVE1Qcm92aWRlclwiKTtyZXR1cm4gdH1leHBvcnR7dSBhcyBERUZBVUxUX0RBVEFfTEFZRVJfTkFNRSxmIGFzIERFRkFVTFRfRE9NQUlOLHAgYXMgREVGQVVMVF9TQ1JJUFRfTkFNRSxnIGFzIEdUTUNvbnRleHQsdiBhcyBHVE1Db250ZXh0RGlzcGF0Y2gsaCBhcyBHVE1Qcm92aWRlcixtIGFzIGluaXRHVE0seSBhcyBpbml0aWFsU3RhdGUsZCBhcyBzZW5kVG9EYXRhTGF5ZXIsdyBhcyB1c2VHVE1EaXNwYXRjaH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20uanMubWFwXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/react-gtm-hook@0.0.1_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/react-gtm-hook/dist/index.esm.js\n");

/***/ })

};
;