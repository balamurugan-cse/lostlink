import React from 'react';
import { Shield, BookOpen, GraduationCap } from 'lucide-react';
import { DmiLogo } from './DmiLogo';

interface FooterProps {
  onNavigate: (screen: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Institutional DMI Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <DmiLogo size={46} />
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 tracking-tight text-base leading-tight">
                  LostLink
                </span>
                <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider leading-tight">
                  DMI Foundations
                </span>
                <span className="text-[9px] font-semibold text-amber-600 tracking-wide">
                  Fully Human &amp; Fully Alive
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Official Smart Campus Lost &amp; Found Management System for students, faculty, and campus administrators under DMI Foundations.
            </p>
          </div>

          {/* Management & Roles */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Campus Operations</h4>
            <div className="space-y-1.5 text-slate-600">
              <div>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors cursor-pointer">
                  Student Dashboard
                </button>
              </div>
              <div>
                <button onClick={() => onNavigate('claims')} className="hover:text-blue-600 transition-colors cursor-pointer">
                  Claim Verification Queue
                </button>
              </div>
              <div>
                <button onClick={() => onNavigate('admin_dashboard')} className="hover:text-blue-600 transition-colors cursor-pointer">
                  Security Operations Console
                </button>
              </div>
              <div>
                <button onClick={() => onNavigate('admin_management')} className="hover:text-blue-600 transition-colors cursor-pointer">
                  Category &amp; User Moderation
                </button>
              </div>
            </div>
          </div>

          {/* Campus Institution Details */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Campus Details</h4>
            <div className="text-slate-600 space-y-1 text-xs">
              <div className="font-semibold text-slate-800">DMI College of Engineering</div>
              <div className="text-slate-500">Palanchur, Nazarethpet Post</div>
              <div className="text-slate-500">Chennai - 600 123, Tamil Nadu</div>
              <div className="text-slate-400 text-[11px] pt-1">
                Department of Computer Science &amp; Engineering
              </div>
            </div>
          </div>
        </div>

        {/* Quiet copyright */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; 2026 DMI Foundations · LostLink Smart Campus Portal
          </div>
          <div className="flex items-center gap-4">
            <span>Fully Human &amp; Fully Alive</span>
            <span>·</span>
            <span>Security &amp; Facilities Directorate</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
