"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/dashboard/categories/page",{

/***/ "(app-pages-browser)/./src/components/dashboard/categories/zones/zones-table.tsx":
/*!*******************************************************************!*\
  !*** ./src/components/dashboard/categories/zones/zones-table.tsx ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ZonesTable: () => (/* binding */ ZonesTable)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/../../node_modules/.pnpm/next@15.1.4_@babel+core@7.26.7_babel-plugin-macros@3.1.0_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/../../node_modules/.pnpm/next@15.1.4_@babel+core@7.26.7_babel-plugin-macros@3.1.0_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _mui_material_IconButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mui/material/IconButton */ \"(app-pages-browser)/../../node_modules/.pnpm/@mui+material@6.3.1_@emotion+react@11.14.0_@types+react@19.0.4_react@19.0.0__@emotion+styled@_xk4ycxdkkzbkbh3cx737ylwvye/node_modules/@mui/material/IconButton/IconButton.js\");\n/* harmony import */ var _phosphor_icons_react_dist_ssr_NotePencil__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @phosphor-icons/react/dist/ssr/NotePencil */ \"(app-pages-browser)/../../node_modules/.pnpm/@phosphor-icons+react@2.1.7_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/@phosphor-icons/react/dist/ssr/NotePencil.mjs\");\n/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mui/material/Box */ \"(app-pages-browser)/../../node_modules/.pnpm/@mui+material@6.3.1_@emotion+react@11.14.0_@types+react@19.0.4_react@19.0.0__@emotion+styled@_xk4ycxdkkzbkbh3cx737ylwvye/node_modules/@mui/material/Box/Box.js\");\n/* harmony import */ var _mui_material_Typography__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mui/material/Typography */ \"(app-pages-browser)/../../node_modules/.pnpm/@mui+material@6.3.1_@emotion+react@11.14.0_@types+react@19.0.4_react@19.0.0__@emotion+styled@_xk4ycxdkkzbkbh3cx737ylwvye/node_modules/@mui/material/Typography/Typography.js\");\n/* harmony import */ var _components_core_data_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/core/data-table */ \"(app-pages-browser)/./src/components/core/data-table.tsx\");\n/* harmony import */ var _zones_selection_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./zones-selection-context */ \"(app-pages-browser)/./src/components/dashboard/categories/zones/zones-selection-context.tsx\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/link */ \"(app-pages-browser)/../../node_modules/.pnpm/next@15.1.4_@babel+core@7.26.7_babel-plugin-macros@3.1.0_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/client/app-dir/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_4__);\n// apps/dashboard/src/components/dashboard/categories/zones/zones-table.tsx\n/* __next_internal_client_entry_do_not_use__ ZonesTable auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\n\n// Falls du das nicht hast, kannst du es weglassen oder dummy. \n// import Link from \"next/link\";\nconst columns = [\n    {\n        field: \"zoneKey\",\n        name: \"Zonen Key\",\n        width: \"100px\"\n    },\n    {\n        field: \"zoneName\",\n        name: \"Zonen Name\",\n        width: \"150px\"\n    },\n    {\n        formatter: (row)=>String(row.minutesRequired),\n        name: \"Minuten\",\n        width: \"80px\"\n    },\n    {\n        formatter: (row)=>String(row.pointsGranted),\n        name: \"Punkte\",\n        width: \"80px\"\n    },\n    {\n        formatter: (row)=>{\n            const hours = Math.floor(row.totalSecondsInZone / 3600);\n            const minutes = Math.floor(row.totalSecondsInZone % 3600 / 60);\n            return \"\".concat(hours, \"h \").concat(minutes, \"m\");\n        },\n        name: \"Gesamtzeit\",\n        width: \"120px\"\n    },\n    {\n        formatter: (row)=>{\n            var _row_categoryName;\n            return (_row_categoryName = row.categoryName) !== null && _row_categoryName !== void 0 ? _row_categoryName : \"-\";\n        },\n        name: \"Kategorie\",\n        width: \"250px\"\n    },\n    {\n        formatter: (row)=>{\n            if (!row.lastUsage) return \"-\";\n            return new Date(row.lastUsage).toLocaleString();\n        },\n        name: \"Zuletzt benutzt\",\n        width: \"180px\"\n    },\n    {\n        formatter: (row)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_IconButton__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n                component: (next_link__WEBPACK_IMPORTED_MODULE_4___default()),\n                href: \"/dashboard/categories/zones/edit/\".concat(row.id),\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_phosphor_icons_react_dist_ssr_NotePencil__WEBPACK_IMPORTED_MODULE_6__.NotePencil, {}, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\zones\\\\zones-table.tsx\",\n                    lineNumber: 63,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\zones\\\\zones-table.tsx\",\n                lineNumber: 59,\n                columnNumber: 7\n            }, undefined),\n        name: \"Edit\",\n        hideName: true,\n        width: \"80px\",\n        align: \"right\"\n    }\n];\nfunction ZonesTable(param) {\n    let { rows } = param;\n    _s();\n    const { deselectAll, deselectOne, selectAll, selectOne, selected } = (0,_zones_selection_context__WEBPACK_IMPORTED_MODULE_3__.useZonesSelection)();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_core_data_table__WEBPACK_IMPORTED_MODULE_2__.DataTable, {\n                columns: columns,\n                rows: rows,\n                selectable: true,\n                selected: selected,\n                onSelectAll: selectAll,\n                onDeselectAll: deselectAll,\n                onSelectOne: (_, row)=>selectOne(row.id),\n                onDeselectOne: (_, row)=>deselectOne(row.id)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\zones\\\\zones-table.tsx\",\n                lineNumber: 82,\n                columnNumber: 7\n            }, this),\n            rows.length === 0 && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Box__WEBPACK_IMPORTED_MODULE_7__[\"default\"], {\n                sx: {\n                    p: 3\n                },\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Typography__WEBPACK_IMPORTED_MODULE_8__[\"default\"], {\n                    color: \"text.secondary\",\n                    sx: {\n                        textAlign: \"center\"\n                    },\n                    variant: \"body2\",\n                    children: \"Keine Zone gefunden\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\zones\\\\zones-table.tsx\",\n                    lineNumber: 95,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\zones\\\\zones-table.tsx\",\n                lineNumber: 94,\n                columnNumber: 9\n            }, this)\n        ]\n    }, void 0, true);\n}\n_s(ZonesTable, \"q8wf3MIOMBc8p+jlq8eM0EnciVI=\", false, function() {\n    return [\n        _zones_selection_context__WEBPACK_IMPORTED_MODULE_3__.useZonesSelection\n    ];\n});\n_c = ZonesTable;\nvar _c;\n$RefreshReg$(_c, \"ZonesTable\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL2Rhc2hib2FyZC9jYXRlZ29yaWVzL3pvbmVzL3pvbmVzLXRhYmxlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyRUFBMkU7OztBQUc1QztBQUNtQjtBQUN1QztBQUNyRDtBQUNjO0FBRU87QUFJSztBQUNqQztBQUk3QiwrREFBK0Q7QUFDL0QsZ0NBQWdDO0FBRWhDLE1BQU1TLFVBQW1DO0lBQ3ZDO1FBQUVDLE9BQU87UUFBV0MsTUFBTTtRQUFhQyxPQUFPO0lBQVE7SUFDdEQ7UUFBRUYsT0FBTztRQUFZQyxNQUFNO1FBQWNDLE9BQU87SUFBUTtJQUN4RDtRQUNFQyxXQUFXLENBQUNDLE1BQVFDLE9BQU9ELElBQUlFLGVBQWU7UUFDOUNMLE1BQU07UUFDTkMsT0FBTztJQUNUO0lBQ0E7UUFDRUMsV0FBVyxDQUFDQyxNQUFRQyxPQUFPRCxJQUFJRyxhQUFhO1FBQzVDTixNQUFNO1FBQ05DLE9BQU87SUFDVDtJQUNBO1FBQ0VDLFdBQVcsQ0FBQ0M7WUFDVixNQUFNSSxRQUFRQyxLQUFLQyxLQUFLLENBQUNOLElBQUlPLGtCQUFrQixHQUFHO1lBQ2xELE1BQU1DLFVBQVVILEtBQUtDLEtBQUssQ0FBQyxJQUFLQyxrQkFBa0IsR0FBRyxPQUFRO1lBQzdELE9BQU8sR0FBYUMsT0FBVkosT0FBTSxNQUFZLE9BQVJJLFNBQVE7UUFDOUI7UUFDQVgsTUFBTTtRQUNOQyxPQUFPO0lBQ1Q7SUFDQTtRQUNFQyxXQUFXLENBQUNDO2dCQUFRQTttQkFBQUEsQ0FBQUEsb0JBQUFBLElBQUlTLFlBQVksY0FBaEJULCtCQUFBQSxvQkFBb0I7O1FBQ3hDSCxNQUFNO1FBQ05DLE9BQU87SUFDVDtJQUNBO1FBQ0VDLFdBQVcsQ0FBQ0M7WUFDVixJQUFJLENBQUNBLElBQUlVLFNBQVMsRUFBRSxPQUFPO1lBQzNCLE9BQU8sSUFBSUMsS0FBS1gsSUFBSVUsU0FBUyxFQUFFRSxjQUFjO1FBQy9DO1FBQ0FmLE1BQU07UUFDTkMsT0FBTztJQUNUO0lBQ0E7UUFDRUMsV0FBVyxDQUFDQyxvQkFDViw4REFBQ2IsZ0VBQVVBO2dCQUNUMEIsV0FBV25CLGtEQUFJQTtnQkFDZm9CLE1BQU0sb0NBQTJDLE9BQVBkLElBQUllLEVBQUU7MEJBRWhELDRFQUFDMUIsaUZBQWNBOzs7Ozs7Ozs7O1FBR25CUSxNQUFNO1FBQ05tQixVQUFVO1FBQ1ZsQixPQUFPO1FBQ1BtQixPQUFPO0lBQ1Q7Q0FDRDtBQU1NLFNBQVNDLFdBQVcsS0FBeUI7UUFBekIsRUFBRUMsSUFBSSxFQUFtQixHQUF6Qjs7SUFDekIsTUFBTSxFQUFFQyxXQUFXLEVBQUVDLFdBQVcsRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUVDLFFBQVEsRUFBRSxHQUFHL0IsMkVBQWlCQTtJQUV0RixxQkFDRTs7MEJBQ0UsOERBQUNELGtFQUFTQTtnQkFDUkcsU0FBU0E7Z0JBQ1R3QixNQUFNQTtnQkFDTk0sVUFBVTtnQkFDVkQsVUFBVUE7Z0JBQ1ZFLGFBQWFKO2dCQUNiSyxlQUFlUDtnQkFDZlEsYUFBYSxDQUFDQyxHQUFHN0IsTUFBUXVCLFVBQVV2QixJQUFJZSxFQUFFO2dCQUN6Q2UsZUFBZSxDQUFDRCxHQUFHN0IsTUFBUXFCLFlBQVlyQixJQUFJZSxFQUFFOzs7Ozs7WUFHOUNJLEtBQUtZLE1BQU0sS0FBSyxtQkFDZiw4REFBQ3pDLHlEQUFHQTtnQkFBQzBDLElBQUk7b0JBQUVDLEdBQUc7Z0JBQUU7MEJBQ2QsNEVBQUMxQyxnRUFBVUE7b0JBQ1QyQyxPQUFNO29CQUNORixJQUFJO3dCQUFFRyxXQUFXO29CQUFTO29CQUMxQkMsU0FBUTs4QkFDVDs7Ozs7Ozs7Ozs7OztBQU9YO0dBN0JnQmxCOztRQUN1RHpCLHVFQUFpQkE7OztLQUR4RXlCIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGluZm9cXERvY3VtZW50c1xcRGlzY29yZCBCb3RcXHB5cm8tbW9ub3JlcG9cXGFwcHNcXERhc2hib2FyZFxcc3JjXFxjb21wb25lbnRzXFxkYXNoYm9hcmRcXGNhdGVnb3JpZXNcXHpvbmVzXFx6b25lcy10YWJsZS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwcy9kYXNoYm9hcmQvc3JjL2NvbXBvbmVudHMvZGFzaGJvYXJkL2NhdGVnb3JpZXMvem9uZXMvem9uZXMtdGFibGUudHN4XHJcblwidXNlIGNsaWVudFwiO1xyXG5cclxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCBJY29uQnV0dG9uIGZyb20gXCJAbXVpL21hdGVyaWFsL0ljb25CdXR0b25cIjtcclxuaW1wb3J0IHsgTm90ZVBlbmNpbCBhcyBOb3RlUGVuY2lsSWNvbiB9IGZyb20gXCJAcGhvc3Bob3ItaWNvbnMvcmVhY3QvZGlzdC9zc3IvTm90ZVBlbmNpbFwiO1xyXG5pbXBvcnQgQm94IGZyb20gXCJAbXVpL21hdGVyaWFsL0JveFwiO1xyXG5pbXBvcnQgVHlwb2dyYXBoeSBmcm9tIFwiQG11aS9tYXRlcmlhbC9UeXBvZ3JhcGh5XCI7XHJcblxyXG5pbXBvcnQgeyBEYXRhVGFibGUgfSBmcm9tIFwiQC9jb21wb25lbnRzL2NvcmUvZGF0YS10YWJsZVwiOyBcclxuaW1wb3J0IHR5cGUgeyBDb2x1bW5EZWYgfSBmcm9tIFwiQC9jb21wb25lbnRzL2NvcmUvZGF0YS10YWJsZVwiO1xyXG5cclxuaW1wb3J0IHR5cGUgeyBab25lUmVzdWx0IH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuaW1wb3J0IHsgdXNlWm9uZXNTZWxlY3Rpb24gfSBmcm9tIFwiLi96b25lcy1zZWxlY3Rpb24tY29udGV4dFwiO1xyXG5pbXBvcnQgTGluayBmcm9tIFwibmV4dC9saW5rXCI7XHJcblxyXG4vLyBPUFRJT05BTDogRmFsbHMgZHUgUGZhZGUgaGFzdFxyXG5pbXBvcnQgeyBwYXRocyB9IGZyb20gXCJAL3BhdGhzXCI7XHJcbi8vIEZhbGxzIGR1IGRhcyBuaWNodCBoYXN0LCBrYW5uc3QgZHUgZXMgd2VnbGFzc2VuIG9kZXIgZHVtbXkuIFxyXG4vLyBpbXBvcnQgTGluayBmcm9tIFwibmV4dC9saW5rXCI7XHJcblxyXG5jb25zdCBjb2x1bW5zOiBDb2x1bW5EZWY8Wm9uZVJlc3VsdD5bXSA9IFtcclxuICB7IGZpZWxkOiBcInpvbmVLZXlcIiwgbmFtZTogXCJab25lbiBLZXlcIiwgd2lkdGg6IFwiMTAwcHhcIiB9LFxyXG4gIHsgZmllbGQ6IFwiem9uZU5hbWVcIiwgbmFtZTogXCJab25lbiBOYW1lXCIsIHdpZHRoOiBcIjE1MHB4XCIgfSxcclxuICB7XHJcbiAgICBmb3JtYXR0ZXI6IChyb3cpID0+IFN0cmluZyhyb3cubWludXRlc1JlcXVpcmVkKSxcclxuICAgIG5hbWU6IFwiTWludXRlblwiLFxyXG4gICAgd2lkdGg6IFwiODBweFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgZm9ybWF0dGVyOiAocm93KSA9PiBTdHJpbmcocm93LnBvaW50c0dyYW50ZWQpLFxyXG4gICAgbmFtZTogXCJQdW5rdGVcIixcclxuICAgIHdpZHRoOiBcIjgwcHhcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGZvcm1hdHRlcjogKHJvdykgPT4ge1xyXG4gICAgICBjb25zdCBob3VycyA9IE1hdGguZmxvb3Iocm93LnRvdGFsU2Vjb25kc0luWm9uZSAvIDM2MDApO1xyXG4gICAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcigocm93LnRvdGFsU2Vjb25kc0luWm9uZSAlIDM2MDApIC8gNjApO1xyXG4gICAgICByZXR1cm4gYCR7aG91cnN9aCAke21pbnV0ZXN9bWA7XHJcbiAgICB9LFxyXG4gICAgbmFtZTogXCJHZXNhbXR6ZWl0XCIsXHJcbiAgICB3aWR0aDogXCIxMjBweFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgZm9ybWF0dGVyOiAocm93KSA9PiByb3cuY2F0ZWdvcnlOYW1lID8/IFwiLVwiLFxyXG4gICAgbmFtZTogXCJLYXRlZ29yaWVcIixcclxuICAgIHdpZHRoOiBcIjI1MHB4XCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBmb3JtYXR0ZXI6IChyb3cpID0+IHtcclxuICAgICAgaWYgKCFyb3cubGFzdFVzYWdlKSByZXR1cm4gXCItXCI7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZShyb3cubGFzdFVzYWdlKS50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgfSxcclxuICAgIG5hbWU6IFwiWnVsZXR6dCBiZW51dHp0XCIsXHJcbiAgICB3aWR0aDogXCIxODBweFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgZm9ybWF0dGVyOiAocm93KSA9PiAoXHJcbiAgICAgIDxJY29uQnV0dG9uXHJcbiAgICAgICAgY29tcG9uZW50PXtMaW5rfVxyXG4gICAgICAgIGhyZWY9e2AvZGFzaGJvYXJkL2NhdGVnb3JpZXMvem9uZXMvZWRpdC8ke3Jvdy5pZH1gfVxyXG4gICAgICA+XHJcbiAgICAgICAgPE5vdGVQZW5jaWxJY29uIC8+XHJcbiAgICAgIDwvSWNvbkJ1dHRvbj5cclxuICAgICksXHJcbiAgICBuYW1lOiBcIkVkaXRcIixcclxuICAgIGhpZGVOYW1lOiB0cnVlLFxyXG4gICAgd2lkdGg6IFwiODBweFwiLFxyXG4gICAgYWxpZ246IFwicmlnaHRcIixcclxuICB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBab25lc1RhYmxlUHJvcHMge1xyXG4gIHJvd3M6IFpvbmVSZXN1bHRbXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFpvbmVzVGFibGUoeyByb3dzIH06IFpvbmVzVGFibGVQcm9wcykge1xyXG4gIGNvbnN0IHsgZGVzZWxlY3RBbGwsIGRlc2VsZWN0T25lLCBzZWxlY3RBbGwsIHNlbGVjdE9uZSwgc2VsZWN0ZWQgfSA9IHVzZVpvbmVzU2VsZWN0aW9uKCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8PlxyXG4gICAgICA8RGF0YVRhYmxlPFpvbmVSZXN1bHQ+XHJcbiAgICAgICAgY29sdW1ucz17Y29sdW1uc31cclxuICAgICAgICByb3dzPXtyb3dzfVxyXG4gICAgICAgIHNlbGVjdGFibGVcclxuICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWR9XHJcbiAgICAgICAgb25TZWxlY3RBbGw9e3NlbGVjdEFsbH1cclxuICAgICAgICBvbkRlc2VsZWN0QWxsPXtkZXNlbGVjdEFsbH1cclxuICAgICAgICBvblNlbGVjdE9uZT17KF8sIHJvdykgPT4gc2VsZWN0T25lKHJvdy5pZCl9XHJcbiAgICAgICAgb25EZXNlbGVjdE9uZT17KF8sIHJvdykgPT4gZGVzZWxlY3RPbmUocm93LmlkKX1cclxuICAgICAgLz5cclxuXHJcbiAgICAgIHtyb3dzLmxlbmd0aCA9PT0gMCAmJiAoXHJcbiAgICAgICAgPEJveCBzeD17eyBwOiAzIH19PlxyXG4gICAgICAgICAgPFR5cG9ncmFwaHlcclxuICAgICAgICAgICAgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiXHJcbiAgICAgICAgICAgIHN4PXt7IHRleHRBbGlnbjogXCJjZW50ZXJcIiB9fVxyXG4gICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBLZWluZSBab25lIGdlZnVuZGVuXHJcbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XHJcbiAgICAgICAgPC9Cb3g+XHJcbiAgICAgICl9XHJcbiAgICA8Lz5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJSZWFjdCIsIkljb25CdXR0b24iLCJOb3RlUGVuY2lsIiwiTm90ZVBlbmNpbEljb24iLCJCb3giLCJUeXBvZ3JhcGh5IiwiRGF0YVRhYmxlIiwidXNlWm9uZXNTZWxlY3Rpb24iLCJMaW5rIiwiY29sdW1ucyIsImZpZWxkIiwibmFtZSIsIndpZHRoIiwiZm9ybWF0dGVyIiwicm93IiwiU3RyaW5nIiwibWludXRlc1JlcXVpcmVkIiwicG9pbnRzR3JhbnRlZCIsImhvdXJzIiwiTWF0aCIsImZsb29yIiwidG90YWxTZWNvbmRzSW5ab25lIiwibWludXRlcyIsImNhdGVnb3J5TmFtZSIsImxhc3RVc2FnZSIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsImNvbXBvbmVudCIsImhyZWYiLCJpZCIsImhpZGVOYW1lIiwiYWxpZ24iLCJab25lc1RhYmxlIiwicm93cyIsImRlc2VsZWN0QWxsIiwiZGVzZWxlY3RPbmUiLCJzZWxlY3RBbGwiLCJzZWxlY3RPbmUiLCJzZWxlY3RlZCIsInNlbGVjdGFibGUiLCJvblNlbGVjdEFsbCIsIm9uRGVzZWxlY3RBbGwiLCJvblNlbGVjdE9uZSIsIl8iLCJvbkRlc2VsZWN0T25lIiwibGVuZ3RoIiwic3giLCJwIiwiY29sb3IiLCJ0ZXh0QWxpZ24iLCJ2YXJpYW50Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/dashboard/categories/zones/zones-table.tsx\n"));

/***/ })

});