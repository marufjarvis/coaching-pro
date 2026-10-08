import React, { useState } from 'react';
import { Calendar, Receipt, FileText, Plus, X } from 'lucide-react';
import './expenses.css';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().substring(0, 10)
  });

  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.amount) return;

    const expenseEntry = {
      id: `EXP-${Math.floor(Math.random() * 10000)}`,
      ...newExpense,
      amount: Number(newExpense.amount)
    };

    setExpenses([expenseEntry, ...expenses]);
    setIsAddModalOpen(false);
    setNewExpense({
      title: '',
      amount: '',
      date: new Date().toISOString().substring(0, 10)
    });
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const todaysDate = new Date().toISOString().substring(0, 10);
  const todaysExpenses = expenses.filter(exp => exp.date === todaysDate).reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="expenses-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <Receipt size={14} /> EXPENSE LEDGER
          </div>
          <h1>খরচ</h1>
          <p className="subtitle">Track coaching costs by month.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>যোগ</button>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <label>Expense month</label>
          <div className="date-input-wrapper">
            <input type="text" className="form-control" value="October 2026" readOnly />
            <Calendar className="calendar-icon" size={16} />
          </div>
        </div>
      </div>

      <div className="summary-cards expenses-kpis">
        <div className="summary-card outstanding">
          <div>
            <div className="summary-label">Total expenses</div>
            <div className="summary-value">৳ {totalExpenses.toLocaleString()}</div>
            <div className="summary-date">October 2026</div>
          </div>
          <Receipt size={48} className="bg-icon" />
        </div>
        <div className="summary-card count">
          <div>
            <div className="summary-label">Entries</div>
            <div className="summary-value">{expenses.length}</div>
            <div className="summary-date">Recorded this month</div>
          </div>
        </div>
        <div className="summary-card count">
          <div>
            <div className="summary-label">Today's expenses (আজকের খরচ)</div>
            <div className="summary-value">৳ {todaysExpenses.toLocaleString()}</div>
            <div className="summary-date">For {todaysDate}</div>
          </div>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header">
          <div>
            <h2>Expense ledger</h2>
            <p>Track where your money goes, one entry at a time.</p>
          </div>
        </div>

        {expenses.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.date}</td>
                  <td><strong>{exp.title}</strong></td>
                  <td className="expense-amount">৳ {exp.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state-box">
            <div className="empty-icon-circle">
              <span className="zero-icon">∅</span>
            </div>
            <p>No expenses</p>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>খরচ যোগ করুন</h2>
                <p>Record a new expense.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>বিবরণ (Description)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Marker, Duster, Snacks"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>তারিখ (Date)</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>পরিমাণ (৳)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleAddExpense}>সেভ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenses;
