export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  date: string;
  created_at: string;
}

export interface IncomeSource {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  description: string | null;
  date: string;
  created_at: string;
}