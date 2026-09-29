import { User, Item, Claim, Notification, Category, CampusStats } from '../types';

const USERS_STORAGE_KEY = 'lostlink_users_v2';
const ITEMS_STORAGE_KEY = 'lostlink_items_v2';
const CLAIMS_STORAGE_KEY = 'lostlink_claims_v2';
const NOTIFICATIONS_STORAGE_KEY = 'lostlink_notifications_v2';
const CATEGORIES_STORAGE_KEY = 'lostlink_categories_v2';
const CURRENT_USER_KEY = 'lostlink_current_user_v2';

// Clean out any legacy v1 mock keys from localStorage
try {
  localStorage.removeItem('lostlink_users_v1');
  localStorage.removeItem('lostlink_items_v1');
  localStorage.removeItem('lostlink_claims_v1');
  localStorage.removeItem('lostlink_notifications_v1');
  localStorage.removeItem('lostlink_categories_v1');
  localStorage.removeItem('lostlink_current_user_v1');
} catch {
  // Ignore in SSR/restricted environments
}

export const INITIAL_USERS: User[] = [
  {
    _id: 'user_student_1',
    name: 'R. Anand',
    email: 'anand.r@dmice.ac.in',
    role: 'Student',
    department: 'Computer Science & Engineering',
    studentId: '2024-CSE-042',
    createdAt: '2026-09-15T09:00:00.000Z'
  },
  {
    _id: 'user_faculty_1',
    name: 'Prof. S. Malar',
    email: 'malar.s@dmice.ac.in',
    role: 'Faculty/Staff',
    department: 'Electronics & Communication',
    createdAt: '2026-09-10T08:30:00.000Z'
  },
  {
    _id: 'user_admin_1',
    name: 'Officer K. Raman',
    email: 'security.admin@dmice.ac.in',
    role: 'Administrator',
    department: 'Campus Security & Facilities Directorate',
    createdAt: '2026-08-01T08:00:00.000Z'
  }
];

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

export const INITIAL_ITEMS: Item[] = [
  {
    _id: 'item_lost_101',
    type: 'lost',
    title: 'Apple AirPods Pro (2nd Gen) in White Case',
    description: 'White AirPods Pro case with small scratch along the lower hinge. Misplaced while studying at the digital reading tables on the second floor.',
    category: 'Audio & Wearables',
    location: 'Central Library & Reading Halls',
    date: '2026-09-28',
    time: '14:30',
    status: 'open',
    ownerId: 'user_student_1',
    ownerName: 'R. Anand',
    ownerEmail: 'anand.r@dmice.ac.in',
    ownerRole: 'Student',
    color: 'White',
    brand: 'Apple',
    uniqueAttributes: 'Engraved initials "RA" in subtle grey lettering',
    mapCoords: { x: 405, y: 125, zoneName: 'Central Library & Reading Halls' },
    createdAt: '2026-09-28T14:45:00.000Z'
  },
  {
    _id: 'item_found_102',
    type: 'found',
    title: 'White Wireless Earbuds Charging Case',
    description: 'Found on the digital library study desk near window table 4. Turned in to the library helpdesk attendant.',
    category: 'Audio & Wearables',
    location: 'Central Library & Reading Halls',
    date: '2026-09-28',
    time: '16:00',
    status: 'open',
    ownerId: 'user_faculty_1',
    ownerName: 'Prof. S. Malar',
    ownerEmail: 'malar.s@dmice.ac.in',
    ownerRole: 'Faculty/Staff',
    color: 'White',
    brand: 'Apple',
    uniqueAttributes: 'Has subtle surface scratch near metal hinge',
    custodyLocation: 'Central Library Main Circulation Desk',
    mapCoords: { x: 410, y: 130, zoneName: 'Central Library & Reading Halls' },
    createdAt: '2026-09-28T16:15:00.000Z'
  },
  {
    _id: 'item_lost_103',
    type: 'lost',
    title: 'DMI Student Identity Card - CSE Dept',
    description: 'Laminated smart ID card of R. Anand with college barcode. Lost somewhere between the main gate and the examination cell.',
    category: 'IDs & Access Cards',
    location: 'Administrative Building & Exam Cell',
    date: '2026-09-27',
    time: '11:15',
    status: 'in_verification',
    ownerId: 'user_student_1',
    ownerName: 'R. Anand',
    ownerEmail: 'anand.r@dmice.ac.in',
    ownerRole: 'Student',
    color: 'White/Maroon',
    brand: 'Institutional',
    uniqueAttributes: 'Student ID: 2024-CSE-042',
    mapCoords: { x: 210, y: 130, zoneName: 'Administrative Building & Exam Cell' },
    createdAt: '2026-09-27T11:30:00.000Z'
  },
  {
    _id: 'item_found_104',
    type: 'found',
    title: 'Student ID Card with DMI Purple Lanyard',
    description: 'Found near the exam section ground floor corridor. Handed over to campus security counter.',
    category: 'IDs & Access Cards',
    location: 'Administrative Building & Exam Cell',
    date: '2026-09-27',
    time: '12:30',
    status: 'in_verification',
    ownerId: 'user_admin_1',
    ownerName: 'Officer K. Raman',
    ownerEmail: 'security.admin@dmice.ac.in',
    ownerRole: 'Administrator',
    color: 'Purple lanyard',
    brand: 'Institutional',
    custodyLocation: 'Main Security Gate Booth #1',
    mapCoords: { x: 200, y: 125, zoneName: 'Administrative Building & Exam Cell' },
    createdAt: '2026-09-27T12:45:00.000Z'
  },
  {
    _id: 'item_found_105',
    type: 'found',
    title: 'Casio fx-991EX Scientific ClassWiz Calculator',
    description: 'Found left behind on workstation bench 7 after Engineering Graphics lab session.',
    category: 'Lab Equipment',
    location: 'Mechanical & Civil Engineering Block',
    date: '2026-09-26',
    time: '17:20',
    status: 'open',
    ownerId: 'user_faculty_1',
    ownerName: 'Prof. S. Malar',
    ownerEmail: 'malar.s@dmice.ac.in',
    ownerRole: 'Faculty/Staff',
    color: 'Black',
    brand: 'Casio',
    uniqueAttributes: 'Silver sticker on rear battery compartment with formula notes',
    custodyLocation: 'Mechanical Department Staff Room Room 104',
    mapCoords: { x: 405, y: 255, zoneName: 'Mechanical & Civil Engineering Block' },
    createdAt: '2026-09-26T17:30:00.000Z'
  },
  {
    _id: 'item_lost_106',
    type: 'lost',
    title: 'Titan Black Leather Bifold Wallet',
    description: 'Black stitched leather wallet containing college canteen meal token, driver license, and metro travel card.',
    category: 'Wallets & Purses',
    location: 'Campus Canteen & Dining Hall',
    date: '2026-09-26',
    time: '13:00',
    status: 'open',
    ownerId: 'user_student_1',
    ownerName: 'R. Anand',
    ownerEmail: 'anand.r@dmice.ac.in',
    ownerRole: 'Student',
    color: 'Black',
    brand: 'Titan',
    mapCoords: { x: 205, y: 255, zoneName: 'Campus Canteen & Dining Hall' },
    createdAt: '2026-09-26T13:20:00.000Z'
  },
  {
    _id: 'item_found_107',
    type: 'found',
    title: 'Wildcraft Navy Blue Laptop Backpack',
    description: 'Contains notebook, course syllabus, and umbrella. Found on chair row 4 at the main auditorium during seminar.',
    category: 'Bags & Backpacks',
    location: 'Computer Science & Tech Lab Block',
    date: '2026-09-25',
    time: '15:15',
    status: 'open',
    ownerId: 'user_admin_1',
    ownerName: 'Officer K. Raman',
    ownerEmail: 'security.admin@dmice.ac.in',
    ownerRole: 'Administrator',
    color: 'Navy Blue',
    brand: 'Wildcraft',
    custodyLocation: 'Campus Security Main Office',
    mapCoords: { x: 605, y: 130, zoneName: 'Computer Science & Tech Lab Block' },
    createdAt: '2026-09-25T15:30:00.000Z'
  },
  {
    _id: 'item_lost_108',
    type: 'lost',
    title: 'Set of 3 Keys on Red Carabiner Keychain',
    description: 'Two brass door keys and one bike key attached to a red climbing carabiner with mini LED torch.',
    category: 'Keys & Keychains',
    location: 'Sports Pavilion & Athletic Grounds',
    date: '2026-09-24',
    time: '18:10',
    status: 'open',
    ownerId: 'user_student_1',
    ownerName: 'R. Anand',
    ownerEmail: 'anand.r@dmice.ac.in',
    ownerRole: 'Student',
    color: 'Red/Brass',
    brand: 'Custom',
    mapCoords: { x: 740, y: 195, zoneName: 'Sports Pavilion & Athletic Grounds' },
    createdAt: '2026-09-24T18:25:00.000Z'
  },
  {
    _id: 'item_found_109',
    type: 'found',
    title: 'Milton Insulated 1-Litre Steel Water Bottle',
    description: 'Matte dark navy finish with flip cap. Found left behind in Canteen dining area table 12.',
    category: 'Water Bottles & Tumblers',
    location: 'Campus Canteen & Dining Hall',
    date: '2026-09-24',
    time: '13:40',
    status: 'open',
    ownerId: 'user_faculty_1',
    ownerName: 'Prof. S. Malar',
    ownerEmail: 'malar.s@dmice.ac.in',
    ownerRole: 'Faculty/Staff',
    color: 'Navy Blue',
    brand: 'Milton',
    custodyLocation: 'Canteen Supervisor Counter',
    mapCoords: { x: 215, y: 260, zoneName: 'Campus Canteen & Dining Hall' },
    createdAt: '2026-09-24T14:00:00.000Z'
  },
  {
    _id: 'item_found_110',
    type: 'found',
    title: 'HP 65W Blue-Pin Laptop Power Adapter',
    description: 'Left connected in CSE Lab 3 wall outlet. Claimed and verified by student owner.',
    category: 'Electronics',
    location: 'Computer Science & Tech Lab Block',
    date: '2026-09-22',
    time: '16:45',
    status: 'returned',
    ownerId: 'user_admin_1',
    ownerName: 'Officer K. Raman',
    ownerEmail: 'security.admin@dmice.ac.in',
    ownerRole: 'Administrator',
    color: 'Black',
    brand: 'HP',
    custodyLocation: 'CSE Department Lab Assistant Desk',
    mapCoords: { x: 610, y: 135, zoneName: 'Computer Science & Tech Lab Block' },
    createdAt: '2026-09-22T17:00:00.000Z'
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    _id: 'claim_201',
    itemId: 'item_found_104',
    itemTitle: 'Student ID Card with DMI Purple Lanyard',
    itemType: 'found',
    claimantId: 'user_student_1',
    claimantName: 'R. Anand',
    claimantEmail: 'anand.r@dmice.ac.in',
    claimantDepartment: 'Computer Science & Engineering',
    evidence: 'My student ID number is 2024-CSE-042. I have the digital duplicate in the student portal on my phone.',
    contactNumber: '+91 98401 23456',
    status: 'pending',
    createdAt: '2026-09-27T14:00:00.000Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    _id: 'notif_301',
    userId: 'user_student_1',
    title: 'Smart Match Detected (92% Score)',
    message: 'Your lost "Apple AirPods Pro" closely matches a "White Wireless Earbuds Charging Case" found at Central Library.',
    read: false,
    linkScreen: 'matches',
    relatedItemId: 'item_lost_101',
    type: 'match',
    createdAt: '2026-09-28T16:20:00.000Z'
  },
  {
    _id: 'notif_302',
    userId: 'user_admin_1',
    title: 'Ownership Claim Awaiting Review',
    message: 'R. Anand submitted ownership evidence for "Student ID Card with DMI Purple Lanyard".',
    read: false,
    linkScreen: 'claims',
    relatedItemId: 'item_found_104',
    type: 'claim',
    createdAt: '2026-09-27T14:05:00.000Z'
  }
];

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
    items[index] = { ...items[index], ...updates };
    this.set(ITEMS_STORAGE_KEY, items);
    return items[index];
  }

  static deleteItem(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter(i => i._id !== id);
    if (filtered.length === items.length) return false;
    this.set(ITEMS_STORAGE_KEY, filtered);
    return true;
  }

  // --- Claims ---
  static getClaims(): Claim[] {
    return this.get<Claim[]>(CLAIMS_STORAGE_KEY, INITIAL_CLAIMS);
  }

  static submitClaim(claimData: Omit<Claim, '_id' | 'createdAt' | 'status'>): Claim {
    const claims = this.getClaims();
    const newClaim: Claim = {
      ...claimData,
      _id: `claim_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    claims.unshift(newClaim);
    this.set(CLAIMS_STORAGE_KEY, claims);

    // Update item status to 'in_verification'
    this.updateItem(claimData.itemId, { status: 'in_verification' });

    // Notify administrators
    const admins = this.getUsers().filter(u => u.role === 'Administrator');
    admins.forEach(admin => {
      this.addNotification({
        userId: admin._id,
        title: 'New Ownership Claim Awaiting Review',
        message: `${claimData.claimantName} filed proof for "${claimData.itemTitle}".`,
        linkScreen: 'claims',
        relatedItemId: claimData.itemId,
        type: 'claim'
      });
    });

    // Notify the item owner/finder if different
    const item = this.getItemById(claimData.itemId);
    if (item && item.ownerId !== claimData.claimantId) {
      this.addNotification({
        userId: item.ownerId,
        title: 'Ownership Claim Submitted for Item',
        message: `A verification claim was filed for "${item.title}". Campus admin will review ownership evidence.`,
        linkScreen: 'details',
        relatedItemId: item._id,
        type: 'claim'
      });
    }

    return newClaim;
  }

  static reviewClaim(
    claimId: string,
    status: 'approved' | 'rejected',
    reviewerName: string,
    adminRemarks?: string
  ): Claim | null {
    const claims = this.getClaims();
    const index = claims.findIndex(c => c._id === claimId);
    if (index === -1) return null;

    claims[index].status = status;
    claims[index].reviewedBy = reviewerName;
    claims[index].reviewedAt = new Date().toISOString();
    claims[index].adminRemarks = adminRemarks || '';
    this.set(CLAIMS_STORAGE_KEY, claims);

    const claim = claims[index];
    const item = this.getItemById(claim.itemId);

    if (item) {
      if (status === 'approved') {
        // Mark item as returned/closed
        this.updateItem(item._id, { status: 'returned' });
      } else {
        // Reset status back to open if no other pending claims
        const otherPending = claims.some(c => c.itemId === item._id && c._id !== claimId && c.status === 'pending');
        if (!otherPending) {
          this.updateItem(item._id, { status: 'open' });
        }
      }
    }

    // Notify claimant
    this.addNotification({
      userId: claim.claimantId,
      title: `Claim ${status === 'approved' ? 'Approved' : 'Declined'}`,
      message: status === 'approved'
        ? `Your claim for "${claim.itemTitle}" was approved by ${reviewerName}. Please collect your item.`
        : `Your claim for "${claim.itemTitle}" was declined. Reason: ${adminRemarks || 'Evidence inconclusive'}.`,
      linkScreen: 'details',
      relatedItemId: claim.itemId,
      type: 'claim'
    });

    return claims[index];
  }

  // --- Notifications ---
  static getNotifications(userId?: string): Notification[] {
    const all = this.get<Notification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS);
    if (userId) {
      return all.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static addNotification(notif: Omit<Notification, '_id' | 'createdAt' | 'read'>): Notification {
    const list = this.get<Notification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS);
    const newNotif: Notification = {
      ...notif,
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newNotif);
    this.set(NOTIFICATIONS_STORAGE_KEY, list);
    return newNotif;
  }

  static markNotificationRead(id: string): void {
    const list = this.get<Notification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS);
    const item = list.find(n => n._id === id);
    if (item) {
      item.read = true;
      this.set(NOTIFICATIONS_STORAGE_KEY, list);
    }
  }

  static markAllNotificationsRead(userId: string): void {
    const list = this.get<Notification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS);
    list.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this.set(NOTIFICATIONS_STORAGE_KEY, list);
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
    const cat = cats.find(c => c._id === id);
    if (cat) {
      cat.active = !cat.active;
      this.set(CATEGORIES_STORAGE_KEY, cats);
    }
  }

  // --- Admin Stats ---
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
