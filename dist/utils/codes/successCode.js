"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessCode = void 0;
var SuccessCode;
(function (SuccessCode) {
    SuccessCode[SuccessCode["OK"] = 200] = "OK";
    SuccessCode[SuccessCode["CREATED"] = 201] = "CREATED";
    SuccessCode[SuccessCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    SuccessCode[SuccessCode["CUSTOM_SUCCESS"] = 2001] = "CUSTOM_SUCCESS";
})(SuccessCode || (exports.SuccessCode = SuccessCode = {}));
