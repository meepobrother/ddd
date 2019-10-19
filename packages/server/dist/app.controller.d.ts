import { Server } from 'ws';
export declare class AppController {
    server: Server;
    path: string;
    readonly file: string;
    appInit(client: any, data: any): "" | {
        data: string;
    };
    appSave(client: any, data: any): void;
}
