import React, { useState } from 'react';
import { User, Notification } from '../types';
import { Bell, Shield, LogOut, LogIn, Menu, X } from 'lucide-react';
import { DmiLogo } from './DmiLogo';

interface NavbarProps {
  currentUser: User | null;
  activeScreen: string;
  onNavigate: (screen: string) => void;
  notifications: Notification[];
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchUser?: (user: User) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeScreen,
  onNavigate,
  notifications,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMobileNav = (screen: string) => {
    setMobileMenuOpen(false);
    onNavigate(screen);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand title with official DMI Foundations Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleMobileNav('landing')}
              className="text-xl font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <DmiLogo size={36} />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-slate-900 tracking-tight leading-none text-base">
                  LostLink
                </span>
                <span className="text-[10px] font-bold text-purple-900 tracking-wider uppercase mt-0.5 leading-none">
                  DMI Foundations
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('landing')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer ${
                activeScreen === 'landing' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('search')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer ${
                activeScreen === 'search' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Browse Catalog
            </button>
            <button
              onClick={() => onNavigate('report_lost')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer ${
                activeScreen === 'report_lost' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Report Lost
            </button>
            <button
              onClick={() => onNavigate('report_found')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer ${
                activeScreen === 'report_found' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Report Found
            </button>
            {currentUser && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer ${
                  activeScreen === 'dashboard' ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                My Dashboard
              </button>
            )}
            <button
              onClick={() => onNavigate('admin_dashboard')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeScreen === 'admin_dashboard' || activeScreen === 'admin_management'
                  ? 'text-blue-600 font-semibold'
                  : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Zone 3: Primary actions & User authentication */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            {currentUser && (
              <button
                onClick={() => handleMobileNav('notifications')}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleMobileNav('dashboard')}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-colors cursor-pointer text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-xs leading-tight">
                    <div className="font-semibold text-slate-900 truncate max-w-[110px]">{currentUser.name}</div>
                    <div className="text-slate-500 font-mono text-[10px]">{currentUser.role}</div>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1 text-sm font-semibold">
            <button
              onClick={() => handleMobileNav('landing')}
              className={`px-3 py-2 text-left rounded-lg transition-colors cursor-pointer ${
                activeScreen === 'landing' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleMobileNav('search')}
              className={`px-3 py-2 text-left rounded-lg transition-colors cursor-pointer ${
                activeScreen === 'search' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Browse Catalog
            </button>
            <button
              onClick={() => handleMobileNav('report_lost')}
              className={`px-3 py-2 text-left rounded-lg transition-colors cursor-pointer ${
                activeScreen === 'report_lost' ? 'bg-rose-50 text-rose-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Report Lost Item
            </button>
            <button
              onClick={() => handleMobileNav('report_found')}
              className={`px-3 py-2 text-left rounded-lg transition-colors cursor-pointer ${
                activeScreen === 'report_found' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Report Found Item
            </button>
            {currentUser && (
              <button
                onClick={() => handleMobileNav('dashboard')}
                className={`px-3 py-2 text-left rounded-lg transition-colors cursor-pointer ${
                  activeScreen === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                My Dashboard
              </button>
            )}
            <button
              onClick={() => handleMobileNav('admin_dashboard')}
              className={`px-3 py-2 text-left rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeScreen === 'admin_dashboard' || activeScreen === 'admin_management'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Admin Console</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
