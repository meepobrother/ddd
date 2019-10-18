import { Server } from 'ws';
export declare class AppController {
    server: Server;
    path: string;
    readonly file: string;
    appInit(): any;
    appSave(client: any, data: any): void;
}
