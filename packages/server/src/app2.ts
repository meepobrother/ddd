import { Controller, Post } from '@nestjs/common';

@Controller('/')
export class AppController2 {

    @Post('open')
    open() {
        return {};
    }

    @Post('save')
    save(...args: any[]) {
        return JSON.stringify({ args });
    }
}
