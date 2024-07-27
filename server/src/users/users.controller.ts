import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('user')
export class UsersController {
  @Get('budget-list/:userId')
  async sendlist(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Query() query: any,
  ) {
    const { current, pageSize, sortField, sortOrder, type, reoccur, total } =
      query;

    console.log('current:', current);
    console.log('pageSize:', pageSize);
    console.log('sortField:', sortField);
    console.log('sortOrder:', sortOrder);
    console.log('type:', type);
    console.log('reoccur:', reoccur);
    console.log('total', total);
    console.log('userId:', userId);

    return res.json('hello');
  }
}
