import React, { useState } from 'react';
import { MapPin, Navigation, Maximize2, RotateCcw, Check, Sparkles, Building2 } from 'lucide-react';
import { Item } from '../types';

export interface MapCoordinates {
  x: number;
  y: number;
  zoneName?: string;
}

interface CampusZone {
  id: string;
  name: string;
  shortName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  desc: string;
}

export const CAMPUS_ZONES: CampusZone[] = [
  {
    id: 'admin',
    name: 'Administrative Building & Exam Cell',
    shortName: 'Admin Block',
    x: 140,
    y: 90,
    width: 140,
    height: 80,
    color: '#e0e7ff',
    desc: 'Registrar, Principal Office, Student Accounts'
  },
  {
    id: 'library',
    name: 'Central Library & Reading Halls',
    shortName: 'Central Library',
    x: 330,
    y: 80,
    width: 150,
    height: 90,
    color: '#fef3c7',
    desc: 'Digital Library, 2nd Floor Silent Reading Room'
  },
  {
    id: 'cse_tech',
    name: 'Computer Science & Tech Lab Block',
    shortName: 'CSE Block',
    x: 530,
    y: 85,
    width: 150,
    height: 95,
    color: '#dbeafe',
    desc: 'AI/ML Labs, Software Studios, Room 101-304'
  },
  {
    id: 'canteen',
    name: 'Campus Canteen & Dining Hall',
    shortName: 'Canteen',
    x: 140,
    y: 220,
    width: 130,
    height: 75,
    color: '#fed7aa',
    desc: 'Main Cafeteria, Dining Patio & Refreshment Stalls'
  },
  {
    id: 'mech_civil',
    name: 'Mechanical & Civil Engineering Block',
    shortName: 'Mech/Civil Labs',
    x: 330,
    y: 215,
    width: 150,
    height: 85,
    color: '#e2e8f0',
    desc: 'Robotics Workshop, CAD Lab, Fluid Mechanics'
  },
  {
    id: 'ece_eee',
    name: 'ECE & Electrical Science Block',
    shortName: 'ECE/EEE Block',
    x: 530,
    y: 220,
    width: 145,
    height: 85,
    color: '#ccfbf1',
    desc: 'Embedded Systems, Circuits Lab, Microprocessors'
  },
  {
    id: 'main_gate',
    name: 'Main Security Gate & Shuttle Bay',
    shortName: 'Main Entrance',
    x: 60,
    y: 330,
    width: 130,
    height: 70,
    color: '#f3e8ff',
    desc: 'Campus Security Headquarters & Shuttle Stop'
  },
  {
    id: 'auditorium',
    name: 'Main Auditorium & Conference Complex',
    shortName: 'Auditorium',
    x: 320,
    y: 340,
    width: 170,
    height: 90,
    color: '#fce7f3',
    desc: 'Seminar Halls, Cultural Center & Open Amphitheatre'
  },
  {
    id: 'sports',
    name: 'Sports Complex & Basketball Grounds',
    shortName: 'Sports Arena',
    x: 540,
    y: 345,
    width: 145,
    height: 85,
    color: '#dcfce7',
    desc: 'Indoor Badminton, Gym, Outdoor Basketball Courts'
  }
];

interface CampusMapProps {
  mode?: 'picker' | 'view' | 'overview';
  selectedPin?: MapCoordinates | null;
  onPinSelect?: (pin: MapCoordinates) => void;
  items?: Item[];
  onSelectItem?: (item: Item) => void;
  height?: number | string;
  showZoneSelector?: boolean;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  mode = 'picker',
  selectedPin,
  onPinSelect,
  items = [],
  onSelectItem,
  height = 360,
  showZoneSelector = true
}) => {
  const [internalPin, setInternalPin] = useState<MapCoordinates | null>(selectedPin || null);
  const [hoveredZone, setHoveredZone] = useState<CampusZone | null>(null);

  const activePin = selectedPin !== undefined ? selectedPin : internalPin;

  // Handle map canvas click
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode === 'view') return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const viewBoxWidth = 760;
    const viewBoxHeight = 470;

    const scaleX = viewBoxWidth / rect.width;
    const scaleY = viewBoxHeight / rect.height;

    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    // Identify which zone this falls into (if any)
    const matchingZone = CAMPUS_ZONES.find(
      z => x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height
    );

    const newPin: MapCoordinates = {
      x,
      y,
      zoneName: matchingZone ? matchingZone.name : 'Open Campus Pathway / Courtyard'
    };

    setInternalPin(newPin);
    if (onPinSelect) {
      onPinSelect(newPin);
    }
  };

  // Quick snap to a building center
  const handleSnapToZone = (zone: CampusZone) => {
    const pin: MapCoordinates = {
      x: Math.round(zone.x + zone.width / 2),
      y: Math.round(zone.y + zone.height / 2),
      zoneName: zone.name
    };
    setInternalPin(pin);
    if (onPinSelect) {
      onPinSelect(pin);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Top Map HUD Bar */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-slate-200">
            DMI Campus Interactive Spatial Map
          </span>
          {mode === 'picker' && (
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              · Click anywhere on map or buildings to drop pin
            </span>
          )}
        </div>

        {activePin && (
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate max-w-[200px]">{activePin.zoneName || `Pin (${activePin.x}, ${activePin.y})`}</span>
          </div>
        )}
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-hidden select-none bg-[#0f172a]" style={{ height }}>
        <svg
          viewBox="0 0 760 470"
          className={`w-full h-full ${mode === 'picker' ? 'cursor-crosshair' : 'cursor-default'}`}
          onClick={handleSvgClick}
        >
          {/* Background Grounds / Campus Lawn Base */}
          <rect x="0" y="0" width="760" height="470" fill="#0f172a" />

          {/* Landscaped Green Courtyards & Trees */}
          <rect x="30" y="30" width="700" height="410" rx="20" fill="#132320" stroke="#1f3b33" strokeWidth="2" />
          <circle cx="380" cy="180" r="28" fill="#1b4332" opacity="0.6" />
          <circle cx="380" cy="180" r="14" fill="#2d6a4f" opacity="0.8" />
          <circle cx="210" cy="180" r="16" fill="#1b4332" opacity="0.5" />
          <circle cx="610" cy="180" r="16" fill="#1b4332" opacity="0.5" />

          {/* Central Lawn & Fountain */}
          <ellipse cx="380" cy="180" rx="35" ry="18" fill="#14532d" opacity="0.4" />
          <circle cx="380" cy="180" r="6" fill="#38bdf8" opacity="0.8" />

          {/* Connecting Walkways & Main Avenue */}
          {/* Main East-West Spine */}
          <line x1="50" y1="180" x2="710" y2="180" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
          <line x1="50" y1="180" x2="710" y2="180" stroke="#475569" strokeWidth="2" strokeDasharray="6 6" />

          {/* North-South Corridors */}
          <line x1="210" y1="50" x2="210" y2="420" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <line x1="380" y1="50" x2="380" y2="420" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <line x1="610" y1="50" x2="610" y2="420" stroke="#334155" strokeWidth="10" strokeLinecap="round" />

          {/* Secondary Pathway Links */}
          <line x1="210" y1="310" x2="380" y2="310" stroke="#1e293b" strokeWidth="8" />
          <line x1="380" y1="310" x2="610" y2="310" stroke="#1e293b" strokeWidth="8" />

          {/* Campus Buildings */}
          {CAMPUS_ZONES.map((zone) => {
            const isHovered = hoveredZone?.id === zone.id;
            const isTarget = activePin?.zoneName === zone.name;

            return (
              <g
                key={zone.id}
                onMouseEnter={() => setHoveredZone(zone)}
                onMouseLeave={() => setHoveredZone(null)}
                className="transition-all duration-150"
              >
                {/* Building Drop Shadow */}
                <rect
                  x={zone.x + 3}
                  y={zone.y + 4}
                  width={zone.width}
                  height={zone.height}
                  rx="8"
                  fill="#020617"
                  opacity="0.6"
                />

                {/* Building Structure */}
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx="8"
                  fill={isTarget ? '#1e3a8a' : isHovered ? '#1e293b' : '#0f172a'}
                  stroke={isTarget ? '#60a5fa' : isHovered ? '#38bdf8' : '#334155'}
                  strokeWidth={isTarget ? 2.5 : isHovered ? 2 : 1.5}
                />

                {/* Building Roof Grid Accent */}
                <rect
                  x={zone.x + 5}
                  y={zone.y + 5}
                  width={zone.width - 10}
                  height={zone.height - 10}
                  rx="5"
                  fill="none"
                  stroke={isTarget ? '#3b82f6' : '#1e293b'}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Building Name Text */}
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + zone.height / 2 - 2}
                  fill={isTarget ? '#ffffff' : '#f1f5f9'}
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {zone.shortName}
                </text>

                {/* Building Subtitle / Tag */}
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + zone.height / 2 + 13}
                  fill={isTarget ? '#93c5fd' : '#94a3b8'}
                  fontSize="8.5"
                  fontWeight="500"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {zone.id.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Render All Existing Pinned Items (Overview Mode) */}
          {mode === 'overview' &&
            items
              .filter(item => item.mapCoords)
              .map(item => {
                const isLost = item.type === 'lost';
                return (
                  <g
                    key={item._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectItem) onSelectItem(item);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring */}
                    <circle
                      cx={item.mapCoords!.x}
                      cy={item.mapCoords!.y}
                      r="12"
                      fill={isLost ? '#ef4444' : '#3b82f6'}
                      opacity="0.25"
                      className="animate-ping"
                    />
                    {/* Outer Circle */}
                    <circle
                      cx={item.mapCoords!.x}
                      cy={item.mapCoords!.y}
                      r="7"
                      fill={isLost ? '#dc2626' : '#2563eb'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {/* Item Title on Hover */}
                    <text
                      x={item.mapCoords!.x}
                      y={item.mapCoords!.y - 10}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-black"
                    >
                      {item.title.substring(0, 18)}
                    </text>
                  </g>
                );
              })}

          {/* Active User-Selected Pin (Picker or Single View Mode) */}
          {activePin && (
            <g transform={`translate(${activePin.x}, ${activePin.y})`}>
              {/* Ripple Effect Ring */}
              <circle cx="0" cy="0" r="16" fill="#3b82f6" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="8" fill="#1d4ed8" opacity="0.4" />

              {/* Pin Needle Base Shadow */}
              <ellipse cx="0" cy="2" rx="4" ry="2" fill="#000000" opacity="0.6" />

              {/* Pin Head Graphic */}
              <path
                d="M 0,-24 C -7,-24 -12,-19 -12,-12 C -12,-4 0,0 0,0 C 0,0 12,-4 12,-12 C 12,-19 7,-24 0,-24 Z"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle cx="0" cy="-12" r="4" fill="#ffffff" />
            </g>
          )}

          {/* Compass Rose at top right */}
          <g transform="translate(710, 45)">
            <circle cx="0" cy="0" r="18" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <polygon points="0,-14 4,-3 0,-7" fill="#ef4444" />
            <polygon points="0,-14 -4,-3 0,-7" fill="#dc2626" />
            <polygon points="0,14 4,3 0,7" fill="#cbd5e1" />
            <polygon points="0,14 -4,3 0,7" fill="#94a3b8" />
            <text x="0" y="-17" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
          </g>
        </svg>

        {/* Hover Zone Overlay Details */}
        {hoveredZone && (
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs border border-slate-700 text-white px-3 py-1.5 rounded-lg text-xs pointer-events-none shadow-lg animate-in fade-in">
            <div className="font-bold text-blue-400">{hoveredZone.name}</div>
            <div className="text-[11px] text-slate-300">{hoveredZone.desc}</div>
          </div>
        )}
      </div>

      {/* Snap-to-Building Zone Selector Pills */}
      {showZoneSelector && mode === 'picker' && (
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>Quick snap pin to campus landmark:</span>
            {activePin && (
              <button
                type="button"
                onClick={() => {
                  setInternalPin(null);
                  if (onPinSelect) onPinSelect({ x: 0, y: 0, zoneName: '' });
                }}
                className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Clear Pin
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CAMPUS_ZONES.map(z => {
              const isSelected = activePin?.zoneName === z.name;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => handleSnapToZone(z)}
                  className={`px-2 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {z.shortName}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
