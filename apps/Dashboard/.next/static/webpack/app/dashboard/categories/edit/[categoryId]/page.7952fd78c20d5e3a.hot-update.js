"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/dashboard/categories/edit/[categoryId]/page",{

/***/ "(app-pages-browser)/./src/services/categories.ts":
/*!************************************!*\
  !*** ./src/services/categories.ts ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createCategory: () => (/* binding */ createCategory),\n/* harmony export */   deleteCategory: () => (/* binding */ deleteCategory),\n/* harmony export */   getCategories: () => (/* binding */ getCategories),\n/* harmony export */   restoreCategory: () => (/* binding */ restoreCategory),\n/* harmony export */   updateCategory: () => (/* binding */ updateCategory)\n/* harmony export */ });\n/* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./http */ \"(app-pages-browser)/./src/services/http.ts\");\n// apps/Dashboard/src/services/categories.ts\n // <-- aus deinem http.ts\n/** Restore-Funktion für eine Kategorie (PATCH /categories/restore/:id) */ function restoreCategory(categoryId) {\n    return (0,_http__WEBPACK_IMPORTED_MODULE_0__.request)(\"categories/restore/\".concat(categoryId), {\n        method: \"PATCH\"\n    });\n}\n/** Update einer Kategorie via PATCH /categories/:id */ function updateCategory(categoryId, payload) {\n    return (0,_http__WEBPACK_IMPORTED_MODULE_0__.request)(\"categories/\".concat(categoryId), {\n        method: \"PATCH\",\n        headers: {\n            \"Content-Type\": \"application/json\"\n        },\n        body: JSON.stringify(payload)\n    });\n}\n/** Löscht eine Kategorie via DELETE /categories/:id */ function deleteCategory(categoryId) {\n    return (0,_http__WEBPACK_IMPORTED_MODULE_0__.request)(\"categories/\".concat(categoryId), {\n        method: \"DELETE\"\n    });\n}\n/** Erstellt eine Kategorie via POST /categories */ function createCategory(payload) {\n    return (0,_http__WEBPACK_IMPORTED_MODULE_0__.request)(\"categories\", {\n        method: \"POST\",\n        headers: {\n            \"Content-Type\": \"application/json\"\n        },\n        body: JSON.stringify(payload)\n    });\n}\nfunction getCategories() {\n    return (0,_http__WEBPACK_IMPORTED_MODULE_0__.request)(\"categories\"); // GET /categories\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9zZXJ2aWNlcy9jYXRlZ29yaWVzLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDRDQUE0QztBQUNYLENBQUMseUJBQXlCO0FBRTNELHdFQUF3RSxHQUNqRSxTQUFTQyxnQkFBZ0JDLFVBQWtCO0lBQ2pELE9BQU9GLDhDQUFPQSxDQUFDLHNCQUFpQyxPQUFYRSxhQUFjO1FBQ2xEQyxRQUFRO0lBQ1Q7QUFDRDtBQUVBLHFEQUFxRCxHQUM5QyxTQUFTQyxlQUFlRixVQUFrQixFQUFFRyxPQUFZO0lBQzlELE9BQU9MLDhDQUFPQSxDQUFDLGNBQXlCLE9BQVhFLGFBQWM7UUFDMUNDLFFBQVE7UUFDUkcsU0FBUztZQUFFLGdCQUFnQjtRQUFtQjtRQUM5Q0MsTUFBTUMsS0FBS0MsU0FBUyxDQUFDSjtJQUN0QjtBQUNEO0FBRUEscURBQXFELEdBQzlDLFNBQVNLLGVBQWVSLFVBQWtCO0lBQ2hELE9BQU9GLDhDQUFPQSxDQUFDLGNBQXlCLE9BQVhFLGFBQWM7UUFDMUNDLFFBQVE7SUFDVDtBQUNEO0FBRUEsaURBQWlELEdBQzFDLFNBQVNRLGVBQWVOLE9BQVk7SUFDMUMsT0FBT0wsOENBQU9BLENBQUMsY0FBYztRQUM1QkcsUUFBUTtRQUNSRyxTQUFTO1lBQUUsZ0JBQWdCO1FBQW1CO1FBQzlDQyxNQUFNQyxLQUFLQyxTQUFTLENBQUNKO0lBQ3RCO0FBQ0Q7QUFFTyxTQUFTTztJQUNmLE9BQU9aLDhDQUFPQSxDQUFDLGVBQWUsa0JBQWtCO0FBQ2pEIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGluZm9cXERvY3VtZW50c1xcRGlzY29yZCBCb3RcXHB5cm8tbW9ub3JlcG9cXGFwcHNcXERhc2hib2FyZFxcc3JjXFxzZXJ2aWNlc1xcY2F0ZWdvcmllcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhcHBzL0Rhc2hib2FyZC9zcmMvc2VydmljZXMvY2F0ZWdvcmllcy50c1xuaW1wb3J0IHsgcmVxdWVzdCB9IGZyb20gXCIuL2h0dHBcIjsgLy8gPC0tIGF1cyBkZWluZW0gaHR0cC50c1xuXG4vKiogUmVzdG9yZS1GdW5rdGlvbiBmw7xyIGVpbmUgS2F0ZWdvcmllIChQQVRDSCAvY2F0ZWdvcmllcy9yZXN0b3JlLzppZCkgKi9cbmV4cG9ydCBmdW5jdGlvbiByZXN0b3JlQ2F0ZWdvcnkoY2F0ZWdvcnlJZDogc3RyaW5nKSB7XG5cdHJldHVybiByZXF1ZXN0KGBjYXRlZ29yaWVzL3Jlc3RvcmUvJHtjYXRlZ29yeUlkfWAsIHtcblx0XHRtZXRob2Q6IFwiUEFUQ0hcIixcblx0fSk7XG59XG5cbi8qKiBVcGRhdGUgZWluZXIgS2F0ZWdvcmllIHZpYSBQQVRDSCAvY2F0ZWdvcmllcy86aWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVDYXRlZ29yeShjYXRlZ29yeUlkOiBzdHJpbmcsIHBheWxvYWQ6IGFueSkge1xuXHRyZXR1cm4gcmVxdWVzdChgY2F0ZWdvcmllcy8ke2NhdGVnb3J5SWR9YCwge1xuXHRcdG1ldGhvZDogXCJQQVRDSFwiLFxuXHRcdGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcblx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSxcblx0fSk7XG59XG5cbi8qKiBMw7ZzY2h0IGVpbmUgS2F0ZWdvcmllIHZpYSBERUxFVEUgL2NhdGVnb3JpZXMvOmlkICovXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlQ2F0ZWdvcnkoY2F0ZWdvcnlJZDogc3RyaW5nKSB7XG5cdHJldHVybiByZXF1ZXN0KGBjYXRlZ29yaWVzLyR7Y2F0ZWdvcnlJZH1gLCB7XG5cdFx0bWV0aG9kOiBcIkRFTEVURVwiLFxuXHR9KTtcbn1cblxuLyoqIEVyc3RlbGx0IGVpbmUgS2F0ZWdvcmllIHZpYSBQT1NUIC9jYXRlZ29yaWVzICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2F0ZWdvcnkocGF5bG9hZDogYW55KSB7XG5cdHJldHVybiByZXF1ZXN0KFwiY2F0ZWdvcmllc1wiLCB7XG5cdFx0bWV0aG9kOiBcIlBPU1RcIixcblx0XHRoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG5cdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkocGF5bG9hZCksXG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2F0ZWdvcmllcygpIHtcblx0cmV0dXJuIHJlcXVlc3QoXCJjYXRlZ29yaWVzXCIpOyAvLyBHRVQgL2NhdGVnb3JpZXNcbn1cbiJdLCJuYW1lcyI6WyJyZXF1ZXN0IiwicmVzdG9yZUNhdGVnb3J5IiwiY2F0ZWdvcnlJZCIsIm1ldGhvZCIsInVwZGF0ZUNhdGVnb3J5IiwicGF5bG9hZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImRlbGV0ZUNhdGVnb3J5IiwiY3JlYXRlQ2F0ZWdvcnkiLCJnZXRDYXRlZ29yaWVzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/services/categories.ts\n"));

/***/ })

});