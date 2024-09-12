import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  // Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BudgetDTO, BudgetWithID } from './dto/users.dto';
import { UsersService } from './users.service';
import { CreateBudgetService } from './budget/create/create.service';
import { UpdateBudgetService } from './budget/update/update.service';
import { UserGuard } from './user.guard';
import { DeleteBudgetService } from './budget/delete/delete.service';

@Controller('user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly userService: UsersService,
    private readonly createBudget: CreateBudgetService,
    private readonly updateBudget: UpdateBudgetService,
    private readonly deleteBudget: DeleteBudgetService,
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
          operation: 'add',
        }),
        this.updateBudget.updateEntryAndPageCount({ userId, operation: 'add' }),
      ]);

      return res.send(status && updateStatus && updateEntry);
    } catch (error) {
      this.logger.error('Error occurred while creating budget', error.stack);
      throw new InternalServerErrorException();
    }
  }

  // @Patch('edit-budget')
  // async handleUpdateBudget(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() budgetData: BudgetWithID,
  // ) {
  //   const userData = req?.userData;
  //   const userId = userData?.id;

  //   try {
  //     const [deleteStatus, updateDeleteStatus, status, updateStatus] =
  //       await Promise.all([
  //         this.deleteBudget.deleteBudgetRecord(userId, budgetData.id),
  //         this.updateBudget.updateBudgetSummary({
  //           userId,
  //           amount: budgetData.amount,
  //           type: budgetData.type,
  //           operation: 'subtract',
  //         }),
  //         this.updateBudget.updateBudget(userId, budgetData),
  //         this.updateBudget.updateBudgetSummary({
  //           userId,
  //           amount: budgetData.amount,
  //           type: budgetData.type,
  //           operation: 'add',
  //         }),
  //       ]);

  //     return res.send(
  //       deleteStatus && updateDeleteStatus && status && updateStatus,
  //     );
  //   } catch (error) {
  //     this.logger.error('Error occurred while updating budget', error.stack);
  //     throw new InternalServerErrorException();
  //   }
  // }

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

  @Delete('delete-budget')
  async handleDeleteBudget(
    @Req() req: Request,
    @Res() res: Response,
    @Body() budgetData: BudgetWithID,
  ) {
    const userData = req?.userData;
    const userId = userData?.id;

    try {
      const status = await this.deleteBudget.deleteBudgetRecordAndUpdateSummary(
        userId,
        budgetData,
      );

      return res.send(status);
    } catch (error) {
      this.logger.error('Error occurred while creating budget', error.stack);
      throw new InternalServerErrorException();
    }
  }
}
