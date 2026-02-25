
import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Download, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  MapPin,
  Phone,
  Check,
  UserPlus,
  BookUser,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Order, OrderStatus, Recipient, SavedRecipient } from '../types';

interface OrderManagementProps {
  orders: Order[];
  onUpdateOrder: (id: string, status: OrderStatus) => void;
  searchTerm: string;
  savedRecipients: SavedRecipient[];
  onSaveRecipient: (recipient: Recipient, customerName: string) => boolean;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ 
  orders, 
  onUpdateOrder, 
  searchTerm, 
  savedRecipients, 
  onSaveRecipient 
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.recipient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'All' || o.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [orders, searchTerm, activeTab]);

  const filteredRecipients = useMemo(() => {
    return savedRecipients.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm)
    );
  }, [savedRecipients, searchTerm]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAID: return 'bg-emerald-100 text-emerald-700';
      case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case OrderStatus.DISPATCHED: return 'bg-blue-100 text-blue-700';
      case OrderStatus.DELIVERED: return 'bg-slate-100 text-slate-700';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Order logs exported successfully to BX_Orders_May24.csv');
    }, 1500);
  };

  const handleSaveContact = (order: Order) => {
    const success = onSaveRecipient(order.recipient, order.customerName);
    if (success) {
      setSaveStatus('Recipient saved!');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('Already in contacts');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const isAlreadySaved = (order: Order) => {
    return savedRecipients.some(r => r.phone === order.recipient.phone && r.customerName === order.customerName);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Advanced
          </button>
          <button 
            disabled={isExporting}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            {isExporting ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span> : <Download size={18} />}
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
           {['All', 'Pending', 'Paid', 'Dispatched', 'Delivered', 'Contacts'].map(tab => (
             <button 
               key={tab} 
               onClick={() => {
                 setActiveTab(tab);
                 if (tab === 'Contacts') setSelectedOrder(null);
               }}
               className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === tab ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {activeTab === 'Contacts' ? (
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <BookUser size={20} className="text-orange-500" />
                      Recipient Directory
                    </h3>
                    <p className="text-xs text-slate-500">Recipients linked to expat customer accounts.</p>
                  </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                       <th className="px-6 py-4">Recipient</th>
                       <th className="px-6 py-4">Linked Expat Customer</th>
                       <th className="px-6 py-4">Phone</th>
                       <th className="px-6 py-4">Added On</th>
                       <th className="px-6 py-4 text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredRecipients.length > 0 ? filteredRecipients.map(r => (
                       <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase">
                                {r.name.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">{r.name}</span>
                                <span className="text-xs text-slate-500">{r.location}</span>
                              </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="text-sm font-medium px-2 py-1 bg-slate-100 rounded text-slate-700">
                              {r.customerName}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-sm font-mono">{r.phone}</td>
                         <td className="px-6 py-4 text-xs text-slate-400 italic">
                            {new Date(r.addedAt).toLocaleDateString()}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-slate-400 hover:text-orange-500 group-hover:translate-x-1 transition-all">
                               <ChevronRight size={20} />
                            </button>
                         </td>
                       </tr>
                     )) : (
                       <tr>
                         <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">No contacts found. Use the "Save Recipient" button in Order Details to build this directory.</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Order Details</th>
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-orange-50' : 'hover:bg-slate-50'}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-slate-400 uppercase">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{order.orderNumber}</span>
                          <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm">
                          <span className="font-semibold">{order.recipient.name}</span>
                          <span className="text-xs text-slate-500">{order.recipient.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">£{order.totalGBP.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 hover:bg-slate-200 rounded transition-colors"><MoreVertical size={18} className="text-slate-400" /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">No orders found matching criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {selectedOrder ? (
              <div className="w-full lg:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg">Order #{selectedOrder.orderNumber}</h3>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-tighter">System ID: {selectedOrder.id}</span>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">✕</button>
                </div>
                
                <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scrollbar">
                  <div className="flex justify-between items-center px-2">
                    {[OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.DISPATCHED].map((s, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${selectedOrder.status === s ? 'bg-orange-500 text-white scale-110 shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
                          {selectedOrder.status === s ? <Check size={14} /> : idx + 1}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">{s}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Customer (Expat)</h4>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold uppercase">{selectedOrder.customerName.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-bold">{selectedOrder.customerName}</p>
                        <p className="text-xs text-slate-500">Global Account Active</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recipient in Bissau</h4>
                      {!isAlreadySaved(selectedOrder) ? (
                        <button 
                          onClick={() => handleSaveContact(selectedOrder)}
                          className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded transition-colors"
                        >
                          <UserPlus size={12} />
                          Save to Contacts
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          <Check size={12} />
                          In Contacts
                        </span>
                      )}
                    </div>
                    {saveStatus && <p className="text-[10px] font-bold text-orange-500 mb-2 animate-pulse">{saveStatus}</p>}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{selectedOrder.recipient.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{selectedOrder.recipient.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-slate-400" />
                        <p className="text-sm font-bold text-slate-700">{selectedOrder.recipient.phone}</p>
                      </div>
                      <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-orange-600 hover:underline">
                        View Recipient History <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 grid grid-cols-2 gap-3 mt-auto">
                    <button 
                      onClick={() => {
                        onUpdateOrder(selectedOrder.id, OrderStatus.CANCELLED);
                        setSelectedOrder(null);
                      }}
                      className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <XCircle size={18} /> Cancel
                    </button>
                    <button 
                      onClick={() => {
                        const next = selectedOrder.status === OrderStatus.PENDING ? OrderStatus.PAID : 
                                     selectedOrder.status === OrderStatus.PAID ? OrderStatus.PROCESSING : 
                                     OrderStatus.DISPATCHED;
                        onUpdateOrder(selectedOrder.id, next);
                        setSelectedOrder({ ...selectedOrder, status: next });
                      }}
                      className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg"
                    >
                      <CheckCircle size={18} className="text-emerald-400" /> Update
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex w-96 items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium p-8 text-center bg-slate-50/50">
                Select an order to manage local fulfillment or view linked contacts.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
