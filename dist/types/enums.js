"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.Action = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["MODERATEUR"] = "MODERATEUR";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var Action;
(function (Action) {
    Action["APPROVED"] = "APPROVED";
    Action["REJECTED"] = "REJECTED";
})(Action || (exports.Action = Action = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["REPUBLISH"] = "REPUBLISH";
    NotificationType["GENERAL"] = "GENERAL";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
