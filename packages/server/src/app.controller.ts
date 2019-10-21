import { WebSocketServer, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'ws';
import { readFileSync, ensureDirSync, existsSync, writeFileSync } from 'fs-extra';
import { join } from 'path';
import { defaultsDeep } from 'lodash';
import * as X2JS from 'x2js';
@WebSocketGateway()
export class AppController {
    @WebSocketServer()
    server: Server;
    path: string = join(__dirname, '../data');
    get file(): string {
        return join(this.path, 'domain.xml');
    }

    @SubscribeMessage('app.init')
    appInit(client: any, data: any) {
        const file = join(this.path, `${data.path}.xml`);
        if (existsSync(file)) {
            return {
                data: readFileSync(file).toString('utf8'),
            };
        } else {
            return ``;
        }
    }

    @SubscribeMessage('app.save')
    appSave(client: any, data: any) {
        try {
            ensureDirSync(this.path);
            const file = join(this.path, `${data.path}.xml`);
            const oldData = readFileSync(file).toString('utf8');
            const newData = data.data;
            const x2js = new X2JS();
            const oldJson = x2js.xml2js(oldData);
            const newJson = x2js.xml2js(newData);
            const json = defaultsDeep(newJson, oldJson);
            const fileData = x2js.js2xml(json);
            writeFileSync(file, fileData);
            this.server.clients.forEach((client) => client.send(JSON.stringify({
                event: `app.update`,
                data: fileData,
            })));
        } catch (e) {
            console.log(e.message);
        }
    }
}
