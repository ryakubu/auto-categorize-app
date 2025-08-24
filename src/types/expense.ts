export interface Expense {
   id?: string; // now optional ✅
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