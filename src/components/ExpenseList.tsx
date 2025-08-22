import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Expense } from "@/types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const getCategoryColor = (category: string) => {
  const colors = {
    "Food": "bg-orange-100 text-orange-800",
    "Transport": "bg-blue-100 text-blue-800",
    "Utilities": "bg-green-100 text-green-800",
    "Shopping": "bg-purple-100 text-purple-800",
    "Entertainment": "bg-pink-100 text-pink-800",
    "Healthcare": "bg-red-100 text-red-800",
    "Others": "bg-gray-100 text-gray-800"
  };
  return colors[category as keyof typeof colors] || colors.Others;
};

export const ExpenseList = ({ expenses, onEdit, onDelete }: ExpenseListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Recent Expenses</CardTitle>
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-primary">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "No expenses match your search." : "No expenses yet. Add your first expense!"}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getCategoryColor(expense.category)}>
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(expense)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(expense.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};