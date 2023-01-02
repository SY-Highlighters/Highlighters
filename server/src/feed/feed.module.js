"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FeedModule = void 0;
var common_1 = require("@nestjs/common");
var feed_controller_1 = require("./feed.controller");
var feed_service_1 = require("./feed.service");
var FeedModule = /** @class */ (function () {
    function FeedModule() {
    }
    FeedModule = __decorate([
        (0, common_1.Module)({
            controllers: [feed_controller_1.FeedController],
            providers: [feed_service_1.FeedService]
        })
    ], FeedModule);
    return FeedModule;
}());
exports.FeedModule = FeedModule;
