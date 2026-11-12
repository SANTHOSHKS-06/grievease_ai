import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, PlusCircle, Search, LayoutDashboard, Sparkles, UserCheck } from 'lucide-react';
import { useGrievances } from '../context/GrievanceContext';

export default function Navbar() {
  const location = useLocation();
  const { isAdminAuthenticated } = useGrievances();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Griev<span className="text-indigo-600">Ease</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                  <Sparkles className="w-3 h-3 text-indigo-500" /> AI-Triage
                </span>
              </div>
              <p className="text-[11px] text-slate-600 hidden sm:block">Campus Grievance Redressal</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/submit"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/submit') 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Submit</span>
            </Link>

            <Link
              to="/track"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/track') 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Track Ticket</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-slate-900 hover:bg-indigo-950 text-white shadow-sm'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{isAdminAuthenticated ? 'Admin Panel' : 'Admin Login'}</span>
              {isAdminAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
