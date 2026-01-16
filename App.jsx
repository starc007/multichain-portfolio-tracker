import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  PieChart as PieChartIcon, 
  Settings, 
  Search, 
  Bell, 
  ChevronUp, 
  ChevronDown,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---
const portfolioHistory = [
  { name: 'Mon', value: 12500 },
  { name: 'Tue', value: 14200 },
  { name: 'Wed', value: 13800 },
  { name: 'Thu', value: 15400 },
  { name: 'Fri', value: 14900 },
  { name: 'Sat', value: 16200 },
  { name: 'Sun', value: 15800 },
];

const chainData = [
  { name: 'Ethereum', value: 65, color: '#627EEA' },
  { name: 'Solana', value: 25, color: '#14F195' },
  { name: 'BSC', value: 10, color: '#F3BA2F' },
];

const transactions = [
  { id: 1, type: 'receive', token: 'ETH', amount: '0.45', status: 'Completed', date: '2 hours ago', hash: '0x123...456' },
  { id: 2, type: 'send', token: 'SOL', amount: '12.0', status: 'Completed', date: '5 hours ago', hash: '8xY...9aB' },
  { id: 3, type: 'swap', token: 'USDC', amount: '1500', status: 'Pending', date: '1 day ago', hash: '0xabc...def' },
  { id: 4, type: 'receive', token: 'BNB', amount: '2.5', status: 'Completed', date: '2 days ago', hash: '0x789...012' },
];

const tokens = [
  { name: 'Ethereum', symbol: 'ETH', price: '$2,450.32', change: '+2.4%', balance: '1.24', value: '$3,038.40', chain: 'Ethereum' },
  { name: 'Solana', symbol: 'SOL', price: '$98.15', change: '-1.2%', balance: '45.8', value: '$4,495.27', chain: 'Solana' },
  { name: 'Chainlink', symbol: 'LINK', price: '$18.42', change: '+5.7%', balance: '120.0', value: '$2,210.40', chain: 'Ethereum' },
  { name: 'USDC', symbol: 'USDC', price: '$1.00', change: '0.0%', balance: '2,500.0', value: '$2,500.00', chain: 'BSC' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, change, isPositive }) => (
  <div className="glass-card p-6 rounded-2xl">
    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
    <h3 className="text-2xl font-bold mb-2">{value}</h3>
    <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
      {isPositive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      <span className="ml-1">{change} vs last week</span>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-2 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Wallet className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">CryptoPulse</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <SidebarItem icon={History} label="Transactions" active={activeTab === 'Transactions'} onClick={() => setActiveTab('Transactions')} />
          <SidebarItem icon={PieChartIcon} label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </nav>

        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Total Portfolio</p>
          <p className="text-xl font-bold">$15,842.12</p>
          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center">
              <Plus size={14} className="mr-1" /> Add Asset
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search assets, addresses..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={refreshData}
              className={`p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-all ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`}
            >
              <RefreshCw size={20} />
            </button>
            <div className="relative">
              <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg relative transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>
              </button>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <button className="flex items-center space-x-3 hover:bg-slate-800 p-1.5 pr-3 rounded-xl transition-all border border-transparent hover:border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs">
                JD
              </div>
              <span className="text-sm font-medium">0x71...2b8c</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Total Balance" value="$15,842.12" change="+12.5%" isPositive={true} />
                  <StatCard title="24h Change" value="+$450.25" change="+3.2%" isPositive={true} />
                  <StatCard title="Gas Tracker" value="18 Gwei" change="-15.4%" isPositive={false} />
                  <StatCard title="Active Chains" value="3" change="0%" isPositive={true} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Portfolio Chart */}
                  <div className="lg:col-span-2 glass-card p-6 rounded-2xl min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold">Portfolio Performance</h3>
                      <div className="flex bg-slate-800 rounded-lg p-1">
                        {['1D', '1W', '1M', '1Y', 'ALL'].map((p) => (
                          <button key={p} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${p === '1W' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={portfolioHistory}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                          <YAxis hide={true} domain={['dataMin - 1000', 'dataMax + 1000']} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                            itemStyle={{ color: '#f1f5f9' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Allocation Chart */}
                  <div className="glass-card p-6 rounded-2xl flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold mb-8">Chain Allocation</h3>
                    <div className="flex-1 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chainData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            {chainData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                            itemStyle={{ color: '#f1f5f9' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-2">
                      {chainData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm text-slate-400">{item.name}</span>
                          </div>
                          <span className="text-sm font-bold">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Token Table */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="p-6 flex items-center justify-between border-b border-slate-800">
                    <h3 className="text-lg font-bold">Your Assets</h3>
                    <button className="text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-all">View All</button>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Asset</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Price</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Balance</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Value</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Chain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {tokens.map((token, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-all cursor-pointer group">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs border border-slate-700">
                                {token.symbol.substring(0,2)}
                              </div>
                              <div>
                                <p className="font-bold">{token.name}</p>
                                <p className="text-xs text-slate-500 uppercase">{token.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium">{token.price}</p>
                            <p className={`text-xs ${token.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{token.change}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium">{token.balance} {token.symbol}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold">{token.value}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                              token.chain === 'Ethereum' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              token.chain === 'Solana' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {token.chain}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'Transactions' && (
              <motion.div 
                key="transactions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Transaction History</h2>
                  <div className="flex space-x-2">
                    <select className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none">
                      <option>All Networks</option>
                      <option>Ethereum</option>
                      <option>Solana</option>
                      <option>BSC</option>
                    </select>
                    <button className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm hover:bg-slate-800 transition-all">Filter</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="glass-card p-5 rounded-2xl flex items-center justify-between hover:border-indigo-500/50 transition-all cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tx.type === 'receive' ? 'bg-emerald-500/10 text-emerald-400' :
                          tx.type === 'send' ? 'bg-rose-500/10 text-rose-400' :
                          'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {tx.type === 'receive' ? <ArrowDownLeft size={24} /> : 
                           tx.type === 'send' ? <ArrowUpRight size={24} /> : 
                           <RefreshCw size={24} />}
                        </div>
                        <div>
                          <p className="font-bold capitalize">{tx.type} {tx.token}</p>
                          <div className="flex items-center text-slate-500 text-xs mt-1">
                            <span className="font-mono">{tx.hash}</span>
                            <button className="ml-2 hover:text-indigo-400"><Copy size={12} /></button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-bold text-lg ${tx.type === 'receive' ? 'text-emerald-400' : tx.type === 'send' ? 'text-rose-400' : 'text-slate-100'}`}>
                          {tx.type === 'receive' ? '+' : tx.type === 'send' ? '-' : ''} {tx.amount} {tx.token}
                        </p>
                        <div className="flex items-center justify-end space-x-2 mt-1">
                          <span className="text-xs text-slate-500">{tx.date}</span>
                          <span className={`w-2 h-2 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          <span className="text-xs font-medium text-slate-400">{tx.status}</span>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-400 transition-all">
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Analytics' && (
              <motion.div 
                key="analytics"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 mb-2">
                  <PieChartIcon size={40} />
                </div>
                <h2 className="text-2xl font-bold">Advanced Analytics</h2>
                <p className="text-slate-400 max-w-md mx-auto">Detailed portfolio breakdown, P&L analysis, and predictive insights are coming soon to CryptoPulse.</p>
                <button 
                  onClick={() => setActiveTab('Dashboard')}
                  className="mt-6 bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}

            {activeTab === 'Settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl"
              >
                <h2 className="text-2xl font-bold mb-8">Settings</h2>
                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4">Wallet Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">ETH</div>
                          <div>
                            <p className="text-sm font-bold">Main Ethereum Wallet</p>
                            <p className="text-xs text-slate-500 font-mono">0x71...2b8c</p>
                          </div>
                        </div>
                        <button className="text-rose-400 hover:text-rose-300 text-xs font-bold">Disconnect</button>
                      </div>
                      <button className="w-full py-3 border border-dashed border-slate-700 rounded-xl text-sm font-medium text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center justify-center">
                        <Plus size={16} className="mr-2" /> Add Another Wallet
                      </button>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">Currency</p>
                          <p className="text-xs text-slate-500">Display all values in this currency</p>
                        </div>
                        <select className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                        </select>
                      </div>
                      <div className="h-px bg-slate-800"></div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">Privacy Mode</p>
                          <p className="text-xs text-slate-500">Hide balances on screen by default</p>
                        </div>
                        <div className="w-12 h-6 bg-slate-800 rounded-full relative p-1 cursor-pointer">
                          <div className="w-4 h-4 bg-slate-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}