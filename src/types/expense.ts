export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}