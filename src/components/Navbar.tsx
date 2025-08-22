import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, LogOut, BarChart3, History, Home } from "lucide-react";
import { User } from "@/types/expense";

interface NavbarProps {
  onAddExpense: () => void;
  onLogout: () => void;
  user: User;
  currentPage: 'dashboard' | 'history';
  onNavigate: (page: 'dashboard' | 'history') => void;
}

export const Navbar = ({ onAddExpense, onLogout, user, currentPage, onNavigate }: NavbarProps) => {
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
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onNavigate('dashboard')}
              className={currentPage === 'dashboard' ? 'bg-gradient-primary hover:shadow-glow' : ''}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            
            <Button 
              variant={currentPage === 'history' ? 'default' : 'ghost'}
              onClick={() => onNavigate('history')}
              className={currentPage === 'history' ? 'bg-gradient-primary hover:shadow-glow' : ''}
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onAddExpense}
              className="hover:shadow-glow transition-all duration-300"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
            
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">{user.name}</span>
            </div>
            
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