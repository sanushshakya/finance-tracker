import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import type { Expense, Investment, IncomeSource } from "../types/database";
import { formatDistanceToNow } from "date-fns";

function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [incomes, setIncomes] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const [expensesData, investmentsData, incomesData] = await Promise.all([
        supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(100),
        supabase
          .from("investments")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(100),
        supabase
          .from("income_sources")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(100),
      ]);

      if (expensesData.data) setExpenses(expensesData.data);
      if (investmentsData.data) setInvestments(investmentsData.data);
      if (incomesData.data) setIncomes(incomesData.data);
      setLoading(false);
    }

    fetchData();
  }, [user]);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalInvestments = investments.reduce(
    (sum, investment) => sum + investment.amount,
    0
  );
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalSavings = totalIncome - totalExpenses - totalInvestments;
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">
            Rs.{totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-red-600">
            Rs.{totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Investments
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            Rs.{totalInvestments.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Savings</h3>
          <p className="text-2xl font-bold text-blue-600">
            Rs.{totalSavings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Expenses
          </h3>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {expense.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(expense.date), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <span className="text-red-600 font-medium">
                  Rs.{expense.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Investments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Investments
          </h3>
          <div className="space-y-3">
            {investments.map((investment) => (
              <div
                key={investment.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{investment.type}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(investment.date), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <span className="text-blue-600 font-medium">
                  Rs.{investment.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Income */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Income
          </h3>
          <div className="space-y-3">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{income.source}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(income.date), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <span className="text-green-600 font-medium">
                  Rs.{income.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
