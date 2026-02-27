import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  BarChart3, 
  Truck, 
  Users,
  Search,
  LogOut,
  Bell,
  Globe,
  X,
  UserCog,
  Smile
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import OrderManagement from './components/OrderManagement';
import InventoryManagement from './components/InventoryManagement';
import FraudMonitoring from './components/FraudMonitoring';
import Analytics from './components/Analytics';
import Fulfillment from './components/Fulfillment';
import UserManagement from './components/UserManagement';
import CustomerManagement from './components/CustomerManagement';
import { MOCK_ORDERS, INVENTORY, MOCK_USERS, MOCK_CUSTOMERS, MOCK_ACTIVITY } from './constants';
import { Order, OrderStatus, InventoryItem, Recipient, User, Customer, ActivityLog, SavedRecipient } from './types';

type View = 'dashboard' | 'orders' | 'inventory' | 'fraud' | 'analytics' | 'fulfillment' | 'users' | 'customers';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [role, setRole] = useState<'London' | 'Bissau'>('London');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [activities, setActivities] = useState<ActivityLog[]>(MOCK_ACTIVITY);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Recipients linked to customers
  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>([
    { id: 'sr1', name: 'Maria Dinis', location: 'Bissau - Praça', phone: '+245 95551234', customerName: 'Kojo Mensah', addedAt: new Date().toISOString() }
  ]);

  const notifications = [
    { id: 1, text: "Low stock alert: Vegetable Oil (5L)", time: "2m ago", type: "alert" },
    { id: 2, text: "New high-value order from Sarah Jalloh", time: "15m ago", type: "info" },
    { id: 3, text: "Antonio Silva completed delivery BX-099", time: "1h ago", type: "success" },
  ];

  const addLog = (action: string, targetId?: string) => {
    const newLog: ActivityLog = {
      id: `a-${Date.now()}`,
      userId: 'u1', // Default current user
      userName: 'Alvaro Dinis',
      action,
      timestamp: new Date().toISOString(),
      targetId
    };
    setActivities(prev => [newLog, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
    addLog(`Changed order ${orderId} status to ${status}`, orderId);
  };

  const updateOrderTracking = (orderId: string, trackingId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingId, updatedAt: new Date().toISOString() } : o));
    addLog(`Updated tracking ID for order ${orderId} to ${trackingId}`, orderId);
  };

  const assignDriverToOrder = (orderId: string, driverName: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { 
      ...o, 
      driverName, 
      status: o.status === OrderStatus.PAID || o.status === OrderStatus.PROCESSING ? OrderStatus.DISPATCHED : o.status,
      updatedAt: new Date().toISOString() 
    } : o));
    addLog(`Assigned ${driverName} to order ${orderId}`, orderId);
  };

  const addInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [item, ...prev]);
    addLog(`Added new SKU: ${item.productName}`, item.id);
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === item.id ? item : i));
    addLog(`Updated SKU: ${item.productName}`, item.id);
  };

  const addUser = (user: User) => {
    setUsers(prev => [user, ...prev]);
    addLog(`Provisioned new staff account: ${user.name} (${user.role})`, user.id);
  };

  const updateUserStatus = (userId: string, status: 'Active' | 'Inactive') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    const user = users.find(u => u.id === userId);
    addLog(`${status === 'Active' ? 'Activated' : 'Suspended'} staff account: ${user?.name}`, userId);
  };

  const updateCustomerStatus = (customerId: string, status: 'Active' | 'Blocked') => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, status } : c));
    const customer = customers.find(c => c.id === customerId);
    addLog(`${status === 'Active' ? 'Unblocked' : 'Blocked'} customer: ${customer?.name}`, customerId);
  };

  const handleSaveRecipient = (recipient: Recipient, customerName: string) => {
    const exists = savedRecipients.find(r => r.phone === recipient.phone && r.customerName === customerName);
    if (!exists) {
      const newSaved: SavedRecipient = {
        ...recipient,
        id: `sr-${Date.now()}`,
        customerName,
        addedAt: new Date().toISOString()
      };
      setSavedRecipients(prev => [newSaved, ...prev]);
      addLog(`Saved new recipient ${recipient.name} for ${customerName}`);
      return true;
    }
    return false;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'fulfillment', label: 'Fulfillment', icon: Truck },
    { id: 'customers', label: 'Expat Directory', icon: Smile },
    { id: 'users', label: 'Staff Directory', icon: UserCog },
    { id: 'fraud', label: 'Fraud Alerts', icon: AlertTriangle },
    { id: 'analytics', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl">
            NK
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Nha Kinhon</h1>
            <p className="text-xs text-slate-400">Operations Console</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === item.id 
                    ? 'bg-orange-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <Users size={20} className="text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Alvaro Dinis</p>
              <p className="text-xs text-slate-500 truncate">{role} Admin</p>
            </div>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {activeView === 'users' ? 'Staff Directory' : activeView === 'customers' ? 'Expat Directory' : activeView}
            </h2>
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" size={18} />
              <input 
                type="text" 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search globally..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full w-72 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
               <button onClick={() => setRole('London')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${role === 'London' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>London Hub</button>
               <button onClick={() => setRole('Bissau')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${role === 'Bissau' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Bissau Hub</button>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 overflow-hidden">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-sm">Notifications</span>
                    <button onClick={() => setShowNotifications(false)}><X size={14} /></button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                        <p className="text-sm font-medium text-slate-700">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Globe size={18} />
              <span>ENG</span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {activeView === 'dashboard' && (
            <Dashboard 
              role={role} 
              orders={orders} 
              inventory={inventory} 
              users={users}
              customers={customers}
              activities={activities}
              onViewAllOrders={() => setActiveView('orders')} 
            />
          )}
          {activeView === 'orders' && (
            <OrderManagement 
              orders={orders} 
              onUpdateOrder={updateOrderStatus} 
              searchTerm={globalSearch}
              savedRecipients={savedRecipients}
              onSaveRecipient={handleSaveRecipient}
            />
          )}
          {activeView === 'inventory' && (
            <InventoryManagement 
              inventory={inventory} 
              onAddInventory={addInventoryItem} 
              onUpdateInventory={updateInventoryItem}
              searchTerm={globalSearch}
            />
          )}
          {activeView === 'users' && (
            <UserManagement 
              users={users} 
              onAddUser={addUser} 
              onUpdateStatus={updateUserStatus} 
              searchTerm={globalSearch}
            />
          )}
          {activeView === 'customers' && (
            <CustomerManagement 
              customers={customers} 
              searchTerm={globalSearch} 
              onUpdateStatus={updateCustomerStatus}
              savedRecipients={savedRecipients}
            />
          )}
          {activeView === 'fraud' && <FraudMonitoring orders={orders} />}
          {activeView === 'analytics' && <Analytics orders={orders} inventory={inventory} customers={customers} />}
          {activeView === 'fulfillment' && (
            <Fulfillment 
              orders={orders} 
              onCompleteDelivery={(id) => updateOrderStatus(id, OrderStatus.DELIVERED)} 
              onAssignDriver={assignDriverToOrder}
              onUpdateTracking={updateOrderTracking}
            />
          )}
        </section>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Logout</h3>
            <p className="text-slate-500 mb-8">Are you sure you want to exit the Nha Kinhon Operations Console?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold hover:bg-slate-50">Cancel</button>
              <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
