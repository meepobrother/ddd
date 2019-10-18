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
        return join(this.path, 'domain.json');
    }

    @SubscribeMessage('app.init')
    appInit() {
        if (existsSync(this.file)) {
            return JSON.parse(readFileSync(this.file).toString('utf8'));
        } else {
            return {};
        }
    }

    @SubscribeMessage('app.save')
    appSave(client: any, data: any) {
        try {
            ensureDirSync(this.path);
            writeFileSync(this.file, JSON.stringify(data));
            this.server.clients.forEach((client) => client.send(JSON.stringify({
                event: `app.update`,
                data,
            })));
        } catch (e) {
            console.log(e.message);
        }
    }
}
