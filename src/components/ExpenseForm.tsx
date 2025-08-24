import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Sparkles } from "lucide-react";
import { Expense } from "@/types/expense";

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  onClose: () => void;
  editExpense?: Expense;
}

const categories = ["Food", "Transport", "Utilities", "Shopping", "Entertainment", "Healthcare", "Others"];

// Simulate AI categorization
const suggestCategory = (description: string): string => {
  const desc = description.toLowerCase();
  if (desc.includes("food") || desc.includes("restaurant") || desc.includes("coffee") || desc.includes("lunch") || desc.includes("dinner")) return "Food";
  if (desc.includes("uber") || desc.includes("taxi") || desc.includes("bus") || desc.includes("train") || desc.includes("gas")) return "Transport";
  if (desc.includes("electric") || desc.includes("water") || desc.includes("internet") || desc.includes("phone")) return "Utilities";
  if (desc.includes("store") || desc.includes("amazon") || desc.includes("buy") || desc.includes("purchase")) return "Shopping";
  if (desc.includes("movie") || desc.includes("game") || desc.includes("concert") || desc.includes("show")) return "Entertainment";
  if (desc.includes("doctor") || desc.includes("pharmacy") || desc.includes("hospital") || desc.includes("medicine")) return "Healthcare";
  return "Others";
};

export const ExpenseForm = ({ onSubmit, onClose, editExpense }: ExpenseFormProps) => {
  const [description, setDescription] = useState(editExpense?.description || "");
  const [amount, setAmount] = useState(editExpense?.amount?.toString() || "");
  const [category, setCategory] = useState(editExpense?.category || "");
  const [date, setDate] = useState(editExpense?.date || new Date().toISOString().split('T')[0]);
  const [aiSuggested, setAiSuggested] = useState(false);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (value.length > 3 && !editExpense) {
      const suggested = suggestCategory(value);
      setCategory(suggested);
      setAiSuggested(true);
      setTimeout(() => setAiSuggested(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    onSubmit({
      description,
      amount: parseFloat(amount),
      category,
      date,
      userId: "current-user", // In real app, get from auth context
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-elegant animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            {editExpense ? "Edit Expense" : "Add New Expense"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close" // ✅ Added for accessibility/testing
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="What did you spend on?"
                required
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="flex items-center gap-2">
                Category
                {aiSuggested && (
                  <span className="text-xs text-primary flex items-center gap-1 animate-fade-in">
                    <Sparkles className="h-3 w-3" />
                    AI Suggested
                  </span>
                )}
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-primary hover:shadow-glow">
                {editExpense ? "Update" : "Add"} Expense
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
