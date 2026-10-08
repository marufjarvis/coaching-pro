import React, { useState, useEffect } from 'react';
import { Calendar, Receipt, Plus, X, Trash2 } from 'lucide-react';
import { dataStore } from './dataStore';
import './expenses.css';

function Expenses() {
  const [expenses, setExpenses] = useState(() => dataStore.getExpenses());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Utilities',
    date: new Date().toISOString().substring(0, 10)
  });

  useEffect(() => {
    const handleSync = () => {
      setExpenses(dataStore.getExpenses());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleAddExpense = () => {
    if (!newExpense.title.trim() || !newExpense.amount) {
      alert("Please enter Description and Amount.");
      return;
    }

    dataStore.addExpense(newExpense);
    setIsAddModalOpen(false);
    setNewExpense({
      title: '',
      amount: '',
      category: 'Utilities',
      date: new Date().toISOString().substring(0, 10)
    });
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense record?")) {
      dataStore.deleteExpense(id);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const todaysDate = new Date().toISOString().substring(0, 10);
  const todaysExpenses = expenses
    .filter(exp => exp.date === todaysDate)
    .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  return (
    <div className="expenses-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <Receipt size={14} /> EXPENSE LEDGER
          </div>
          <h1>খরচ</h1>
          <p className="subtitle">Track coaching expenses, utilities, and bills.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} /> খরচ যোগ
        </button>
      </div>

      <div className="summary-cards expenses-kpis">
        <div className="summary-card outstanding">
          <div>
            <div className="summary-label">Total expenses</div>
            <div className="summary-value">৳ {totalExpenses.toLocaleString()}</div>
            <div className="summary-date">Recorded in ledger</div>
          </div>
          <Receipt size={48} className="bg-icon" />
        </div>
        <div className="summary-card count">
          <div>
            <div className="summary-label">Entries</div>
            <div className="summary-value">{expenses.length}</div>
            <div className="summary-date">Recorded expenses</div>
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
                <th>CATEGORY</th>
                <th>AMOUNT</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.date}</td>
                  <td><strong>{exp.title}</strong></td>
                  <td><span className="badge-gray">{exp.category || 'General'}</span></td>
                  <td className="expense-amount" style={{ fontWeight: 700, color: '#dc2626' }}>
                    ৳ {Number(exp.amount).toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn-icon text-danger" 
                      onClick={() => handleDeleteExpense(exp.id)}
                      title="Delete Expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state-box">
            <div className="empty-icon-circle">
              <span className="zero-icon">∅</span>
            </div>
            <p>No expenses recorded yet</p>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>খরচ যোগ করুন</h2>
                <p>Record a new coaching expenditure.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>বিবরণ (Description) <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Marker, Duster, Electricity bill"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  autoFocus
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>পরিমাণ (৳) <span className="text-danger">*</span></label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  />
                </div>
                <div className="form-group half">
                  <label>ক্যাটাগরি (Category)</label>
                  <select 
                    className="form-control"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  >
                    <option value="Utilities">Utilities (বিদ্যুৎ, ইন্টারনেট)</option>
                    <option value="Materials">Materials (মার্কার, শিট)</option>
                    <option value="Rent">Rent (ভাড়া)</option>
                    <option value="Refreshments">Refreshments (নাস্তা)</option>
                    <option value="Salary">Salary (সম্মানী)</option>
                    <option value="Other">Other (অন্যান্য)</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>তারিখ (Date)</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
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
