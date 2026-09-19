import React, { useState } from 'react';

export const VotreComposantCaisse = () => {
  // 1. Vos variables d'état (useState)
  const [cart, setCart] = useState<any[]>([]);
  const [customerPhone, setCustomerPhone] = useState('');
  
  // États pour la gestion des dépenses
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseReason, setExpenseReason] = useState('');

  // Calcul dynamique du total du panier
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 2. Fonction d'envoi de la facture WhatsApp
  const handleSendWhatsAppInvoice = () => {
    if (!customerPhone) {
      alert("Veuillez saisir le numéro WhatsApp du client.");
      return;
    }
    const itemsList = cart
      .map((item: any) => `- ${item.quantity}x ${item.name} : ${item.price * item.quantity} FCFA`)
      .join('%0A');

    const message = `*Facture BSIM*%0A%0A${itemsList}%0A%0A*Total :* ${totalAmount} FCFA`;
    window.open(`https://wa.me/${customerPhone.replace(/\s+/g, '')}?text=${message}`, '_blank');
  };

  // Enregistrement d'une dépense signée
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dépense enregistrée :", {
      amount: expenseAmount,
      reason: expenseReason,
      date: new Date().toISOString(),
    });
    setExpenseAmount('');
    setExpenseReason('');
    setIsExpenseOpen(false);
  };

  // 3. Le rendu JSX
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow border space-y-6">
      {/* En-tête avec bouton de dépense de caisse */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Interface Caisse</h1>
        <button
          onClick={() => setIsExpenseOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          + Sortie de Caisse (Dépense)
        </button>
      </div>

      {/* Zone du panier et validation */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Panier en cours</h2>
        
        {/* Affichage du total */}
        <div className="text-xl font-bold text-gray-900">
          Total : {totalAmount} FCFA
        </div>

        {/* Champ Numéro WhatsApp & Bouton d'envoi */}
        <div className="pt-4 border-t space-y-3 max-w-md">
          <label className="block text-sm font-medium text-gray-700">
            Numéro WhatsApp du client
          </label>
          <input
            type="tel"
            placeholder="ex: 221770000000"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={handleSendWhatsAppInvoice}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-bold text-sm transition"
          >
            Envoyer la facture par WhatsApp
          </button>
        </div>
      </div>

      {/* Modal / Formulaire de saisie de dépense */}
      {isExpenseOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800">Nouvelle dépense de caisse</h3>
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
                <input
                  type="number"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full border p-2 rounded-lg text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Motif</label>
                <input
                  type="text"
                  required
                  value={expenseReason}
                  onChange={(e) => setExpenseReason(e.target.value)}
                  className="w-full border p-2 rounded-lg text-sm mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg"
                >
                  Valider la dépense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};