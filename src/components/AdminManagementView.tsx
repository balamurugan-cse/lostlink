import React, { useState } from 'react';
import { Item, User, Category } from '../types';
import { Shield, ArrowLeft, Trash2, Edit3, Plus, CheckCircle, XCircle, Search } from 'lucide-react';

interface AdminManagementViewProps {
  items: Item[];
  users: User[];
  categories: Category[];
  onBack: () => void;
  onSelectItem: (item: Item) => void;
  onUpdateItemStatus: (itemId: string, status: Item['status']) => void;
  onDeleteItem: (itemId: string) => void;
  onAddCategory: (name: string) => void;
  onToggleCategory: (catId: string) => void;
}

export const AdminManagementView: React.FC<AdminManagementViewProps> = ({
  items,
  users,
  categories,
  onBack,
  onSelectItem,
  onUpdateItemStatus,
  onDeleteItem,
  onAddCategory,
  onToggleCategory
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'categories' | 'users'>('reports');
  const [searchFilter, setSearchFilter] = useState('');
  const [newCatName, setNewCatName] = useState('');

  const filteredItems = items.filter(i => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return i.title.toLowerCase().includes(q) || i.ownerName.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
  });

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Dashboard</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Moderation &amp; System Governance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            User, Report, and Category Management Controls
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'reports' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Reports ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'categories' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Registered Users ({users.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Reports Moderation */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by report title, reporter, or category..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Total Reports: {filteredItems.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Item Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Campus Location</th>
                  <th className="py-2.5 px-3">Reporter</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 max-w-[200px] truncate">
                        {item.title}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{item.category}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-[150px] truncate">{item.location}</td>
                      <td className="py-3 px-3 text-slate-600">
                        <div>{item.ownerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.ownerRole}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{item.date}</td>
                      <td className="py-3 px-3">
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateItemStatus(item._id, e.target.value as Item['status'])}
                          className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold focus:outline-none focus:border-blue-600 capitalize cursor-pointer"
                        >
                          <option value="open">Open</option>
                          <option value="in_verification">In Verification</option>
                          <option value="claimed">Claimed</option>
                          <option value="returned">Returned</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => onSelectItem(item)}
                          className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => onDeleteItem(item._id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                          title="Delete report"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                      No reports registered yet in the campus system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Categories Management */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus Categories Management</h2>
              <p className="text-xs text-slate-500">Configure item classifications used across reporting forms.</p>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategorySubmit} className="flex items-center gap-2">
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New Category Name (e.g. Sports Equipment)..."
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map(cat => (
              <div
                key={cat._id}
                className="p-3.5 border border-slate-200 rounded-lg flex items-center justify-between bg-slate-50/50"
              >
                <div>
                  <div className="font-semibold text-slate-800 text-xs">{cat.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {cat.itemCount || 0} items reported
                  </div>
                </div>

                <button
                  onClick={() => onToggleCategory(cat._id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                    cat.active
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {cat.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-5">
          <h2 className="text-base font-bold text-slate-900 mb-1">Campus User Registry &amp; Roles</h2>
          <p className="text-xs text-slate-500 mb-4">
            Demonstrates Role-Based Access Control (RBAC) across Students, Faculty/Staff, and Administrators.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Campus Email</th>
                  <th className="py-2.5 px-3">System Role</th>
                  <th className="py-2.5 px-3">Department / Division</th>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length > 0 ? (
                  users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">{u.name}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{u.email}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          u.role === 'Administrator'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'Faculty/Staff'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{u.department}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{u.studentId || 'N/A'}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      No users registered yet. New user sign-ups will be listed here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
