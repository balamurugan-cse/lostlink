import React, { useState, useMemo } from 'react';
import { Item, MatchResult, User } from '../types';
import { findMatchesForItem } from '../services/matchingEngine';
import { Sparkles, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface PossibleMatchesViewProps {
  targetItem: Item;
  allItems: Item[];
  currentUser: User | null;
  onBack: () => void;
  onSelectItem: (item: Item) => void;
  onClaimItem: (item: Item) => void;
  onSelectNewTarget: (item: Item) => void;
}

export const PossibleMatchesView: React.FC<PossibleMatchesViewProps> = ({
  targetItem,
  allItems,
  currentUser,
  onBack,
  onSelectItem,
  onClaimItem,
  onSelectNewTarget
}) => {
  const isLost = targetItem.type === 'lost';

  // Compute matches using Section 17 engine
  const matches: MatchResult[] = useMemo(() => {
    return findMatchesForItem(targetItem, allItems);
  }, [targetItem, allItems]);

  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(
    matches.length > 0 ? matches[0] : null
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Target Item Selector Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Matching against:</span>
          <select
            value={targetItem._id}
            onChange={(e) => {
              const found = allItems.find(i => i._id === e.target.value);
              if (found) onSelectNewTarget(found);
            }}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-blue-600 text-xs"
          >
            {allItems.map(it => (
              <option key={it._id} value={it._id}>
                [{it.type.toUpperCase()}] {it.title.substring(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Item Reference Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
              isLost ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-bold uppercase tracking-wider text-slate-700">
                  Target {isLost ? 'Lost Item' : 'Found Item'}
                </span>
                <span>·</span>
                <span>{targetItem.category}</span>
                <span>·</span>
                <span>{targetItem.location}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">{targetItem.title}</h2>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{targetItem.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-mono">Date Reported</div>
              <div className="text-xs font-semibold text-slate-800 font-mono">{targetItem.date}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 17 Specifications Banner */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div>
          <div className="font-bold text-blue-950 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Rule-Based Smart Matching Engine</span>
          </div>
          <div className="text-blue-800 leading-relaxed">
            Multi-attribute similarity score: Category Match (30%) + Keyword &amp; Description (30%) + Campus Location (20%) + Date Proximity (10%) + Brand/Attributes (10%).
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-blue-900 bg-white/80 px-3 py-2 rounded-lg border border-blue-200">
          <span>Formula: 30 + 30 + 20 + 10 + 10 = 100%</span>
        </div>
      </div>

      {/* Matches Results Section */}
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Matches List Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-2">
              <span>{matches.length} Potential Counterpart Matches Found</span>
              <span>Sorted by Highest Compatibility Score</span>
            </div>

            {matches.map((m) => {
              const cp = m.counterpartItem;
              const isSelected = selectedMatch?._id === m._id;

              return (
                <div
                  key={m._id}
                  onClick={() => setSelectedMatch(m)}
                  className={`bg-white border rounded-xl p-5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {/* Match Score Badge */}
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono tabular-nums ${
                        m.score >= 70
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : m.score >= 45
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.score}% Match
                      </div>

                      <span className="text-xs text-slate-500">
                        {cp.type === 'found' ? 'Found Report' : 'Lost Report'}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-mono">{cp.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{cp.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{cp.description}</p>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mb-3">
                    <span className="font-semibold text-slate-700">{cp.category}</span>
                    <span>·</span>
                    <span>{cp.location}</span>
                    {cp.custodyLocation && (
                      <>
                        <span>·</span>
                        <span className="text-amber-800 font-medium">Custody: {cp.custodyLocation}</span>
                      </>
                    )}
                  </div>

                  {/* Similarity Reason Summary */}
                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{m.reason}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Match Inspection Breakdown Column */}
          <div className="lg:col-span-5">
            {selectedMatch ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs sticky top-24 space-y-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Similarity Score Breakdown
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      Overall Match: <span className="text-blue-600 font-mono">{selectedMatch.score}%</span>
                    </h3>
                    <div className="text-xs text-slate-500 font-medium">
                      {selectedMatch.score >= 70 ? 'High Confidence' : 'Moderate Alignment'}
                    </div>
                  </div>
                </div>

                {/* Score Factor Bars (Section 17 weights) */}
                <div className="space-y-3.5 text-xs">
                  {/* Factor 1: Category */}
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Category Match (Max 30%)</span>
                      <span className="font-mono">{selectedMatch.breakdown.categoryScore} / 30%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(selectedMatch.breakdown.categoryScore / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 2: Keywords */}
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Keyword &amp; Description (Max 30%)</span>
                      <span className="font-mono">{selectedMatch.breakdown.keywordScore} / 30%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(selectedMatch.breakdown.keywordScore / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 3: Location */}
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Location Proximity (Max 20%)</span>
                      <span className="font-mono">{selectedMatch.breakdown.locationScore} / 20%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(selectedMatch.breakdown.locationScore / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 4: Date */}
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Date / Time Proximity (Max 10%)</span>
                      <span className="font-mono">{selectedMatch.breakdown.dateScore} / 10%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(selectedMatch.breakdown.dateScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 5: Unique Attributes & Brand */}
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Brand / Color / Attributes (Max 10%)</span>
                      <span className="font-mono">{selectedMatch.breakdown.attributeScore} / 10%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(selectedMatch.breakdown.attributeScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Counterpart Card Actions */}
                <div className="border-t border-slate-100 pt-5 space-y-2">
                  <button
                    onClick={() => onSelectItem(selectedMatch.counterpartItem)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect Full Counterpart Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onClaimItem(selectedMatch.counterpartItem)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>File Ownership Claim for This Item</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No automatic matches detected yet</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            The smart matching engine did not detect any counterpart reports meeting the threshold for category, keywords, and campus location. New reports are indexed continuously.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Return to Item Catalog
          </button>
        </div>
      )}
    </div>
  );
};
