import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AuthForm } from "@/components/AuthForm";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseCharts } from "@/components/ExpenseCharts";
import { ExpenseHistory } from "@/components/ExpenseHistory";
import { useToast } from "@/hooks/use-toast";
import { Expense, User } from "@/types/expense";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'history'>('dashboard');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Set up auth state listener and load initial data
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Load user profile
          await loadUserProfile(session.user.id);
          // Load user expenses
          await loadExpenses(session.user.id);
        } else {
          setUser(null);
          setExpenses([]);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setTimeout(async () => {
          await loadUserProfile(session.user.id);
          await loadExpenses(session.user.id);
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadExpenses = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading expenses:', error);
        return;
      }

      if (data) {
        const formattedExpenses = data.map(expense => ({
          id: expense.id,
          description: expense.description,
          amount: Number(expense.amount),
          category: expense.category,
          date: expense.date,
          userId: expense.user_id
        }));
        setExpenses(formattedExpenses);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Goodbye!",
      description: "You've been logged out successfully.",
    });
  };

  const handleAddExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: session.user.id,
          description: expenseData.description,
          amount: expenseData.amount,
          category: expenseData.category,
          date: expenseData.date
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add expense. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const newExpense: Expense = {
        id: data.id,
        description: data.description,
        amount: Number(data.amount),
        category: data.category,
        date: data.date,
        userId: data.user_id
      };

      setExpenses(prev => [newExpense, ...prev]);
      setShowExpenseForm(false);
      toast({
        title: "Expense added!",
        description: `$${expenseData.amount.toFixed(2)} expense recorded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!editingExpense || !session?.user) return;
    
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          description: expenseData.description,
          amount: expenseData.amount,
          category: expenseData.category,
          date: expenseData.date
        })
        .eq('id', editingExpense.id)
        .eq('user_id', session.user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update expense. Please try again.",
          variant: "destructive"
        });
        return;
      }

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete expense. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast({
        title: "Expense deleted",
        description: "The expense has been removed from your records.",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openEditForm = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const closeExpenseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(undefined);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show auth form if not logged in
  if (!session?.user || !user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onAddExpense={() => setShowExpenseForm(true)}
        onLogout={handleLogout}
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {currentPage === 'dashboard' ? (
            <>
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
            </>
          ) : (
            <>
              {/* History Header */}
              <div className="text-center animate-fade-in">
                <h2 className="text-3xl font-bold mb-2">
                  Expense History
                </h2>
                <p className="text-muted-foreground">
                  View and download your complete expense records
                </p>
              </div>

              {/* Expense History */}
              <ExpenseHistory expenses={expenses} />
            </>
          )}
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
