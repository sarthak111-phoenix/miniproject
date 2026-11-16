import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, Scale, Clock, UserCheck, FileCheck, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy & Data Protection Notice — Saarthi AI',
  description: 'Digital Personal Data Protection (DPDP) Act 2023 compliance, 90-day KYC document retention, data minimization, and user privacy rights at Saarthi AI.',
};

export default function PrivacyPage() {
  return (
    <main className="w-full min-h-screen bg-[#F5F2EC] text-[#1A1715] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#7E756C] hover:text-[#1A1715] transition-colors p-2 rounded-xl bg-white/80 border border-[#E5DFD5] shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#948170]" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E8EFE6] text-[#4A634E] border border-[#CCD8C8]">
            DPDP Act 2023 Compliant
          </span>
        </div>

        {/* Header Hero Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />
          <div className="flex items-center gap-3 mb-3 text-[#948170]">
            <Lock className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7E756C]">Official Legal Notice</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1715]">
            Privacy Policy & Data Protection Notice
          </h1>
          <p className="mt-2 text-sm text-[#5E544C] leading-relaxed max-w-2xl">
            This policy outlines how Saarthi AI collects, uses, protects, and auto-purges your personal data in strict compliance with India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and the <strong>Information Technology Act, 2000</strong>.
          </p>
          <div className="mt-4 pt-4 border-t border-[#E5DFD5] flex flex-wrap gap-4 text-xs text-[#7E756C]">
            <span><strong>Effective Date:</strong> October 2026</span>
            <span>•</span>
            <span><strong>Version:</strong> 2.0 (Production Release)</span>
            <span>•</span>
            <span><strong>Jurisdiction:</strong> Republic of India</span>
          </div>
        </div>

        {/* Section 1: Data Minimization & Collection Inventory */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <UserCheck className="w-5 h-5 text-[#948170]" />
            <h2>1. Inventory of User Data Collected</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            Saarthi AI operates on the principle of <strong>strict data minimization</strong>. We collect only the factual parameters necessary to evaluate your deterministic eligibility against official state and central scheme circulars:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD5] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1715]">Account & Security Data</h3>
              <ul className="text-xs text-[#5E544C] space-y-1 list-disc pl-4">
                <li>Email address (for authentication and password recovery)</li>
                <li>Hashed passwords (salted with bcrypt, raw passwords never stored)</li>
                <li>Optional phone number (for SMS deadline alerts)</li>
                <li>Client IP address (hashed/temporarily tracked for brute-force rate limiting)</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD5] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1715]">Demographic & Eligibility Data</h3>
              <ul className="text-xs text-[#5E544C] space-y-1 list-disc pl-4">
                <li>Age, gender, and state of domicile</li>
                <li>Social reservation category (General, OBC, SC, ST, EWS, Minority)</li>
                <li>Annual family income bracket (to verify government means-tests)</li>
                <li>Current education level, semester, marks percentage, and career track</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Uploaded Documents & 90-Day Retention Policy */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <Clock className="w-5 h-5 text-[#948170]" />
            <h2>2. Document Verification & Mandatory 90-Day Auto-Purge Policy</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            In compliance with DPDP Act 2023 Section 8(7), Saarthi AI does not retain citizen KYC documents indefinitely. Uploaded certificates (such as income certificates, caste certificates, or bonafide proofs) are subject to a strict <strong>concrete retention TTL</strong>:
          </p>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D5C3A5] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1A1715]">
              <ShieldCheck className="w-4 h-4 text-[#948170]" />
              <span>Automated 90-Day Expiry & Erasure</span>
            </div>
            <p className="text-xs text-[#5E544C] leading-relaxed">
              Every uploaded document is stamped with an explicit <code className="text-[#1A1715] font-semibold bg-white px-1.5 py-0.5 rounded border border-[#E5DFD5]">expiresAt</code> timestamp 90 calendar days from upload. Once expired, files and OCR caches are automatically purged from databases and persistent storage.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
            <strong>Aadhaar Act 2016 Compliance:</strong> Saarthi AI never requests, stores, or indexes your 12-digit unmasked Aadhaar number or core biometric details. When an Aadhaar document is processed for document-type verification, only the classification badge is verified.
          </div>
        </section>

        {/* Section 3: AI Engine & Data Isolation */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <FileCheck className="w-5 h-5 text-[#948170]" />
            <h2>3. AI Copilot Integration & Data Isolation</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            Saarthi AI utilizes Google Gemini models solely for natural-language synthesis of verified eligibility outcomes and conversational assistance. The AI Engine operates under strict data boundaries:
          </p>
          <ul className="text-xs sm:text-sm text-[#5E544C] space-y-2 list-disc pl-5 leading-relaxed">
            <li><strong>Zero Model Training:</strong> Your personal data, income details, and chat conversations are NOT used to train public LLM foundation models.</li>
            <li><strong>Data Anonymization:</strong> Prompts sent to the AI Copilot exclude full account credentials, phone numbers, and raw uploaded document binaries.</li>
            <li><strong>Deterministic Single Source of Truth:</strong> Qualification decisions are made locally by our audited rule engine; the AI layer cannot alter or override boolean criteria.</li>
          </ul>
        </section>

        {/* Section 4: Citizen Rights & Grievance Redressal */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <Scale className="w-5 h-5 text-[#948170]" />
            <h2>4. Your Rights Under the DPDP Act, 2023 & Grievance Officer</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            Every Indian citizen using Saarthi AI possesses the following statutory rights:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5E544C]">
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
              <strong className="text-[#1A1715] block mb-1">Right to Access:</strong>
              Inspect summary of personal data and matching history stored in your profile.
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
              <strong className="text-[#1A1715] block mb-1">Right to Correction:</strong>
              Update demographic details, income, or semester marks at any time.
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
              <strong className="text-[#1A1715] block mb-1">Right to Erasure:</strong>
              Permanently delete your account and all associated records with one click.
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
              <strong className="text-[#1A1715] block mb-1">Right to Grievance:</strong>
              Direct access to our designated Data Protection & Grievance Officer.
            </div>
          </div>

          <div className="mt-4 p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD5] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1715]">Designated Grievance Officer</h3>
            <p className="text-xs text-[#5E544C]">
              In accordance with Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules, 2021:
            </p>
            <div className="text-xs text-[#1A1715] font-medium space-y-0.5 pt-1">
              <div><strong>Name:</strong> Grievance Redressal Officer, Saarthi AI</div>
              <div><strong>Email:</strong> <a href="mailto:grievance@saarthi.ai" className="text-[#948170] underline">grievance@saarthi.ai</a></div>
              <div><strong>Response SLA:</strong> Within 48 business hours</div>
              <div><strong>Official Escalation:</strong> Centralized Public Grievance Redress and Monitoring System (CPGRAMS - pgportal.gov.in)</div>
            </div>
          </div>
        </section>

        {/* Bottom Back Button */}
        <div className="pt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1715] text-[#F5F2EC] text-xs font-semibold hover:bg-[#2C2622] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#D5C3A5]" />
            <span>Return to Saarthi Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
