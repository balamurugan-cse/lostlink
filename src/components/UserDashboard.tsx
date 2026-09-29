import React, { useState } from 'react';
import { User, Item, Claim, Notification } from '../types';
import { ItemCard } from './ItemCard';
import { UserCircle, PlusCircle, CheckCircle2, ShieldCheck, Bell, Clock, ArrowRight } from 'lucide-react';

interface UserDashboardProps {
  currentUser: User;
  items: Item[];
  claims: Claim[];
  notifications: Notification[];
  onSelectItem: (item: Item) => void;
  onCheckMatches: (item: Item) => void;
  onReportLost: () => void;
  onReportFound: () => void;
  onBrowseItems: () => void;
  onOpenNotifications: () => void;
  onOpenClaims: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  items,
  claims,
  notifications,
  onSelectItem,
  onCheckMatches,
  onReportLost,
  onReportFound,
  onBrowseItems,
  onOpenNotifications,
  onOpenClaims
}) => {
  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'claims'>('lost');

  // Filter items reported by this user
  const userLostItems = items.filter(i => i.ownerId === currentUser._id && i.type === 'lost');
  const userFoundItems = items.filter(i => i.ownerId === currentUser._id && i.type === 'found');
  const userClaims = claims.filter(c => c.claimantId === currentUser._id);
  const unreadNotifs = notifications.filter(n => !n.read && n.userId === currentUser._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student/Staff Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser.department} {currentUser.studentId && `· Student ID: ${currentUser.studentId}`}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        {/* Quick Report CTAs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onReportLost}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Report Lost</span>
          </button>
          <button
            onClick={onReportFound}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Report Found</span>
          </button>
          <button
            onClick={onBrowseItems}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Browse Catalog
          </button>
        </div>
      </div>

      {/* Unread Notifications Banner (Adjacency Rule) */}
      {unreadNotifs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-xs text-blue-900">
              You have <strong className="font-mono tabular-nums">{unreadNotifs.length}</strong> new notifications regarding smart matches or claim reviews.
            </div>
          </div>
          <button
            onClick={onOpenNotifications}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer"
          >
            View Alerts
          </button>
        </div>
      )}

      {/* Dashboard Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('lost')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'lost' ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-xs' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-xs text-slate-500 font-medium">My Lost Reports</div>
          <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums mt-1">
            {userLostItems.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active items registered</div>
        </div>

        <div
          onClick={() => setActiveTab('found')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'found' ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-xs' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-xs text-slate-500 font-medium">Items I Turned In</div>
          <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
            {userFoundItems.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Reported found for fellow students</div>
        </div>

        <div
          onClick={() => setActiveTab('claims')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'claims' ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-xs' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-xs text-slate-500 font-medium">My Claims Submitted</div>
          <div className="text-2xl font-bold font-mono text-purple-700 tabular-nums mt-1">
            {userClaims.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Ownership verification requests</div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="space-y-4">
        {/* Interactive Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'lost' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            My Lost Reports ({userLostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'found' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            My Found Items ({userFoundItems.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'claims' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            My Submitted Claims ({userClaims.length})
          </button>
        </div>

        {/* Tab 1: My Lost Reports */}
        {activeTab === 'lost' && (
          <div>
            {userLostItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userLostItems.map(item => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onSelect={onSelectItem}
                    onCheckMatches={onCheckMatches}
                    isOwner={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                <p className="text-xs text-slate-500 mb-4">You have not reported any lost belongings.</p>
                <button
                  onClick={onReportLost}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Report a Lost Item
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Found Items */}
        {activeTab === 'found' && (
          <div>
            {userFoundItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userFoundItems.map(item => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onSelect={onSelectItem}
                    onCheckMatches={onCheckMatches}
                    isOwner={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                <p className="text-xs text-slate-500 mb-4">You have not turned in any found items.</p>
                <button
                  onClick={onReportFound}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Report a Found Item
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Claims */}
        {activeTab === 'claims' && (
          <div>
            {userClaims.length > 0 ? (
              <div className="space-y-3">
                {userClaims.map(claim => (
                  <div
                    key={claim._id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          claim.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {claim.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Filed {new Date(claim.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{claim.itemTitle}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                        Proof: &quot;{claim.evidence}&quot;
                      </p>
                      {claim.adminRemarks && (
                        <div className="text-xs text-blue-700 mt-2 bg-blue-50 p-2 rounded border border-blue-100">
                          <strong>Admin Feedback: </strong>{claim.adminRemarks}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={onOpenClaims}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg self-start sm:self-auto cursor-pointer"
                    >
                      View Status
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                <p className="text-xs text-slate-500 mb-4">You have not submitted any ownership claims.</p>
                <button
                  onClick={onBrowseItems}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Browse Campus Catalog
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
