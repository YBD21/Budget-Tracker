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
import { CreateBudgetService } from './create/create.service';
import { UpdateBudgetService } from './update/update.service';
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
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(UserGuard)
  @Get('budget-overview')
  async getBudgetOverview(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const userEmail = req.userData?.email;
      const userId = req.userData?.id;

      const respond = await this.userService.getBudgetSummary(
        userEmail,
        userId,
      );

      return res.json(respond);
    } catch (error) {
      this.logger.error(
        'Error occurred while fetching budget overview !',
        error.message,
      );
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(UserGuard)
  @Get('user-name')
  async getFullName(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const userEmail = req.userData?.email;
      const userId = req.userData?.id;

      const respond = await this.userService.getUserName(userEmail, userId);

      return res.json(respond);
    } catch (error) {
      this.logger.error(
        'Error occurred while fetching budget overview !',
        error.message,
      );
      throw new InternalServerErrorException();
    }
  }
}
