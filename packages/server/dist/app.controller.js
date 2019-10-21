"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const lodash_1 = require("lodash");
const X2JS = require("x2js");
let AppController = class AppController {
    constructor() {
        this.path = path_1.join(__dirname, '../data');
    }
    get file() {
        return path_1.join(this.path, 'domain.xml');
    }
    appInit(client, data) {
        const file = path_1.join(this.path, `${data.path}.xml`);
        if (fs_extra_1.existsSync(file)) {
            return {
                data: fs_extra_1.readFileSync(file).toString('utf8'),
            };
        }
        else {
            return ``;
        }
    }
    appSave(client, data) {
        try {
            fs_extra_1.ensureDirSync(this.path);
            const file = path_1.join(this.path, `${data.path}.xml`);
            const oldData = fs_extra_1.readFileSync(file).toString('utf8');
            const newData = data.data;
            const x2js = new X2JS();
            const oldJson = x2js.xml2js(oldData);
            const newJson = x2js.xml2js(newData);
            const json = lodash_1.defaultsDeep(newJson, oldJson);
            const fileData = x2js.js2xml(json);
            fs_extra_1.writeFileSync(file, fileData);
            this.server.clients.forEach((client) => client.send(JSON.stringify({
                event: `app.update`,
                data: fileData,
            })));
        }
        catch (e) {
            console.log(e.message);
        }
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", ws_1.Server)
], AppController.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage('app.init'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "appInit", null);
__decorate([
    websockets_1.SubscribeMessage('app.save'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "appSave", null);
AppController = __decorate([
    websockets_1.WebSocketGateway()
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map