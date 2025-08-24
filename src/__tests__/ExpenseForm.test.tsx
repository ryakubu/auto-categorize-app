import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExpenseForm } from "../components/ExpenseForm";

describe("ExpenseForm Unit", () => {
  test("submits form with correct values", async () => {
    const mockOnSubmit = jest.fn();
    const mockOnClose = jest.fn();
    const user = userEvent.setup();

    render(<ExpenseForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Fill description
    await user.type(screen.getByLabelText(/description/i), "Groceries");

    // Fill amount
    await user.type(screen.getByLabelText(/amount/i), "100");

    // Open category dropdown using the button with role 'combobox'
    const categoryTrigger = screen.getByRole("combobox");
    await user.click(categoryTrigger);

    // Click the visible "Food" option
    const foodOption = await screen.findByText("Food");
    await user.click(foodOption);

    // Fill date
    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
    await user.clear(dateInput);
    await user.type(dateInput, "2025-08-23");

    // Submit form
    await user.click(screen.getByRole("button", { name: /add expense/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Groceries",
          amount: 100,
          category: "Food",
          date: "2025-08-23",
        })
      );
    });
  });
});
