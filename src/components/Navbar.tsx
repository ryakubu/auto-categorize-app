import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut, BarChart3 } from "lucide-react";

interface NavbarProps {
  onAddExpense: () => void;
  onLogout: () => void;
}

export const Navbar = ({ onAddExpense, onLogout }: NavbarProps) => {
  return (
    <nav className="bg-card border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart Expense Tracker
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="default" 
              onClick={onAddExpense}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
            
            <Button variant="ghost" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};