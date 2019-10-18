"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_ws_1 = require("@nestjs/platform-ws");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
    });
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    await app.listen(3000, `0.0.0.0`);
}
bootstrap();
//# sourceMappingURL=main.js.map