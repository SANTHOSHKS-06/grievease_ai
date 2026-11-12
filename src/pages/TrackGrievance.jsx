import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Check, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  User, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Shield,
  EyeOff,
  Activity
} from 'lucide-react';
import { useGrievances } from '../context/GrievanceContext';

export default function TrackGrievance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getGrievanceById, grievances } = useGrievances();

  const [ticketInput, setTicketInput] = useState('');
  const [currentTicket, setCurrentTicket] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Sync with URL query parameter ?id=...
  useEffect(() => {
    const idFromQuery = searchParams.get('id');
    if (idFromQuery) {
      setTicketInput(idFromQuery);
      const ticket = getGrievanceById(idFromQuery);
      setCurrentTicket(ticket);
      setHasSearched(true);
    } else {
      // Default to the first in-review ticket for an instant preview if no query param
      const defaultSample = grievances[0] || null;
      if (defaultSample && !hasSearched) {
        setTicketInput(defaultSample.id);
        setCurrentTicket(defaultSample);
        setHasSearched(true);
      }
    }
  }, [searchParams, grievances]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!ticketInput.trim()) return;

    const trimmed = ticketInput.trim().toUpperCase();
    setSearchParams({ id: trimmed });
    const found = getGrievanceById(trimmed);
    setCurrentTicket(found);
    setHasSearched(true);
  };

  const selectQuickTicket = (id) => {
    setTicketInput(id);
    setSearchParams({ id });
    const found = getGrievanceById(id);
    setCurrentTicket(found);
    setHasSearched(true);
  };

  // Stepper Stage logic
  const stages = [
    { key: 'Submitted', label: '1. Submitted', desc: 'Received & AI classified' },
    { key: 'In Review', label: '2. In Review', desc: 'Assigned to field team' },
    { key: 'Resolved', label: '3. Resolved', desc: 'Rectified & verified closed' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'In Review': return 1;
      case 'Resolved': return 2;
      default: return 0;
    }
  };

  const currentStepIndex = currentTicket ? getStepIndex(currentTicket.status) : 0;

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="text-center sm:text-left mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
          <Activity className="w-3.5 h-3.5 text-indigo-600" />
          <span>Real-Time Resolution Stepper</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Track Grievance Status</h1>
        <p className="text-slate-600 text-sm mt-1">
          Check live administrative progress, assigned field officers, and verified milestone dates.
        </p>
      </div>

      {/* Ticket Lookup Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Ticket ID (e.g. GRV-2026-101)..."
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm uppercase tracking-wide font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-colors shrink-0"
          >
            Track Status
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-600 font-medium">Quick sample tickets:</span>
          {['GRV-2026-101', 'GRV-2026-103', 'GRV-2026-105', 'GRV-2026-108'].map(id => (
            <button
              key={id}
              type="button"
              onClick={() => selectQuickTicket(id)}
              className={`px-2.5 py-1 rounded-md font-mono transition-colors ${
                currentTicket?.id === id 
                  ? 'bg-indigo-100 text-indigo-800 font-bold border border-indigo-300' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* When ticket is found */}
      {currentTicket ? (
        <div className="space-y-6">
          {/* Stepper Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Ticket Reference</span>
                <h2 className="text-2xl font-bold font-mono text-indigo-600 mt-0.5">{currentTicket.id}</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Current Status:</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  currentTicket.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : currentTicket.status === 'In Review'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    currentTicket.status === 'Resolved' ? 'bg-emerald-500' : currentTicket.status === 'In Review' ? 'bg-amber-500 animate-ping' : 'bg-indigo-500'
                  }`}></span>
                  {currentTicket.status}
                </span>
              </div>
            </div>

            {/* Stepper Graphic */}
            <div className="relative mb-6">
              <div className="grid grid-cols-3 gap-2 relative">
                {/* Connecting background line */}
                <div className="absolute top-5 left-12 right-12 h-1 bg-slate-200 -z-0"></div>
                
                {/* Active progress bar line */}
                <div 
                  className="absolute top-5 left-12 h-1 bg-indigo-600 transition-all duration-500 -z-0"
                  style={{
                    width: currentStepIndex === 0 ? '0%' : currentStepIndex === 1 ? '50%' : 'calc(100% - 48px)'
                  }}
                ></div>

                {stages.map((st, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const isPending = idx > currentStepIndex;

                  return (
                    <div key={st.key} className="flex flex-col items-center text-center relative z-10">
                      {/* Step Circle */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        isDone 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-4 ring-indigo-50' 
                          : isCurrent
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300 ring-4 ring-indigo-100 animate-pulse'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}>
                        {isDone ? <Check className="w-5 h-5" /> : idx + 1}
                      </div>

                      {/* Step Labels */}
                      <div className="mt-3">
                        <p className={`text-sm font-bold ${
                          isCurrent ? 'text-indigo-600' : isDone ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {st.key}
                        </p>
                        <p className="text-[11px] text-slate-600 hidden sm:block mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grievance Summary & Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Category Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  {currentTicket.category}
                </span>

                {/* Priority Badge */}
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  currentTicket.priority === 'Critical'
                    ? 'bg-rose-100 text-rose-800'
                    : currentTicket.priority === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-indigo-100 text-indigo-800'
                }`}>
                  Priority: {currentTicket.priority}
                </span>

                {/* Sentiment Badge */}
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  currentTicket.sentiment === 'Negative'
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : currentTicket.sentiment === 'Positive'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-slate-100 text-slate-600'
                }`}>
                  Sentiment: {currentTicket.sentiment}
                </span>

                <span className="text-xs text-slate-600 ml-auto flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {currentTicket.date}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">{currentTicket.title}</h2>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {currentTicket.description}
              </p>
            </div>

            {/* Department & Reporter Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-600 font-medium block mb-1">Assigned Department</span>
                <p className="font-semibold text-slate-800">{currentTicket.assignedDept || `${currentTicket.category} Committee`}</p>
              </div>

              <div>
                <span className="text-slate-600 font-medium block mb-1">Campus Location</span>
                <p className="font-semibold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentTicket.location || 'Campus Facilities'}
                </p>
              </div>

              <div>
                <span className="text-slate-600 font-medium block mb-1">Filed By</span>
                <p className="font-semibold text-slate-800 flex items-center gap-1">
                  {currentTicket.isAnonymous ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Protected Identity (Anonymous)</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentTicket.submittedBy || 'Student'}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Action Timeline Audit Log */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Milestone History & Administrative Notes</span>
              </h3>

              <div className="space-y-3">
                {currentTicket.timeline && currentTicket.timeline.length > 0 ? (
                  currentTicket.timeline.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900">{event.status}</span>
                          <span className="text-slate-600">{event.date}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{event.note}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-600">No previous milestones logged.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        /* Not found state */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center my-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Ticket "{ticketInput}" Not Found</h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            Please verify the ticket code format (e.g. GRV-2026-101). Try clicking one of the sample tickets above or submit a new grievance.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => selectQuickTicket('GRV-2026-101')}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Load Sample GRV-2026-101
            </button>
            <Link
              to="/submit"
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Submit New Grievance
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
