import React, { useState } from 'react';
import { Search, PlusCircle, CheckCircle2, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { CampusStats } from '../types';
import { DmiLogo } from './DmiLogo';

interface HeroProps {
  stats: CampusStats;
  onSearch: (query: string) => void;
  onReportLost: () => void;
  onReportFound: () => void;
  onBrowseAll: () => void;
}

const POPULAR_TAGS = [
  'Student ID',
  'AirPods',
  'Keys',
  'Calculator',
  'Backpack',
  'Water Bottle',
  'Charger'
];

export const Hero: React.FC<HeroProps> = ({
  stats,
  onSearch,
  onReportLost,
  onReportFound,
  onBrowseAll
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    } else {
      onBrowseAll();
    }
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchInput(tag);
    onSearch(tag);
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Institutional DMI Foundations Kicker */}
          <div className="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-800 bg-purple-50/90 border border-purple-200/80 rounded-full pl-2 pr-3.5 py-1 mb-5 shadow-2xs">
            <DmiLogo size={24} />
            <span className="font-bold text-purple-950 uppercase tracking-wider text-[11px]">
              DMI Foundations · Fully Human &amp; Fully Alive · Campus Portal
            </span>
          </div>

          {/* Primary Headline with text-wrap: balance */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4 [text-wrap:balance]">
            Reconnecting misplaced items across campus with smart precision.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-7 max-w-2xl mx-auto">
            Report lost belongings, register found property, and leverage rule-based similarity matching to recover campus items securely with verified ownership claims.
          </p>

          {/* Search Entry Point Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mb-3 bg-white border-2 border-slate-200 hover:border-slate-300 focus-within:border-blue-600 rounded-xl p-1.5 shadow-sm transition-all flex items-center gap-2"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by keywords, serial number, brand, or campus location (e.g. MacBook, Library, Keys)..."
              className="w-full py-2 px-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-1"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              Search Catalog
            </button>
          </form>

          {/* Quick Category Searches (Editorial links) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 mb-8 max-w-2xl mx-auto">
            <span className="font-semibold text-slate-400 text-[11px] mr-1">Quick search:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-[11px] font-medium cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <button
              onClick={onReportLost}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-rose-400" />
              <span>Report Lost Item</span>
            </button>
            <button
              onClick={onReportFound}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Report Found Item</span>
            </button>
            <button
              onClick={onBrowseAll}
              className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore All Items</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quantitative Proof Adjacency: Campus Statistics Bar with Hover States */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 border border-slate-200/80 rounded-xl text-left">
            <button
              onClick={onBrowseAll}
              className="text-left group cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
            >
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums group-hover:text-blue-600 transition-colors">
                {stats.totalReports}
              </div>
              <div className="text-xs text-slate-500 font-medium">Total Registered Reports</div>
            </button>
            <button
              onClick={() => onSearch('lost')}
              className="text-left group cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
            >
              <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
                {stats.totalLost}
              </div>
              <div className="text-xs text-slate-500 font-medium">Active Lost Inquiries</div>
            </button>
            <button
              onClick={() => onSearch('found')}
              className="text-left group cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
            >
              <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
                {stats.returnedItems}
              </div>
              <div className="text-xs text-slate-500 font-medium">Items Returned to Owners</div>
            </button>
            <div className="p-2">
              <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
                {stats.matchSuccessRate}%
              </div>
              <div className="text-xs text-slate-500 font-medium">Recovery Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
