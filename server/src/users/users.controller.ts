import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('user')
export class UsersController {
  @Get('budget-list')
  async sendlist(@Res() res: Response, @Query() query: any) {
    const { current, pageSize, sortField, sortOrder, type, reoccur } = query;

    console.log('current:', current);
    console.log('pageSize:', pageSize);
    console.log('sortField:', sortField);
    console.log('sortOrder:', sortOrder);
    console.log('type:', type);
    console.log('reoccur:', reoccur);
    // console.log('userId:', userId);

    const generateDataSource = (length: number) =>
      Array.from({ length }).map((_, i) => ({
        key: i,
        date: `2023-07-${i + 1}`,
        title: `Transaction ${i}`,
        type: i % 2 === 0 ? 'Income' : 'Expense',
        reoccur: i % 2 === 0,
        amount: Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000,
      }));

    const dataSource = generateDataSource(10);

    return res.json(dataSource);
  }
}
