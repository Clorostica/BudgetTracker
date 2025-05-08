import { useState, useEffect } from "react";


const commonBtn = "transition transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md";


function Item({ item, type, onSave, onRemove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category || "");
  const [amount, setAmount] = useState(item.amount);

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
      <div className="flex-1">
        {isEditing ? (
          <>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="input mb-1 w-full"
              placeholder="Name"
            />
            {type === "expense" && (
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="input mb-1 w-full"
              >
                <option value="">Select Category</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Bills</option>
                <option>Other</option>
              </select>
            )}
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              type="number"
              className="input mb-1 w-full"
              placeholder="Amount"
            />
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">{item.name}</p>
            {type === "expense" && (
              <p className="text-sm text-gray-600">Category: {item.category}</p>
            )}
            <p className="text-sm text-gray-600">
              Amount: ${item.amount.toFixed(2)}
            </p>
          </>
        )}
      </div>

      {isEditing ? (
        <>
          <button
            onClick={() => {
              onSave(item.id, { name, category, amount: parseFloat(amount) }, type);
              setIsEditing(false);
            }}
            className={`${commonBtn} bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white px-4 py-2 rounded-md mr-2`}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className={`${commonBtn} bg-gray-500 hover:bg-gray-600 hover:scale-105 text-white px-4 py-2 rounded-md`}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsEditing(true)}
            className={`${commonBtn} bg-yellow-500 hover:bg-yellow-600 hover:scale-105 text-white px-4 py-2 rounded-md mr-2`}
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(item.id, type)}
            className={`${commonBtn} bg-red-500 hover:bg-red-600 hover:scale-105 text-white px-4 py-2 rounded-md`}
          >
            Remove
          </button>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem("expenses")) || []);
  const [incomes, setIncomes] = useState(() => JSON.parse(localStorage.getItem("incomes")) || []);
  const [expenseName, setExpenseName] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [gainName, setGainName] = useState("");
  const [gainAmount, setGainAmount] = useState("");

  useEffect(() => { localStorage.setItem("expenses", JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem("incomes", JSON.stringify(incomes)); }, [incomes]);

  const handleAddExpense = () => {
    if (!expenseName || !expenseCategory || !expenseAmount || parseFloat(expenseAmount) <= 0) {
      alert("Please enter a valid expense.");
      return;
    }
    setExpenses([...expenses, { id: Date.now(), name: expenseName, category: expenseCategory, amount: parseFloat(expenseAmount) }]);
    setExpenseName(""); setExpenseCategory(""); setExpenseAmount("");
  };

  const handleAddIncome = () => {
    if (!gainName || !gainAmount || parseFloat(gainAmount) <= 0) {
      alert("Please enter a valid income.");
      return;
    }
    setIncomes([...incomes, { id: Date.now(), name: gainName, amount: parseFloat(gainAmount) }]);
    setGainName(""); setGainAmount("");
  };

  const handleRemove = (id, type) => {
    if (type === "expense") setExpenses(prev => prev.filter(e => e.id !== id));
    else setIncomes(prev => prev.filter(i => i.id !== id));
  };

  const handleSave = (id, updated, type) => {
    if (type === "expense") setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    else setIncomes(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i));
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="bg-gradient-to-r from-teal-400 to-cyan-500 min-h-screen p-8 font-sans">
      <h1 className="text-5xl font-semibold text-center mb-8 text-white tracking-wide">Budget Tracker</h1>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md text-black flex-1">
          <h2 className="text-2xl text-blue-500 mb-4">Expenses</h2>
          <input value={expenseName} onChange={e => setExpenseName(e.target.value)} type="text" placeholder="Expense Name" className="input mb-3 w-full" />
          <select value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)} className="input mb-3 w-full">
            <option value="">Select Category</option><option>Food</option><option>Transport</option><option>Entertainment</option><option>Bills</option><option>Other</option>
          </select>
          <input value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} type="number" placeholder="Amount" className="input mb-3 w-full" />
          <button onClick={handleAddExpense} className={`${commonBtn} bg-green-500 hover:bg-green-600 hover:scale-105 text-white py-2 px-6 rounded-md w-full`}>Add Expense</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-black flex-1">
          <h2 className="text-2xl text-blue-500 mb-4">Incomes</h2>
          <input value={gainName} onChange={e => setGainName(e.target.value)} type="text" placeholder="Income Name" className="input mb-3 w-full" />
          <input value={gainAmount} onChange={e => setGainAmount(e.target.value)} type="number" placeholder="Amount" className="input mb-3 w-full" />
          <button onClick={handleAddIncome} className={`${commonBtn} bg-orange-500 hover:bg-orange-600 hover:scale-105 text-white py-2 px-6 rounded-md w-full`}>Add Income</button>
        </div>
      </div>

      <div className="bg-neutral-800 p-4 rounded-lg shadow-md text-white mb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p>Total Expense: ${totalExpense.toFixed(2)}</p>
        <p>Total Income: ${totalIncome.toFixed(2)}</p>
        <p>Net Balance: ${netBalance.toFixed(2)}</p>
      </div>

      <div className="space-y-4" id="expenseList">
        {expenses.map(exp => (
          <Item key={exp.id} item={exp} type="expense" onSave={handleSave} onRemove={handleRemove} />
        ))}
        {incomes.map(inc => (
          <Item key={inc.id} item={inc} type="income" onSave={handleSave} onRemove={handleRemove} />
        ))}
      </div>
    </div>
  );
}
