
import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Sparkles, UserX, UserCheck } from 'lucide-react';
import { Order } from '../types';
import { checkFraudRisk } from '../services/geminiService';

// Fix: Add prop definition for FraudMonitoring
interface FraudMonitoringProps {
  orders: Order[];
}

const FraudMonitoring: React.FC<FraudMonitoringProps> = ({ orders }) => {
  // Fix: Use the passed orders prop instead of the static MOCK_ORDERS
  const flaggedOrders = orders.filter(o => o.isFlagged);
  const [riskAssessments, setRiskAssessments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleAssessment = async (order: Order) => {
    setLoading(prev => ({ ...prev, [order.id]: true }));
    const result = await checkFraudRisk(order);
    setRiskAssessments(prev => ({ ...prev, [order.id]: result }));
    setLoading(prev => ({ ...prev, [order.id]: false }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-6">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-red-900">Security & Fraud Watch</h2>
          <p className="text-red-700">We've identified {flaggedOrders.length} orders that require immediate verification before local fulfillment can proceed in Bissau.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {flaggedOrders.map(order => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
            <div className="w-full md:w-64 bg-slate-50 p-6 flex flex-col items-center justify-center border-r border-slate-100">
              <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle className="text-orange-500" size={28} />
              </div>
              <p className="font-black text-slate-800 text-lg">{order.orderNumber}</p>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">High Risk Score</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-orange-500 h-full w-[85%]"></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Score: 85/100</p>
            </div>
            
            <div className="flex-1 p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Trigger</h4>
                  <p className="text-sm font-semibold text-slate-700">{order.notes || "Bulk order velocity limit exceeded."}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</h4>
                  <p className="text-sm font-semibold text-slate-700">{order.customerName} (London)</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 text-white relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-orange-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">AI Risk Verdict</span>
                </div>
                {loading[order.id] ? (
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                ) : riskAssessments[order.id] ? (
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{riskAssessments[order.id]}"
                  </p>
                ) : (
                  <button 
                    onClick={() => handleAssessment(order)}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-all"
                  >
                    Analyze with Gemini 
                    <Sparkles size={12} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <UserX size={16} />
                  Block Account
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all shadow-md shadow-red-100">
                  <ShieldAlert size={16} />
                  Reject & Refund
                </button>
                <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100">
                  <UserCheck size={16} />
                  Verify & Approve
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Everything looks secure</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">Most recent transactions are matching expected expat behavior patterns. Automated scoring is active.</p>
        </div>
      </div>
    </div>
  );
};

export default FraudMonitoring;
