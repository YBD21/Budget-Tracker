import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('user')
export class UsersController {
  @Get('budget-list:id')
  async sendlist(
    @Res() res: Response,
    @Param('id') id: string,
    @Query() query: any,
  ) {
    const { page, pageSize, sortField, sortOrder, filters } = query;
    console.log('page :', page);
    console.log('pageSize :', pageSize);
    console.log('sortField :', sortField);
    console.log('sortOrder :', sortOrder);
    console.log('filters :', filters);
    console.log(id);
    return res.json('hello');
  }
}
