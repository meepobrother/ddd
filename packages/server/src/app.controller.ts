import { WebSocketServer, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'ws';
import { readFileSync, ensureDirSync, existsSync, writeFileSync } from 'fs-extra';
import { join } from 'path';

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
            writeFileSync(file, data.data);
            this.server.clients.forEach((client) => client.send(JSON.stringify({
                event: `app.update`,
                data: data.data,
            })));
        } catch (e) {
            console.log(e.message);
        }
    }
}
