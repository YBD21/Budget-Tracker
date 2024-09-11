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
  operation: 'add' | 'subtract';
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

export class BudgetWithID extends BudgetDTO {
  @IsString()
  id: string;
}

export class UpdateBudgetDTO extends BudgetDTO {
  @IsString()
  @IsNotEmpty()
  operation: 'add' | 'subtract';
}
