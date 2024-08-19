import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BudgetDTO } from './dto/users.dto';
import { UsersService } from './users.service';
import { CreateBudgetService } from './create.service';
import { UpdateBudgetService } from './update.service';
import { UserGuard } from './user.guard';

@Controller('user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly userService: UsersService,
    private readonly createBudget: CreateBudgetService,
    private readonly updateBudget: UpdateBudgetService,
  ) {}

  @Get('budget-list')
  async sendlist(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const userData = req.userData;

    const userId = userData?.id;

    const result = await this.userService.getBudgetData(userId, query);

    // const { current, pageSize, sortField, sortOrder, type, reoccur } = query;

    // console.log('current:', current);
    // console.log('pageSize:', pageSize);
    // console.log('sortField:', sortField);
    // console.log('sortOrder:', sortOrder);
    // console.log('type:', type);
    // console.log('reoccur:', reoccur);

    // const generateDataSource = (length) =>
    //   Array.from({ length }).map((_, i) => ({
    //     key: i,
    //     date: `2023-07-${i + 1}`,
    //     title: `Transaction ${i}`,
    //     type: i % 2 === 0 ? 'Income' : 'Expense',
    //     reoccur: i % 3 === 0 ? 'Year' : i % 3 === 1 ? 'Month' : 'Once', // Update reoccur to be 'Year', 'Month', or 'Once'
    //     amount: Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000,
    //   }));

    // const dataSource = generateDataSource(10);

    // console.log(dataSource);

    // return res.json(dataSource);

    return res.json(result);
  }

  @Post('create-budget')
  async handleCreateBudget(
    @Req() req: Request,
    @Res() res: Response,
    @Body() budgetData: BudgetDTO,
  ) {
    const userData = req?.userData;
    const userId = userData?.id;

    try {
      const [status, updateStatus, updateEntry] = await Promise.all([
        this.createBudget.createBudget(userId, budgetData),
        this.updateBudget.updateBudgetSummary({
          userId,
          amount: budgetData.amount,
          type: budgetData.type,
        }),
        this.updateBudget.updateEntryAndPageCount(userId),
      ]);

      return res.send(status && updateStatus && updateEntry);
    } catch (error) {
      this.logger.error('Error occurred while creating budget', error.stack);
      throw error;
    }
  }

  @UseGuards(UserGuard)
  @Get('my-data')
  async getUserData(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const respond = req.userData;
      // add function to get their data
      return res.json(respond);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
