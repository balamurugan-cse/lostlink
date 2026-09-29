import React, { useState } from 'react';
import { User, Notification, UserRole } from '../types';
import { Bell, Shield, LogOut, LogIn, Menu, X, Users, Check, ChevronDown } from 'lucide-react';
import { DmiLogo } from './DmiLogo';
import { INITIAL_USERS } from '../services/storage';

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
  onLogout,
  onSwitchUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
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

          {/* Zone 2: 4–6 nav links, 1–2 word labels, single-line text */}
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

          {/* Zone 3: 1–2 primary actions + Demo Persona Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50 transition-colors cursor-pointer"
                title="Switch Demo Role (Student, Faculty, Security Admin)"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden xl:inline">Role:</span>
                <span className="text-slate-900 font-bold">
                  {currentUser ? currentUser.role : 'Guest'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 mb-1">
                    Select Active Persona
                  </div>
                  {INITIAL_USERS.map((u) => {
                    const isSelected = currentUser?._id === u._id;
                    return (
                      <button
                        key={u._id}
                        onClick={() => {
                          if (onSwitchUser) onSwitchUser(u);
                          setRoleSwitcherOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-500">{u.role} · {u.department}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
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

          {/* Quick Persona Switcher for Mobile */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Quick Role Switcher
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {INITIAL_USERS.map((u) => {
                const isSelected = currentUser?._id === u._id;
                return (
                  <button
                    key={u._id}
                    onClick={() => {
                      if (onSwitchUser) onSwitchUser(u);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-lg text-center text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="truncate font-semibold">{u.name.split(' ')[0]}</div>
                    <div className="text-[10px] opacity-80">{u.role.replace('/Staff', '')}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
