import React, { useState, useMemo } from 'react';
import { Item, Category, User } from '../types';
import { ItemCard } from './ItemCard';
import { Search, Filter, RotateCcw, Plus, CheckCircle2, LayoutGrid, List, MapPin, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { CampusMap } from './CampusMap';

interface SearchFilterPageProps {
  items: Item[];
  categories: Category[];
  currentUser: User | null;
  initialQuery?: string;
  onSelectItem: (item: Item) => void;
  onCheckMatches: (item: Item) => void;
  onClaimItem: (item: Item) => void;
  onReportLost: () => void;
  onReportFound: () => void;
}

export const SearchFilterPage: React.FC<SearchFilterPageProps> = ({
  items,
  categories,
  currentUser,
  initialQuery = '',
  onSelectItem,
  onCheckMatches,
  onClaimItem,
  onReportLost,
  onReportFound
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'map'>('grid');

  // Extract unique locations from current items
  const uniqueLocations = useMemo(() => {
    const locs = Array.from(new Set(items.map((i) => i.location))).filter(Boolean);
    return locs.sort();
  }, [items]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Type filter
        if (selectedType !== 'all' && item.type !== selectedType) return false;

        // Category filter
        if (selectedCategory !== 'all' && item.category.toLowerCase() !== selectedCategory.toLowerCase())
          return false;

        // Status filter
        if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

        // Location filter
        if (selectedLocation !== 'all' && item.location !== selectedLocation) return false;

        // Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesBrand = (item.brand || '').toLowerCase().includes(q);
          const matchesColor = (item.color || '').toLowerCase().includes(q);
          const matchesLoc = item.location.toLowerCase().includes(q);
          const matchesAttr = (item.uniqueAttributes || '').toLowerCase().includes(q);

          if (!matchesTitle && !matchesDesc && !matchesBrand && !matchesColor && !matchesLoc && !matchesAttr) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [items, selectedType, selectedCategory, selectedStatus, selectedLocation, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedLocation('all');
    setSortBy('newest');
  };

  const isFiltered =
    searchQuery !== '' ||
    selectedType !== 'all' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    selectedLocation !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Lost &amp; Found Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified campus reports, apply multi-attribute filters, or search keywords.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Compact Table / List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Campus Map View"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>

          <button
            onClick={onReportLost}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </button>
          <button
            onClick={onReportFound}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Report Found</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Primary Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items by keywords, serial number, brand, color, or location..."
              className="w-full pl-9 pr-12 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Filter Control: Segmented Type Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'lost'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost Only ({items.filter((i) => i.type === 'lost').length})
            </button>
            <button
              onClick={() => setSelectedType('found')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'found'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found Only ({items.filter((i) => i.type === 'found').length})
            </button>
          </div>
        </div>

        {/* Quick Category Buttons Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.slice(0, 8).map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.name)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Specific Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Campus Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Campus Zones</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="open">Active / Unclaimed</option>
              <option value="in_verification">Under Verification</option>
              <option value="claimed">Claim Submitted</option>
              <option value="returned">Returned to Owner</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-600 font-mono"
            >
              <option value="newest">Newest Date First</option>
              <option value="oldest">Oldest Date First</option>
            </select>
          </div>
        </div>

        {isFiltered && (
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900 font-mono tabular-nums">{filteredItems.length}</strong> of{' '}
              <strong className="text-slate-900 font-mono tabular-nums">{items.length}</strong> items
            </span>
            <button
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Results View: Table vs Map vs Grid */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-slate-900 text-sm">Spatial Campus Location Overview</div>
              <div className="text-slate-500">
                Visualizing approximate locations where items were lost or recovered across campus zones.
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span className="text-slate-700 font-medium">Lost Item Pins</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-700 font-medium">Found Item Pins</span>
              </div>
            </div>
          </div>

          <CampusMap
            mode="overview"
            items={filteredItems}
            onSelectItem={onSelectItem}
            height={460}
            showZoneSelector={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onSelect={onSelectItem}
                onCheckMatches={onCheckMatches}
                onClaim={onClaimItem}
                isOwner={currentUser?._id === item.ownerId}
              />
            ))}
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* High-Density Data Grid / Table Mode */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Item &amp; Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Campus Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isLost = item.type === 'lost';
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectItem(item)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isLost ? 'bg-rose-500' : 'bg-blue-600'
                            }`}
                          />
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">
                              {isLost ? 'LOST REPORT' : 'FOUND ITEM'} {item.brand && `· ${item.brand}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 truncate max-w-[200px]">
                        {item.location}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums text-slate-500">
                        {item.date}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            item.status === 'open'
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.status === 'returned'
                              ? 'bg-purple-50 text-purple-700'
                              : item.status === 'in_verification'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'open'
                                ? 'bg-emerald-500'
                                : item.status === 'returned'
                                ? 'bg-purple-600'
                                : 'bg-amber-500'
                            }`}
                          />
                          <span className="capitalize">{item.status.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onCheckMatches(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Check Smart Matches"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectItem(item)}
                            className="px-2.5 py-1 text-slate-700 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-300 font-semibold rounded-md transition-colors shadow-2xs"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onSelect={onSelectItem}
              onCheckMatches={onCheckMatches}
              onClaim={onClaimItem}
              isOwner={currentUser?._id === item.ownerId}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No items matched your criteria</h3>
          <p className="text-xs text-slate-500 mb-5">
            Try adjusting your search terms or clearing active filters to see all campus reports.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
            <button
              onClick={onReportLost}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Report New Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
