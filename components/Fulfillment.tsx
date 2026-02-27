
import React, { useState } from 'react';
import { 
  Truck, 
  Navigation, 
  Phone, 
  CheckCircle2, 
  MapPin, 
  UserCheck, 
  ChevronDown, 
  User, 
  Camera, 
  X, 
  Hash, 
  Save, 
  Copy, 
  Check,
  Star,
  Timer,
  Activity,
  Zap
} from 'lucide-react';
import { Order, OrderStatus, Driver } from '../types';
import { MOCK_DRIVERS } from '../constants';

interface FulfillmentProps {
  orders: Order[];
  onCompleteDelivery: (id: string, podData?: string) => void;
  onAssignDriver: (id: string, driverName: string) => void;
  onUpdateTracking: (id: string, trackingId: string, trackingUrl: string) => void;
}

const Fulfillment: React.FC<FulfillmentProps> = ({ orders, onCompleteDelivery, onAssignDriver, onUpdateTracking }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showDriverSelect, setShowDriverSelect] = useState<string | null>(null);
  const [podCapture, setPodCapture] = useState<string | null>(null);
  const [activePodOrder, setActivePodOrder] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const dispatchableOrders = orders.filter(o => 
    o.status === OrderStatus.PAID || 
    o.status === OrderStatus.DISPATCHED || 
    o.status === OrderStatus.PROCESSING
  );

  const handleComplete = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      onCompleteDelivery(id, podCapture || undefined);
      setProcessingId(null);
      setPodCapture(null);
      setActivePodOrder(null);
    }, 1200);
  };

  const simulatePhotoCapture = () => {
    setPodCapture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDriverByName = (name: string): Driver | undefined => {
    return MOCK_DRIVERS.find(d => d.name === name);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dispatch & Delivery</h2>
          <p className="text-slate-500">Local Bissau fulfillment and proof-of-delivery tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {dispatchableOrders.length > 0 ? dispatchableOrders.map((order) => {
          const assignedDriver = order.driverName ? getDriverByName(order.driverName) : null;
          
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:border-orange-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === OrderStatus.DISPATCHED ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      <Truck size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-800">{order.orderNumber}</h3>
                      <div className="relative">
                        <button 
                          onClick={() => setShowDriverSelect(showDriverSelect === order.id ? null : order.id)}
                          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-600 transition-colors group"
                        >
                          {order.driverName ? (
                            <span className="flex items-center gap-1 font-semibold text-emerald-600">
                              <UserCheck size={12} />
                              Assigned: {order.driverName}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <User size={12} className="text-slate-400" />
                              Unassigned - Click to Assign
                            </span>
                          )}
                          <ChevronDown size={12} className={`transition-transform ${showDriverSelect === order.id ? 'rotate-180' : ''}`} />
                        </button>

                        {showDriverSelect === order.id && (
                          <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                            <p className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 border-b border-slate-100">Bissau Hub Drivers & Performance</p>
                            <div className="max-h-64 overflow-y-auto no-scrollbar">
                              {MOCK_DRIVERS.map(driver => (
                                <button 
                                  key={driver.id}
                                  onClick={() => {
                                    onAssignDriver(order.id, driver.name);
                                    setShowDriverSelect(null);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-slate-50 last:border-0 group"
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <span className={`text-sm font-bold ${order.driverName === driver.name ? 'text-orange-600' : 'text-slate-700'}`}>
                                      {driver.name}
                                    </span>
                                    {order.driverName === driver.name && <CheckCircle2 size={14} className="text-emerald-500" />}
                                  </div>
                                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <span className="flex items-center gap-0.5 text-emerald-600">
                                      <Zap size={10} /> {driver.completionRate}%
                                    </span>
                                    <span className="flex items-center gap-0.5 text-blue-600">
                                      <Timer size={10} /> {driver.avgDeliveryTime}
                                    </span>
                                    <span className="flex items-center gap-0.5 text-amber-500">
                                      <Star size={10} /> {driver.rating}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${order.status === OrderStatus.DISPATCHED ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                  {order.status}
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Delivery Info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Drop-off Point</h4>
                      <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-orange-500 shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-bold">{order.recipient.name}</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{order.recipient.location}</p>
                          </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={`tel:${order.recipient.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">
                        <Phone size={14} /> Call
                      </a>
                      <button onClick={() => alert('Launching Bissau Map Nav...')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all text-blue-600">
                        <Navigation size={14} /> Nav
                      </button>
                    </div>
                  </div>

                  {/* POD Section */}
                  <div className="space-y-4 border-l border-slate-100 pl-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Proof of Delivery</h4>
                    {activePodOrder === order.id && podCapture ? (
                      <div className="relative w-full aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
                          <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10">
                            <CheckCircle2 className="text-emerald-500" size={32} />
                          </div>
                          <button onClick={() => setPodCapture(null)} className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-slate-600 hover:text-red-500">
                            <X size={14} />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-white/90 p-2 text-[10px] font-bold text-center text-emerald-600 uppercase tracking-tighter">
                            Photo Captured Successfully
                          </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setActivePodOrder(order.id); simulatePhotoCapture(); }}
                        className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all"
                      >
                        <Camera size={24} />
                        <span className="text-xs font-bold uppercase tracking-widest">Take POD Photo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Driver Performance Brief (if assigned) */}
                {assignedDriver && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Activity size={8} /> Reliability
                      </span>
                      <span className="text-sm font-black text-emerald-600">{assignedDriver.completionRate}%</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Timer size={8} /> Speed
                      </span>
                      <span className="text-sm font-black text-blue-600">{assignedDriver.avgDeliveryTime}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Truck size={8} /> Experience
                      </span>
                      <span className="text-sm font-black text-slate-700">{assignedDriver.totalDeliveries}</span>
                    </div>
                  </div>
                )}

                {/* Logistics & Tracking ID Section */}
                {order.status === OrderStatus.DISPATCHED && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Hash size={12} className="text-blue-500" />
                      Logistics & Tracking Info
                    </h4>
                    
                    {order.trackingId ? (
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Active Tracking ID</span>
                          <span className="text-sm font-mono font-bold text-slate-800">{order.trackingId}</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCopy(order.trackingId!, order.id)}
                            className="p-2 hover:bg-slate-100 rounded-md text-slate-400 transition-colors"
                            title="Copy ID"
                          >
                            {copiedId === order.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                          </button>
                          <button 
                            onClick={() => setTrackingInputs({ ...trackingInputs, [order.id]: order.trackingId! })}
                            className="text-[10px] font-black text-blue-500 uppercase hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            value={trackingInputs[order.id] || ''}
                            onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                            placeholder="Enter Local Tracking ID..." 
                            className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                          <Hash size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                        </div>
                        <button 
                          onClick={() => {
                            if (trackingInputs[order.id]) {
                              const trackingId = trackingInputs[order.id];
                              const trackingUrl = `https://track.nhakinhon.com/${trackingId}`;
                              onUpdateTracking(order.id, trackingId, trackingUrl);
                              setTrackingInputs(prev => {
                                const next = { ...prev };
                                delete next[order.id];
                                return next;
                              });
                            }
                          }}
                          disabled={!trackingInputs[order.id]}
                          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                          <Save size={16} />
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 pt-0">
                 <button 
                  onClick={() => handleComplete(order.id)}
                  disabled={processingId === order.id || !order.driverName || (activePodOrder === order.id && !podCapture)}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50 ${order.driverName ? 'bg-slate-900 text-white hover:bg-black' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                 >
                    {processingId === order.id ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <CheckCircle2 size={20} className={order.driverName ? "text-emerald-400" : "text-slate-300"} />
                    )}
                    {!order.driverName ? 'Assign Driver' : 
                     (activePodOrder === order.id && !podCapture) ? 'Capture Photo First' :
                     processingId === order.id ? 'Saving Record...' : 'Confirm Delivery'}
                 </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-2 py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl">
             <Truck size={48} className="text-slate-200 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-400">No active dispatch orders.</h3>
             <p className="text-slate-300">Wait for hub verification to push orders to delivery.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fulfillment;
