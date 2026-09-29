/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService, INITIAL_USERS } from './services/storage';
import { User, Item, Claim, Notification, Category, CampusStats } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ItemCard } from './components/ItemCard';
import { SearchFilterPage } from './components/SearchFilterPage';
import { ReportForm } from './components/ReportForm';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { PossibleMatchesView } from './components/PossibleMatchesView';
import { ClaimVerificationView } from './components/ClaimVerificationView';
import { NotificationsView } from './components/NotificationsView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminManagementView } from './components/AdminManagementView';
import { UserDashboard } from './components/UserDashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ToastProvider, useToast } from './components/Toast';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Search, PlusCircle } from 'lucide-react';

export default function App() {
  return (
    <ToastProvider>
      <LostLinkAppContent />
    </ToastProvider>
  );
}

function LostLinkAppContent() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<string>('landing');
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CampusStats>({
    totalReports: 0,
    totalLost: 0,
    totalFound: 0,
    openReports: 0,
    claimedReports: 0,
    returnedItems: 0,
    activeClaims: 0,
    matchSuccessRate: 72
  });

  // Modal and navigation states
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [matchingTargetItem, setMatchingTargetItem] = useState<Item | null>(null);
  const [claimingTargetItem, setClaimingTargetItem] = useState<Item | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');

  // Load state from StorageService
  const refreshData = () => {
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    setItems(StorageService.getItems());
    setClaims(StorageService.getClaims());
    setNotifications(StorageService.getNotifications(user?._id));
    setCategories(StorageService.getCategories());
    setStats(StorageService.getCampusStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    StorageService.logoutUser();
    setCurrentUser(null);
    refreshData();
    showToast('Signed out of LostLink', 'info');
    handleNavigate('landing');
  };

  const handleSwitchUser = (user: User) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    refreshData();
    showToast(`Active persona: ${user.name} (${user.role})`, 'info');
  };

  // Navigation router
  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search trigger from Hero
  const handleHeroSearch = (query: string) => {
    setSearchInitialQuery(query);
    setActiveScreen('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Smart Matches for an item (Screen 8)
  const handleOpenSmartMatches = (item: Item) => {
    setMatchingTargetItem(item);
    setActiveScreen('matches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Claim Form for an item (Screen 9)
  const handleOpenClaim = (item: Item) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setClaimingTargetItem(item);
    setActiveScreen('claims');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit new report (Screen 4 & 5)
  const handleReportSubmit = (itemData: Omit<Item, '_id' | 'createdAt' | 'status'>) => {
    const newItem = StorageService.createItem(itemData);
    refreshData();
    showToast(`Report filed for "${newItem.title}"! Calculating smart matches...`, 'success');
    // Prompt smart matching if counterpart exists
    handleOpenSmartMatches(newItem);
  };

  // Submit claim (Screen 9)
  const handleSubmitClaim = (claimData: Omit<Claim, '_id' | 'createdAt' | 'status'>) => {
    StorageService.submitClaim(claimData);
    refreshData();
    showToast('Ownership claim submitted for administrative verification!', 'success');
  };

  // Review claim (Screen 9 & 11)
  const handleReviewClaim = (claimId: string, status: 'approved' | 'rejected', adminRemarks?: string) => {
    const reviewer = currentUser?.name || 'Campus Administrator';
    StorageService.reviewClaim(claimId, status, reviewer, adminRemarks);
    refreshData();
    showToast(
      `Claim marked as ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      status === 'approved' ? 'success' : 'info'
    );
  };

  // Update item status directly (Screen 7 & 12)
  const handleUpdateItemStatus = (itemId: string, newStatus: Item['status']) => {
    StorageService.updateItem(itemId, { status: newStatus });
    refreshData();
    showToast(`Status updated to ${newStatus.replace('_', ' ')}`, 'info');
  };

  // Delete item (Screen 12)
  const handleDeleteItem = (itemId: string) => {
    StorageService.deleteItem(itemId);
    refreshData();
    showToast('Item report removed from catalog', 'info');
  };

  // Add category (Screen 12)
  const handleAddCategory = (name: string) => {
    StorageService.addCategory(name);
    refreshData();
    showToast(`Category "${name}" added`, 'success');
  };

  // Toggle category (Screen 12)
  const handleToggleCategory = (catId: string) => {
    StorageService.toggleCategory(catId);
    refreshData();
  };

  // Clear database data
  const handleClearAllData = () => {
    StorageService.clearAllData();
    refreshData();
    showToast('All data reset to initial campus state', 'info');
    setActiveScreen('landing');
  };

  // Notifications actions
  const handleMarkNotificationRead = (notifId: string) => {
    StorageService.markNotificationRead(notifId);
    if (currentUser) {
      setNotifications(StorageService.getNotifications(currentUser._id));
    }
  };

  const handleMarkAllNotificationsRead = (userId: string) => {
    StorageService.markAllNotificationsRead(userId);
    setNotifications(StorageService.getNotifications(userId));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Strict 3-Zone Top Bar Contract with Mobile Navigation & Role Switcher */}
      <Navbar
        currentUser={currentUser}
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        notifications={notifications}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* SCREEN 1: LANDING / HOME PAGE */}
        {activeScreen === 'landing' && (
          <div>
            <Hero
              stats={stats}
              onSearch={handleHeroSearch}
              onReportLost={() => handleNavigate('report_lost')}
              onReportFound={() => handleNavigate('report_found')}
              onBrowseAll={() => {
                setSearchInitialQuery('');
                handleNavigate('search');
              }}
            />

            {/* Featured Recent Campus Items */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Recent Campus Reports
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Misplaced belongings and found property awaiting claim verification.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSearchInitialQuery('');
                    handleNavigate('search');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <span>Explore Full Catalog ({items.length} items)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.slice(0, 6).map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onSelect={(it) => setSelectedItem(it)}
                    onCheckMatches={handleOpenSmartMatches}
                    onClaim={handleOpenClaim}
                    isOwner={currentUser?._id === item.ownerId}
                  />
                ))}
              </div>
            </div>

            {/* How LostLink Works */}
            <div className="bg-white border-y border-slate-200 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Campus Recovery Workflow
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
                    Campus Lost &amp; Found Workflow
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Designed for students, faculty, and campus security administrators with end-to-end status tracking and automated recovery.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs mb-4">
                      01
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">Item Registration</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Students report lost items or turn in found property with photos and details verified securely.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs mb-4">
                      02
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">Smart Matching</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Automated rule-based engine cross-references category, keywords, campus zones, and date proximity automatically.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs mb-4">
                      03
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">Evidence Claim</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Claimants file indisputable ownership evidence (serial number, lockscreen pattern, unique scratches) for review.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs mb-4">
                      04
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">Admin Release</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Campus security verifies proof at physical custody desks, approves claim, and marks report as returned to owner.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 6: SEARCH AND FILTER PAGE */}
        {activeScreen === 'search' && (
          <SearchFilterPage
            items={items}
            categories={categories}
            currentUser={currentUser}
            initialQuery={searchInitialQuery}
            onSelectItem={(it) => setSelectedItem(it)}
            onCheckMatches={handleOpenSmartMatches}
            onClaimItem={handleOpenClaim}
            onReportLost={() => handleNavigate('report_lost')}
            onReportFound={() => handleNavigate('report_found')}
          />
        )}

        {/* SCREEN 4: REPORT LOST ITEM FORM */}
        {activeScreen === 'report_lost' && (
          <ReportForm
            type="lost"
            currentUser={currentUser}
            categories={categories}
            onSubmit={handleReportSubmit}
            onCancel={() => handleNavigate('landing')}
            onRequireAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* SCREEN 5: REPORT FOUND ITEM FORM */}
        {activeScreen === 'report_found' && (
          <ReportForm
            type="found"
            currentUser={currentUser}
            categories={categories}
            onSubmit={handleReportSubmit}
            onCancel={() => handleNavigate('landing')}
            onRequireAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* SCREEN 3: STUDENT DASHBOARD */}
        {activeScreen === 'dashboard' && currentUser && (
          <UserDashboard
            currentUser={currentUser}
            items={items}
            claims={claims}
            notifications={notifications}
            onSelectItem={(it) => setSelectedItem(it)}
            onCheckMatches={handleOpenSmartMatches}
            onReportLost={() => handleNavigate('report_lost')}
            onReportFound={() => handleNavigate('report_found')}
            onBrowseItems={() => handleNavigate('search')}
            onOpenNotifications={() => handleNavigate('notifications')}
            onOpenClaims={() => handleNavigate('claims')}
          />
        )}

        {/* SCREEN 8: POSSIBLE MATCHES PAGE */}
        {activeScreen === 'matches' && matchingTargetItem && (
          <PossibleMatchesView
            targetItem={matchingTargetItem}
            allItems={items}
            currentUser={currentUser}
            onBack={() => handleNavigate('search')}
            onSelectItem={(it) => setSelectedItem(it)}
            onClaimItem={handleOpenClaim}
            onSelectNewTarget={(it) => setMatchingTargetItem(it)}
          />
        )}

        {/* SCREEN 9: CLAIM VERIFICATION PAGE */}
        {activeScreen === 'claims' && (
          <ClaimVerificationView
            claims={claims}
            items={items}
            currentUser={currentUser}
            claimingItem={claimingTargetItem}
            onBack={() => {
              setClaimingTargetItem(null);
              handleNavigate('search');
            }}
            onSubmitClaim={handleSubmitClaim}
            onReviewClaim={handleReviewClaim}
            onSelectItem={(it) => setSelectedItem(it)}
          />
        )}

        {/* SCREEN 10: NOTIFICATIONS PAGE */}
        {activeScreen === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            currentUser={currentUser}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onNavigateToScreen={(screen, itemId) => {
              if (itemId) {
                const foundItem = StorageService.getItemById(itemId);
                if (foundItem) {
                  setSelectedItem(foundItem);
                }
              }
              handleNavigate(screen);
            }}
          />
        )}

        {/* SCREEN 11: ADMIN DASHBOARD */}
        {activeScreen === 'admin_dashboard' && (
          <AdminDashboard
            stats={stats}
            items={items}
            claims={claims}
            categories={categories}
            onNavigateToManagement={() => handleNavigate('admin_management')}
            onNavigateToClaims={() => handleNavigate('claims')}
            onSelectItem={(it) => setSelectedItem(it)}
            onClearAllData={handleClearAllData}
          />
        )}

        {/* SCREEN 12: USER/REPORT MANAGEMENT PAGE */}
        {activeScreen === 'admin_management' && (
          <AdminManagementView
            items={items}
            users={StorageService.getUsers()}
            categories={categories}
            onBack={() => handleNavigate('admin_dashboard')}
            onSelectItem={(it) => setSelectedItem(it)}
            onUpdateItemStatus={handleUpdateItemStatus}
            onDeleteItem={handleDeleteItem}
            onAddCategory={handleAddCategory}
            onToggleCategory={handleToggleCategory}
          />
        )}
      </main>

      {/* SCREEN 7: ITEM DETAILS MODAL */}
      <ItemDetailsModal
        item={selectedItem}
        currentUser={currentUser}
        onClose={() => setSelectedItem(null)}
        onClaim={handleOpenClaim}
        onCheckMatches={handleOpenSmartMatches}
        onUpdateStatus={handleUpdateItemStatus}
      />

      {/* SCREEN 2: LOGIN / REGISTER MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          refreshData();
          showToast(`Welcome back, ${user.name}!`, 'success');
        }}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
