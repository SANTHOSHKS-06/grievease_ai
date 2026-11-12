import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Shield, 
  ShieldAlert, 
  CheckCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  AlertTriangle, 
  Building2, 
  Clock, 
  HelpCircle,
  Cpu,
  RefreshCw,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { useGrievances } from '../context/GrievanceContext';
import { fakeAiAnalysis } from '../utils/aiSimulator';

export default function SubmitGrievance() {
  const navigate = useNavigate();
  const { addGrievance } = useGrievances();

  const [category, setCategory] = useState('Hostel');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [department, setDepartment] = useState('Computer Science');

  // AI Loading & Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Quick preset sample buttons for rapid testing
  const sampleScenarios = [
    {
      label: '⚡ Hostel Geyser Shock (Critical)',
      cat: 'Hostel',
      t: 'Geyser current leakage in 2nd floor common washroom',
      d: 'The electric geyser in Block C bathroom is giving mild shocks through the metal tap when turned on. Urgent safety hazard.'
    },
    {
      label: '🍲 Mess Food Hygiene (High)',
      cat: 'Mess',
      t: 'Foreign insect found in dinner vegetable curry',
      d: 'A dead beetle was discovered in the evening mixed vegetable subzi served at Central Mess 2. Multiple students witnessed this.'
    },
    {
      label: '🚌 Transport Delay (Medium)',
      cat: 'Transport',
      t: 'Route 6 morning campus bus arriving 30 mins late',
      d: 'The 8:00 AM shuttle from North Railway Station consistently arrives after 8:35 AM, causing first period attendance loss.'
    }
  ];

  const handleApplySample = (sample) => {
    setCategory(sample.cat);
    setTitle(sample.t);
    setDescription(sample.d);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the title and description.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('Scanning grievance syntax and extracting semantic keywords...');

    // Fake AI Step 1
    setTimeout(() => {
      setAnalysisStep('Classifying campus operational category & department...');
    }, 500);

    // Fake AI Step 2
    setTimeout(() => {
      setAnalysisStep('Evaluating sentiment polarity, emotional distress & priority rating...');
    }, 1000);

    // Fake AI Step 3: Complete Analysis & Save
    setTimeout(() => {
      const result = fakeAiAnalysis(title, description, category);

      const createdTicket = addGrievance({
        id: result.ticketId,
        title: title.trim(),
        description: description.trim(),
        category: result.category,
        priority: result.priority,
        sentiment: result.sentiment,
        sentimentDetail: result.sentimentDetail,
        sentimentScore: result.sentimentScore,
        confidence: result.confidence,
        reasoning: result.reasoning,
        isAnonymous,
        submittedBy: isAnonymous ? 'Anonymous Student' : (studentName.trim() || 'Student'),
        department: isAnonymous ? 'Confidential' : department,
        location: `${result.category} Division`,
        assignedDept: `${result.category} Administrative Committee`
      });

      setAiResult({
        ...result,
        createdTicket
      });
      setIsAnalyzing(false);
    }, 1700);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAiResult(null);
    setCopied(false);
  };

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI Neural Intake Engine</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Submit a Campus Grievance</h1>
        <p className="text-slate-600 text-sm mt-1">
          Our AI auto-analyzes your description to detect department, calculate urgency, and monitor resolution.
        </p>
      </div>

      {/* AI Analysis Loading Overlay / State */}
      {isAnalyzing && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-xl p-8 sm:p-12 text-center my-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse"></div>
          
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-6 shadow-inner relative">
            <Sparkles className="w-10 h-10 text-indigo-600 animate-spin" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/40 animate-ping pointer-events-none"></div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Grievance with AI...</h3>
          <p className="text-indigo-600 text-sm font-medium animate-pulse mb-6">
            {analysisStep}
          </p>

          <div className="max-w-md mx-auto bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full transition-all duration-500 animate-[pulse_1s_infinite] w-3/4"></div>
          </div>
          <p className="text-xs text-slate-600 mt-4">
            Categorizing • Estimating Severity • Generating Ticket ID
          </p>
        </div>
      )}

      {/* Post-Analysis Success Card / AI Breakdown Screen */}
      {!isAnalyzing && aiResult && (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-xl overflow-hidden mb-10 transition-all">
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-6 py-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Grievance Successfully Registered</span>
                <h3 className="text-xl font-bold">AI Triage Complete</h3>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-medium text-emerald-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{aiResult.confidence}% AI Model Confidence</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Ticket ID Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Your Cryptographic Ticket ID</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-mono tracking-tight mt-1">
                  {aiResult.ticketId}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">Keep this ID to track live updates and administration actions.</p>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(aiResult.ticketId)}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  copied 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-white text-slate-700 hover:text-indigo-600 border-slate-300 hover:border-indigo-300 shadow-sm'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Ticket ID'}</span>
              </button>
            </div>

            {/* AI Detected Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Auto Category */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
                <span className="text-xs font-medium text-indigo-600 uppercase">Auto-Detected Category</span>
                <p className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  {aiResult.category}
                </p>
                <span className="text-[11px] text-slate-600 mt-1 block">Routed to {aiResult.category} Division</span>
              </div>

              {/* Detected Sentiment */}
              <div className={`border rounded-xl p-4 ${
                aiResult.sentiment === 'Negative' 
                  ? 'bg-rose-50/60 border-rose-100 text-rose-900' 
                  : aiResult.sentiment === 'Positive' 
                    ? 'bg-emerald-50/60 border-emerald-100 text-emerald-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}>
                <span className="text-xs font-medium text-slate-600 uppercase">Sentiment Analysis</span>
                <p className="text-base font-bold mt-1 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    aiResult.sentiment === 'Negative' ? 'bg-rose-500' : aiResult.sentiment === 'Positive' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}></span>
                  {aiResult.sentiment}
                </p>
                <span className="text-[11px] text-slate-600 mt-1 block">{aiResult.sentimentDetail}</span>
              </div>

              {/* Detected Priority */}
              <div className={`border rounded-xl p-4 ${
                aiResult.priority === 'Critical'
                  ? 'bg-red-50/60 border-red-200 text-red-900'
                  : aiResult.priority === 'High'
                    ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                    : 'bg-indigo-50/60 border-indigo-100 text-indigo-900'
              }`}>
                <span className="text-xs font-medium text-slate-600 uppercase">Triage Priority</span>
                <p className="text-base font-bold mt-1 flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    aiResult.priority === 'Critical' ? 'text-red-600' : aiResult.priority === 'High' ? 'text-amber-600' : 'text-indigo-600'
                  }`} />
                  {aiResult.priority}
                </p>
                <span className="text-[11px] text-slate-600 mt-1 block">
                  {aiResult.priority === 'Critical' ? 'Immediate escalation flagged' : 'Standard resolution SLA'}
                </span>
              </div>
            </div>

            {/* AI Reasoning Explainer */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">AI Neural Engine Decision Rationale:</span>
                <p className="mt-0.5">{aiResult.reasoning}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/track?id=${aiResult.ticketId}`)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all"
              >
                <span>Track Status in Real-Time Stepper</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>Submit Another Grievance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Submission Form */}
      {!isAnalyzing && !aiResult && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Quick preset chips */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
              💡 Quick Test Scenarios (Click to auto-fill)
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleScenarios.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySample(sample)}
                  className="text-xs bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-3 py-1.5 rounded-lg transition-all"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Target Category <span className="text-slate-600 font-normal">(AI will auto-confirm or re-route)</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
            >
              <option value="Hostel">Hostel (Rooms, Plumbing, Electrical, Wardens)</option>
              <option value="Mess">Mess & Canteen (Hygiene, Food Quality, Timings)</option>
              <option value="Academics">Academics (Exams, Faculty, Marks, ERP, Schedules)</option>
              <option value="Transport">Transport (Buses, Shuttles, Drivers, Timing)</option>
              <option value="Lab">Lab & Tech (Computers, Instruments, Chemicals, AC)</option>
              <option value="Library">Library (Study Space, Wi-Fi, Book Issue)</option>
              <option value="Sanitation">Sanitation (Washrooms, Cleanliness, Drainage)</option>
              <option value="Infrastructure">Infrastructure (Roads, Streetlights, Security)</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Grievance Subject / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Broken water cooler on 2nd floor Girls Hostel 4..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Detailed Description <span className="text-rose-500">*</span></span>
              <span className="text-xs text-slate-600 font-normal">Include room/bus # and urgency</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide specific details about when it started, who is affected, and immediate hazards..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-y"
            ></textarea>
          </div>

          {/* Anonymous Toggle Switch */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                {isAnonymous ? <EyeOff className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-sm block">Submit Anonymously</span>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isAnonymous 
                    ? 'Your student ID and identity are strictly hidden from wardens and college faculty.'
                    : 'Your name will be visible to designated resolving staff for direct contact.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isAnonymous ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAnonymous ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Optional Name fields if NOT anonymous */}
          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Branch</label>
                <input
                  type="text"
                  placeholder="e.g. Electrical Engg - 3rd Year"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Analyze & Submit with AI Triage</span>
            </button>
            <p className="text-center text-xs text-slate-600 mt-2.5">
              AI will evaluate risk, tag keywords, and assign a unique tracking ticket instantly.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
