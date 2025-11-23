import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getRoot() {
    return {
      message: 'Success! Server is Up and Running.',
    };
  }
}
