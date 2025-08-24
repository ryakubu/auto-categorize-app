import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExpenseForm } from "../components/ExpenseForm";

describe("ExpenseForm Integration", () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnClose.mockClear();
  });

  test("adds expense correctly", async () => {
    render(<ExpenseForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Fill in description
    await user.type(screen.getByLabelText(/description/i), "Lunch Test");

    // Fill in amount
    await user.type(screen.getByLabelText(/amount/i), "25.50");

    // Select category (open dropdown first, then click option)
    // Grab the Radix combobox (unnamed)
const categorySelect = screen.getByRole("combobox");
await user.click(categorySelect);

// Choose an option
await user.click(await screen.findByRole("option", { name: "Food" }));


    // Fill in date
    await user.type(screen.getByLabelText(/date/i), "2025-08-23");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /add expense/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Lunch Test",
        amount: 25.5,
        category: "Food",
        date: "2025-08-23",
      })
    );
  });
});
