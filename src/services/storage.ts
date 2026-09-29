import { User, Item, Claim, Notification, Category, CampusStats } from '../types';

const USERS_STORAGE_KEY = 'lostlink_users_v3';
const ITEMS_STORAGE_KEY = 'lostlink_items_v3';
const CLAIMS_STORAGE_KEY = 'lostlink_claims_v3';
const NOTIFICATIONS_STORAGE_KEY = 'lostlink_notifications_v3';
const CATEGORIES_STORAGE_KEY = 'lostlink_categories_v3';
const CURRENT_USER_KEY = 'lostlink_current_user_v3';

// Clean out any legacy storage keys
try {
  localStorage.removeItem('lostlink_users_v1');
  localStorage.removeItem('lostlink_items_v1');
  localStorage.removeItem('lostlink_claims_v1');
  localStorage.removeItem('lostlink_notifications_v1');
  localStorage.removeItem('lostlink_categories_v1');
  localStorage.removeItem('lostlink_current_user_v1');
  localStorage.removeItem('lostlink_users_v2');
  localStorage.removeItem('lostlink_items_v2');
  localStorage.removeItem('lostlink_claims_v2');
  localStorage.removeItem('lostlink_notifications_v2');
  localStorage.removeItem('lostlink_categories_v2');
  localStorage.removeItem('lostlink_current_user_v2');
} catch {
  // Ignore in restricted environments
}

export const INITIAL_USERS: User[] = [];

export const INITIAL_CATEGORIES: Category[] = [
  { _id: 'cat_1', name: 'Electronics', active: true },
  { _id: 'cat_2', name: 'IDs & Access Cards', active: true },
  { _id: 'cat_3', name: 'Keys & Keychains', active: true },
  { _id: 'cat_4', name: 'Books & Stationery', active: true },
  { _id: 'cat_5', name: 'Bags & Backpacks', active: true },
  { _id: 'cat_6', name: 'Audio & Wearables', active: true },
  { _id: 'cat_7', name: 'Wallets & Purses', active: true },
  { _id: 'cat_8', name: 'Water Bottles & Tumblers', active: true },
  { _id: 'cat_9', name: 'Lab Equipment', active: true },
  { _id: 'cat_10', name: 'Others', active: true }
];

export const INITIAL_ITEMS: Item[] = [];
export const INITIAL_CLAIMS: Claim[] = [];
export const INITIAL_NOTIFICATIONS: Notification[] = [];

export class StorageService {
  private static get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }

  // --- Users & Session Auth ---
  static getUsers(): User[] {
    return this.get<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
  }

  static getCurrentUser(): User | null {
    return this.get<User | null>(CURRENT_USER_KEY, null);
  }

  static setCurrentUser(user: User | null): void {
    if (user === null) {
      try {
        localStorage.removeItem(CURRENT_USER_KEY);
      } catch {}
    } else {
      this.set(CURRENT_USER_KEY, user);
    }
  }

  static registerUser(
    name: string,
    email: string,
    role: User['role'],
    department: string,
    studentId?: string
  ): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser: User = {
      _id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      department: department.trim(),
      studentId: studentId?.trim(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.set(USERS_STORAGE_KEY, users);
    this.setCurrentUser(newUser);

    this.addNotification({
      userId: newUser._id,
      title: 'Welcome to LostLink',
      message: `Your campus account has been successfully registered as ${role}.`,
      type: 'system'
    });

    return { success: true, user: newUser };
  }

  static loginUser(email: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'User not found. Please register a campus account.' };
    }
    this.setCurrentUser(user);
    return { success: true, user };
  }

  static logoutUser(): void {
    this.setCurrentUser(null);
  }

  // --- Items ---
  static getItems(): Item[] {
    return this.get<Item[]>(ITEMS_STORAGE_KEY, INITIAL_ITEMS);
  }

  static getItemById(id: string): Item | undefined {
    return this.getItems().find(i => i._id === id);
  }

  static createItem(itemInput: Omit<Item, '_id' | 'createdAt' | 'status'> & { status?: Item['status'] }): Item {
    const items = this.getItems();
    const newItem: Item = {
      ...itemInput,
      _id: `item_${itemInput.type}_${Date.now()}`,
      status: itemInput.status || 'open',
      createdAt: new Date().toISOString()
    };
    items.unshift(newItem);
    this.set(ITEMS_STORAGE_KEY, items);

    // Notify admins of new report
    const admins = this.getUsers().filter(u => u.role === 'Administrator');
    admins.forEach(admin => {
      this.addNotification({
        userId: admin._id,
        title: `New ${newItem.type.toUpperCase()} Item Reported`,
        message: `"${newItem.title}" was reported at ${newItem.location} by ${newItem.ownerName}.`,
        linkScreen: 'search',
        relatedItemId: newItem._id,
        type: 'status_change'
      });
    });

    return newItem;
  }

  static updateItem(id: string, updates: Partial<Item>): Item | null {
    const items = this.getItems();
    const index = items.findIndex(i => i._id === id);
    if (index === -1) return null;

    const oldItem = items[index];
    const updatedItem = { ...oldItem, ...updates };
    items[index] = updatedItem;
    this.set(ITEMS_STORAGE_KEY, items);

    // If status changed, notify item owner
    if (updates.status && updates.status !== oldItem.status) {
      this.addNotification({
        userId: updatedItem.ownerId,
        title: 'Report Status Updated',
        message: `Your report for "${updatedItem.title}" has been updated to "${updates.status.replace('_', ' ')}".`,
        linkScreen: 'dashboard',
        relatedItemId: updatedItem._id,
        type: 'status_change'
      });
    }

    return updatedItem;
  }

  static deleteItem(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter(i => i._id !== id);
    if (filtered.length !== items.length) {
      this.set(ITEMS_STORAGE_KEY, filtered);
      return true;
    }
    return false;
  }

  // --- Claims ---
  static getClaims(): Claim[] {
    return this.get<Claim[]>(CLAIMS_STORAGE_KEY, INITIAL_CLAIMS);
  }

  static getClaimsForItem(itemId: string): Claim[] {
    return this.getClaims().filter(c => c.itemId === itemId);
  }

  static getClaimsByUser(userId: string): Claim[] {
    return this.getClaims().filter(c => c.claimantId === userId);
  }

  static submitClaim(claimInput: Omit<Claim, '_id' | 'createdAt' | 'status'>): Claim {
    const claims = this.getClaims();
    const newClaim: Claim = {
      ...claimInput,
      _id: `claim_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    claims.unshift(newClaim);
    this.set(CLAIMS_STORAGE_KEY, claims);

    // Update item status to 'in_verification'
    this.updateItem(claimInput.itemId, { status: 'in_verification' });

    // Notify administrators
    const admins = this.getUsers().filter(u => u.role === 'Administrator');
    admins.forEach(admin => {
      this.addNotification({
        userId: admin._id,
        title: 'New Ownership Claim Submitted',
        message: `${claimInput.claimantName} submitted a claim for "${claimInput.itemTitle}".`,
        linkScreen: 'claims',
        relatedItemId: claimInput.itemId,
        type: 'claim'
      });
    });

    // Notify item owner if someone claimed their found item
    const item = this.getItemById(claimInput.itemId);
    if (item && item.ownerId !== claimInput.claimantId) {
      this.addNotification({
        userId: item.ownerId,
        title: 'Claim Submitted for Found Item',
        message: `A claimant has submitted ownership proof for "${item.title}". Campus Security is reviewing.`,
        linkScreen: 'dashboard',
        relatedItemId: item._id,
        type: 'claim'
      });
    }

    return newClaim;
  }

  static reviewClaim(
    claimId: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    adminRemarks?: string
  ): Claim | null {
    const claims = this.getClaims();
    const index = claims.findIndex(c => c._id === claimId);
    if (index === -1) return null;

    const claim = claims[index];
    claim.status = status;
    claim.reviewedBy = reviewedBy;
    claim.adminRemarks = adminRemarks;
    claim.reviewedAt = new Date().toISOString();
    claims[index] = claim;
    this.set(CLAIMS_STORAGE_KEY, claims);

    // If approved, update item to 'returned'
    if (status === 'approved') {
      this.updateItem(claim.itemId, { status: 'returned' });
    } else {
      // If rejected, check if there are other pending claims; if none, revert to open
      const otherPending = claims.filter(c => c.itemId === claim.itemId && c._id !== claimId && c.status === 'pending');
      if (otherPending.length === 0) {
        this.updateItem(claim.itemId, { status: 'open' });
      }
    }

    // Notify claimant
    this.addNotification({
      userId: claim.claimantId,
      title: `Claim ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your claim for "${claim.itemTitle}" was ${status}. ${
        status === 'approved'
          ? 'Please proceed to campus security custody desk to collect your item.'
          : adminRemarks || 'Please contact security administration for clarification.'
      }`,
      linkScreen: 'dashboard',
      relatedItemId: claim.itemId,
      type: 'claim'
    });

    return claim;
  }

  // --- Notifications ---
  static getNotifications(userId?: string): Notification[] {
    const all = this.get<Notification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS);
    if (!userId) return all;
    return all.filter(n => n.userId === userId || n.userId === 'all');
  }

  static addNotification(notif: Omit<Notification, '_id' | 'createdAt' | 'read'>): Notification {
    const list = this.get<Notification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS);
    const newNotif: Notification = {
      ...notif,
      _id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newNotif);
    this.set(NOTIFICATIONS_STORAGE_KEY, list);
    return newNotif;
  }

  static markNotificationRead(notifId: string): void {
    const list = this.get<Notification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS);
    const index = list.findIndex(n => n._id === notifId);
    if (index !== -1) {
      list[index].read = true;
      this.set(NOTIFICATIONS_STORAGE_KEY, list);
    }
  }

  static markAllNotificationsRead(userId: string): void {
    const list = this.get<Notification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS);
    const updated = list.map(n => {
      if (n.userId === userId || n.userId === 'all') {
        return { ...n, read: true };
      }
      return n;
    });
    this.set(NOTIFICATIONS_STORAGE_KEY, updated);
  }

  // --- Categories ---
  static getCategories(): Category[] {
    const cats = this.get<Category[]>(CATEGORIES_STORAGE_KEY, INITIAL_CATEGORIES);
    const items = this.getItems();
    return cats.map(c => ({
      ...c,
      itemCount: items.filter(i => i.category.toLowerCase() === c.name.toLowerCase()).length
    }));
  }

  static addCategory(name: string): Category {
    const cats = this.getCategories();
    const newCat: Category = {
      _id: `cat_${Date.now()}`,
      name: name.trim(),
      active: true,
      itemCount: 0
    };
    cats.push(newCat);
    this.set(CATEGORIES_STORAGE_KEY, cats);
    return newCat;
  }

  static toggleCategory(id: string): void {
    const cats = this.getCategories();
    const index = cats.findIndex(c => c._id === id);
    if (index !== -1) {
      cats[index].active = !cats[index].active;
      this.set(CATEGORIES_STORAGE_KEY, cats);
    }
  }

  // --- Analytics & Statistics ---
  static getCampusStats(): CampusStats {
    const items = this.getItems();
    const claims = this.getClaims();

    const totalReports = items.length;
    const totalLost = items.filter(i => i.type === 'lost').length;
    const totalFound = items.filter(i => i.type === 'found').length;
    const openReports = items.filter(i => i.status === 'open').length;
    const claimedReports = items.filter(i => i.status === 'claimed' || i.status === 'in_verification').length;
    const returnedItems = items.filter(i => i.status === 'returned').length;
    const activeClaims = claims.filter(c => c.status === 'pending').length;

    const matchSuccessRate = totalLost > 0 ? Math.round((returnedItems / totalLost) * 100) : 0;

    return {
      totalReports,
      totalLost,
      totalFound,
      openReports,
      claimedReports,
      returnedItems,
      activeClaims,
      matchSuccessRate
    };
  }

  // --- Clear / Reset Data ---
  static clearAllData(): void {
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(ITEMS_STORAGE_KEY);
    localStorage.removeItem(CLAIMS_STORAGE_KEY);
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    localStorage.removeItem(CATEGORIES_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}
