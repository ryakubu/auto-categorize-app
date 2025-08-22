import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AuthForm } from "@/components/AuthForm";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseCharts } from "@/components/ExpenseCharts";
import { useToast } from "@/hooks/use-toast";
import { Expense, User } from "@/types/expense";

// Demo data for showcase
const demoExpenses: Expense[] = [
  {
    id: "1",
    description: "Lunch at Subway",
    amount: 12.50,
    category: "Food",
    date: "2024-01-20",
    userId: "demo-user"
  },
  {
    id: "2", 
    description: "Uber ride to work",
    amount: 15.75,
    category: "Transport",
    date: "2024-01-19",
    userId: "demo-user"
  },
  {
    id: "3",
    description: "Electricity bill",
    amount: 89.50,
    category: "Utilities", 
    date: "2024-01-18",
    userId: "demo-user"
  },
  {
    id: "4",
    description: "Coffee at Starbucks",
    amount: 5.25,
    category: "Food",
    date: "2024-01-17",
    userId: "demo-user"
  },
  {
    id: "5",
    description: "Movie tickets",
    amount: 24.00,
    category: "Entertainment",
    date: "2024-01-16",
    userId: "demo-user"
  }
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const { toast } = useToast();

  // Load demo data when user logs in
  useEffect(() => {
    if (user) {
      setExpenses(demoExpenses);
    }
  }, [user]);

  const handleLogin = (email: string, password: string) => {
    // Demo login - accept any credentials
    setUser({
      id: "demo-user",
      name: "Demo User",
      email: email
    });
    toast({
      title: "Welcome back!",
      description: "You've successfully logged in to your expense tracker.",
    });
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Demo register - accept any credentials
    setUser({
      id: "demo-user", 
      name: name,
      email: email
    });
    toast({
      title: "Account created!",
      description: "Welcome to Smart Expense Tracker.",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setExpenses([]);
    toast({
      title: "Goodbye!",
      description: "You've been logged out successfully.",
    });
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString()
    };
    setExpenses(prev => [newExpense, ...prev]);
    setShowExpenseForm(false);
    toast({
      title: "Expense added!",
      description: `$${expenseData.amount.toFixed(2)} expense recorded successfully.`,
    });
  };

  const handleEditExpense = (expenseData: Omit<Expense, 'id'>) => {
    if (!editingExpense) return;
    
    const updatedExpense: Expense = {
      ...expenseData,
      id: editingExpense.id
    };
    setExpenses(prev => prev.map(exp => exp.id === editingExpense.id ? updatedExpense : exp));
    setEditingExpense(undefined);
    setShowExpenseForm(false);
    toast({
      title: "Expense updated!",
      description: "Your expense has been updated successfully.",
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    toast({
      title: "Expense deleted",
      description: "The expense has been removed from your records.",
      variant: "destructive"
    });
  };

  const openEditForm = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const closeExpenseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(undefined);
  };

  // Show auth form if not logged in
  if (!user) {
    return <AuthForm onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onAddExpense={() => setShowExpenseForm(true)}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-muted-foreground">
              Track your expenses with AI-powered categorization
            </p>
          </div>

          {/* Charts Section */}
          <ExpenseCharts expenses={expenses} />

          {/* Expense List */}
          <ExpenseList 
            expenses={expenses}
            onEdit={openEditForm}
            onDelete={handleDeleteExpense}
          />
        </div>
      </main>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          onClose={closeExpenseForm}
          editExpense={editingExpense}
        />
      )}
    </div>
  );
};

export default Index;
