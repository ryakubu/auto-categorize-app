# Smart Expense Tracker

Smart Expense Tracker is a web application that helps users efficiently track and categorize their expenses. The app integrates AI to suggest categories automatically, reducing manual effort and improving financial tracking accuracy.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage Guidelines](#usage-guidelines)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Many individuals struggle to track and categorize expenses manually, which can lead to poor financial planning. Smart Expense Tracker solves this by allowing users to input expenses and leveraging AI to automatically suggest categories.

AI Integration:
- **Lovable AI**: Used for rapid prototyping of the application.
- **ChatGPT**: Assisted in coding, debugging, writing unit tests, and generating documentation.

---

## Features

- Add, update, and delete expenses
- Input fields: description, amount, category, and date
- AI-powered automatic category suggestions
- Fully tested components
- Accessible action buttons (Add/Update, Cancel, Close)

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite, shadcn UI components, Tailwind CSS  
- **Backend**: Supabase (Database & Auth)  
- **Testing**: Jest, React Testing Library  
- **CI/CD**: GitHub Actions, Vercel  
- **Environment Management**: `.env` file

---

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/ryakubu/auto-categorize-app.git
cd auto-categorize-app/auto-categorize-frontend

Install dependencies

npm install

Set up environment variables

Create a .env file in the root of the frontend folder with your Supabase credentials:

env

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Run the development server
npm run dev

The app will be available at http://localhost:8080/.

Usage Guidelines

Open the application in your browser.

Fill in the expense form with:

Description

Amount

Date

(Optional) Category

AI will suggest a category automatically based on the description.

Use Add/Update to save the expense.

Use Cancel or Close to clear or exit the form.


Testing

Run unit tests using Jest and React Testing Library:
npm run test

Tests include:

Component rendering

Form submission

Button actions

Contributing

Contributions are welcome! Please follow these steps:

Fork the repository

Create a new branch for your feature (git checkout -b feature-name)

Make your changes

Commit your changes (git commit -m "Add feature")

Push to your branch (git push origin feature-name)

Open a Pull Request


License

This project is licensed under the MIT License.

---

## Screenshots

### Expense Form
![Expense Form](screenshots/expense-form.png)

### AI Category Suggestion
![AI Category Suggestion](screenshots/ai-category.gif)

### Test Results
![Jest Test Results](screenshots/test-results.png)

