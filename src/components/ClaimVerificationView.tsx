import React, { useState } from 'react';
import { Claim, Item, User } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertCircle, ArrowLeft, Upload, FileText, UserCheck } from 'lucide-react';

interface ClaimVerificationViewProps {
  claims: Claim[];
  items: Item[];
  currentUser: User | null;
  claimingItem: Item | null;
  onBack: () => void;
  onSubmitClaim: (claimData: Omit<Claim, '_id' | 'createdAt' | 'status'>) => void;
  onReviewClaim: (claimId: string, status: 'approved' | 'rejected', adminRemarks?: string) => void;
  onSelectItem: (item: Item) => void;
}

export const ClaimVerificationView: React.FC<ClaimVerificationViewProps> = ({
  claims,
  items,
  currentUser,
  claimingItem,
  onBack,
  onSubmitClaim,
  onReviewClaim,
  onSelectItem
}) => {
  const isAdmin = currentUser?.role === 'Administrator' || currentUser?.role === 'Faculty/Staff';

  // State for submitting a new claim
  const [evidence, setEvidence] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [evidenceImageUrl, setEvidenceImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // State for reviewing claims
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(claims[0] || null);
  const [adminRemarks, setAdminRemarks] = useState('');

  // Handle new claim submission
  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingItem || !currentUser) return;
    if (!evidence.trim() || !contactNumber.trim()) return;

    setIsSubmitting(true);
    onSubmitClaim({
      itemId: claimingItem._id,
      itemTitle: claimingItem.title,
      itemType: claimingItem.type,
      claimantId: currentUser._id,
      claimantName: currentUser.name,
      claimantEmail: currentUser.email,
      claimantDepartment: currentUser.department,
      evidence: evidence.trim(),
      evidenceImageUrl: evidenceImageUrl || undefined,
      contactNumber: contactNumber.trim()
    });

    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  const filteredClaims = claims.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-xs text-slate-500 font-medium">
          Logged in as: <strong className="text-slate-900">{currentUser?.name}</strong> ({currentUser?.role})
        </div>
      </div>

      {/* Mode A: Filing a claim for a specific item */}
      {claimingItem && !submitSuccess && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs mb-10">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Ownership Verification Protocol
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Submit Ownership Claim
            </h2>
          </div>

          {/* Item Reference */}
          <div className="p-6 bg-blue-50/40 border-b border-slate-200">
            <div className="text-xs text-blue-900 font-semibold mb-1">Claiming Item:</div>
            <div className="text-base font-bold text-slate-900">{claimingItem.title}</div>
            <div className="text-xs text-slate-500 mt-1">
              Category: {claimingItem.category} · Found Location: {claimingItem.location} · Date: {claimingItem.date}
            </div>
            {claimingItem.custodyLocation && (
              <div className="text-xs font-semibold text-amber-800 mt-2">
                Physical Custody Desk: {claimingItem.custodyLocation}
              </div>
            )}
          </div>

          <form onSubmit={handleClaimSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ownership Proof &amp; Distinctive Evidence *
              </label>
              <textarea
                required
                rows={4}
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Provide indisputable proof of ownership: e.g., device passcode/lock screen wallpaper, student ID number, receipt or serial number, precise scratches, items inside compartments..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Campus security and administrators inspect this evidence before releasing items from custody.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Submit Claim for Verification
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success banner if claim just submitted */}
      {submitSuccess && (
        <div className="max-w-2xl mx-auto bg-white border border-emerald-200 rounded-xl p-8 text-center mb-8 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Claim Filed Successfully</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your ownership proof has been queued for verification. Campus security and administrators have received your evidence.
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Return to Item Catalog
          </button>
        </div>
      )}

      {/* Mode B: Claims Review Management (All Claims / Admin & User Queue) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <span>Campus Ownership Verification Queue</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review submitted ownership evidence, verify student claims, and mark items returned.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({claims.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Pending ({claims.filter(c => c.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'approved' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Approved ({claims.filter(c => c.status === 'approved').length})
            </button>
          </div>
        </div>

        {filteredClaims.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Claims List Column */}
            <div className="lg:col-span-6 space-y-3">
              {filteredClaims.map((claim) => {
                const isSelected = selectedClaim?._id === claim._id;
                return (
                  <div
                    key={claim._id}
                    onClick={() => setSelectedClaim(claim)}
                    className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        claim.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : claim.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {claim.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">{claim.itemTitle}</h3>
                    <div className="text-xs text-slate-500 mb-2">
                      Claimant: <strong className="text-slate-700">{claim.claimantName}</strong> ({claim.claimantDepartment})
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded border border-slate-100">
                      &quot;{claim.evidence}&quot;
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Selected Claim Review Column */}
            <div className="lg:col-span-6">
              {selectedClaim ? (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs sticky top-24 space-y-5">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Claim Inspection &amp; Audit
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedClaim.itemTitle}</h2>
                    <div className="text-xs text-slate-500 mt-1 font-mono">
                      Claim Ref: {selectedClaim._id}
                    </div>
                  </div>

                  {/* Claimant Details */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div>
                      <span className="text-slate-500">Claimant: </span>
                      <strong className="text-slate-800">{selectedClaim.claimantName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Department: </span>
                      <span className="text-slate-700">{selectedClaim.claimantDepartment}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Contact Email: </span>
                      <span className="text-slate-700 font-mono">{selectedClaim.claimantEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Phone: </span>
                      <span className="text-slate-700 font-mono">{selectedClaim.contactNumber}</span>
                    </div>
                  </div>

                  {/* Submitted Evidence */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Submitted Ownership Evidence
                    </h4>
                    <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                      {selectedClaim.evidence}
                    </div>
                  </div>

                  {/* Admin Remarks Input or History */}
                  {selectedClaim.status === 'pending' ? (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Verification Remarks / Audit Notes
                      </label>
                      <input
                        type="text"
                        value={adminRemarks}
                        onChange={(e) => setAdminRemarks(e.target.value)}
                        placeholder="e.g. Identity confirmed via physical student card; serial number matched."
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                      />

                      {/* Action Buttons for Administrator */}
                      <div className="pt-4 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            onReviewClaim(selectedClaim._id, 'rejected', adminRemarks || 'Evidence did not match item attributes.');
                            setAdminRemarks('');
                          }}
                          className="px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Decline Claim
                        </button>
                        <button
                          onClick={() => {
                            onReviewClaim(selectedClaim._id, 'approved', adminRemarks || 'Verified with physical student ID and ownership markers.');
                            setAdminRemarks('');
                          }}
                          className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Claim &amp; Mark Returned</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-800">
                        Resolution Status: <span className="capitalize">{selectedClaim.status}</span>
                      </div>
                      {selectedClaim.reviewedBy && (
                        <div className="text-slate-600">
                          Reviewed by: <strong>{selectedClaim.reviewedBy}</strong>
                        </div>
                      )}
                      {selectedClaim.adminRemarks && (
                        <div className="text-slate-600">
                          Audit Remarks: &quot;{selectedClaim.adminRemarks}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No claims in this category</h3>
            <p className="text-xs text-slate-500">
              When students submit ownership proofs, they will appear here for security verification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
