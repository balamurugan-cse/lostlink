import React, { useState } from 'react';
import { Item, ItemType, User, Category } from '../types';
import { Upload, X, Shield, MapPin, Calendar, Clock, Tag, Sparkles, Check, AlertCircle, Compass } from 'lucide-react';
import { CampusMap, MapCoordinates } from './CampusMap';

interface ReportFormProps {
  type: ItemType;
  currentUser: User | null;
  categories: Category[];
  onSubmit: (itemData: Omit<Item, '_id' | 'createdAt' | 'status'>) => void;
  onCancel: () => void;
  onRequireAuth: () => void;
}

const COMMON_CAMPUS_LOCATIONS = [
  'Central Library - 2nd Floor Reading Room',
  'Central Library - Ground Floor Circulation Desk',
  'Main Campus Canteen & Dining Area',
  'Lab Block B - 3rd Floor Robotics Lab',
  'CSE Department Lecture Hall 102',
  'Electronics & Comm Lab - Room 204',
  'Campus Sports Complex & Gymnasium',
  'Auditorium / Main Seminar Hall',
  'Campus Student Center - 1st Floor Lounge',
  'Campus Shuttle Bus Stop #1',
  'Hostel Block 3 Quadrangle',
  'Administrative Exam Cell Office'
];

export const ReportForm: React.FC<ReportFormProps> = ({
  type,
  currentUser,
  categories,
  onSubmit,
  onCancel,
  onRequireAuth
}) => {
  const isLost = type === 'lost';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Electronics');
  const [location, setLocation] = useState(COMMON_CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [uniqueAttributes, setUniqueAttributes] = useState('');
  const [custodyLocation, setCustodyLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [mapCoords, setMapCoords] = useState<MapCoordinates | null>(null);
  const [showMap, setShowMap] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePinSelect = (pin: MapCoordinates) => {
    setMapCoords(pin);
    if (pin.zoneName && pin.zoneName !== 'Open Campus Pathway / Courtyard') {
      // Find matching preset or set as custom
      const matched = COMMON_CAMPUS_LOCATIONS.find(loc => loc.toLowerCase().includes(pin.zoneName!.toLowerCase().slice(0, 8)));
      if (matched) {
        setLocation(matched);
      } else {
        setLocation('Other Custom Location');
        setCustomLocation(pin.zoneName);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl text-center">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-sm text-slate-600 mb-6">
          To maintain security and auditability, reporting lost or found items requires an authenticated student, staff, or administrator account.
        </p>
        <button
          onClick={onRequireAuth}
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Sign In or Register
        </button>
      </div>
    );
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB limit. Please select a smaller photo.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    // Simulate Cloudinary / Firebase Storage upload via FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        setImageUrl(event.target?.result as string);
        setIsUploading(false);
      }, 400);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to process image.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter an item title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a brief description.');
      return;
    }

    const finalLocation = location === 'Other Custom Location' ? customLocation.trim() || 'Campus Grounds' : location;

    onSubmit({
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      location: finalLocation,
      date,
      time: time || undefined,
      color: color.trim() || undefined,
      brand: brand.trim() || undefined,
      uniqueAttributes: uniqueAttributes.trim() || undefined,
      custodyLocation: !isLost ? custodyLocation.trim() || undefined : undefined,
      imageUrl: imageUrl || undefined,
      mapCoords: mapCoords || undefined,
      ownerId: currentUser._id,
      ownerName: currentUser.name,
      ownerEmail: currentUser.email,
      ownerRole: currentUser.role,
      contactPreference: currentUser.email
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              {isLost ? 'Step 1 · File Lost Property Report' : 'Step 1 · Register Found Item in Custody'}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section: Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isLost ? 'e.g. Apple MacBook Air 13" M2, Silver' : 'e.g. Black Sony WH-1000XM4 Headphones'}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Campus Location *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{showMap ? 'Hide Campus Map' : 'Pin on Campus Map'}</span>
                  </button>
                </div>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white"
                >
                  {COMMON_CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                  <option value="Other Custom Location">Other / Specific Room...</option>
                </select>
              </div>
            </div>

            {location === 'Other Custom Location' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Specify Location
                </label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="e.g. Civil Engineering Workshop Bay 3"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            )}

            {/* Interactive SVG Campus Map Pin Dropper */}
            {showMap && (
              <div className="pt-1">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span className="font-semibold flex items-center gap-1.5 text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Drop a pin on approximate campus location:</span>
                  </span>
                  {mapCoords ? (
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      ✓ Location pinned: {mapCoords.zoneName || `(${mapCoords.x}, ${mapCoords.y})`}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Click building or pathway below to pin
                    </span>
                  )}
                </div>
                <CampusMap
                  mode="picker"
                  selectedPin={mapCoords}
                  onPinSelect={handlePinSelect}
                  height={280}
                  showZoneSelector={true}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date {isLost ? 'Misplaced' : 'Discovered'} *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Approximate Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section: Matching Attributes (Section 17 rule-based similarity) */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Item Attributes (Used by Smart Matching Engine)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Space Gray, Navy Blue, Silver"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apple, Sony, Casio, Hydro Flask"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Unique Attributes &amp; Identifying Marks
              </label>
              <input
                type="text"
                value={uniqueAttributes}
                onChange={(e) => setUniqueAttributes(e.target.value)}
                placeholder="e.g. GitHub sticker on lid, minor scratch on bottom, engraved initials P.S."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Crucial for ownership verification during the claim process.
              </span>
            </div>

            {!isLost && (
              <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-lg">
                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                  Current Physical Custody / Storage Desk *
                </label>
                <input
                  type="text"
                  required
                  value={custodyLocation}
                  onChange={(e) => setCustodyLocation(e.target.value)}
                  placeholder="e.g. Campus Security Main Gate Office, Library Helpdesk (Ref #402)"
                  className="w-full px-3.5 py-2 text-sm border border-amber-300 rounded-lg bg-white focus:outline-none focus:border-amber-600"
                />
                <span className="text-[11px] text-amber-800 mt-1 block">
                  Students will be directed to this physical campus desk once ownership claim is verified.
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe where you last saw the item, accessories, contents, or distinctive circumstances..."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Item Photograph Upload */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
              Item Photograph
            </label>

            {imageUrl ? (
              <div className="relative aspect-16/9 max-w-sm rounded-lg overflow-hidden border border-slate-200">
                <img src={imageUrl} alt="Uploaded item preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-white/90 p-1 rounded-full text-slate-700 hover:text-red-600 transition-colors shadow-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-slate-400 transition-colors bg-slate-50/50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs text-slate-700 font-semibold mb-1">
                  Upload high-resolution photograph
                </div>
                <div className="text-[11px] text-slate-500 mb-3">
                  PNG, JPG, or WEBP up to 5MB
                </div>
                <label className="inline-block px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-xs">
                  <span>{isUploading ? 'Uploading...' : 'Select File from Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Reporter Identity Notice */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Reporting as: </span>
              <span>{currentUser.name} ({currentUser.role}) · {currentUser.department}</span>
            </div>
            <span className="font-mono text-slate-400 text-[11px]">{currentUser.email}</span>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              Submit {isLost ? 'Lost Report' : 'Found Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
