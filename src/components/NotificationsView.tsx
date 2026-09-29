import React from 'react';
import { Notification, User } from '../types';
import { Bell, CheckCheck, Sparkles, Shield, Clock, ArrowRight, Check } from 'lucide-react';

interface NotificationsViewProps {
  notifications: Notification[];
  currentUser: User | null;
  onMarkRead: (id: string) => void;
  onMarkAllRead: (userId: string) => void;
  onNavigateToScreen: (screen: string, itemId?: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  currentUser,
  onMarkRead,
  onMarkAllRead,
  onNavigateToScreen
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <span>Campus Notification Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time alerts for smart match suggestions, claim verification updates, and status changes.
          </p>
        </div>

        {unreadCount > 0 && currentUser && (
          <button
            onClick={() => onMarkAllRead(currentUser._id)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => {
            return (
              <div
                key={notif._id}
                className={`bg-white border rounded-xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.read
                    ? 'border-blue-300 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    notif.type === 'match'
                      ? 'bg-blue-100 text-blue-700'
                      : notif.type === 'claim'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {notif.type === 'match' ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{notif.message}</p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(notif.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => onMarkRead(notif._id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  {notif.linkScreen && (
                    <button
                      onClick={() => onNavigateToScreen(notif.linkScreen!, notif.relatedItemId)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No notifications right now</h3>
          <p className="text-xs text-slate-500">
            You will receive instant campus alerts when smart matches are identified or when claims are reviewed.
          </p>
        </div>
      )}
    </div>
  );
};
