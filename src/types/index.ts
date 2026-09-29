export type UserRole = 'Student' | 'Faculty/Staff' | 'Administrator';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentId?: string;
  createdAt: string;
}

export type ItemType = 'lost' | 'found';
export type ItemStatus = 'open' | 'claimed' | 'in_verification' | 'returned' | 'closed';

export interface Item {
  _id: string;
  type: ItemType;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string; // YYYY-MM-DD
  time?: string;
  imageUrl?: string;
  status: ItemStatus;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerRole: UserRole;
  color?: string;
  brand?: string;
  uniqueAttributes?: string;
  custodyLocation?: string; // For found items: e.g. "Security Desk", "Library Helpdesk"
  contactPreference?: string;
  mapCoords?: { x: number; y: number; zoneName?: string };
  createdAt: string;
}

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface Claim {
  _id: string;
  itemId: string;
  itemTitle: string;
  itemType: ItemType;
  claimantId: string;
  claimantName: string;
  claimantEmail: string;
  claimantDepartment: string;
  evidence: string;
  evidenceImageUrl?: string;
  contactNumber: string;
  status: ClaimStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  adminRemarks?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  linkScreen?: string;
  relatedItemId?: string;
  type?: 'match' | 'claim' | 'status_change' | 'system';
}

export interface MatchScoreBreakdown {
  categoryScore: number;     // max 30%
  keywordScore: number;      // max 30%
  locationScore: number;     // max 20%
  dateScore: number;         // max 10%
  attributeScore: number;    // max 10%
}

export interface MatchResult {
  _id: string;
  lostItemId: string;
  foundItemId: string;
  score: number;             // 0 - 100
  reason: string;
  breakdown: MatchScoreBreakdown;
  createdAt: string;
  counterpartItem: Item;
}

export interface Category {
  _id: string;
  name: string;
  active: boolean;
  itemCount?: number;
}

export interface CampusStats {
  totalReports: number;
  totalLost: number;
  totalFound: number;
  openReports: number;
  claimedReports: number;
  returnedItems: number;
  activeClaims: number;
  matchSuccessRate: number;
}
