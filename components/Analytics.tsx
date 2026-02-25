
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { REVENUE_DATA, PRODUCTS } from '../constants';
import { Order, InventoryItem } from '../types';

// Fix: Add prop definition for Analytics component
interface AnalyticsProps {
  orders: Order[];
  inventory: InventoryItem[];
}

const Analytics: React.FC<AnalyticsProps> = ({ orders, inventory }) => {
  const categoryData = [
    { name: 'Rice & Staples', value: 45 },
    { name: 'Cooking Oil', value: 25 },
    { name: 'Bundles/Combos', value: 20 },
    { name: 'Hygiene/Other', value: 10 },
  ];

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#6366f1'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Analytics</h2>
          <p className="text-slate-500">Financial summaries and provision movement tracking.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50">
            <Calendar size={18} />
            May 2024
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black shadow-lg shadow-slate-200">
            <Download size={18} />
            Generate PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-8 text-slate-800">Revenue Growth (GBP)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Mix Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-8 text-slate-800">Provision Category Mix</h3>
          <div className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Exportable Reports', icon: FileText, items: ['Monthly P&L', 'Inventory Audit', 'Driver Payouts'] },
           { label: 'Popular Bundles', icon: Filter, items: ['Mega Family Bundle', 'Rice & Oil Combo', 'Hygiene Kit'] },
           { label: 'London Team Tasks', icon: User, items: ['Bank Reconciliation', 'Ad Spend Review', 'Refund Processing'] },
           { label: 'Bissau Team Tasks', icon: User, items: ['Warehouse Check', 'Fuel Reimbursements', 'Vendor Payments'] }
         ].map((box, i) => (
           <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 mb-4 text-orange-500">
               <box.icon size={18} />
               <h3 className="text-sm font-black uppercase tracking-widest">{box.label}</h3>
             </div>
             <ul className="space-y-3">
               {box.items.map((item, idx) => (
                 <li key={idx} className="flex items-center justify-between text-sm group cursor-pointer hover:text-orange-500 transition-colors">
                    <span className="text-slate-600 group-hover:text-orange-600 font-medium">{item}</span>
                    <Download size={14} className="text-slate-300" />
                 </li>
               ))}
             </ul>
           </div>
         ))}
      </div>
    </div>
  );
};

// Fix: Made className optional to prevent TS error when component is rendered without it
const User = ({ size, className = "" }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default Analytics;
