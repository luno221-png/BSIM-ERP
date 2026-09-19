import React, { useState } from 'react';
import { 
  Store, ShoppingCart, Package, LogOut, 
  Search, Plus, Minus, Trash2, CheckCircle2, 
  Receipt, ChevronRight, BarChart3, PlusCircle, Wrench, Smartphone, ShoppingBag, DollarSign,
  Printer, Share2, Users, Calendar, BadgeCheck, CreditCard, UserPlus, Phone, MapPin, User, TrendingUp, AlertTriangle
} from 'lucide-react';

// --- TYPES ---
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

interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

interface Invoice {
  id: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  method: string;
  date: string;
  time: string;
}

interface Employee {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  hireDate: string;
  salary: number;
  role: string;
  payments: { [key: string]: boolean }; // ex: { "2026-09": true }
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'ADMIN' | 'CASHIER'>('ADMIN');
  const [activeTab, setActiveTab] = useState<'POS' | 'DASHBOARD' | 'INVENTORY' | 'EXPENSES' | 'SALES' | 'HR'>('POS');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [businessType, setBusinessType] = useState<'TELEPHONY' | 'HARDWARE' | 'GENERAL'>('TELEPHONY');

  // --- STOCKS & PRODUITS ---
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'iPhone 13 Pro 128GB', price: 420000, buyPrice: 350000, stock: 5, category: 'Téléphones', code: 'TEL-001' },
    { id: '2', name: 'Chargeur Rapide 20W USB-C', price: 12000, buyPrice: 6000, stock: 25, category: 'Accessoires', code: 'ACC-002' },
    { id: '3', name: 'Écouteurs AirPods Pro v2', price: 85000, buyPrice: 65000, stock: 8, category: 'Accessoires', code: 'ACC-003' },
  ]);

  // Formulaire Produit
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdBuyPrice, setNewProdBuyPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdCode, setNewProdCode] = useState('');

  // --- PANIER & CLIENT ---
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({ firstName: '', lastName: '', phone: '', address: '' });
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  // --- EMPLOYES (RH - Exclusif Admin) ---
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', matricule: 'EMP-001', firstName: 'Mamadou', lastName: 'Diallo', hireDate: '2025-01-15', salary: 180000, role: 'Caissier Senior', payments: { '2026-08': true, '2026-09': false } },
    { id: '2', matricule: 'EMP-002', firstName: 'Aïssatou', lastName: 'Sow', hireDate: '2025-06-01', salary: 150000, role: 'Vendeuse', payments: { '2026-08': true, '2026-09': true } }
  ]);

  // Formulaire Employé
  const [empFirstName, setEmpFirstName] = useState('');
  const [empLastName, setEmpLastName] = useState('');
  const [empHireDate, setEmpHireDate] = useState('');
  const [empSalary, setEmpSalary] = useState('');
  const [empRole, setEmpRole] = useState('Caissier');

  // --- HISTORIQUE & CHARGES ---
  const [sales, setSales] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 'DEP-101', title: 'Facture Senelec Électricité', amount: 45000, category: 'Électricité', date: '10/09/2026' }
  ]);

  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Électricité');

  // --- AUTHENTIFICATION ---
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

  // --- GESTION PANIER & STOCK ---
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

  const removeFromCart = (id: string) => setCart(cart.filter(item => item.id !== id));
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // --- ENCAISSEMENT ET FACTURATION ---
  const handleCheckout = (method: string) => {
    if (cart.length === 0) return;

    setProducts(prev => prev.map(p => {
      const item = cart.find(i => i.id === p.id);
      return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
    }));

    const invoice: Invoice = {
      id: `FAC-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: {
        firstName: customer.firstName || 'Client',
        lastName: customer.lastName || 'Passage',
        phone: customer.phone || 'Non renseigné',
        address: customer.address || 'Non renseignée',
      },
      items: [...cart],
      total: cartTotal,
      method,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setSales([invoice, ...sales]);
    setCurrentInvoice(invoice);
    setCart([]);
    setCustomer({ firstName: '', lastName: '', phone: '', address: '' });
  };

  // --- ENVOI WHATSAPP ---
  const sendWhatsApp = (inv: Invoice) => {
    let cleanPhone = inv.customer.phone.replace(/\s+/g, '').replace('+', '');
    if (!cleanPhone.startsWith('221') && cleanPhone.length === 9) {
      cleanPhone = '221' + cleanPhone;
    }

    let message = `*FACTURE - sama Boutique*\n`;
    message += `Facture N°: *${inv.id}*\n`;
    message += `Date: ${inv.date} à ${inv.time}\n`;
    message += `Client: ${inv.customer.firstName} ${inv.customer.lastName}\n`;
    message += `----------------------------\n`;
    inv.items.forEach(item => {
      message += `• ${item.name} x${item.qty} : ${(item.price * item.qty).toLocaleString()} FCFA\n`;
    });
    message += `----------------------------\n`;
    message += `*TOTAL PAYÉ : ${inv.total.toLocaleString()} FCFA*\n`;
    message += `Règlement : ${inv.method}\n\n`;
    message += `Merci de votre confiance !`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // --- GESTION EMPLOYES (RH) ---
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empFirstName || !empLastName || !empSalary) return;

    const newEmp: Employee = {
      id: String(Date.now()),
      matricule: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      firstName: empFirstName,
      lastName: empLastName,
      hireDate: empHireDate || new Date().toISOString().split('T')[0],
      salary: Number(empSalary),
      role: empRole,
      payments: {}
    };

    setEmployees([...employees, newEmp]);
    setEmpFirstName('');
    setEmpLastName('');
    setEmpSalary('');
    setEmpHireDate('');
  };

  const togglePaymentStatus = (empId: string, monthKey: string) => {
    setEmployees(employees.map(emp => {
      if (emp.id === empId) {
        const updatedPayments = { ...emp.payments, [monthKey]: !emp.payments[monthKey] };
        return { ...emp, payments: updatedPayments };
      }
      return emp;
    }));
  };

  // --- GESTION ARTICLES & DEPENSES ---
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock) return;
    setProducts([{
      id: String(Date.now()),
      name: newProdName,
      category: newProdCategory || 'Général',
      price: Number(newProdPrice),
      buyPrice: Number(newProdBuyPrice) || Number(newProdPrice) * 0.7,
      stock: Number(newProdStock),
      code: newProdCode || `ART-${Math.floor(100 + Math.random() * 900)}`,
    }, ...products]);
    setNewProdName(''); setNewProdCategory(''); setNewProdPrice(''); setNewProdBuyPrice(''); setNewProdStock(''); setNewProdCode('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;
    setExpenses([{
      id: `DEP-${Math.floor(100 + Math.random() * 900)}`,
      title: expTitle,
      amount: Number(expAmount),
      category: expCategory,
      date: 'Aujourd\'hui'
    }, ...expenses]);
    setExpTitle(''); setExpAmount('');
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSalesAmount = sales.reduce((sum, s) => sum + s.total, 0);
  const currentMonthKey = '2026-09';

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
            <p className="text-xs text-orange-400 font-semibold tracking-wider uppercase mt-1">Système ERP & POS Multi-Commerce</p>
          </div>

          {loginError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl mb-5 text-center">{loginError}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Identifiant</label>
              <input type="text" placeholder="admin ou caisse" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-sm text-white" required />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Mot de passe</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-[#1F2937]/50 border border-gray-700/60 rounded-xl text-sm text-white" required />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-orange-500/20">Se Connecter</button>
          </form>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
            Admin: <span className="text-orange-400 font-mono">admin / admin</span> | Caissier: <span className="text-amber-400 font-mono">caisse / 1234</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col md:flex-row">
      {/* BARRE LATÉRALE */}
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

          <div className="mb-6 p-3 bg-[#1F2937]/50 rounded-2xl border border-gray-800">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Secteur d'Activité</label>
            <div className="grid grid-cols-3 gap-1">
              <button onClick={() => setBusinessType('TELEPHONY')} className={`p-2 rounded-xl text-xs flex justify-center ${businessType === 'TELEPHONY' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}><Smartphone className="w-4 h-4" /></button>
              <button onClick={() => setBusinessType('HARDWARE')} className={`p-2 rounded-xl text-xs flex justify-center ${businessType === 'HARDWARE' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}><Wrench className="w-4 h-4" /></button>
              <button onClick={() => setBusinessType('GENERAL')} className={`p-2 rounded-xl text-xs flex justify-center ${businessType === 'GENERAL' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}><ShoppingBag className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="space-y-1">
            <button onClick={() => setActiveTab('POS')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'POS' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              <div className="flex items-center gap-3"><ShoppingCart className="w-4 h-4" /><span>Caisse POS</span></div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {userRole === 'ADMIN' && (
              <button onClick={() => setActiveTab('DASHBOARD')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'DASHBOARD' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                <div className="flex items-center gap-3"><BarChart3 className="w-4 h-4" /><span>Bilan & Analytics</span></div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            )}

            {userRole === 'ADMIN' && (
              <button onClick={() => setActiveTab('HR')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'HR' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-800'}`}>
                <div className="flex items-center gap-3"><Users className="w-4 h-4" /><span>Ressources Humaines</span></div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            )}

            <button onClick={() => setActiveTab('INVENTORY')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'INVENTORY' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              <div className="flex items-center gap-3"><Package className="w-4 h-4" /><span>Gestion du Stock</span></div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button onClick={() => setActiveTab('EXPENSES')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'EXPENSES' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              <div className="flex items-center gap-3"><DollarSign className="w-4 h-4" /><span>Dépenses & Charges</span></div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button onClick={() => setActiveTab('SALES')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'SALES' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              <div className="flex items-center gap-3"><Receipt className="w-4 h-4" /><span>Historique Factures</span></div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between bg-[#1F2937]/40 p-3 rounded-xl border border-gray-800">
            <div>
              <p className="text-xs font-bold text-white uppercase">{userRole === 'ADMIN' ? 'Gérant Principal' : 'Poste Caissier'}</p>
              <p className="text-[10px] text-emerald-400 font-medium">Connecté</p>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="p-2 text-gray-400 hover:text-red-400"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* VUE 1: CAISSE POS */}
        {activeTab === 'POS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input type="text" placeholder="Rechercher produit..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#111827] border border-gray-800 rounded-xl text-xs text-white" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                  <div key={p.id} onClick={() => addToCart(p)} className={`bg-[#111827] border p-4 rounded-2xl flex flex-col justify-between cursor-pointer hover:border-orange-500 ${p.stock <= 0 ? 'opacity-50' : ''}`}>
                    <div>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase">{p.category}</span>
                      <h3 className="font-bold text-white text-xs mt-1">{p.name}</h3>
                    </div>
                    <div className="mt-4 flex justify-between items-end border-t border-gray-800/40 pt-2">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Stock: {p.stock}</span>
                        <span className="text-sm font-extrabold text-orange-400">{p.price.toLocaleString()} F</span>
                      </div>
                      <div className="p-2 bg-gray-800 rounded-xl text-white"><Plus className="w-3.5 h-3.5" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PANIER & INFORMATIONS CLIENT */}
            <div className="lg:col-span-5 xl:col-span-4 bg-[#111827] border border-gray-800 rounded-3xl p-5 flex flex-col justify-between min-h-[580px]">
              <div>
                <h2 className="font-extrabold text-white text-sm flex items-center gap-2 pb-3 border-b border-gray-800">
                  <Receipt className="w-4 h-4 text-orange-400" /> Informations Vente & Client
                </h2>

                <div className="mt-4 space-y-2 bg-[#1F2937]/40 p-3 rounded-2xl border border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Coordonnées Client</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Prénom" value={customer.firstName} onChange={e => setCustomer({...customer, firstName: e.target.value})} className="px-3 py-2 bg-[#0B0F19] border border-gray-700/60 rounded-xl text-xs text-white" />
                    <input type="text" placeholder="Nom" value={customer.lastName} onChange={e => setCustomer({...customer, lastName: e.target.value})} className="px-3 py-2 bg-[#0B0F19] border border-gray-700/60 rounded-xl text-xs text-white" />
                  </div>
                  <input type="text" placeholder="Numéro Téléphone (WhatsApp)" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-700/60 rounded-xl text-xs text-white" />
                  <input type="text" placeholder="Adresse physique" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-700/60 rounded-xl text-xs text-white" />
                </div>

                <div className="divide-y divide-gray-800 max-h-[220px] overflow-y-auto my-3 pr-1">
                  {cart.length === 0 ? (
                    <p className="py-10 text-center text-gray-500 text-xs">Panier vide</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white text-xs">{item.name}</p>
                          <p className="text-[11px] text-orange-400 font-semibold">{item.price.toLocaleString()} FCFA</p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#0B0F19] p-1 rounded-xl border border-gray-800">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 text-gray-400"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-bold px-1">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 text-gray-400"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400 font-bold uppercase">Total À Encaisser</span>
                  <span className="text-2xl font-extrabold text-orange-400">{cartTotal.toLocaleString()} FCFA</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => handleCheckout('Espèces')} disabled={cart.length === 0} className="bg-emerald-600/20 border border-emerald-500 text-emerald-300 font-bold py-3 rounded-xl text-xs disabled:opacity-30">Espèces</button>
                  <button onClick={() => handleCheckout('Wave')} disabled={cart.length === 0} className="bg-sky-600/20 border border-sky-500 text-sky-300 font-bold py-3 rounded-xl text-xs disabled:opacity-30">Wave</button>
                  <button onClick={() => handleCheckout('Orange Money')} disabled={cart.length === 0} className="bg-orange-600/20 border border-orange-500 text-orange-300 font-bold py-3 rounded-xl text-xs disabled:opacity-30">OM</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FACTURE MODALE */}
        {currentInvoice && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-gray-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">sama Boutique</h2>
                  <p className="text-xs text-gray-500">Facture N°: {currentInvoice.id}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{currentInvoice.date}</p>
                  <p>{currentInvoice.time}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-1">
                <p className="font-bold text-gray-700">Client:</p>
                <p><span className="font-semibold">Nom & Prénom:</span> {currentInvoice.customer.firstName} {currentInvoice.customer.lastName}</p>
                <p><span className="font-semibold">Téléphone:</span> {currentInvoice.customer.phone}</p>
                <p><span className="font-semibold">Adresse:</span> {currentInvoice.customer.address}</p>
              </div>

              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b text-gray-500 text-left">
                    <th className="py-2">Désignation</th>
                    <th className="py-2 text-center">Qté</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentInvoice.items.map(item => (
                    <tr key={item.id}>
                      <td className="py-2 font-medium">{item.name}</td>
                      <td className="py-2 text-center">{item.qty}</td>
                      <td className="py-2 text-right font-bold">{(item.price * item.qty).toLocaleString()} F</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t pt-3 flex justify-between items-center font-extrabold text-base">
                <span>Total Payé ({currentInvoice.method}):</span>
                <span className="text-orange-600">{currentInvoice.total.toLocaleString()} FCFA</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 bg-gray-900 text-white font-bold py-2.5 rounded-xl text-xs">
                  <Printer className="w-4 h-4" /> Imprimer
                </button>
                <button onClick={() => sendWhatsApp(currentInvoice)} className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs">
                  <Share2 className="w-4 h-4" /> WhatsApp
                </button>
                <button onClick={() => setCurrentInvoice(null)} className="bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VUE 2: RESSOURCES HUMAINES (RH) */}
        {activeTab === 'HR' && userRole === 'ADMIN' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
              <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-400" /> Ajouter un Nouvel Employé
              </h2>
              <form onSubmit={handleAddEmployee} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <input type="text" placeholder="Prénom" value={empFirstName} onChange={e => setEmpFirstName(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" required />
                <input type="text" placeholder="Nom" value={empLastName} onChange={e => setEmpLastName(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" required />
                <input type="date" value={empHireDate} onChange={e => setEmpHireDate(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" required />
                <input type="number" placeholder="Salaire Mensuel (FCFA)" value={empSalary} onChange={e => setEmpSalary(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" required />
                <button type="submit" className="bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs">Enregistrer</button>
              </form>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
              <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" /> Gestion des Employés & Paie Mensuelle
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase">
                      <th className="pb-3">Matricule</th>
                      <th className="pb-3">Employé</th>
                      <th className="pb-3">Date d'embauche</th>
                      <th className="pb-3">Salaire Fixe</th>
                      <th className="pb-3 text-center">Statut Paie (Septembre 2026)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {employees.map(emp => {
                      const isPaid = emp.payments[currentMonthKey];
                      return (
                        <tr key={emp.id}>
                          <td className="py-3 font-mono text-orange-400 font-bold">{emp.matricule}</td>
                          <td className="py-3 font-bold text-white">{emp.firstName} {emp.lastName}</td>
                          <td className="py-3 text-gray-400">{emp.hireDate}</td>
                          <td className="py-3 font-bold text-white">{emp.salary.toLocaleString()} FCFA</td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => togglePaymentStatus(emp.id, currentMonthKey)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${isPaid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
                            >
                              {isPaid ? 'Payé (Marquer non-payé)' : 'Non Payé (Valider Règlement)'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VUE 3: DASHBOARD & ANALYTICS */}
        {activeTab === 'DASHBOARD' && userRole === 'ADMIN' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#111827] border border-gray-800 rounded-3xl p-5">
                <span className="text-xs text-gray-400 font-bold uppercase">Chiffre d'Affaires</span>
                <p className="text-2xl font-extrabold text-emerald-400 mt-2">{totalSalesAmount.toLocaleString()} FCFA</p>
              </div>
              <div className="bg-[#111827] border border-gray-800 rounded-3xl p-5">
                <span className="text-xs text-gray-400 font-bold uppercase">Total Charges</span>
                <p className="text-2xl font-extrabold text-red-400 mt-2">{totalExpenses.toLocaleString()} FCFA</p>
              </div>
              <div className="bg-[#111827] border border-gray-800 rounded-3xl p-5">
                <span className="text-xs text-gray-400 font-bold uppercase">Bilan Net (Estimé)</span>
                <p className={`text-2xl font-extrabold mt-2 ${totalSalesAmount - totalExpenses >= 0 ? 'text-orange-400' : 'text-red-500'}`}>
                  {(totalSalesAmount - totalExpenses).toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VUE 4: GESTION DE STOCK */}
        {activeTab === 'INVENTORY' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
              <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-400" /> Ajouter un Nouvel Article
              </h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" placeholder="Désignation Produit" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" required />
                <input type="text" placeholder="Catégorie" value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" />
                <input type="number" placeholder="Prix de Vente (FCFA)" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" required />
                <input type="number" placeholder="Prix d'Achat (FCFA)" value={newProdBuyPrice} onChange={e => setNewProdBuyPrice(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" />
                <input type="number" placeholder="Quantité en Stock" value={newProdStock} onChange={e => setNewProdStock(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" required />
                <button type="submit" className="bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs">Ajouter au Stock</button>
              </form>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
              <h2 className="text-lg font-extrabold text-white mb-4">Stock Actuel ({products.length} références)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase">
                      <th className="pb-3">Code</th>
                      <th className="pb-3">Article</th>
                      <th className="pb-3">Catégorie</th>
                      <th className="pb-3">Prix Vente</th>
                      <th className="pb-3">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="py-3 font-mono text-gray-400">{p.code}</td>
                        <td className="py-3 font-bold text-white">{p.name}</td>
                        <td className="py-3 text-gray-400">{p.category}</td>
                        <td className="py-3 font-bold text-orange-400">{p.price.toLocaleString()} F</td>
                        <td className="py-3 font-bold">{p.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VUE 5: DEPENSES */}
        {activeTab === 'EXPENSES' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
              <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-400" /> Saisir une Charge / Dépense
              </h2>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" placeholder="Libellé Dépense" value={expTitle} onChange={e => setExpTitle(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" required />
                <input type="number" placeholder="Montant (FCFA)" value={expAmount} onChange={e => setExpAmount(e.target.value)} className="px-4 py-2.5 bg-[#1F2937]/50 border border-gray-700 rounded-xl text-xs text-white" required />
                <button type="submit" className="bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs">Enregistrer Dépense</button>
              </form>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
              <h2 className="text-lg font-extrabold text-white mb-4">Historique des Charges</h2>
              <div className="divide-y divide-gray-800">
                {expenses.map(exp => (
                  <div key={exp.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{exp.title}</p>
                      <p className="text-[10px] text-gray-400">{exp.date} • {exp.category}</p>
                    </div>
                    <span className="font-bold text-red-400">-{exp.amount.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VUE 6: HISTORIQUE DES VENTES */}
        {activeTab === 'SALES' && (
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
            <h2 className="text-lg font-extrabold text-white mb-4">Historique des Ventes & Factures</h2>
            {sales.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">Aucune vente enregistrée pour le moment.</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {sales.map(s => (
                  <div key={s.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{s.id} — {s.customer.firstName} {s.customer.lastName}</p>
                      <p className="text-[10px] text-gray-400">{s.date} à {s.time} • Règlement: {s.method}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-400">+{s.total.toLocaleString()} FCFA</span>
                      <button onClick={() => setCurrentInvoice(s)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-white">
                        <Receipt className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}