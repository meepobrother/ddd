import { Server } from 'ws';
export declare class AppController {
    server: Server;
    path: string;
    readonly file: string;
    appInit(): "" | {
        data: string;
    };
    appSave(client: any, data: any): void;
}
