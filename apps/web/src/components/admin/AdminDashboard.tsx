import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tableau de Bord Administrateur</h1>
      
      {/* Synthèse Journalière */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Ventes du Jour</p>
          <p className="text-2xl font-bold text-green-600">125 000 FCFA</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Dépenses Signées du Jour</p>
          <p className="text-2xl font-bold text-red-600">15 000 FCFA</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Bilan Net Journalier</p>
          <p className="text-2xl font-bold text-blue-600">110 000 FCFA</p>
        </div>
      </div>

      {/* Tableau des Dépenses Auteur Signées */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-bold text-lg mb-3">Dépenses du Jour (Signées)</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2">Heure</th>
              <th className="p-2">Motif</th>
              <th className="p-2">Montant</th>
              <th className="p-2">Auteur (Signature)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">14:20</td>
              <td className="p-2">Achat Fournitures Caisse</td>
              <td className="p-2 text-red-600 font-semibold">5 000 FCFA</td>
              <td className="p-2 font-medium">Moussa (CASHIER)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};