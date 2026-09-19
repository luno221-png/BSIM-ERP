import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Expense } from '../../types';

interface ExpenseModalProps {
  onClose: () => void;
  onAddExpense: (expense: Expense) => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ onClose, onAddExpense }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !reason || !user) return;

    const newExpense: Expense = {
      id: `EXP-${Date.now()}`,
      amount: parseFloat(amount),
      reason,
      authorName: user.name,
      authorRole: user.role,
      createdAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    onAddExpense(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Enregistrer une Dépense (Sortie Caisse)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded-lg mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Motif de la dépense</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border p-2 rounded-lg mt-1"
              required
            />
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-600">
            Signé par : <strong className="text-gray-800">{user?.name}</strong> ({user?.role})
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium">Valider & Signer</button>
          </div>
        </form>
      </div>
    </div>
  );
};