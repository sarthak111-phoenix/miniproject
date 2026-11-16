import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Scale, AlertTriangle, ShieldCheck, CheckCircle2, Landmark } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — Saarthi AI',
  description: 'Terms of use, user responsibilities, civic information disclaimers, and platform rules for Saarthi AI.',
};

export default function TermsPage() {
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
          <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FAF7F2] text-[#948170] border border-[#D5C3A5]">
            Platform Guidelines
          </span>
        </div>

        {/* Header Hero Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />
          <div className="flex items-center gap-3 mb-3 text-[#948170]">
            <FileText className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7E756C]">Legal Agreement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1715]">
            Terms of Service & Platform Rules
          </h1>
          <p className="mt-2 text-sm text-[#5E544C] leading-relaxed max-w-2xl">
            Please read these terms carefully before utilizing the Saarthi AI platform. By accessing our services, creating an account, or interacting with our AI Copilot, you agree to these legally binding terms.
          </p>
          <div className="mt-4 pt-4 border-t border-[#E5DFD5] flex flex-wrap gap-4 text-xs text-[#7E756C]">
            <span><strong>Last Updated:</strong> October 2026</span>
            <span>•</span>
            <span><strong>Applicable Law:</strong> Information Technology Act, 2000 & Laws of India</span>
          </div>
        </div>

        {/* Non-Government Entity Disclaimer */}
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-700" />
            <span>Crucial Civic Disclaimer: Independent Guidance Platform</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90">
            Saarthi AI is an independent academic and welfare technology tool. <strong>Saarthi AI is NOT a government agency, department, or affiliate of the Government of India, State Governments, or Union Territories.</strong> We do NOT disburse funds, approve scholarship applications, issue certificates, or guarantee admission. All final grant submissions must be made directly on official portals (e.g. <code>scholarships.gov.in</code>, <code>myscheme.gov.in</code>).
          </p>
        </div>

        {/* 1. Nature of Services */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <Landmark className="w-5 h-5 text-[#948170]" />
            <h2>1. Nature & Scope of Services</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            Saarthi AI provides:
          </p>
          <ul className="text-xs sm:text-sm text-[#5E544C] space-y-2 list-disc pl-5 leading-relaxed">
            <li><strong>Deterministic Scheme Matching:</strong> Computational matching of citizen-entered demographic parameters against published scheme rules.</li>
            <li><strong>Student Career Roadmaps:</strong> Semester-by-semester milestone blueprints, recommended skills, and project suggestions.</li>
            <li><strong>Document Readiness Checklists:</strong> Advisory checklists explaining how to obtain requisite certificates.</li>
            <li><strong>Deadline Alerts & Digest:</strong> Automated notifications alerting users to upcoming application closing dates.</li>
          </ul>
        </section>

        {/* 2. 100% Free Public Civic Platform — No Fees or Payments */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <CheckCircle2 className="w-5 h-5 text-[#948170]" />
            <h2>2. 100% Free Service — Zero Fees & Refund Disclaimer</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            Saarthi AI is completely free to all students, farmers, women, and citizens. <strong>We do not charge any registration fees, assessment charges, subscription costs, or application commission.</strong>
          </p>
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD5] text-xs text-[#5E544C] space-y-1">
            <strong>Refund Policy Declaration:</strong> Because Saarthi AI does not collect any financial payments, processing fees, or credit transactions, <em>no refunds are applicable under any circumstances</em>. Anyone demanding payments on behalf of Saarthi AI is an unauthorized impostor and should be reported to <a href="mailto:support@saarthi.ai" className="text-[#948170] underline">support@saarthi.ai</a>.
          </div>
        </section>

        {/* 3. User Responsibilities & Acceptable Use */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <Scale className="w-5 h-5 text-[#948170]" />
            <h2>3. User Responsibilities & Prohibited Conduct</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            When utilizing Saarthi AI, users agree to:
          </p>
          <ul className="text-xs sm:text-sm text-[#5E544C] space-y-2 list-disc pl-5 leading-relaxed">
            <li><strong>Input Accuracy:</strong> Provide truthful information regarding age, annual family income, category, and domicile. Output recommendations directly depend on user accuracy.</li>
            <li><strong>Fair Usage & Rate Limits:</strong> Abide by API rate limits. Users shall not deploy automated scrapers, bots, or DDoS attacks against Saarthi AI or underlying government links.</li>
            <li><strong>No Prompt Injection or Jailbreaking:</strong> Users shall not submit queries intended to bypass safety guardrails, extract prompt instructions, or exploit the AI Copilot.</li>
            <li><strong>No Commercial Resale:</strong> Users shall not resell, white-label, or charge students for scheme recommendations generated by Saarthi AI.</li>
          </ul>
        </section>

        {/* 4. Limitation of Liability */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#1A1715] font-serif text-xl font-bold">
            <ShieldCheck className="w-5 h-5 text-[#948170]" />
            <h2>4. Limitation of Liability & Dispute Resolution</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5E544C] leading-relaxed">
            To the maximum extent permitted by Indian law (including the Information Technology Act, 2000), Saarthi AI, its developers, and contributors shall not be held liable for:
          </p>
          <ul className="text-xs sm:text-sm text-[#5E544C] space-y-1.5 list-disc pl-5 text-xs">
            <li>Any government rejection, disqualification, or delay in welfare disbursement.</li>
            <li>Changes in government guidelines or sudden portal downtime on third-party sites.</li>
            <li>Indirect, consequential, or incidental losses arising from reliance on platform information.</li>
          </ul>
          <p className="text-xs text-[#5E544C] pt-2">
            <strong>Jurisdiction:</strong> These Terms are governed by the laws of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
          </p>
        </section>

        {/* Return Button */}
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
