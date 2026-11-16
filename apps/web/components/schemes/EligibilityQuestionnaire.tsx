'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Sliders,
  GraduationCap,
  Tractor,
  Briefcase,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { MagneticButton, RippleClickWrapper, AnimatedCheckmark } from '../animations/SvgatorWrappers';

export interface EligibilityCriteriaState {
  fullName?: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'all';
  state: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'All';
  annualIncome: number;
  occupation: string;
  educationLevel: string;
  currentCourse?: string;
  currentSemester?: number;
  cgpaOrPercentage?: number;
  disability: boolean;
}

interface EligibilityQuestionnaireProps {
  initialCriteria?: Partial<EligibilityCriteriaState>;
  onSubmit: (criteria: EligibilityCriteriaState) => void;
  onSwitchToSearch: () => void;
  savedProfile?: any | null;
  onUseSavedProfile?: () => void;
  isLoading?: boolean;
}

export function EligibilityQuestionnaire({
  initialCriteria,
  onSubmit,
  onSwitchToSearch,
  savedProfile,
  onUseSavedProfile,
  isLoading = false,
}: EligibilityQuestionnaireProps) {
  const [criteria, setCriteria] = useState<EligibilityCriteriaState>({
    fullName: initialCriteria?.fullName || savedProfile?.fullName || '',
    age: initialCriteria?.age || savedProfile?.age || 20,
    gender: initialCriteria?.gender || savedProfile?.gender || 'female',
    state: initialCriteria?.state || savedProfile?.state || 'Maharashtra',
    category: initialCriteria?.category || savedProfile?.category || 'OBC',
    annualIncome: initialCriteria?.annualIncome ?? (savedProfile?.annualIncome || 350000),
    occupation: initialCriteria?.occupation || savedProfile?.occupation || 'student',
    educationLevel: initialCriteria?.educationLevel || savedProfile?.educationLevel || 'Undergraduate',
    currentCourse: initialCriteria?.currentCourse || savedProfile?.currentCourse || 'B.Tech IT',
    currentSemester: initialCriteria?.currentSemester || savedProfile?.currentSemester || 4,
    cgpaOrPercentage: initialCriteria?.cgpaOrPercentage || savedProfile?.cgpaOrPercentage || 84.5,
    disability: initialCriteria?.disability ?? (savedProfile?.disability || false),
  });

  const applyPreset = (preset: Partial<EligibilityCriteriaState>) => {
    setCriteria((prev) => ({ ...prev, ...preset }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(criteria);
  };

  return (
    <div className="card-container p-6 sm:p-8 bg-white border border-[#E5DFD5] shadow-md rounded-2xl relative overflow-hidden text-[#1A1715]">
      {/* Quiet Luxury Top Accent Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />

      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#D5C3A5] text-[#948170] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#948170]" />
          <span>Eligibility-First Citizen Discovery</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1715]">
          Find Schemes You Are Eligible For
        </h2>
        <p className="mt-2 text-sm text-[#7E756C] leading-relaxed">
          In accordance with Indian welfare governance, government schemes have deterministic criteria based on age, domicile state, caste category, and income. Fill out the quick details below, and Saarthi AI will immediately match you with eligible central and state schemes.
        </p>
      </div>

      {/* Logged In Shortcut (if profile exists) */}
      {savedProfile && onUseSavedProfile && (
        <div className="mt-5 p-4 rounded-xl bg-[#FAF7F2] border border-[#D5C3A5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-[#D5C3A5] flex items-center justify-center text-[#948170] shadow-xs font-bold text-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1A1715]">
                Saved Profile Detected: {savedProfile.fullName}
              </div>
              <div className="text-xs text-[#7E756C]">
                {savedProfile.category} • {savedProfile.state} • ₹{Number(savedProfile.annualIncome).toLocaleString('en-IN')}/yr • {savedProfile.occupation}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onUseSavedProfile}
            className="px-4 py-2 rounded-xl btn-luxury text-xs font-semibold shadow-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Match with My Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Persona Presets */}
      <div className="mt-6 pt-5 border-t border-[#E5DFD5]">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#7E756C] mb-2.5 flex items-center justify-between">
          <span>Or Quick-Fill With Sample Citizens:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <MagneticButton strength={0.12}>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  age: 20,
                  gender: 'female',
                  state: 'Maharashtra',
                  category: 'OBC',
                  annualIncome: 350000,
                  occupation: 'student',
                  educationLevel: 'Undergraduate',
                  cgpaOrPercentage: 85,
                  disability: false,
                })
              }
              className="w-full p-2.5 text-left rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-white hover:border-[#948170] hover:shadow-xs transition-all text-xs group"
            >
              <div className="flex items-center gap-1.5 font-semibold text-[#1A1715]">
                <GraduationCap className="w-3.5 h-3.5 text-[#948170] group-hover:scale-110 transition-transform" />
                <span>Priya (Student)</span>
              </div>
              <div className="text-[10px] text-[#7E756C] mt-0.5">20y • Female • OBC • 3.5L</div>
            </button>
          </MagneticButton>

          <MagneticButton strength={0.12}>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  age: 48,
                  gender: 'male',
                  state: 'Uttar Pradesh',
                  category: 'General',
                  annualIncome: 180000,
                  occupation: 'farmer',
                  educationLevel: '10th',
                  cgpaOrPercentage: 60,
                  disability: false,
                })
              }
              className="w-full p-2.5 text-left rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-white hover:border-[#948170] hover:shadow-xs transition-all text-xs group"
            >
              <div className="flex items-center gap-1.5 font-semibold text-[#1A1715]">
                <Tractor className="w-3.5 h-3.5 text-[#948170] group-hover:scale-110 transition-transform" />
                <span>Ramesh (Farmer)</span>
              </div>
              <div className="text-[10px] text-[#7E756C] mt-0.5">48y • Male • Agri • 1.8L</div>
            </button>
          </MagneticButton>

          <MagneticButton strength={0.12}>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  age: 32,
                  gender: 'female',
                  state: 'Karnataka',
                  category: 'OBC',
                  annualIncome: 250000,
                  occupation: 'self-employed',
                  educationLevel: '12th',
                  cgpaOrPercentage: 70,
                  disability: false,
                })
              }
              className="w-full p-2.5 text-left rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-white hover:border-[#948170] hover:shadow-xs transition-all text-xs group"
            >
              <div className="flex items-center gap-1.5 font-semibold text-[#1A1715]">
                <Briefcase className="w-3.5 h-3.5 text-[#948170] group-hover:scale-110 transition-transform" />
                <span>Kavita (Entrepreneur)</span>
              </div>
              <div className="text-[10px] text-[#7E756C] mt-0.5">32y • Female • Self-emp • 2.5L</div>
            </button>
          </MagneticButton>

          <MagneticButton strength={0.12}>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  age: 67,
                  gender: 'female',
                  state: 'Karnataka',
                  category: 'SC',
                  annualIncome: 120000,
                  occupation: 'senior citizen',
                  educationLevel: 'None',
                  cgpaOrPercentage: 50,
                  disability: false,
                })
              }
              className="w-full p-2.5 text-left rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-white hover:border-[#948170] hover:shadow-xs transition-all text-xs group"
            >
              <div className="flex items-center gap-1.5 font-semibold text-[#1A1715]">
                <Users className="w-3.5 h-3.5 text-[#948170] group-hover:scale-110 transition-transform" />
                <span>Shanti (Senior)</span>
              </div>
              <div className="text-[10px] text-[#7E756C] mt-0.5">67y • Female • Pension • 1.2L</div>
            </button>
          </MagneticButton>
        </div>
      </div>

      {/* Main Questionnaire Form */}
      <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
        {/* Section 1: Demographics */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#948170] mb-3 flex items-center gap-2">
            <span>1. Demographics & Domicile</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#7E756C] mb-1.5">
                Your Age (Years) *
              </label>
              <input
                type="number"
                min={5}
                max={100}
                required
                value={criteria.age}
                onChange={(e) => setCriteria({ ...criteria, age: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] text-sm text-[#1A1715] font-semibold focus:outline-none focus:border-[#948170] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7E756C] mb-1.5">
                Gender *
              </label>
              <select
                value={criteria.gender}
                onChange={(e) => setCriteria({ ...criteria, gender: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] text-sm text-[#1A1715] font-semibold focus:outline-none focus:border-[#948170] focus:bg-white"
              >
                <option value="female">Female (Kanya / Mahila)</option>
                <option value="male">Male</option>
                <option value="other">Transgender / Other</option>
                <option value="all">Any / General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7E756C] mb-1.5">
                Domicile State / UT *
              </label>
              <select
                value={criteria.state}
                onChange={(e) => setCriteria({ ...criteria, state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] text-sm text-[#1A1715] font-semibold focus:outline-none focus:border-[#948170] focus:bg-white"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi (NCT)</option>
                <option value="Bihar">Bihar</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Kerala">Kerala</option>
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="All">All India / Other States</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7E756C] mb-1.5">
                Social Category *
              </label>
              <select
                value={criteria.category}
                onChange={(e) => setCriteria({ ...criteria, category: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] text-sm text-[#1A1715] font-semibold focus:outline-none focus:border-[#948170] focus:bg-white"
              >
                <option value="General">General / Unreserved</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker)</option>
                <option value="Minority">Minority Community</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Financial & Employment */}
        <div className="pt-4 border-t border-[#E5DFD5]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#948170] mb-3">
            2. Economic Profile & Occupation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#7E756C] mb-1.5">
                Annual Family Income (₹) *
              </label>
              <input
                type="number"
                min={0}
                step={10000}
                required
                value={criteria.annualIncome}
                onChange={(e) => setCriteria({ ...criteria, annualIncome: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] text-sm text-[#1A1715] font-semibold focus:outline-none focus:border-[#948170] focus:bg-white"
              />
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {[
                  { label: '< ₹1.5L', val: 140000 },
                  { label: '₹2.5L', val: 250000 },
                  { label: '₹4.5L', val: 450000 },
                  { label: '₹8L', val: 800000 },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => setCriteria({ ...criteria, annualIncome: b.val })}
                    className="px-2 py-0.5 text-[10px] rounded-md bg-[#FAF7F2] border border-[#E5DFD5] text-[#7E756C] hover:border-[#948170]"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7E756C] mb-1.5">
                Current Occupation / Role *
              </label>
              <select
                value={criteria.occupation}
                onChange={(e) => setCriteria({ ...criteria, occupation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] text-sm text-[#1A1715] font-semibold focus:outline-none focus:border-[#948170] focus:bg-white"
              >
                <option value="student">Student (School / College)</option>
                <option value="farmer">Farmer / Agriculturalist</option>
                <option value="self-employed">Self-Employed / Artisan / Vendor</option>
                <option value="unemployed">Unemployed / Job Seeker</option>
                <option value="senior citizen">Senior Citizen / Retired</option>
                <option value="homemaker">Homemaker / Women Head</option>
                <option value="employed">Salaried Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7E756C] mb-1.5">
                Highest Education Level
              </label>
              <select
                value={criteria.educationLevel}
                onChange={(e) => setCriteria({ ...criteria, educationLevel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] text-sm text-[#1A1715] font-semibold focus:outline-none focus:border-[#948170] focus:bg-white"
              >
                <option value="Undergraduate">Undergraduate (B.Tech, B.Sc, BA, etc.)</option>
                <option value="12th">Class 12th Pass</option>
                <option value="10th">Class 10th Pass</option>
                <option value="Diploma">Diploma / Polytechnic</option>
                <option value="Postgraduate">Postgraduate (M.Tech, MBA, etc.)</option>
                <option value="Doctorate">Doctorate (Ph.D)</option>
                <option value="None">None / Non-formal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Special Affirmative Criteria */}
        <div className="pt-4 border-t border-[#E5DFD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="disability"
              checked={criteria.disability}
              onChange={(e) => setCriteria({ ...criteria, disability: e.target.checked })}
              className="w-4 h-4 rounded border-[#E5DFD5] text-[#948170] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="disability" className="text-xs font-medium text-[#1A1715] cursor-pointer">
              I hold an official Person with Disability (PwD) certificate (qualifies for targeted welfare)
            </label>
          </div>

          {/* Student Percentage (if student) */}
          {criteria.occupation === 'student' && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[#7E756C] whitespace-nowrap">
                Last Exam Marks %:
              </label>
              <input
                type="number"
                min={30}
                max={100}
                step={0.5}
                value={criteria.cgpaOrPercentage || 80}
                onChange={(e) => setCriteria({ ...criteria, cgpaOrPercentage: Number(e.target.value) })}
                className="w-20 px-2.5 py-1 rounded-lg border border-[#E5DFD5] bg-[#FAF7F2] text-xs font-semibold text-[#1A1715]"
              />
            </div>
          )}
        </div>

        {/* Submit Action Bar */}
        <div className="pt-5 border-t border-[#E5DFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onSwitchToSearch}
            className="text-xs font-semibold text-[#948170] hover:text-[#1A1715] flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Or Search All 5,000+ Government Schemes Directly</span>
          </button>

          <MagneticButton strength={0.2}>
            <RippleClickWrapper>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl btn-luxury font-bold text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 active:scale-95 transition-transform"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#1A1715] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check My Eligible Schemes</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </RippleClickWrapper>
          </MagneticButton>
        </div>
      </form>
    </div>
  );
}
