"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FeedOgDto = exports.FeedRequestDto = void 0;
var class_validator_1 = require("class-validator");
var FeedRequestDto = /** @class */ (function () {
    function FeedRequestDto() {
    }
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsNotEmpty)()
    ], FeedRequestDto.prototype, "group_id");
    return FeedRequestDto;
}());
exports.FeedRequestDto = FeedRequestDto;
var FeedOgDto = /** @class */ (function () {
    function FeedOgDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], FeedOgDto.prototype, "og_title");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], FeedOgDto.prototype, "og_desc");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], FeedOgDto.prototype, "og_image");
    return FeedOgDto;
}());
exports.FeedOgDto = FeedOgDto;
