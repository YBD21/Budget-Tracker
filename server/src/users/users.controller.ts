import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('user')
export class UsersController {
  @Get('budget-list:id')
  async sendlist(@Res() res: Response, @Param() params: any) {
    const { userId, page, pageSize, sortField, sortOrder, filters } = params;
    console.log('page :', page);
    console.log('pageSize :', pageSize);
    console.log('sortField :', sortField);
    console.log('sortOrder :', sortOrder);
    console.log('filters :', filters);
    console.log(userId);
    return res.json('hello');
  }
}
