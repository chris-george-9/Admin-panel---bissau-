
import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Package, 
  ArrowRight,
  Sparkles,
  ShoppingCart,
  Users as UsersIcon,
  Globe,
  Smile,
  Map,
  ArrowUpRight,
  History,
  Coins,
  RefreshCcw,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { REVENUE_DATA, DEFAULT_EXCHANGE_RATE } from '../constants';
import { getOpsInsights } from '../services/geminiService';
import { Order, InventoryItem, User, Department, Customer, ActivityLog, UserRole } from '../types';

interface DashboardProps {
  role: 'London' | 'Bissau';
  orders: Order[];
  inventory: InventoryItem[];
  users: User[];
  customers: Customer[];
  activities: ActivityLog[];
  onViewAllOrders: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ role, orders, inventory, users, customers, activities, onViewAllOrders }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(DEFAULT_EXCHANGE_RATE);

  const fetchInsights = async () => {
    setLoadingAi(true);
    const insight = await getOpsInsights(orders, inventory);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  useEffect(() => {
    fetchInsights();
  }, [orders.length, inventory.length]);

  const activeStaff = users.filter(u => u.status === 'Active').length;
  const bissauStaff = users.filter(u => u.department === Department.BISSAU).length;

  const roleDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    users.forEach(u => {
      dist[u.role] = (dist[u.role] || 0) + 1;
    });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [users]);

  const stats = [
    { label: 'Today\'s Revenue', value: role === 'London' ? '£4,285' : '3,214,000 CFA', change: '+12.5%', icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Active Orders', value: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length.toString(), change: '+3', icon: ShoppingCart, color: 'bg-orange-500' },
    { label: 'Expat Customers', value: customers.length.toString(), change: '+15.4% Growth', icon: Smile, color: 'bg-indigo-500' },
    { label: 'Active Staff', value: `${activeStaff} Users`, change: `${bissauStaff} in Bissau`, icon: UsersIcon, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes('+') || stat.change.includes('Bissau') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold">Revenue Performance</h3>
                <p className="text-sm text-slate-500">Provision support volume across the diaspora</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                GBP Transaction Volume
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`£${value}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <History size={20} className="text-slate-400" />
              Recent System Activity
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
              {activities.slice(0, 10).map((log) => (
                <div key={log.id} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0 group-hover:scale-125 transition-transform"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      <span className="font-bold">{log.userName}</span> {log.action}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                      {new Date(log.timestamp).toLocaleTimeString()} • {log.targetId?.startsWith('o') ? 'Order' : log.targetId?.startsWith('u') ? 'Staff' : 'System'} Event
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">
              View Complete Audit Trail
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={80} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center"><Sparkles size={16} /></div>
                <h3 className="font-bold text-lg">AI Operations Insights</h3>
              </div>
              <div className="space-y-4">
                {loadingAi ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-slate-800 rounded animate-pulse w-2/3"></div>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-sm">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{aiInsight || "Analyzing latest provision trends..."}</p>
                  </div>
                )}
              </div>
              <button onClick={() => fetchInsights()} className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                Refresh Analysis
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck size={18} className="text-emerald-500" />
                  Staff Role Breakdown
                </h3>
             </div>
             <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleDistribution} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fontWeight: 700}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={15}>
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             </div>
             <div className="mt-2 grid grid-cols-2 gap-2">
                {roleDistribution.map((r, i) => (
                  <div key={r.name} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-[10px] font-bold text-slate-500 truncate">{r.name} ({r.value})</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Coins size={18} className="text-amber-500" />
                  Internal Exchange Rate
                </h3>
                <button onClick={() => setExchangeRate(prev => prev + (Math.random() - 0.5))} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400">
                  <RefreshCcw size={14} />
                </button>
             </div>
             <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">GBP / XOF (CFA)</p>
                <p className="text-3xl font-black text-slate-800">{exchangeRate.toFixed(2)}</p>
                <p className="text-[10px] text-emerald-500 font-bold mt-1">Live from Operations Panel</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
