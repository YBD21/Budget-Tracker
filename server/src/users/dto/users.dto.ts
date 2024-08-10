import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export type BudgetSummary = {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  totalPage: number;
};

export class BudgetDTO {
  @IsNumber()
  @IsNotEmpty()
  date: number;

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
