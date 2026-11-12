import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Lock, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Utensils, 
  GraduationCap, 
  Bus, 
  Cpu, 
  BookOpen, 
  Users, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { useGrievances } from '../context/GrievanceContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { grievances } = useGrievances();
  const [quickTrackId, setQuickTrackId] = useState('');

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
    }
  };

  // Dynamic metrics from current dataset
  const total = grievances.length;
  const resolved = grievances.filter(g => g.status === 'Resolved').length;
  const inReview = grievances.filter(g => g.status === 'In Review').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 92;

  const categories = [
    { name: 'Hostel', icon: Building2, count: grievances.filter(g => g.category === 'Hostel').length, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { name: 'Mess & Food', icon: Utensils, count: grievances.filter(g => g.category === 'Mess').length, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { name: 'Academics', icon: GraduationCap, count: grievances.filter(g => g.category === 'Academics').length, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { name: 'Transport', icon: Bus, count: grievances.filter(g => g.category === 'Transport').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { name: 'Lab & Tech', icon: Cpu, count: grievances.filter(g => g.category === 'Lab').length, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { name: 'Library', icon: BookOpen, count: grievances.filter(g => g.category === 'Library').length, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Glow orbs & grid backdrop */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs sm:text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-indigo-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI-Powered Automated Triage & Resolution</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-300">Live Campus System</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Voice your campus concerns. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-violet-300">
              Resolved transparently with AI speed.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-indigo-100/90 font-normal mb-10 leading-relaxed">
            GrievEase replaces slow manual complaints with instant neural triage, 
            zero-retaliation anonymous reporting, and a live transparent progress stepper for college students and faculty.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg shadow-indigo-950/40 hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Submit Grievance</span>
              <ArrowRight className="w-4 h-4 text-indigo-700 ml-1" />
            </Link>

            <Link
              to="/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-indigo-700/60 hover:bg-indigo-700 text-white border border-indigo-400/40 backdrop-blur-sm shadow-md hover:scale-105 transition-all duration-200"
            >
              <ShieldCheck className="w-5 h-5 text-indigo-300" />
              <span>Admin Login</span>
            </Link>
          </div>

          {/* Quick Track Input Bar */}
          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
            <form onSubmit={handleQuickTrack} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-indigo-200 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Ticket ID (e.g. GRV-2026-101)..."
                  value={quickTrackId}
                  onChange={(e) => setQuickTrackId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-indigo-200/70 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 border border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-colors shrink-0 shadow-md"
              >
                Track Status
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-2 pt-1 text-xs text-indigo-200/80">
              <span>Try test IDs:</span>
              <button
                type="button"
                onClick={() => navigate('/track?id=GRV-2026-101')}
                className="underline hover:text-white"
              >
                GRV-2026-101
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => navigate('/track?id=GRV-2026-103')}
                className="underline hover:text-white"
              >
                GRV-2026-103
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => navigate('/track?id=GRV-2026-108')}
                className="underline hover:text-white"
              >
                GRV-2026-108
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Campus Impact Banner */}
      <section className="relative -mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{total}</p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Logged Tickets</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{resolved}</p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">{resolutionRate}% Resolution Rate</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-700">{inReview}</p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Under Active Review</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-violet-700">&lt; 2.5s</p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">AI Triage Speed</p>
            </div>
          </div>
        </div>
      </section>

      {/* How GrievEase Works - 3 Step Visual */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-indigo-600 font-semibold text-xs tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Intelligent Workflow
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3 mb-4">How GrievEase Resolves Issues</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From submission to resolution, every grievance is analyzed by AI, routed to the correct department, and tracked live.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-indigo-200">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Student Reports Concern</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Write your issue with optional 100% anonymity. No paperwork, no standing outside dean offices or wardens' desks.
            </p>
            <div className="text-xs font-medium text-indigo-700 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100/60 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full identity privacy protection</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-violet-200">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Neural Triage Engine</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Our AI extracts root cause, categorizes by hostel/mess/lab, calculates emotional sentiment, and flags safety priorities automatically.
            </p>
            <div className="text-xs font-medium text-violet-700 bg-violet-50 p-2.5 rounded-lg border border-violet-100/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>Auto-assigned Category & Severity</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-emerald-200">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Transparent Resolution Stepper</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Watch real-time status progression from "Submitted" to "In Review" to "Resolved" with admin notes and timestamped audit logs.
            </p>
            <div className="text-xs font-medium text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100/60 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cryptographic Ticket ID Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Covered Campus Categories */}
      <section className="bg-slate-100/80 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Covered Campus Domains</h3>
              <p className="text-slate-600 text-sm mt-1">Directly dispatched to the designated college officers</p>
            </div>
            <Link
              to="/submit"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>Submit a grievance now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all text-center flex flex-col items-center"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 border ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">{cat.name}</h4>
                  <span className="text-xs text-slate-600 font-medium">{cat.count} recent cases</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
