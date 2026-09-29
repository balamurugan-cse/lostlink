import React, { useState } from 'react';
import { Item, User } from '../types';
import { X, MapPin, Calendar, Clock, ShieldCheck, Tag, Sparkles, AlertCircle, CheckCircle, Share2, Printer, Compass } from 'lucide-react';
import { CampusMap, CAMPUS_ZONES, MapCoordinates } from './CampusMap';
import { useToast } from './Toast';

interface ItemDetailsModalProps {
  item: Item | null;
  currentUser: User | null;
  onClose: () => void;
  onClaim: (item: Item) => void;
  onCheckMatches: (item: Item) => void;
  onUpdateStatus?: (itemId: string, newStatus: Item['status']) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  currentUser,
  onClose,
  onClaim,
  onCheckMatches,
  onUpdateStatus
}) => {
  const { showToast } = useToast();
  if (!item) return null;

  const isLost = item.type === 'lost';
  const isOwner = currentUser?._id === item.ownerId;
  const isAdmin = currentUser?.role === 'Administrator';

  const handleShare = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${window.location.origin}/#item-${item._id}`);
        showToast('Item link copied to clipboard!');
      } else {
        showToast(`Item #${item._id} link ready`);
      }
    } catch {
      showToast(`Item #${item._id} ready to share`);
    }
  };

  // Derive map coordinates from item.mapCoords or approximate building zone
  const derivedPin: MapCoordinates | null = React.useMemo(() => {
    if (item.mapCoords && item.mapCoords.x > 0) return item.mapCoords;
    const match = CAMPUS_ZONES.find(z =>
      item.location.toLowerCase().includes(z.shortName.toLowerCase()) ||
      item.location.toLowerCase().includes(z.name.toLowerCase()) ||
      z.name.toLowerCase().includes(item.location.toLowerCase())
    );
    if (match) {
      return {
        x: Math.round(match.x + match.width / 2),
        y: Math.round(match.y + match.height / 2),
        zoneName: match.name
      };
    }
    return null;
  }, [item]);

  // Lifecycle steps according to Section 16 Core Workflow
  const steps = [
    { title: 'Report Filed', done: true, desc: `Created on ${item.date}` },
    { title: 'Matching Engine', done: true, desc: 'Rule-based similarities computed' },
    { title: 'Claim & Evidence', done: item.status !== 'open', desc: item.status === 'open' ? 'Awaiting verified claimant' : 'Evidence submitted' },
    { title: 'Admin Verification', done: item.status === 'returned' || item.status === 'closed', desc: item.status === 'returned' ? 'Ownership approved' : 'Security review' },
    { title: 'Returned to Owner', done: item.status === 'returned', desc: item.status === 'returned' ? 'Closed' : 'Pending resolution' }
  ];

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              isLost ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {isLost ? 'Lost Property Report' : 'Found Campus Item'}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {item._id}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              title="Copy shareable item link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Main Title & Status */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-800">
                <span className={`w-2 h-2 rounded-full ${
                  item.status === 'returned' ? 'bg-purple-600' :
                  item.status === 'open' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <span className="capitalize">{item.status.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{item.category}</span>
              <span aria-hidden="true">·</span>
              <span>{item.location}</span>
              <span aria-hidden="true">·</span>
              <span>{item.date}</span>
              {item.time && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{item.time}</span>
                </>
              )}
            </div>
          </div>

          {/* Photo Slot */}
          {item.imageUrl && (
            <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Detailed Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              {item.description}
            </p>
          </div>

          {/* Item Attributes Grid (Smart Matching Specifications) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-400 font-medium mb-0.5">Color</div>
              <div className="font-semibold text-slate-800">{item.color || 'Unspecified'}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-400 font-medium mb-0.5">Brand / Make</div>
              <div className="font-semibold text-slate-800">{item.brand || 'Unbranded / Custom'}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-400 font-medium mb-0.5">Campus Zone</div>
              <div className="font-semibold text-slate-800 truncate">{item.location}</div>
            </div>
          </div>

          {item.uniqueAttributes && (
            <div className="p-3 bg-blue-50/50 border border-blue-200/70 rounded-lg text-xs">
              <span className="font-bold text-blue-900 block mb-1">Unique Identifying Attributes:</span>
              <span className="text-blue-800">{item.uniqueAttributes}</span>
            </div>
          )}

          {/* Pinned Spatial Campus Map Location */}
          {derivedPin && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Pinned Campus Location: {derivedPin.zoneName || item.location}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Approx. Map Coords: ({derivedPin.x}, {derivedPin.y})
                </span>
              </div>
              <CampusMap
                mode="view"
                selectedPin={derivedPin}
                height={210}
                showZoneSelector={false}
              />
            </div>
          )}

          {/* Physical Custody Desk (if found item) */}
          {item.custodyLocation && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold mb-1">Campus Physical Custody Location</div>
                <div>{item.custodyLocation}</div>
                <div className="text-[11px] text-amber-700 mt-1">
                  Claimants must present authorized LostLink verification confirmation at this desk.
                </div>
              </div>
            </div>
          )}

          {/* Core Workflow Lifecycle */}
          <div className="border-t border-slate-200 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Item Recovery Lifecycle
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {steps.map((st, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border text-xs ${
                    st.done
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1 mb-1">
                    {st.done ? '✓ ' : '○ '}
                    <span>{st.title}</span>
                  </div>
                  <div className="text-[10px] leading-tight opacity-80">{st.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reporter Information */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-800">Reported By: </span>
              <span>{item.ownerName} ({item.ownerRole})</span>
              <span className="text-slate-400 font-mono block sm:inline sm:ml-2">· {item.ownerEmail}</span>
            </div>
            <button
              onClick={handlePrintSlip}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium cursor-pointer"
              title="Print security verification slip"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>
          </div>

          {/* Admin Status Controls */}
          {isAdmin && onUpdateStatus && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-2">
              <div className="font-bold text-purple-900">Administrator State Override</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onUpdateStatus(item._id, 'open')}
                  className="px-2.5 py-1 bg-white border border-purple-200 rounded font-semibold text-purple-800 hover:bg-purple-100 cursor-pointer"
                >
                  Set Open
                </button>
                <button
                  onClick={() => onUpdateStatus(item._id, 'in_verification')}
                  className="px-2.5 py-1 bg-white border border-purple-200 rounded font-semibold text-purple-800 hover:bg-purple-100 cursor-pointer"
                >
                  Set Under Verification
                </button>
                <button
                  onClick={() => onUpdateStatus(item._id, 'returned')}
                  className="px-2.5 py-1 bg-purple-700 rounded font-semibold text-white hover:bg-purple-800 cursor-pointer"
                >
                  Mark as Returned to Owner
                </button>
                <button
                  onClick={() => onUpdateStatus(item._id, 'closed')}
                  className="px-2.5 py-1 bg-slate-600 rounded font-semibold text-white hover:bg-slate-700 cursor-pointer"
                >
                  Close Archive
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onCheckMatches(item);
            }}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Check Smart Matches</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg transition-colors cursor-pointer bg-white"
            >
              Close
            </button>

            {!isOwner && item.status === 'open' && (
              <button
                onClick={() => {
                  onClose();
                  onClaim(item);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Submit Ownership Claim
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
