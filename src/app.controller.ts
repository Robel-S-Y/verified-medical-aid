import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  @Get('/')
  @Public()
  getRoot() {
    return {
      message: 'Success! Server is Up and Running.',
    };
  }
}
