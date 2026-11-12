import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  Legend 
} from 'recharts';
import { 
  ShieldCheck, 
  Lock, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Activity, 
  LogOut, 
  RefreshCw, 
  Eye, 
  X, 
  Calendar, 
  Building2, 
  ArrowUpDown,
  Sparkles,
  User,
  EyeOff,
  Zap
} from 'lucide-react';
import { useGrievances } from '../context/GrievanceContext';

const SENTIMENT_COLORS = {
  Negative: '#f43f5e', // rose-500
  Neutral: '#64748b',  // slate-500
  Positive: '#10b981'  // emerald-500
};

const CATEGORY_COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

export default function AdminDashboard() {
  const { 
    grievances, 
    updateGrievanceStatus, 
    resetToDefault, 
    isAdminAuthenticated, 
    loginAdmin, 
    logoutAdmin 
  } = useGrievances();

  // Login form states
  const [email, setEmail] = useState('admin@college.edu');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Table filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Modal inspection state
  const [inspectTicket, setInspectTicket] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleLogin = (e) => {
    e?.preventDefault();
    const res = loginAdmin(email, password);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('admin@college.edu', 'demo');
  };

  // KPIs
  const totalCount = grievances.length;
  const inReviewCount = grievances.filter(g => g.status === 'In Review').length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;
  const criticalCount = grievances.filter(g => g.priority === 'Critical' || g.priority === 'High').length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Chart 1: Category Distribution
  const categoryData = useMemo(() => {
    const counts = {};
    grievances.forEach(g => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [grievances]);

  // Chart 2: Sentiment Breakdown
  const sentimentData = useMemo(() => {
    const counts = { Negative: 0, Neutral: 0, Positive: 0 };
    grievances.forEach(g => {
      if (counts[g.sentiment] !== undefined) {
        counts[g.sentiment] += 1;
      } else {
        counts.Neutral += 1;
      }
    });
    return [
      { name: 'Negative', value: counts.Negative },
      { name: 'Neutral', value: counts.Neutral },
      { name: 'Positive', value: counts.Positive }
    ];
  }, [grievances]);

  // Chart 3: Weekly / Chronological Grievance Trend
  const trendData = useMemo(() => {
    // Group grievances by date
    const dateMap = {};
    // Ensure all dates present are sorted
    const sorted = [...grievances].sort((a, b) => new Date(a.date) - new Date(b.date));
    sorted.forEach(g => {
      const d = g.date.slice(5); // "MM-DD" e.g. "10-14"
      if (!dateMap[d]) {
        dateMap[d] = { date: d, count: 0, resolved: 0 };
      }
      dateMap[d].count += 1;
      if (g.status === 'Resolved') {
        dateMap[d].resolved += 1;
      }
    });
    return Object.values(dateMap);
  }, [grievances]);

  // Filtered grievances for table
  const filteredGrievances = useMemo(() => {
    return grievances.filter(item => {
      const matchSearch = searchTerm === '' || 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.submittedBy && item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchStat = selectedStatus === 'All' || item.status === selectedStatus;
      const matchPrio = selectedPriority === 'All' || item.priority === selectedPriority;

      return matchSearch && matchCat && matchStat && matchPrio;
    });
  }, [grievances, searchTerm, selectedCategory, selectedStatus, selectedPriority]);

  const handleStatusChange = (id, newStatus) => {
    updateGrievanceStatus(id, newStatus);
    showToast(`Ticket ${id} status updated to "${newStatus}"`);
    if (inspectTicket && inspectTicket.id === id) {
      setInspectTicket(prev => ({
        ...prev,
        status: newStatus
      }));
    }
  };

  // 1. If not authenticated, show Mock Admin Login
  if (!isAdminAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Portal Sign In</h2>
            <p className="text-slate-600 text-sm mt-1">GrievEase Campus Administration & Triage</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Administrative Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-colors"
            >
              Sign In to Admin Console
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600 mb-3">Testing prototype without credentials?</p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>One-Click Instant Demo Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Campus Oversight Dashboard</h1>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Live Monitor
            </span>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Real-time analytics, automated AI classification & status triage control
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset all 20 mock records to original defaults?')) {
                resetToDefault();
                showToast('Reset all mock grievances to default 20 items.');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            title="Reset dataset"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset 20 Records</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase">Total Tickets</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{totalCount}</p>
          <span className="text-[11px] text-slate-600 mt-1 block">Campus-wide filings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase">Under Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-700">{inReviewCount}</p>
          <span className="text-[11px] text-amber-700 mt-1 block">Active field tasks</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-700">{resolvedCount}</p>
          <span className="text-[11px] text-emerald-700 mt-1 block">{resolutionRate}% closed rate</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase">Critical / High</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-black text-rose-700">{criticalCount}</p>
          <span className="text-[11px] text-rose-700 mt-1 block">Priority escalation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase">Avg SLA</span>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-indigo-700">1.8 <span className="text-base font-normal text-slate-600">Days</span></p>
          <span className="text-[11px] text-slate-600 mt-1 block">Resolution turnaround</span>
        </div>
      </div>

      {/* 3 Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart 1: Category Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Grievances by Category</h3>
            <p className="text-xs text-slate-600">Distribution across campus operational domains</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  interval={0} 
                  angle={-30} 
                  textAnchor="end" 
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sentiment Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">AI Sentiment Breakdown</h3>
            <p className="text-xs text-slate-600">Emotional tone detected in student submissions</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell 
                      key={`sentiment-cell-${index}`} 
                      fill={SENTIMENT_COLORS[entry.name] || '#64748b'} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(val) => <span className="text-xs text-slate-700">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Weekly Submission & Resolution Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Grievance Activity Trend</h3>
            <p className="text-xs text-slate-600">Volume logged vs resolved over recent dates</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Logged" 
                  stroke="#4f46e5" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="resolved" 
                  name="Resolved" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorResolved)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filterable Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by Ticket ID, Title, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Hostel">Hostel</option>
              <option value="Mess">Mess</option>
              <option value="Academics">Academics</option>
              <option value="Transport">Transport</option>
              <option value="Lab">Lab</option>
              <option value="Library">Library</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedPriority !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                  setSelectedPriority('All');
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* The Grievances Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Title & Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Sentiment</th>
                <th className="py-3.5 px-4">Status (Interactive)</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredGrievances.length > 0 ? (
                filteredGrievances.map((item) => (
                  <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                    {/* Ticket ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      {item.id}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {item.date}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 truncate" title={item.title}>
                        {item.title}
                      </p>
                      <p className="text-slate-600 text-[11px] truncate mt-0.5">
                        {item.location} • {item.isAnonymous ? 'Anonymous' : item.submittedBy}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.priority === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : item.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.priority}
                      </span>
                    </td>

                    {/* Sentiment */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                        item.sentiment === 'Negative'
                          ? 'text-rose-700 bg-rose-50'
                          : item.sentiment === 'Positive'
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-slate-600 bg-slate-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.sentiment === 'Negative' ? 'bg-rose-500' : item.sentiment === 'Positive' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}></span>
                        {item.sentiment}
                      </span>
                    </td>

                    {/* Interactive Status Selector */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                          item.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.status === 'In Review'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="In Review">In Review</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectTicket(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 transition-colors text-xs font-semibold"
                        title="View Full Case Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-600">
                    No grievance records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table summary footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span>Showing {filteredGrievances.length} of {grievances.length} total grievances</span>
          <span>Tip: Change status directly via the dropdown above</span>
        </div>
      </div>

      {/* Inspect Ticket Drawer / Modal */}
      {inspectTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative animate-in fade-in duration-200">
            {/* Close button */}
            <button
              onClick={() => setInspectTicket(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                {inspectTicket.id}
              </span>
              <span className="text-xs text-slate-600">• Filed {inspectTicket.date}</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3">{inspectTicket.title}</h3>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed mb-6">
              {inspectTicket.description}
            </div>

            {/* Metadata Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block mb-0.5">Category</span>
                <span className="font-semibold text-slate-900">{inspectTicket.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block mb-0.5">Priority</span>
                <span className="font-semibold text-slate-900">{inspectTicket.priority}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block mb-0.5">Sentiment</span>
                <span className="font-semibold text-slate-900">{inspectTicket.sentiment}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block mb-0.5">Anonymous</span>
                <span className="font-semibold text-slate-900">{inspectTicket.isAnonymous ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {/* Quick Status Update inside Modal */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-indigo-900 block">Change Status & Post Admin Audit Event:</span>
                <span className="text-[11px] text-indigo-700">Student will see this updated in their live stepper</span>
              </div>

              <div className="flex items-center gap-2">
                {['Submitted', 'In Review', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(inspectTicket.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      inspectTicket.status === st
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-indigo-100 border border-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline history inside modal */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Audit Milestone Timeline</h4>
              <div className="space-y-2">
                {inspectTicket.timeline?.map((ev, i) => (
                  <div key={i} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                    <span className="font-bold text-indigo-700 shrink-0">{ev.status}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">{ev.date}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-700">{ev.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
