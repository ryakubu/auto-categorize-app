import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Expense } from "@/types/expense";

interface ExpenseChartsProps {
  expenses: Expense[];
}

const COLORS = [
  'hsl(262 83% 58%)', // Primary
  'hsl(220 83% 68%)', // Blue variant
  'hsl(300 83% 68%)', // Purple variant
  'hsl(38 92% 50%)',  // Warning/Orange
  'hsl(142 76% 36%)', // Success/Green
  'hsl(0 84% 60%)',   // Destructive/Red
  'hsl(240 4% 46%)'   // Muted
];

export const ExpenseCharts = ({ expenses }: ExpenseChartsProps) => {
  // Category breakdown data
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.category === expense.category);
    if (existing) {
      existing.amount += expense.amount;
      existing.count += 1;
    } else {
      acc.push({
        category: expense.category,
        amount: expense.amount,
        count: 1
      });
    }
    return acc;
  }, [] as Array<{ category: string; amount: number; count: number }>);

  // Monthly data
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({ month, amount: expense.amount });
    }
    return acc;
  }, [] as Array<{ month: string; amount: number }>);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart - Category Breakdown */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Spending by Category</span>
            <span className="text-sm font-normal text-muted-foreground">
              Total: ${totalSpent.toFixed(2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data to display
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, value }) => {
                    const percentage = ((value / totalSpent) * 100).toFixed(0);
                    return `${category} (${percentage}%)`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - Monthly Spending */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data to display
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                <Legend />
                <Bar 
                  dataKey="amount" 
                  fill="hsl(262 83% 58%)" 
                  radius={[4, 4, 0, 0]}
                  name="Monthly Spending"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="lg:col-span-2 shadow-card">
        <CardHeader>
          <CardTitle>Quick Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary">{expenses.length}</div>
              <div className="text-sm text-muted-foreground">Total Expenses</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary">
                ${expenses.length > 0 ? (totalSpent / expenses.length).toFixed(2) : '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">Average per Expense</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {categoryData.length > 0 ? categoryData.reduce((max, cat) => max.amount > cat.amount ? max : cat).category : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Top Category</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary">
                ${monthlyData.length > 0 ? (totalSpent / monthlyData.length).toFixed(2) : '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Average</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};