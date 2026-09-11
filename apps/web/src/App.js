import React, { useState } from 'react';
import { LogOut, Lock, User, Store } from 'lucide-react';
export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('ADMIN');
    const [activeTab, setActiveTab] = useState('DASHBOARD');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('TOUS');
    const [products] = useState([
        { id: '1', name: 'Riz Parfumé 5kg', price: 4800, stock: 45, category: 'Alimentation' },
        { id: '2', name: 'Huile Dinor 1L', price: 1300, stock: 80, category: 'Alimentation' },
        { id: '3', name: 'Sucre En Poudre 1kg', price: 650, stock: 120, category: 'Alimentation' },
        { id: '4', name: 'Lait Concentré Sucré', price: 600, stock: 60, category: 'Alimentation' },
        { id: '5', name: 'Savon Madar 250g', price: 400, stock: 8, category: 'Hygiène' },
        { id: '6', name: 'Eau Minérale 1.5L', price: 400, stock: 150, category: 'Boissons' },
    ]);
    const [cart, setCart] = useState([]);
    const [recentSales, setRecentSales] = useState([
        { id: 'CMD-1092', total: 12500, method: 'Wave', date: 'Aujourd\'hui 14:32' },
        { id: 'CMD-1091', total: 6400, method: 'Espèces', date: 'Aujourd\'hui 12:15' }
    ]);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
            setUserRole('ADMIN');
            setActiveTab('DASHBOARD');
            setLoginError('');
        }
        else if (email === 'caisse' && password === '1234') {
            setIsAuthenticated(true);
            setUserRole('CASHIER');
            setActiveTab('POS');
            setLoginError('');
        }
        else {
            setLoginError('Identifiants incorrects (Admin: admin/admin | Caisse: caisse/1234)');
        }
    };
    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        }
        else {
            setCart([...cart, { id: product.id, name: product.name, price: product.price, qty: 1 }]);
        }
    };
    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                return newQty > 0 ? { ...item, qty: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const handleCheckout = (method) => {
        if (cart.length === 0)
            return;
        const newSale = {
            id: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
            total: cartTotal,
            method,
            date: 'À l\'instant'
        };
        setRecentSales([newSale, ...recentSales]);
        setPaymentSuccess(true);
        setTimeout(() => {
            setCart([]);
            setPaymentSuccess(false);
        }, 2000);
    };
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'TOUS' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    if (!isAuthenticated) {
        return (<div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl text-white shadow-xl shadow-orange-500/20 mb-3">
              <Store className="w-8 h-8"/>
            </div>
            <h1 className="text-2xl font-black text-white">sama Boutique</h1>
            <p className="text-xs text-orange-400 font-bold mt-1">Version v2.0 — UI Révisée</p>
          </div>

          {loginError && (<div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs p-3 rounded-xl mb-5 text-center font-medium">
              {loginError}
            </div>)}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Identifiant</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
                <input type="text" placeholder="admin ou caisse" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" required/>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" required/>
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-orange-500/25">
              Se Connecter
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            Gérant: <code className="text-orange-400 bg-slate-800 px-1.5 py-0.5 rounded">admin</code> | Caisse: <code className="text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded">caisse</code>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-xl text-white">
            <Store className="w-5 h-5"/>
          </div>
          <div>
            <h1 className="font-bold text-white text-base">sama Boutique</h1>
            <span className="text-[10px] text-orange-400 font-bold">BSIM ERP v2.0</span>
          </div>
        </div>

        <nav className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {userRole === 'ADMIN' && (<button onClick={() => setActiveTab('DASHBOARD')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${activeTab === 'DASHBOARD' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>Bilan</button>)}
          <button onClick={() => setActiveTab('POS')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${activeTab === 'POS' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>Caisse POS</button>
          <button onClick={() => setActiveTab('INVENTORY')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${activeTab === 'INVENTORY' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>Stock</button>
          <button onClick={() => setActiveTab('SALES')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${activeTab === 'SALES' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>Ventes</button>
        </nav>

        <button onClick={() => setIsAuthenticated(false)} className="p-2 text-slate-400 hover:text-rose-400">
          <LogOut className="w-4 h-4"/>
        </button>
      </header>

      <main className="flex-1 p-6">
        {activeTab === 'DASHBOARD' && (<div className="space-y-6">
            <h2 className="text-xl font-black text-white">Tableau de Bord Financier</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold uppercase">Chiffre d'Affaires</span>
                <p className="text-2xl font-black text-white mt-2">1 450 000 FCFA</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold uppercase">Achats</span>
                <p className="text-2xl font-black text-white mt-2">920 000 FCFA</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold uppercase">Charges Fixes</span>
                <p className="text-2xl font-black text-rose-400 mt-2">120 000 FCFA</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-5 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                <span className="text-xs font-bold uppercase text-orange-100">Bénéfice Net</span>
                <p className="text-2xl font-black mt-2">410 000 FCFA</p>
              </div>
            </div>
          </div>)}

        {activeTab === 'POS' && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex gap-2">
                <input type="text" placeholder="Rechercher un produit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"/>
                <div className="flex gap-1">
                  {['TOUS', 'Alimentation', 'Hygiène', 'Boissons'].map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-2 rounded-xl text-xs font-bold ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-400'}`}>{cat}</button>))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredProducts.map(p => (<div key={p.id} onClick={() => addToCart(p)} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-orange-500 cursor-pointer">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{p.category}</span>
                    <h3 className="font-bold text-white text-sm">{p.name}</h3>
                    <p className="text-orange-400 font-black text-sm mt-1">{p.price.toLocaleString()} FCFA</p>
                  </div>))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Ticket de Caisse</h3>
                {cart.map(item => (<div key={item.id} className="flex justify-between items-center text-xs border-b border-slate-800 py-2">
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-orange-400">{item.price} FCFA</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1 bg-slate-800 rounded">-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1 bg-slate-800 rounded">+</button>
                    </div>
                  </div>))}
              </div>
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="flex justify-between text-base font-black text-white">
                  <span>Total:</span>
                  <span className="text-orange-400">{cartTotal.toLocaleString()} FCFA</span>
                </div>
                <button onClick={() => handleCheckout('Wave/OM')} disabled={cart.length === 0} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl disabled:opacity-40">Valider la Vente</button>
              </div>
            </div>
          </div>)}
      </main>
    </div>);
}
