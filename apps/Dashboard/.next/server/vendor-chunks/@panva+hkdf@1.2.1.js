"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@panva+hkdf@1.2.1";
exports.ids = ["vendor-chunks/@panva+hkdf@1.2.1"];
exports.modules = {

/***/ "(rsc)/../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/index.js":
/*!**************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/index.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports[\"default\"] = exports.hkdf = void 0;\nconst hkdf_js_1 = __webpack_require__(/*! ./runtime/hkdf.js */ \"(rsc)/../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/runtime/hkdf.js\");\nfunction normalizeDigest(digest) {\n    switch (digest) {\n        case 'sha256':\n        case 'sha384':\n        case 'sha512':\n        case 'sha1':\n            return digest;\n        default:\n            throw new TypeError('unsupported \"digest\" value');\n    }\n}\nfunction normalizeUint8Array(input, label) {\n    if (typeof input === 'string')\n        return new TextEncoder().encode(input);\n    if (!(input instanceof Uint8Array))\n        throw new TypeError(`\"${label}\"\" must be an instance of Uint8Array or a string`);\n    return input;\n}\nfunction normalizeIkm(input) {\n    const ikm = normalizeUint8Array(input, 'ikm');\n    if (!ikm.byteLength)\n        throw new TypeError(`\"ikm\" must be at least one byte in length`);\n    return ikm;\n}\nfunction normalizeInfo(input) {\n    const info = normalizeUint8Array(input, 'info');\n    if (info.byteLength > 1024) {\n        throw TypeError('\"info\" must not contain more than 1024 bytes');\n    }\n    return info;\n}\nfunction normalizeKeylen(input, digest) {\n    if (typeof input !== 'number' || !Number.isInteger(input) || input < 1) {\n        throw new TypeError('\"keylen\" must be a positive integer');\n    }\n    const hashlen = parseInt(digest.substr(3), 10) >> 3 || 20;\n    if (input > 255 * hashlen) {\n        throw new TypeError('\"keylen\" too large');\n    }\n    return input;\n}\nasync function hkdf(digest, ikm, salt, info, keylen) {\n    return (0, hkdf_js_1.default)(normalizeDigest(digest), normalizeIkm(ikm), normalizeUint8Array(salt, 'salt'), normalizeInfo(info), normalizeKeylen(keylen, digest));\n}\nexports.hkdf = hkdf;\nexports[\"default\"] = hkdf;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BwYW52YStoa2RmQDEuMi4xL25vZGVfbW9kdWxlcy9AcGFudmEvaGtkZi9kaXN0L25vZGUvY2pzL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtCQUFlLEdBQUcsWUFBWTtBQUM5QixrQkFBa0IsbUJBQU8sQ0FBQyxrSUFBbUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLE1BQU07QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1osa0JBQWUiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcaW5mb1xcRG9jdW1lbnRzXFxEaXNjb3JkIEJvdFxccHlyby1tb25vcmVwb1xcbm9kZV9tb2R1bGVzXFwucG5wbVxcQHBhbnZhK2hrZGZAMS4yLjFcXG5vZGVfbW9kdWxlc1xcQHBhbnZhXFxoa2RmXFxkaXN0XFxub2RlXFxjanNcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5oa2RmID0gdm9pZCAwO1xuY29uc3QgaGtkZl9qc18xID0gcmVxdWlyZShcIi4vcnVudGltZS9oa2RmLmpzXCIpO1xuZnVuY3Rpb24gbm9ybWFsaXplRGlnZXN0KGRpZ2VzdCkge1xuICAgIHN3aXRjaCAoZGlnZXN0KSB7XG4gICAgICAgIGNhc2UgJ3NoYTI1Nic6XG4gICAgICAgIGNhc2UgJ3NoYTM4NCc6XG4gICAgICAgIGNhc2UgJ3NoYTUxMic6XG4gICAgICAgIGNhc2UgJ3NoYTEnOlxuICAgICAgICAgICAgcmV0dXJuIGRpZ2VzdDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3Vuc3VwcG9ydGVkIFwiZGlnZXN0XCIgdmFsdWUnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBub3JtYWxpemVVaW50OEFycmF5KGlucHV0LCBsYWJlbCkge1xuICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKVxuICAgICAgICByZXR1cm4gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGlucHV0KTtcbiAgICBpZiAoIShpbnB1dCBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBcIiR7bGFiZWx9XCJcIiBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIFVpbnQ4QXJyYXkgb3IgYSBzdHJpbmdgKTtcbiAgICByZXR1cm4gaW5wdXQ7XG59XG5mdW5jdGlvbiBub3JtYWxpemVJa20oaW5wdXQpIHtcbiAgICBjb25zdCBpa20gPSBub3JtYWxpemVVaW50OEFycmF5KGlucHV0LCAnaWttJyk7XG4gICAgaWYgKCFpa20uYnl0ZUxlbmd0aClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgXCJpa21cIiBtdXN0IGJlIGF0IGxlYXN0IG9uZSBieXRlIGluIGxlbmd0aGApO1xuICAgIHJldHVybiBpa207XG59XG5mdW5jdGlvbiBub3JtYWxpemVJbmZvKGlucHV0KSB7XG4gICAgY29uc3QgaW5mbyA9IG5vcm1hbGl6ZVVpbnQ4QXJyYXkoaW5wdXQsICdpbmZvJyk7XG4gICAgaWYgKGluZm8uYnl0ZUxlbmd0aCA+IDEwMjQpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdcImluZm9cIiBtdXN0IG5vdCBjb250YWluIG1vcmUgdGhhbiAxMDI0IGJ5dGVzJyk7XG4gICAgfVxuICAgIHJldHVybiBpbmZvO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplS2V5bGVuKGlucHV0LCBkaWdlc3QpIHtcbiAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnbnVtYmVyJyB8fCAhTnVtYmVyLmlzSW50ZWdlcihpbnB1dCkgfHwgaW5wdXQgPCAxKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wia2V5bGVuXCIgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInKTtcbiAgICB9XG4gICAgY29uc3QgaGFzaGxlbiA9IHBhcnNlSW50KGRpZ2VzdC5zdWJzdHIoMyksIDEwKSA+PiAzIHx8IDIwO1xuICAgIGlmIChpbnB1dCA+IDI1NSAqIGhhc2hsZW4pIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJrZXlsZW5cIiB0b28gbGFyZ2UnKTtcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0O1xufVxuYXN5bmMgZnVuY3Rpb24gaGtkZihkaWdlc3QsIGlrbSwgc2FsdCwgaW5mbywga2V5bGVuKSB7XG4gICAgcmV0dXJuICgwLCBoa2RmX2pzXzEuZGVmYXVsdCkobm9ybWFsaXplRGlnZXN0KGRpZ2VzdCksIG5vcm1hbGl6ZUlrbShpa20pLCBub3JtYWxpemVVaW50OEFycmF5KHNhbHQsICdzYWx0JyksIG5vcm1hbGl6ZUluZm8oaW5mbyksIG5vcm1hbGl6ZUtleWxlbihrZXlsZW4sIGRpZ2VzdCkpO1xufVxuZXhwb3J0cy5oa2RmID0gaGtkZjtcbmV4cG9ydHMuZGVmYXVsdCA9IGhrZGY7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/index.js\n");

/***/ }),

/***/ "(rsc)/../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/runtime/fallback.js":
/*!*************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/runtime/fallback.js ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst crypto_1 = __webpack_require__(/*! crypto */ \"crypto\");\nexports[\"default\"] = (digest, ikm, salt, info, keylen) => {\n    const hashlen = parseInt(digest.substr(3), 10) >> 3 || 20;\n    const prk = (0, crypto_1.createHmac)(digest, salt.byteLength ? salt : new Uint8Array(hashlen))\n        .update(ikm)\n        .digest();\n    const N = Math.ceil(keylen / hashlen);\n    const T = new Uint8Array(hashlen * N + info.byteLength + 1);\n    let prev = 0;\n    let start = 0;\n    for (let c = 1; c <= N; c++) {\n        T.set(info, start);\n        T[start + info.byteLength] = c;\n        T.set((0, crypto_1.createHmac)(digest, prk)\n            .update(T.subarray(prev, start + info.byteLength + 1))\n            .digest(), start);\n        prev = start;\n        start += hashlen;\n    }\n    return T.slice(0, keylen);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BwYW52YStoa2RmQDEuMi4xL25vZGVfbW9kdWxlcy9AcGFudmEvaGtkZi9kaXN0L25vZGUvY2pzL3J1bnRpbWUvZmFsbGJhY2suanMiLCJtYXBwaW5ncyI6IkFBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUJBQWlCLG1CQUFPLENBQUMsc0JBQVE7QUFDakMsa0JBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFFBQVE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcaW5mb1xcRG9jdW1lbnRzXFxEaXNjb3JkIEJvdFxccHlyby1tb25vcmVwb1xcbm9kZV9tb2R1bGVzXFwucG5wbVxcQHBhbnZhK2hrZGZAMS4yLjFcXG5vZGVfbW9kdWxlc1xcQHBhbnZhXFxoa2RmXFxkaXN0XFxub2RlXFxjanNcXHJ1bnRpbWVcXGZhbGxiYWNrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY3J5cHRvXzEgPSByZXF1aXJlKFwiY3J5cHRvXCIpO1xuZXhwb3J0cy5kZWZhdWx0ID0gKGRpZ2VzdCwgaWttLCBzYWx0LCBpbmZvLCBrZXlsZW4pID0+IHtcbiAgICBjb25zdCBoYXNobGVuID0gcGFyc2VJbnQoZGlnZXN0LnN1YnN0cigzKSwgMTApID4+IDMgfHwgMjA7XG4gICAgY29uc3QgcHJrID0gKDAsIGNyeXB0b18xLmNyZWF0ZUhtYWMpKGRpZ2VzdCwgc2FsdC5ieXRlTGVuZ3RoID8gc2FsdCA6IG5ldyBVaW50OEFycmF5KGhhc2hsZW4pKVxuICAgICAgICAudXBkYXRlKGlrbSlcbiAgICAgICAgLmRpZ2VzdCgpO1xuICAgIGNvbnN0IE4gPSBNYXRoLmNlaWwoa2V5bGVuIC8gaGFzaGxlbik7XG4gICAgY29uc3QgVCA9IG5ldyBVaW50OEFycmF5KGhhc2hsZW4gKiBOICsgaW5mby5ieXRlTGVuZ3RoICsgMSk7XG4gICAgbGV0IHByZXYgPSAwO1xuICAgIGxldCBzdGFydCA9IDA7XG4gICAgZm9yIChsZXQgYyA9IDE7IGMgPD0gTjsgYysrKSB7XG4gICAgICAgIFQuc2V0KGluZm8sIHN0YXJ0KTtcbiAgICAgICAgVFtzdGFydCArIGluZm8uYnl0ZUxlbmd0aF0gPSBjO1xuICAgICAgICBULnNldCgoMCwgY3J5cHRvXzEuY3JlYXRlSG1hYykoZGlnZXN0LCBwcmspXG4gICAgICAgICAgICAudXBkYXRlKFQuc3ViYXJyYXkocHJldiwgc3RhcnQgKyBpbmZvLmJ5dGVMZW5ndGggKyAxKSlcbiAgICAgICAgICAgIC5kaWdlc3QoKSwgc3RhcnQpO1xuICAgICAgICBwcmV2ID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ICs9IGhhc2hsZW47XG4gICAgfVxuICAgIHJldHVybiBULnNsaWNlKDAsIGtleWxlbik7XG59O1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/runtime/fallback.js\n");

/***/ }),

/***/ "(rsc)/../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/runtime/hkdf.js":
/*!*********************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/runtime/hkdf.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\");\nconst fallback_js_1 = __webpack_require__(/*! ./fallback.js */ \"(rsc)/../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/runtime/fallback.js\");\nlet hkdf;\nif (typeof crypto.hkdf === 'function' && !process.versions.electron) {\n    hkdf = async (...args) => new Promise((resolve, reject) => {\n        crypto.hkdf(...args, (err, arrayBuffer) => {\n            if (err)\n                reject(err);\n            else\n                resolve(new Uint8Array(arrayBuffer));\n        });\n    });\n}\nexports[\"default\"] = async (digest, ikm, salt, info, keylen) => (hkdf || fallback_js_1.default)(digest, ikm, salt, info, keylen);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BwYW52YStoa2RmQDEuMi4xL25vZGVfbW9kdWxlcy9AcGFudmEvaGtkZi9kaXN0L25vZGUvY2pzL3J1bnRpbWUvaGtkZi5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxlQUFlLG1CQUFPLENBQUMsc0JBQVE7QUFDL0Isc0JBQXNCLG1CQUFPLENBQUMsa0lBQWU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxrQkFBZSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxpbmZvXFxEb2N1bWVudHNcXERpc2NvcmQgQm90XFxweXJvLW1vbm9yZXBvXFxub2RlX21vZHVsZXNcXC5wbnBtXFxAcGFudmEraGtkZkAxLjIuMVxcbm9kZV9tb2R1bGVzXFxAcGFudmFcXGhrZGZcXGRpc3RcXG5vZGVcXGNqc1xccnVudGltZVxcaGtkZi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoXCJjcnlwdG9cIik7XG5jb25zdCBmYWxsYmFja19qc18xID0gcmVxdWlyZShcIi4vZmFsbGJhY2suanNcIik7XG5sZXQgaGtkZjtcbmlmICh0eXBlb2YgY3J5cHRvLmhrZGYgPT09ICdmdW5jdGlvbicgJiYgIXByb2Nlc3MudmVyc2lvbnMuZWxlY3Ryb24pIHtcbiAgICBoa2RmID0gYXN5bmMgKC4uLmFyZ3MpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY3J5cHRvLmhrZGYoLi4uYXJncywgKGVyciwgYXJyYXlCdWZmZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IGFzeW5jIChkaWdlc3QsIGlrbSwgc2FsdCwgaW5mbywga2V5bGVuKSA9PiAoaGtkZiB8fCBmYWxsYmFja19qc18xLmRlZmF1bHQpKGRpZ2VzdCwgaWttLCBzYWx0LCBpbmZvLCBrZXlsZW4pO1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/.pnpm/@panva+hkdf@1.2.1/node_modules/@panva/hkdf/dist/node/cjs/runtime/hkdf.js\n");

/***/ })

};
;