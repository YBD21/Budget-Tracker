import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type BudgetSummary = {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  totalPage: number;
  totalEntry: number;
};

export type UserData = UserName & BudgetSummary;

export type updateBudget = {
  userId: any;
  amount: number;
  type: string;
};

export class BudgetDTO {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  reoccur: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
