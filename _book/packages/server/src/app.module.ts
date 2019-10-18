import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppController2 } from './app2';

@Module({
    imports: [],
    controllers: [
        AppController2,
    ],
    providers: [AppController],
})
export class AppModule { }
