
import React, { useMemo, useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronRight,
  UserCheck,
  UserX,
  CreditCard,
  X,
  History,
  Package,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { Customer, Order, SavedRecipient } from '../types';
import { MOCK_ORDERS } from '../constants';

interface CustomerManagementProps {
  customers: Customer[];
  searchTerm: string;
  onUpdateStatus: (customerId: string, status: 'Active' | 'Blocked') => void;
  savedRecipients: SavedRecipient[];
  orders: Order[];
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ customers, searchTerm, onUpdateStatus, savedRecipients, orders }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(o => o.customerName === selectedCustomer.name);
  }, [selectedCustomer, orders]);

  const customerRecipients = useMemo(() => {
    if (!selectedCustomer) return [];
    return savedRecipients.filter(r => r.customerName === selectedCustomer.name);
  }, [selectedCustomer, savedRecipients]);

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 h-full animate-in fade-in duration-500">
      {/* Main List */}
      <div className={`flex-1 space-y-6 transition-all duration-300 ${selectedCustomer ? 'lg:mr-[400px]' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Customer Directory</h2>
            <p className="text-slate-500">Global expat community supporting families in Guinea-Bissau.</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm">
              <TrendingUp size={18} className="text-emerald-500" />
              <span className="text-sm font-bold text-slate-700">12% Growth this month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Expat Profile</th>
                  <th className="px-6 py-4">Contact & Location</th>
                  <th className="px-6 py-4">Engagement</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => setSelectedCustomer(customer)}
                    className={`hover:bg-slate-50 transition-colors group cursor-pointer ${selectedCustomer?.id === customer.id ? 'bg-orange-50/50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 font-black text-lg shadow-sm">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-sm">{customer.name}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar size={10} /> Joined {new Date(customer.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                          <Mail size={12} className="text-slate-400" /> {customer.email}
                        </p>
                        <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                          <Globe size={12} className="text-blue-500" /> {customer.country}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">{customer.totalOrders} Orders</span>
                        </div>
                        <p className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
                          <CreditCard size={10} /> £{customer.totalSpentGBP.toLocaleString()} total
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase w-fit ${
                        customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {customer.status === 'Active' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed lg:absolute top-0 right-0 bottom-0 w-full lg:w-[400px] bg-white border-l border-slate-200 shadow-2xl z-40 animate-in slide-in-from-right duration-300 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-lg text-slate-800">Customer Profile</h3>
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
            {/* Header Info */}
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center text-orange-600 font-black text-2xl mb-4 border-4 border-white shadow-md">
                {selectedCustomer.name.charAt(0)}
              </div>
              <h4 className="text-xl font-bold text-slate-900">{selectedCustomer.name}</h4>
              <p className="text-sm text-slate-500">{selectedCustomer.country} based expat</p>
              
              <div className="mt-6 flex items-center justify-center gap-2">
                 {selectedCustomer.status === 'Active' ? (
                   <button 
                    onClick={() => onUpdateStatus(selectedCustomer.id, 'Blocked')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
                   >
                    <UserX size={14} /> Block Account
                   </button>
                 ) : (
                   <button 
                    onClick={() => onUpdateStatus(selectedCustomer.id, 'Active')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all"
                   >
                    <UserCheck size={14} /> Restore Account
                   </button>
                 )}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lifetime Value</p>
                <p className="text-lg font-bold text-slate-800">£{selectedCustomer.totalSpentGBP.toFixed(2)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Order</p>
                <p className="text-lg font-bold text-slate-800">£{(selectedCustomer.totalSpentGBP / selectedCustomer.totalOrders).toFixed(2)}</p>
              </div>
            </div>

            {/* Order History */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <History size={14} /> Order History
                </h5>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold">{customerOrders.length} Found</span>
              </div>
              <div className="space-y-3">
                {customerOrders.length > 0 ? customerOrders.map(order => (
                  <div key={order.id} className="p-3 bg-white border border-slate-100 rounded-xl hover:border-orange-200 transition-all flex items-center justify-between group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{order.orderNumber}</p>
                        <p className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-slate-800">£{order.totalGBP.toFixed(2)}</p>
                       <span className="text-[9px] font-bold text-emerald-500 uppercase">{order.status}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400">No matching orders found in local cache.</p>
                  </div>
                )}
              </div>
            </div>

             {/* Recipients */}
            <div>
               <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Users size={14} /> Recipient Network
              </h5>
              <div className="space-y-3">
                 {customerRecipients.length > 0 ? customerRecipients.map((r, idx) => {
                   // Calculate stats for this recipient
                   const recipientOrders = orders.filter(o => o.recipient.name === r.name && o.customerName === selectedCustomer.name);
                   const totalReceived = recipientOrders.reduce((sum, o) => sum + o.totalGBP, 0);
                   const lastOrderDate = recipientOrders.length > 0 
                     ? new Date(Math.max(...recipientOrders.map(o => new Date(o.createdAt).getTime()))).toLocaleDateString()
                     : 'N/A';

                   return (
                   <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                          {r.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{r.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{r.location}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-slate-300" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/50">
                        <div className="text-center">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Orders</p>
                          <p className="text-xs font-bold text-slate-700">{recipientOrders.length}</p>
                        </div>
                        <div className="text-center border-l border-slate-200/50">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Value</p>
                          <p className="text-xs font-bold text-emerald-600">£{totalReceived.toFixed(0)}</p>
                        </div>
                        <div className="text-center border-l border-slate-200/50">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Last</p>
                          <p className="text-xs font-bold text-slate-600">{lastOrderDate}</p>
                        </div>
                      </div>
                   </div>
                   );
                 }) : (
                   <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                     <p className="text-xs text-slate-400">No saved recipients found.</p>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
