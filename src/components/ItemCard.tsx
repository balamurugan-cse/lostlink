import React from 'react';
import { Item } from '../types';
import { MapPin, Calendar, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  onCheckMatches?: (item: Item) => void;
  onClaim?: (item: Item) => void;
  isOwner?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onSelect,
  onCheckMatches,
  onClaim,
  isOwner
}) => {
  const isLost = item.type === 'lost';

  // Status text & indicator color (paired with text for WCAG compliance)
  const getStatusDisplay = (status: Item['status']) => {
    switch (status) {
      case 'open':
        return { label: 'Active', color: 'bg-emerald-500', textClass: 'text-emerald-700' };
      case 'in_verification':
        return { label: 'In Verification', color: 'bg-amber-500', textClass: 'text-amber-700' };
      case 'claimed':
        return { label: 'Claim Submitted', color: 'bg-blue-500', textClass: 'text-blue-700' };
      case 'returned':
        return { label: 'Returned to Owner', color: 'bg-purple-500', textClass: 'text-purple-700' };
      case 'closed':
        return { label: 'Resolved / Closed', color: 'bg-slate-400', textClass: 'text-slate-600' };
    }
  };

  const status = getStatusDisplay(item.status);

  // Fallback category icon / color gradient for high-fidelity appearance
  const getCategoryTheme = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('electr')) return { bg: 'from-blue-50 to-indigo-100', border: 'border-blue-200', text: 'text-blue-700', label: 'Electronics' };
    if (c.includes('key')) return { bg: 'from-amber-50 to-yellow-100', border: 'border-amber-200', text: 'text-amber-700', label: 'Key & Security' };
    if (c.includes('card') || c.includes('id')) return { bg: 'from-emerald-50 to-teal-100', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Access ID' };
    if (c.includes('audio') || c.includes('headphone')) return { bg: 'from-violet-50 to-purple-100', border: 'border-violet-200', text: 'text-violet-700', label: 'Audio' };
    if (c.includes('bottle') || c.includes('water')) return { bg: 'from-cyan-50 to-sky-100', border: 'border-cyan-200', text: 'text-cyan-700', label: 'Container' };
    return { bg: 'from-slate-100 to-slate-200', border: 'border-slate-200', text: 'text-slate-700', label: 'Campus Item' };
  };

  const theme = getCategoryTheme(item.category);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Visual Slot with Zero-Broken-Image Policy */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              onError={(e) => {
                // Graceful fallback to styled domain container if external url fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${theme.bg} flex flex-col items-center justify-center p-6 text-center`}>
              <div className="w-12 h-12 rounded-xl bg-white/80 shadow-xs border border-white flex items-center justify-center mb-2">
                <span className={`text-base font-bold ${theme.text}`}>
                  {isLost ? '?' : '✓'}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-700">{item.category}</span>
              {item.brand && <span className="text-[11px] text-slate-500 font-medium">{item.brand}</span>}
            </div>
          )}

          {/* Type Tag (Quiet unboxed overlay with scrim) */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-semibold shadow-xs">
            <span className={isLost ? 'text-rose-600' : 'text-blue-700'}>
              {isLost ? 'LOST REPORT' : 'FOUND ITEM'}
            </span>
          </div>

          {/* Status Dot & Label */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-medium shadow-xs flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status.color}`} />
            <span className={status.textClass}>{status.label}</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5">
          {/* Metadata Line (NO PILLS: clean unboxed text with subtle typographic separators) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">{item.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{item.date}</span>
            {item.time && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono tabular-nums">{item.time}</span>
              </>
            )}
          </div>

          {/* Item Title */}
          <h3
            onClick={() => onSelect(item)}
            className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer mb-2"
          >
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>

          {/* Attributes List */}
          <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>

            {item.custodyLocation && (
              <div className="flex items-center gap-2 text-amber-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Custody: {item.custodyLocation}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          onClick={() => onSelect(item)}
          className="text-slate-700 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {onCheckMatches && item.status !== 'returned' && item.status !== 'closed' && (
            <button
              onClick={() => onCheckMatches(item)}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Calculate smart matching against reports"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Smart Match</span>
            </button>
          )}

          {!isOwner && item.status === 'open' && onClaim && (
            <button
              onClick={() => onClaim(item)}
              className="px-2.5 py-1 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
            >
              Claim
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
