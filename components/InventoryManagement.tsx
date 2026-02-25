
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Warehouse, 
  Plus, 
  AlertCircle, 
  RefreshCcw,
  ChevronRight,
  TrendingDown,
  X,
  Layers,
  Trash2
} from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryProps {
  inventory: InventoryItem[];
  onAddInventory: (item: InventoryItem) => void;
  onUpdateInventory: (item: InventoryItem) => void;
  searchTerm: string;
}

const InventoryManagement: React.FC<InventoryProps> = ({ inventory, onAddInventory, onUpdateInventory, searchTerm }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    name: string;
    stock: number;
    minThreshold: number;
    location: string;
    type: 'individual' | 'bundle';
    bundleItems: { productName: string; quantity: number }[];
    category: 'Value Bundles' | 'Pantry Staples' | 'Hygiene & Care';
    procurementType: 'In-House' | 'Local Procurement';
  } | null>(null);

  const [newItem, setNewItem] = useState<{
    name: string;
    stock: number;
    minThreshold: number;
    location: string;
    type: 'individual' | 'bundle';
    bundleItems: { productName: string; quantity: number }[];
    category: 'Value Bundles' | 'Pantry Staples' | 'Hygiene & Care';
    procurementType: 'In-House' | 'Local Procurement';
  }>({ 
    name: '', 
    stock: 0, 
    minThreshold: 50,
    location: 'Bissau Central',
    type: 'individual',
    bundleItems: [],
    category: 'Pantry Staples',
    procurementType: 'In-House'
  });

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [inventory, searchTerm]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    onAddInventory({
      id: 'i' + (inventory.length + 1),
      productName: newItem.name,
      currentStock: newItem.stock,
      minThreshold: newItem.minThreshold,
      warehouseLocation: newItem.location,
      type: newItem.type,
      bundleItems: newItem.type === 'bundle' ? newItem.bundleItems : undefined,
      category: newItem.category,
      procurementType: newItem.procurementType
    });
    setNewItem({ name: '', stock: 0, minThreshold: 50, location: 'Bissau Central', type: 'individual', bundleItems: [], category: 'Pantry Staples', procurementType: 'In-House' });
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name) return;
    onUpdateInventory({
      id: editingItem.id,
      productName: editingItem.name,
      currentStock: editingItem.stock,
      minThreshold: editingItem.minThreshold,
      warehouseLocation: editingItem.location,
      type: editingItem.type,
      bundleItems: editingItem.type === 'bundle' ? editingItem.bundleItems : undefined,
      category: editingItem.category,
      procurementType: editingItem.procurementType
    });
    setEditingItem(null);
    setShowEditModal(false);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem({
      id: item.id,
      name: item.productName,
      stock: item.currentStock,
      minThreshold: item.minThreshold,
      location: item.warehouseLocation,
      type: item.type || 'individual',
      bundleItems: item.bundleItems || [],
      category: item.category || 'Pantry Staples',
      procurementType: item.procurementType || 'In-House'
    });
    setShowEditModal(true);
  };

  const addBundleItem = (isEditing = false) => {
    if (isEditing && editingItem) {
      setEditingItem({
        ...editingItem,
        bundleItems: [...editingItem.bundleItems, { productName: '', quantity: 1 }]
      });
    } else {
      setNewItem({
        ...newItem,
        bundleItems: [...newItem.bundleItems, { productName: '', quantity: 1 }]
      });
    }
  };

  const updateBundleItem = (index: number, field: 'productName' | 'quantity', value: string | number, isEditing = false) => {
    if (isEditing && editingItem) {
      const updated = [...editingItem.bundleItems];
      updated[index] = { ...updated[index], [field]: value };
      setEditingItem({ ...editingItem, bundleItems: updated });
    } else {
      const updated = [...newItem.bundleItems];
      updated[index] = { ...updated[index], [field]: value };
      setNewItem({ ...newItem, bundleItems: updated });
    }
  };

  const removeBundleItem = (index: number, isEditing = false) => {
    if (isEditing && editingItem) {
      const updated = [...editingItem.bundleItems];
      updated.splice(index, 1);
      setEditingItem({ ...editingItem, bundleItems: updated });
    } else {
      const updated = [...newItem.bundleItems];
      updated.splice(index, 1);
      setNewItem({ ...newItem, bundleItems: updated });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Warehouse Inventory</h2>
          <p className="text-slate-500">Managing provision clusters across Bissau hubs.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleSync}
             disabled={isSyncing}
             className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-white transition-all disabled:opacity-50"
           >
             <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} />
             {isSyncing ? 'Syncing...' : 'Sync Stock'}
           </button>
           <button 
             onClick={() => setShowAddModal(true)}
             className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all"
           >
             <Plus size={18} />
             Add New SKU
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
             <Warehouse size={20} />
             <h3 className="font-bold">Active Warehouse</h3>
          </div>
          <p className="text-3xl font-black">Bissau HQ</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center gap-3 mb-4 text-orange-600">
             <TrendingDown size={20} />
             <h3 className="font-bold">Low Alerts</h3>
          </div>
          <p className="text-3xl font-black">{inventory.filter(i => i.currentStock <= i.minThreshold).length} SKU</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-emerald-600">
             <Package size={20} />
             <h3 className="font-bold">Total Items</h3>
          </div>
          <p className="text-3xl font-black">{inventory.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Procurement</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Available</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => {
                const isLow = item.currentStock <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {item.productName}
                      {item.type === 'bundle' && item.bundleItems && (
                        <div className="text-xs text-slate-400 font-normal mt-1">
                          Includes: {item.bundleItems.map(b => `${b.quantity}x ${b.productName}`).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold uppercase">
                        {item.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.type === 'bundle' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold uppercase">
                          <Layers size={10} /> Bundle
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">
                          <Package size={10} /> Item
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.procurementType === 'Local Procurement' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {item.procurementType || 'In-House'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{item.warehouseLocation}</td>
                    <td className="px-6 py-4">
                      <span className={`font-black text-lg ${isLow ? 'text-orange-600' : 'text-slate-800'}`}>{item.currentStock}</span>
                      <span className="text-xs text-slate-500 ml-1">Units</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black uppercase w-fit ${isLow ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {isLow ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                        {isLow ? 'Restock' : 'Optimal'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => openEditModal(item)}
                         className="text-slate-400 hover:text-orange-500 transition-colors"
                       >
                         <ChevronRight size={20} />
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Add New Stock</h3>
              <button onClick={() => setShowAddModal(false)}><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">SKU Type</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setNewItem({...newItem, type: 'individual'})}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newItem.type === 'individual' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Individual Item
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewItem({...newItem, type: 'bundle'})}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newItem.type === 'bundle' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Bundle Pack
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Procurement Source</label>
                <select 
                  value={newItem.procurementType} 
                  onChange={e => setNewItem({...newItem, procurementType: e.target.value as any})} 
                  className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>In-House</option>
                  <option>Local Procurement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <select 
                  value={newItem.category} 
                  onChange={e => setNewItem({...newItem, category: e.target.value as any})} 
                  className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>Pantry Staples</option>
                  <option>Value Bundles</option>
                  <option>Hygiene & Care</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
                <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500" placeholder={newItem.type === 'bundle' ? "e.g. Family Essentials Pack" : "e.g. Tomato Paste (1kg)"} />
              </div>

              {newItem.type === 'bundle' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase">Bundle Contents</label>
                    <button type="button" onClick={() => addBundleItem(false)} className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                      <Plus size={12} /> Add Item
                    </button>
                  </div>
                  {newItem.bundleItems.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-2">No items added to this bundle yet.</p>
                  )}
                  {newItem.bundleItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Item name"
                        value={item.productName}
                        onChange={(e) => updateBundleItem(idx, 'productName', e.target.value, false)}
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500"
                      />
                      <input 
                        type="number" 
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateBundleItem(idx, 'quantity', parseInt(e.target.value) || 0, false)}
                        className="w-16 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500"
                      />
                      <button type="button" onClick={() => removeBundleItem(idx, false)} className="p-2 text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Initial Stock Level</label>
                  <input required type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})} className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Low Stock Alert At</label>
                  <input required type="number" value={newItem.minThreshold} onChange={e => setNewItem({...newItem, minThreshold: parseInt(e.target.value)})} className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Warehouse Location</label>
                <select value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500">
                  <option>Bissau Central</option>
                  <option>Gabú Satellite</option>
                  <option>Bafatá Satellite</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 transition-all mt-4">Confirm Addition</button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Edit SKU</h3>
              <button onClick={() => setShowEditModal(false)}><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">SKU Type</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setEditingItem({...editingItem, type: 'individual'})}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${editingItem.type === 'individual' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Individual Item
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingItem({...editingItem, type: 'bundle'})}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${editingItem.type === 'bundle' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Bundle Pack
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Procurement Source</label>
                <select 
                  value={editingItem.procurementType} 
                  onChange={e => setEditingItem({...editingItem, procurementType: e.target.value as any})} 
                  className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>In-House</option>
                  <option>Local Procurement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <select 
                  value={editingItem.category} 
                  onChange={e => setEditingItem({...editingItem, category: e.target.value as any})} 
                  className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>Pantry Staples</option>
                  <option>Value Bundles</option>
                  <option>Hygiene & Care</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
                <input required type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              {editingItem.type === 'bundle' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase">Bundle Contents</label>
                    <button type="button" onClick={() => addBundleItem(true)} className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                      <Plus size={12} /> Add Item
                    </button>
                  </div>
                  {editingItem.bundleItems.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-2">No items added to this bundle yet.</p>
                  )}
                  {editingItem.bundleItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Item name"
                        value={item.productName}
                        onChange={(e) => updateBundleItem(idx, 'productName', e.target.value, true)}
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500"
                      />
                      <input 
                        type="number" 
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateBundleItem(idx, 'quantity', parseInt(e.target.value) || 0, true)}
                        className="w-16 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500"
                      />
                      <button type="button" onClick={() => removeBundleItem(idx, true)} className="p-2 text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Current Stock Level</label>
                  <input required type="number" value={editingItem.stock} onChange={e => setEditingItem({...editingItem, stock: parseInt(e.target.value)})} className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Low Stock Alert At</label>
                  <input required type="number" value={editingItem.minThreshold} onChange={e => setEditingItem({...editingItem, minThreshold: parseInt(e.target.value)})} className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Warehouse Location</label>
                <select value={editingItem.location} onChange={e => setEditingItem({...editingItem, location: e.target.value})} className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500">
                  <option>Bissau Central</option>
                  <option>Gabú Satellite</option>
                  <option>Bafatá Satellite</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 transition-all mt-4">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export default InventoryManagement;
