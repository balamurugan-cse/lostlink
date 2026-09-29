import React from 'react';
import { CampusStats, Item, Claim, Category } from '../types';
import { Shield, Layers, Users, CheckCircle2, AlertTriangle, FileText, ArrowRight, BarChart3, RotateCcw } from 'lucide-react';

interface AdminDashboardProps {
  stats: CampusStats;
  items: Item[];
  claims: Claim[];
  categories: Category[];
  onNavigateToManagement: () => void;
  onNavigateToClaims: () => void;
  onSelectItem: (item: Item) => void;
  onClearAllData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  items,
  claims,
  categories,
  onNavigateToManagement,
  onNavigateToClaims,
  onSelectItem,
  onClearAllData
}) => {
  const pendingClaims = claims.filter(c => c.status === 'pending');
  const recentReports = items.slice(0, 5);

  // Group items by category for breakdown
  const categoryCounts = categories.map(cat => {
    const count = items.filter(i => i.category.toLowerCase() === cat.name.toLowerCase()).length;
    return { name: cat.name, count };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Campus Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus LostLink Operations &amp; Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time audit overview of campus lost reports, found inventory in security custody, and claim approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToManagement}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>User &amp; Report Management</span>
          </button>
          {onClearAllData && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all campus reports, claims, and users?')) {
                  onClearAllData();
                }
              }}
              className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-slate-300 text-slate-700 hover:text-rose-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Clear all stored data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Data</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid with Tabular Numerals */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Reports</div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {stats.totalReports}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">All campus items</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Active Lost</div>
          <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums mt-1">
            {stats.totalLost}
          </div>
          <div className="text-[11px] text-rose-500/80 mt-1">Open investigations</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Found Items</div>
          <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
            {stats.totalFound}
          </div>
          <div className="text-[11px] text-blue-500/80 mt-1">In campus custody</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Pending Claims</div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums mt-1">
            {pendingClaims.length}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-1">Needs admin review</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Returned to Owner</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums mt-1">
            {stats.returnedItems}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1">Closed successfully</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Recovery Rate</div>
          <div className="text-2xl font-bold font-mono text-purple-700 tabular-nums mt-1">
            {stats.matchSuccessRate}%
          </div>
          <div className="text-[11px] text-purple-600/80 mt-1">Resolution metric</div>
        </div>
      </div>

      {/* Main Admin Section: Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Claims Queue & Recent Reports */}
        <div className="lg:col-span-8 space-y-6">
          {/* Claims Queue Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Ownership Claims Requiring Verification ({pendingClaims.length})
                </h2>
              </div>
              <button
                onClick={onNavigateToClaims}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Open Claims Center
              </button>
            </div>

            {pendingClaims.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {pendingClaims.map(claim => (
                  <div key={claim._id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{claim.itemTitle}</h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Claimed by: <span className="font-semibold text-slate-700">{claim.claimantName}</span> ({claim.claimantDepartment})
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-1 italic mt-1">
                        Evidence: &quot;{claim.evidence}&quot;
                      </div>
                    </div>
                    <button
                      onClick={onNavigateToClaims}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
                    >
                      Audit Proof
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                All ownership claims have been audited and resolved.
              </div>
            )}
          </div>

          {/* Recent Reports Stream */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Recent Campus Reports Stream</h2>
              <button
                onClick={onNavigateToManagement}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                View Full Audit Table
              </button>
            </div>

            {recentReports.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentReports.map(item => (
                  <div
                    key={item._id}
                    onClick={() => onSelectItem(item)}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{item.date}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 truncate">{item.title}</div>
                      <div className="text-xs text-slate-500 truncate">{item.location} · {item.ownerName}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold capitalize text-slate-700">
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No reports submitted yet. Newly reported lost or found items will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Category Distribution */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Distribution Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Reports by Category</h3>
            </div>

            <div className="space-y-3">
              {categoryCounts.map(cat => {
                const percentage = stats.totalReports > 0 ? Math.round((cat.count / stats.totalReports) * 100) : 0;
                return (
                  <div key={cat.name} className="text-xs">
                    <div className="flex justify-between font-medium text-slate-700 mb-1">
                      <span>{cat.name}</span>
                      <span className="font-mono text-slate-500 tabular-nums">{cat.count} items ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
