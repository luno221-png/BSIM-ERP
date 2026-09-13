import React, { useState } from 'react';
import { 
  Store, ShoppingCart, Package, LogOut, 
  Search, Plus, Minus, Trash2, CheckCircle2, 
  Receipt, ChevronRight, BarChart3, PlusCircle, Wrench, Smartphone, ShoppingBag, DollarSign
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  buyPrice: number;
  stock: number;
  category: string;
  code: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface Sale {
  id: string;
  client: string;
  total: number;
  method: string;
  time: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'ADMIN' | 'CASHIER'>('ADMIN');
  const [activeTab, setActiveTab] = useState<'POS' | 'DASHBOARD' | 'INVENTORY' | 'EXPENSES' | 'SALES'>('POS');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Secteur d'activité de la boutique
  const [businessType, setBusinessType] = useState<'TELEPHONY' | 'HARDWARE' | 'GENERAL'>('TELEPHONY');

  // Produits
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'iPhone 13 Pro 128GB', price: 420000, buyPrice: 350000, stock: 5, category: 'Téléphones', code: 'TEL-001' },
    { id: '2', name: 'Chargeur Rapide 20W USB-C', price: 12000, buyPrice: 6000, stock: 25, category: 'Accessoires', code: 'ACC-002' },
    { id: '3', name: 'Écouteurs AirPods Pro v2', price: 85000, buyPrice: 65000, stock: 8, category: 'Accessoires', code: 'ACC-003' },
    { id: '4', name: 'Ciment SOCOCIM 50kg', price: 4500, buyPrice: 3900, stock: 120, category: 'Matériaux', code: 'QUI-001' },
    { id: '5', name: 'Peinture Mat Blanche 20L', price: 28000, buyPrice: 21000, stock: 14, category: 'Peinture', code: 'QUI-002' },
  ]);

  // Formulaire Nouveau Produit
  const [newProdName, setNewProdName] = useState<string>('');
  const [newProdCategory, setNewProdCategory] = useState<string>('');
  const [newProdPrice, setNewProdPrice] = useState<string>('');
  const [newProdBuyPrice, setNewProdBuyPrice] = useState<string>('');
  const [newProdStock, setNewProdStock] = useState<string>('');
  const [newProdCode, setNewProdCode] = useState<string>('');

  // Dépenses de la boutique
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 'DEP-101', title: 'Facture Senelec Électricité', amount: 45000, category: 'Électricité', date: '10/09/2026' },
    { id: 'DEP-102', title: 'Restauration équipe caisse', amount: 12000, category: 'Repas', date: '11/09/2026' },
    { id: 'DEP-103', title: 'Achat serrure & peinture comptoir', amount: 18000, category: 'Réfection', date: '08/09/2026' },
  ]);

  // Formulaire Nouvelle Dépense
  const [expTitle, setExpTitle] = useState<string>('');
  const [expAmount, setExpAmount] = useState<string>('');
  const [expCategory, setExpCategory] = useState<string>('Électricité');

  // Recherche & Panier
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Historique Ventes
  const [sales, setSales] = useState<Sale[]>([
    { id: 'FAC-2026-091', client: 'Client Passage', total: 420000, method: 'Wave', time: '14:20' },
    { id: 'FAC-2026-090', client: 'Client Passage', total: 24000, method: 'Espèces', time: '13:45' },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setUserRole('ADMIN');
      setActiveTab('POS');
      setLoginError('');
    } else if (email === 'caisse' && password === '1234') {
      setIsAuthenticated(true);
      setUserRole('CASHIER');
      setActiveTab('POS');
      setLoginError('');
    } else {
      setLoginError('Identifiants incorrects');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock) return;
    const newProd: Product = {
      id: String(Date.now()),
      name: newProdName,
      category: newProdCategory || 'Général',
      price: Number(newProdPrice),
      buyPrice: Number(newProdBuyPrice) || Number(newProdPrice) * 0.7,
      stock: Number(newProdStock),
      code: newProdCode || `ART-${Math.floor(100 + Math.random() * 900)}`,
    };
    setProducts([newProd, ...products]);
    setNewProdName('');
    setNewProdCategory('');
    setNewProdPrice('');
    setNewProdBuyPrice('');
    setNewProdStock('');
    setNewProdCode('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;
    const newExp: Expense = {
      id: `DEP-${Math.floor(100 + Math.random() * 900)}`,
      title: expTitle,
      amount: Number(expAmount),
      category: expCategory,
      date: 'Aujourd\'hui',
    };
    setExpenses([newExp, ...expenses]);
    setExpTitle('');
    setExpAmount('');
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) return;
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, qty: 1 }]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    const product = products.find(p => p.id === id);
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (product && newQty > product.stock) return item;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.total, 0);

  const handleCheckout = (method: string) => {
    if (cart.length === 0) return;

    // Mise à jour automatique des stocks
    setProducts(prevProducts =>
      prevProducts.map(prod => {
        const itemInCart = cart.find(item => item.id === prod.id);
        if (itemInCart) {
          return { ...prod, stock: Math.max(0, prod.stock - itemInCart.qty) };
        }
        return prod;
      })
    );

    const newSale: Sale = {
      id: `FAC-2026-${Math.floor(100 + Math.random() * 900)}`,
      client: 'Client Passage',
      total: cartTotal,
      method,
      time: 'À l\'instant'
    };
    setSales([newSale, ...sales]);
    setPaymentSuccess(true);
    setTimeout(() => {
      setCart([]);
      setPaymentSuccess(false);
    }, 1800);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600"></div>
          <div className="text-center mb-8 pt-2">
            <div className="inline-flex p-4 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl text-white shadow-xl shadow-orange-500/20 mb-4">
              <Store className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">sama Boutique</h1>
            <p className="text-xs text-orange-400 font-semibold tracking-wider uppercase mt-1">Système ERP Multi-Commerce</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl mb-5 text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Identifiant</label>
              <input
                type="text"
                placeholder="Ex: admin ou caisse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-orange-500/20 active:scale-[0.98] mt-2"
            >
              Connexion à la Caisse
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
            Admin: <span className="text-orange-400 font-mono">admin / admin</span> | Caisse: <span className="text-amber-400 font-mono">caisse / 1234</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col md:flex-row">
      {/* Navigation Latérale */}
      <aside className="w-full md:w-64 bg-[#111827] border-r border-gray-800/80 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="p-2.5 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl text-white shadow-lg shadow-orange-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight leading-none">sama Boutique</h1>
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mt-1 block">ERP V2.0</span>
            </div>
          </div>

          {/* Choix du type de commerce */}
          <div className="mb-6 p-3 bg-[#1F2937]/50 rounded-2xl border border-gray-800">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Type de Boutique</label>
            <div className="grid grid-cols-3 gap-1">
              <button 
                onClick={() => setBusinessType('TELEPHONY')} 
                className={`p-2 rounded-xl text-xs flex justify-center items-center transition ${businessType === 'TELEPHONY' ? 'bg-orange-500 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
                title="Boutique Téléphonie"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setBusinessType('HARDWARE')} 
                className={`p-2 rounded-xl text-xs flex justify-center items-center transition ${businessType === 'HARDWARE' ? 'bg-orange-500 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
                title="Quincaillerie"
              >
                <Wrench className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setBusinessType('GENERAL')} 
                className={`p-2 rounded-xl text-xs flex justify-center items-center transition ${businessType === 'GENERAL' ? 'bg-orange-500 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
                title="Commerce Général / Superette"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Menus Principaux */}
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('POS')} 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'POS' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4" />
                <span>Caisse POS</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {userRole === 'ADMIN' && (
              <button 
                onClick={() => setActiveTab('DASHBOARD')} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'DASHBOARD' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4" />
                  <span>Bilan & Analytics</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            )}

            <button 
              onClick={() => setActiveTab('INVENTORY')} 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'INVENTORY' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Gestion du Stock</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => setActiveTab('EXPENSES')} 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'EXPENSES' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4" />
                <span>Dépenses & Charges</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => setActiveTab('SALES')} 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'SALES' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4" />
                <span>Historique Ventes</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>

        {/* Profil & Déconnexion */}
        <div className="pt-6 border-t border-gray-800/80">
          <div className="flex items-center justify-between bg-[#1F2937]/40 p-3 rounded-xl border border-gray-800">
            <div>
              <p className="text-xs font-bold text-white uppercase">{userRole === 'ADMIN' ? 'Gérant Principal' : 'Poste Caissier'}</p>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> En ligne
              </p>
            </div>
            <button 
              onClick={() => setIsAuthenticated(false)} 
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* VUE 1: CAISSE POS */}
        {activeTab === 'POS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#111827] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className={`bg-[#111827] border p-4 rounded-2xl transition duration-150 flex flex-col justify-between group ${p.stock > 0 ? 'border-gray-800/80 hover:border-orange-500/80 cursor-pointer hover:-translate-y-0.5' : 'border-red-900/30 opacity-50 cursor-not-allowed'}`}
                  >
                    <div>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider">{p.category}</span>
                      <h3 className="font-bold text-white text-xs mt-1.5 group-hover:text-orange-400 transition leading-snug">{p.name}</h3>
                    </div>
                    <div className="mt-4 flex justify-between items-end pt-2 border-t border-gray-800/40">
                      <div>
                        <span className={`text-[10px] block font-medium ${p.stock === 0 ? 'text-red-400 font-bold' : 'text-gray-500'}`}>
                          {p.stock === 0 ? 'Rupture' : `Stock: ${p.stock}`}
                        </span>
                        <span className="text-sm font-extrabold text-orange-400">{p.price.toLocaleString()} F</span>
                      </div>
                      <div className="p-2 bg-gray-800 group-hover:bg-orange-500 text-white rounded-xl transition">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4 bg-[#111827] border border-gray-800/80 rounded-3xl p-5 flex flex-col justify-between min-h-[580px] shadow-2xl relative">
              {paymentSuccess && (
                <div className="absolute inset-0 bg-[#111827]/95 backdrop-blur-md rounded-3xl z-20 flex flex-col items-center justify-center p-6 text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-3 animate-bounce" />
                  <h3 className="text-xl font-extrabold text-white">Vente Validée !</h3>
                  <p className="text-xs text-gray-400 mt-1">Ticket enregistré et stock mis à jour</p>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                  <h2 className="font-extrabold text-white text-sm flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-orange-400" /> Ticket Caisse
                  </h2>
                  <span className="text-[10px] text-gray-400 font-bold bg-[#1F2937] px-2.5 py-1 rounded-lg">
                    {cart.reduce((sum, item) => sum + item.qty, 0)} Articles
                  </span>
                </div>

                <div className="divide-y divide-gray-800 max-h-[320px] overflow-y-auto my-3 pr-1">
                  {cart.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 text-xs">Panier vide. Cliquez sur un article pour l'ajouter.</div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-bold text-white text-xs">{item.name}</p>
                          <p className="text-[11px] text-orange-400 font-semibold">{item.price.toLocaleString()} FCFA</p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#0B0F19] p-1 rounded-xl border border-gray-800">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-800 rounded-lg text-gray-400"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-bold px-1.5">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-gray-800 rounded-lg text-gray-400"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400 font-bold uppercase">Total À Encaisser</span>
                  <span className="text-2xl font-extrabold text-orange-400 tracking-tight">{cartTotal.toLocaleString()} FCFA</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button onClick={() => handleCheckout('Espèces')} disabled={cart.length === 0} className="bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white font-bold py-3 rounded-xl text-xs transition disabled:opacity-30">Espèces</button>
                  <button onClick={() => handleCheckout('Wave')} disabled={cart.length === 0} className="bg-sky-600/20 hover:bg-sky-600 border border-sky-500/30 text-sky-300 hover:text-white font-bold py-3 rounded-xl text-xs transition disabled:opacity-30">Wave</button>
                  <button onClick={() => handleCheckout('Orange Money')} disabled={cart.length === 0} className="bg-orange-600/20 hover:bg-orange-600 border border-orange-500/30 text-orange-300 hover:text-white font-bold py-3 rounded-xl text-xs transition disabled:opacity-30">OM</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VUE 2: AJOUT DE PRODUITS & STOCK */}
        {activeTab === 'INVENTORY' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-gray-800/80 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-400" /> Ajouter un Nouveau Produit au Stock
              </h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" placeholder="Désignation / Nom du produit" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-xs text-white" required />
                <input type="text" placeholder="Catégorie (ex: Smartphones, Outils)" value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-xs text-white" />
                <input type="number" placeholder="Prix de Vente (FCFA)" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-xs text-white" required />
                <input type="number" placeholder="Prix d'Achat Fournisseur (FCFA)" value={newProdBuyPrice} onChange={e => setNewProdBuyPrice(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-xs text-white" />
                <input type="number" placeholder="Quantité initiale en stock" value={newProdStock} onChange={e => setNewProdStock(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-xs text-white" required />
                <input type="text" placeholder="Code Référence / Code-Barres" value={newProdCode} onChange={e => setNewProdCode(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-xs text-white" />
                <button type="submit" className="sm:col-span-2 lg:col-span-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-orange-500/20">Enregistrer l'Article dans la Base</button>
              </form>
            </div>

            <div className="bg-[#111827] border border-gray-800/80 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-extrabold text-white mb-4">Base des Articles ({products.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase">
                      <th className="pb-3 font-bold">Code</th>
                      <th className="pb-3 font-bold">Désignation</th>
                      <th className="pb-3 font-bold">Catégorie</th>
                      <th className="pb-3 font-bold">Prix d'Achat</th>
                      <th className="pb-3 font-bold">Prix Vente</th>
                      <th className="pb-3 font-bold">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="py-3 font-mono text-gray-500">{p.code}</td>
                        <td className="py-3 font-bold text-white">{p.name}</td>
                        <td className="py-3 text-gray-400">{p.category}</td>
                        <td className="py-3 font-bold text-gray-400">{p.buyPrice?.toLocaleString()} FCFA</td>
                        <td className="py-3 font-bold text-orange-400">{p.price.toLocaleString()} FCFA</td>
                        <td className="py-3 font-bold text-white">
                          <span className={`px-2 py-1 rounded-md text-[11px] ${p.stock <= 5 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {p.stock} unités
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VUE 3: DÉPENSES & CHARGES */}
        {activeTab === 'EXPENSES' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-gray-800/80 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-400" /> Enregistrer une Dépense
              </h2>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" placeholder="Motif (ex: Facture Senelec, Repas caissiers)" value={expTitle} onChange={e => setExpTitle(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-xs text-white" required />
                <input type="number" placeholder="Montant Dépensé (FCFA)" value={expAmount} onChange={e => setExpAmount(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-xs text-white" required />
                <select value={expCategory} onChange={e => setExpCategory(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-xs text-white">
                  <option value="Électricité">Électricité</option>
                  <option value="Repas">Repas & Restauration</option>
                  <option value="Réfection">Réfection / Entretien</option>
                  <option value="Loyer">Loyer Boutique</option>
                  <option value="Transport">Transport / Logistique</option>
                </select>
                <button type="submit" className="sm:col-span-3 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-xs transition">Ajouter la Charge au Bilan</button>
              </form>
            </div>

            <div className="bg-[#111827] border border-gray-800/80 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-extrabold text-white mb-4">Historique des Charges Enregistrées</h2>
              <div className="divide-y divide-gray-800">
                {expenses.map(exp => (
                  <div key={exp.id} className="py-3.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{exp.title}</p>
                      <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{exp.category} — {exp.date}</span>
                    </div>
                    <span className="font-extrabold text-red-400 text-sm">-{exp.amount.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VUE 4: BILAN & ANALYTICS */}
        {activeTab === 'DASHBOARD' && userRole === 'ADMIN' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-white">Bilan Financier Global</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#111827] border border-gray-800/80 p-5 rounded-2xl">
                <span className="text-xs text-gray-400 font-bold uppercase">Total Ventes</span>
                <p className="text-2xl font-extrabold text-white mt-2">{totalSalesAmount.toLocaleString()} FCFA</p>
              </div>
              <div className="bg-[#111827] border border-gray-800/80 p-5 rounded-2xl">
                <span className="text-xs text-gray-400 font-bold uppercase">Total Charges Dépensées</span>
                <p className="text-2xl font-extrabold text-red-400 mt-2">{totalExpenses.toLocaleString()} FCFA</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-5 rounded-2xl text-white shadow-xl">
                <span className="text-xs font-bold uppercase text-orange-100">Solde Net en Caisse</span>
                <p className="text-2xl font-extrabold mt-2">{(totalSalesAmount - totalExpenses).toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>
        )}

        {/* VUE 5: HISTORIQUE DES VENTES */}
        {activeTab === 'SALES' && (
          <div className="bg-[#111827] border border-gray-800/80 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-white mb-4">Historique des Ventes</h2>
            <div className="divide-y divide-gray-800">
              {sales.map(s => (
                <div key={s.id} className="py-3.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">{s.id}</p>
                    <p className="text-[10px] text-gray-500">{s.time} — {s.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-orange-400">{s.total.toLocaleString()} FCFA</p>
                    <span className="text-[10px] text-gray-400 font-medium">{s.method}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}