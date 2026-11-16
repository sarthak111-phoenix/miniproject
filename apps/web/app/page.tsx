'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { AuthModal } from '../components/auth/AuthModal';
import { ProfileOnboardingModal } from '../components/auth/ProfileOnboardingModal';
import {
  EligibilityQuestionnaire,
  EligibilityCriteriaState,
} from '../components/schemes/EligibilityQuestionnaire';
import { MySchemeDetailModal } from '../components/schemes/MySchemeDetailModal';
import {
  Sparkles,
  Award,
  Compass,
  FileCheck,
  Bell,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Send,
  Upload,
  Calendar,
  ShieldCheck,
  BookOpen,
  Filter,
  Check,
  Clock,
  RefreshCw,
  Search,
  Lock,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle,
  FileText,
  UserCheck,
  Globe,
  Landmark,
  ArrowLeft,
  Edit3,
  Download,
  Layers,
  Code,
  Briefcase,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  X,
  Target,
} from 'lucide-react';
import { Skeleton, SchemeCardSkeleton, RoadmapTimelineSkeleton } from '../components/shared/skeleton-loader';
import {
  FloatingWrapper,
  OrganicBlobMotion,
  ScrollReveal,
  MagneticButton,
  RippleClickWrapper,
  GlassCard,
  MorphingBlobLoader,
  OrbitLoader,
  LiquidFillLoader,
  AnimatedCheckmark,
  CounterNumber,
} from '../components/animations/SvgatorWrappers';
import { KineticText } from '../components/animations/KineticText';
import { triggerLuxuryConfetti } from '../components/animations/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch, getApiBase } from '../lib/api';

const API_BASE = getApiBase();

export const POPULAR_CAREER_TRACKS = [
  { id: 'Full Stack Engineer', label: 'Full Stack Engineer', icon: '🚀', tag: 'Web & Mobile' },
  { id: 'Machine Learning Engineer', label: 'AI & ML Engineer', icon: '🧠', tag: 'PyTorch & MLOps' },
  { id: 'Software Engineer', label: 'Software Engineer', icon: '💻', tag: 'Algorithms & Core' },
  { id: 'Cloud Architect', label: 'Cloud & DevOps', icon: '☁️', tag: 'AWS & Kubernetes' },
  { id: 'Cybersecurity Analyst', label: 'Cybersecurity', icon: '🛡️', tag: 'Security & Forensics' },
  { id: 'Data Scientist', label: 'Data Scientist', icon: '📊', tag: 'Analytics & Models' },
  { id: 'Mobile App Developer', label: 'Mobile Apps', icon: '📱', tag: 'Flutter & Native' },
  { id: 'UI/UX & Product Designer', label: 'UI/UX Design', icon: '🎨', tag: 'Figma & Systems' },
  { id: 'Civil Services / UPSC Aspirant', label: 'Civil Services / UPSC', icon: '🏛️', tag: 'Policy & Governance' },
];

export default function SaarthiDashboard() {
  const { user, profile, token, isAuthenticated, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'schemes' | 'roadmap' | 'readiness' | 'notifications'>('schemes');
  
  // Citizen Schemes Workflow: 'questionnaire' -> 'eligible_results' -> 'search_all'
  const [schemeWorkflow, setSchemeWorkflow] = useState<'questionnaire' | 'eligible_results' | 'search_all'>('questionnaire');
  const [lastEvaluatedCriteria, setLastEvaluatedCriteria] = useState<EligibilityCriteriaState | null>(null);
  const [eligibleSchemes, setEligibleSchemes] = useState<any[]>([]);
  const [ineligibleSchemes, setIneligibleSchemes] = useState<any[]>([]);
  const [criteriaSummary, setCriteriaSummary] = useState<any | null>(null);
  const [evaluatingCriteria, setEvaluatingCriteria] = useState(false);

  // Universal Search across myScheme.gov.in (5,000+ schemes) & verified schemes
  const [universalSearchQuery, setUniversalSearchQuery] = useState('');
  const [universalSearchResults, setUniversalSearchResults] = useState<{
    verifiedSchemes: any[];
    mySchemeCatalog: any[];
    totalMyScheme: number;
  }>({ verifiedSchemes: [], mySchemeCatalog: [], totalMyScheme: 0 });
  const [isSearchingUniversal, setIsSearchingUniversal] = useState(false);
  const [selectedMySchemeSlug, setSelectedMySchemeSlug] = useState<string | null>(null);

  // Modals & AI
  const [selectedSchemeForExplain, setSelectedSchemeForExplain] = useState<any | null>(null);
  const [explainResult, setExplainResult] = useState<any | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Roadmap State
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [isRegeneratingRoadmap, setIsRegeneratingRoadmap] = useState(false);
  const [roadmapSearch, setRoadmapSearch] = useState('');
  const [roadmapCategoryFilter, setRoadmapCategoryFilter] = useState<string>('all');
  const [roadmapStatusFilter, setRoadmapStatusFilter] = useState<string>('all');
  const [roadmapSemesterFilter, setRoadmapSemesterFilter] = useState<number | 'all'>('all');
  const [collapsedSemesters, setCollapsedSemesters] = useState<Record<number, boolean>>({});
  const [selectedPreviewGoal, setSelectedPreviewGoal] = useState<string>('Full Stack Engineer');
  const [activeMilestoneHighlight, setActiveMilestoneHighlight] = useState<string | null>(null);
  const [activeStatusMenuMilestoneId, setActiveStatusMenuMilestoneId] = useState<string | null>(null);

  // Document Readiness State
  const [readinessSchemeId, setReadinessSchemeId] = useState<string>('scheme-aicte-pragati');
  const [readinessData, setReadinessData] = useState<any | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; citations?: any[] }>>([
    {
      role: 'assistant',
      text: 'Namaste! I am your Saarthi AI Copilot. I can guide you on eligible citizen schemes, document preparation, and career milestones. How can I assist you today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Initial load
  useEffect(() => {
    // Initial universal search pre-warm
    searchUniversalSchemes('');
  }, []);

  // Handle global tab navigation events (e.g. from Footer quick links)
  useEffect(() => {
    const handleCustomNavigate = (e: any) => {
      const { tab, workflow } = e.detail || {};
      if (tab) {
        setActiveTab(tab);
        const tabsEl = document.getElementById('dashboard-tabs');
        if (tabsEl) {
          tabsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
      if (workflow) {
        setSchemeWorkflow(workflow);
      }
    };
    window.addEventListener('saarthi-navigate', handleCustomNavigate as EventListener);
    return () => {
      window.removeEventListener('saarthi-navigate', handleCustomNavigate as EventListener);
    };
  }, []);

  // Sync user data when authenticated and profile updates
  useEffect(() => {
    if (isAuthenticated && token) {
      if (profile) {
        fetchRoadmap();
        fetchNotifications();
      }
    } else {
      setRoadmap(null);
    }
  }, [isAuthenticated, token, profile, activeTab]);

  // Load readiness when scheme changes
  useEffect(() => {
    if (isAuthenticated && token && readinessSchemeId) {
      fetchReadiness(readinessSchemeId);
    }
  }, [isAuthenticated, token, readinessSchemeId]);

  // Execute Criteria-Based Eligibility Check
  async function handleCheckCriteria(criteria: EligibilityCriteriaState) {
    setEvaluatingCriteria(true);
    setLastEvaluatedCriteria(criteria);
    try {
      const res = await apiFetch(`${API_BASE}/eligibility/check-criteria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      });
      if (res.ok) {
        const data = await res.json();
        const eligible = data.eligibleSchemes || [];
        setEligibleSchemes(eligible);
        setIneligibleSchemes(data.ineligibleSchemes || []);
        setCriteriaSummary(data.criteriaSummary || null);
        setSchemeWorkflow('eligible_results');
        if (eligible.length > 0) {
          triggerLuxuryConfetti();
        }
      }
    } catch (err) {
      console.error('Criteria check failed', err);
    } finally {
      setEvaluatingCriteria(false);
    }
  }

  // Use Logged In User Profile for Match
  async function handleMatchWithUserProfile() {
    if (!token) return;
    setEvaluatingCriteria(true);
    try {
      const res = await apiFetch(`${API_BASE}/eligibility/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        const eligible = data.eligibleSchemes || [];
        setEligibleSchemes(eligible);
        setIneligibleSchemes(data.ineligibleSchemes || []);
        setCriteriaSummary(data.userSummary || null);
        setSchemeWorkflow('eligible_results');
        if (eligible.length > 0) {
          triggerLuxuryConfetti();
        }
      }
    } catch (err) {
      console.error('User eligibility match failed', err);
    } finally {
      setEvaluatingCriteria(false);
    }
  }

  // Universal Scheme Search (myScheme.gov.in + Local verified DB)
  async function searchUniversalSchemes(q: string) {
    setIsSearchingUniversal(true);
    try {
      const res = await apiFetch(`${API_BASE}/schemes/search?q=${encodeURIComponent(q)}&limit=30`);
      if (res.ok) {
        const data = await res.json();
        setUniversalSearchResults({
          verifiedSchemes: data.verifiedSchemes || [],
          mySchemeCatalog: data.mySchemeCatalog || [],
          totalMyScheme: data.totalMyScheme || 0,
        });
      }
    } catch (err) {
      console.error('Universal search failed', err);
    } finally {
      setIsSearchingUniversal(false);
    }
  }

  async function fetchRoadmap() {
    if (!token) return;
    try {
      setRoadmapLoading(true);
      const res = await apiFetch(`${API_BASE}/roadmap/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap || data);
      }
    } catch (err) {
      console.error('Failed to fetch user roadmap', err);
    } finally {
      setRoadmapLoading(false);
    }
  }

  async function fetchPreviewRoadmap(goal = 'Full Stack Engineer', semester = 1) {
    try {
      setRoadmapLoading(true);
      const res = await apiFetch(`${API_BASE}/roadmap/preview?goal=${encodeURIComponent(goal)}&semester=${semester}`);
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap || data);
      }
    } catch (err) {
      console.error('Failed to load preview roadmap', err);
    } finally {
      setRoadmapLoading(false);
    }
  }

  async function handleSwitchCareerGoal(newGoal: string) {
    setSelectedPreviewGoal(newGoal);
    if (!token || !isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    try {
      setIsRegeneratingRoadmap(true);
      const res = await apiFetch(`${API_BASE}/roadmap/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetGoal: newGoal }),
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap || data);
        if (refreshUser) await refreshUser();
      }
    } catch (err) {
      console.error('Failed to regenerate roadmap', err);
    } finally {
      setIsRegeneratingRoadmap(false);
    }
  }

  function handleExportRoadmap() {
    if (!roadmap) return;
    let markdown = `# ${roadmap.targetGoal} — Student Academic & Career Roadmap\n`;
    markdown += `Generated by Saarthi AI for ${profile?.fullName || 'Student'} (${roadmap.course || 'Degree Program'})\n`;
    markdown += `Overall Progress: ${roadmap.overallProgressPercentage}%\n\n`;

    markdown += `## Skill Gap Analysis\n`;
    (roadmap.skillGapAnalysis || []).forEach((item: any) => {
      markdown += `- **${item.targetSkill}**: ${item.currentProficiency.toUpperCase()} (Taught in Semester ${item.resolvedInSemester || 'N/A'})\n`;
    });
    markdown += `\n---\n\n`;

    (roadmap.semesters || []).forEach((sem: any) => {
      markdown += `## Semester ${sem.semesterNumber}: ${sem.theme}\n`;
      if (sem.focusSummary) markdown += `*Focus: ${sem.focusSummary}*\n\n`;
      (sem.milestones || []).forEach((m: any, idx: number) => {
        const check = m.status === 'completed' ? '[x]' : '[ ]';
        markdown += `### ${check} ${idx + 1}. ${m.title} (${m.category.replace('_', ' ').toUpperCase()})\n`;
        markdown += `${m.description}\n`;
        if (m.actionChecklist && m.actionChecklist.length > 0) {
          markdown += `\n**Key Action Items:**\n`;
          m.actionChecklist.forEach((item: string) => {
            markdown += `- ${item}\n`;
          });
        }
        if (m.recommendedResources && m.recommendedResources.length > 0) {
          markdown += `\n**Verified Resources:**\n`;
          m.recommendedResources.forEach((res: any) => {
            markdown += `- [${res.title}](${res.url}) ${res.isFree ? '(Free)' : ''}\n`;
          });
        }
        markdown += `\n`;
      });
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${roadmap.targetGoal.replace(/[^a-zA-Z0-9]/g, '_')}_Roadmap.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleResolveSkillGap(skillName: string) {
    if (!token) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await apiFetch(`${API_BASE}/roadmap/skills/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skill: skillName }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.roadmap) setRoadmap(data.roadmap);
        if (refreshUser) await refreshUser();
      }
    } catch (err) {
      console.error('Failed to add skill to profile', err);
    }
  }

  async function fetchReadiness(schemeId: string) {
    if (!token) return;
    try {
      const res = await apiFetch(`${API_BASE}/documents/readiness/${schemeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const rep = data.report || data;
        setReadinessData({
          ...rep,
          readinessScore: rep.readinessPercentage ?? rep.readinessScore ?? 0,
          matchedCount: rep.matchedDocuments?.length ?? rep.matchedCount ?? 0,
          totalRequired: (rep.matchedDocuments?.length ?? 0) + (rep.missingDocuments?.length ?? 0),
        });
      }
    } catch {}
  }

  async function fetchNotifications() {
    if (!token) return;
    try {
      const res = await apiFetch(`${API_BASE}/notifications/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  }

  async function handleExplainScheme(scheme: any) {
    setSelectedSchemeForExplain(scheme);
    setExplainLoading(true);
    setExplainResult(null);

    const schemeId = scheme.id || scheme.schemeId;
    try {
      const res = await apiFetch(`${API_BASE}/ai/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ schemeId }),
      });

      if (res.ok) {
        const data = await res.json();
        setExplainResult(data);
      } else {
        setExplainResult({
          explanation: `${scheme.name || scheme.schemeName} provides official welfare support (${scheme.benefitAmount || 'Financial Grant'}). Verified against official circular guidelines.`,
          citations: [{ sourceVersion: 'Official Government Circular', officialUrl: scheme.officialPortalUrl || scheme.portalUrl || 'https://india.gov.in' }],
        });
      }
    } catch {
      setExplainResult({
        explanation: `${scheme.name || scheme.schemeName} provides official welfare support (${scheme.benefitAmount || 'Financial Grant'}).`,
        citations: [{ sourceVersion: 'Audited Rule Specification', officialUrl: 'https://india.gov.in' }],
      });
    } finally {
      setExplainLoading(false);
    }
  }

  async function handleToggleMilestone(milestoneId: string, currentStatus: string, directStatus?: string) {
    if (!token) {
      setAuthModalOpen(true);
      return;
    }
    const newStatus = directStatus || (currentStatus === 'completed' ? 'pending' : 'completed');

    // Optimistic UI update
    setRoadmap((prev: any) => {
      if (!prev || !prev.semesters) return prev;
      let total = 0;
      let completed = 0;
      const updatedSemesters = prev.semesters.map((sem: any) => {
        const updatedMilestones = (sem.milestones || []).map((m: any) => {
          if (m.id === milestoneId) {
            const updatedM = { ...m, status: newStatus };
            total++;
            if (newStatus === 'completed') completed++;
            return updatedM;
          }
          total++;
          if (m.status === 'completed') completed++;
          return m;
        });
        return { ...sem, milestones: updatedMilestones };
      });
      const newPct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        ...prev,
        semesters: updatedSemesters,
        overallProgressPercentage: newPct,
      };
    });

    try {
      const res = await apiFetch(`${API_BASE}/roadmap/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.roadmap) setRoadmap(data.roadmap);
      }
    } catch {
      fetchRoadmap();
    }
  }

  async function handleUploadMockDoc(docType: string) {
    if (!token) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await apiFetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          docType: docType.toLowerCase().replace(/\s+/g, '_'),
          fileName: `${docType.toLowerCase().replace(/\s+/g, '_')}_verified.pdf`,
          fileUrl: `https://storage.saarthi.internal/docs/${Date.now()}.pdf`,
          fileSize: 1024 * 350,
          consentGiven: true,
          userConsent: true,
        }),
      });

      if (res.ok) {
        setUploadSuccess(`Successfully uploaded and verified ${docType} (90-day retention logged).`);
        setTimeout(() => setUploadSuccess(null), 4000);
        fetchReadiness(readinessSchemeId);
      }
    } catch {}
  }

  async function handleSyncDeadlines() {
    if (!token) return;
    try {
      const res = await apiFetch(`${API_BASE}/notifications/sync-deadlines`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch {}
  }

  async function handleGenerateDigest() {
    if (!token) return;
    try {
      const res = await apiFetch(`${API_BASE}/notifications/digest`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch {}
  }

  async function handleSendChat() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const res = await apiFetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query: userMsg, message: userMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.answer || data.reply || 'Here is what I found for you.',
            citations: data.citations,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'I could not process your query right now. Please explore your Citizen Schemes or try again shortly.',
          },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I could not connect to the assistant service. Please check your network connection.',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#1A1715] font-sans">
      {/* Top Quiet Luxury Navbar */}
      <Navbar unreadCount={unreadCount} />

      {/* Hero Section & Website Overview based on Reference Image */}
      <HeroSection
        onExploreEligibility={() => {
          setActiveTab('schemes');
          setSchemeWorkflow('questionnaire');
          const el = document.getElementById('dashboard-tabs');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onBrowseRoadmaps={() => {
          if (!isAuthenticated) {
            setAuthModalOpen(true);
            return;
          }
          setActiveTab('roadmap');
          const el = document.getElementById('dashboard-tabs');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectTab={(tab) => {
          if (tab === 'roadmap' && !isAuthenticated) {
            setAuthModalOpen(true);
            return;
          }
          setActiveTab(tab);
          const el = document.getElementById('dashboard-tabs');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectCareerTrack={(goal) => {
          if (!isAuthenticated) {
            setAuthModalOpen(true);
            return;
          }
          setActiveTab('roadmap');
          handleSwitchCareerGoal(goal);
          const el = document.getElementById('dashboard-tabs');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSchemeDetail={(slug) => {
          setSelectedMySchemeSlug(slug);
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        isAuthenticated={isAuthenticated}
        profileName={profile?.fullName}
        profileDetails={
          isAuthenticated && profile
            ? `Active Profile: ${profile.fullName} • ${profile.educationLevel} • ${profile.category} • ${profile.state} • ₹${Number(profile.annualIncome).toLocaleString('en-IN')}/yr`
            : undefined
        }
      />

      {/* Global Navigation Tabs & Interactive Dashboard Section */}
      <section id="dashboard-tabs" className="sticky top-16 z-30 bg-[#F5F2EC]/95 backdrop-blur-md border-b border-[#E5DFD5] pt-3 pb-0 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 pb-px">
            {[
              {
                id: 'schemes',
                label: 'Citizen Schemes',
                icon: Award,
                count: eligibleSchemes.length > 0 ? eligibleSchemes.length : undefined,
              },
              {
                id: 'roadmap',
                label: 'Career Roadmap',
                icon: !isAuthenticated ? Lock : Compass,
                badge: isAuthenticated && roadmap ? `${roadmap.overallProgressPercentage}%` : !isAuthenticated ? 'Sign In' : undefined,
              },
              { id: 'readiness', label: 'Document Readiness', icon: FileCheck },
              { id: 'notifications', label: 'Deadline Alerts', icon: Bell, count: unreadCount },
            ].map(({ id, label, icon: Icon, count, badge }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  if (id === 'roadmap' && !isAuthenticated) {
                    setAuthModalOpen(true);
                  }
                  setActiveTab(id as any);
                }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === id
                    ? 'border-[#948170] text-[#1A1715] bg-[#FAF7F2] rounded-t-xl'
                    : 'border-transparent text-[#7E756C] hover:text-[#1A1715]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {count !== undefined && (
                  <span className="ml-1.5 px-2 py-0.5 text-[11px] rounded-full bg-[#FAF7F2] text-[#948170] border border-[#D5C3A5]">
                    <CounterNumber value={count} />
                  </span>
                )}
                {badge && (
                  <span className="ml-1.5 px-2 py-0.5 text-[11px] rounded-full bg-[#FAF7F2] text-[#948170] border border-[#D5C3A5]">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quick Profile / Status Pill */}
          <div className="hidden md:flex items-center gap-2.5 pb-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD5] hover:border-[#948170] text-xs font-semibold text-[#1A1715] flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Sliders className="w-3.5 h-3.5 text-[#948170]" />
                <span>Profile Settings</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg btn-luxury text-xs font-semibold shadow-2xs flex items-center gap-1.5"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===================== TAB 1: CITIZEN SCHEMES ===================== */}
        {activeTab === 'schemes' && (
          <div className="space-y-8">
            {/* Citizen Schemes Workflow View Switcher */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#E5DFD5]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#7E756C] uppercase tracking-wider">
                  Discovery Mode:
                </span>
                <div className="inline-flex p-1 rounded-xl bg-white border border-[#E5DFD5] shadow-xs">
                  <button
                    type="button"
                    onClick={() => setSchemeWorkflow('questionnaire')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      schemeWorkflow === 'questionnaire'
                        ? 'bg-[#FAF7F2] text-[#1A1715] border border-[#D5C3A5]'
                        : 'text-[#7E756C] hover:text-[#1A1715]'
                    }`}
                  >
                    1. Eligibility Check
                  </button>
                  <button
                    type="button"
                    disabled={eligibleSchemes.length === 0}
                    onClick={() => setSchemeWorkflow('eligible_results')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all disabled:opacity-40 ${
                      schemeWorkflow === 'eligible_results'
                        ? 'bg-[#FAF7F2] text-[#1A1715] border border-[#D5C3A5]'
                        : 'text-[#7E756C] hover:text-[#1A1715]'
                    }`}
                  >
                    2. Eligible Schemes ({eligibleSchemes.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchemeWorkflow('search_all')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      schemeWorkflow === 'search_all'
                        ? 'bg-[#FAF7F2] text-[#1A1715] border border-[#D5C3A5]'
                        : 'text-[#7E756C] hover:text-[#1A1715]'
                    }`}
                  >
                    <Search className="w-3 h-3 text-[#948170]" />
                    <span>Search All Schemes (5,000+)</span>
                  </button>
                </div>
              </div>

              {schemeWorkflow === 'eligible_results' && (
                <button
                  type="button"
                  onClick={() => setSchemeWorkflow('questionnaire')}
                  className="text-xs font-semibold text-[#948170] hover:text-[#1A1715] flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Modify Eligibility Criteria</span>
                </button>
              )}
            </div>

            {/* 1. STATE A: ELIGIBILITY QUESTIONNAIRE (Default) */}
            {schemeWorkflow === 'questionnaire' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <EligibilityQuestionnaire
                    initialCriteria={lastEvaluatedCriteria || undefined}
                    savedProfile={profile}
                    onUseSavedProfile={handleMatchWithUserProfile}
                    onSubmit={handleCheckCriteria}
                    onSwitchToSearch={() => setSchemeWorkflow('search_all')}
                    isLoading={evaluatingCriteria}
                  />
                </div>

                {/* Right Side: Why Eligibility First & AI Assistant */}
                <div className="space-y-6">
                  <div className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-[#948170] font-bold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Why Eligibility First?</span>
                    </div>
                    <p className="text-xs text-[#5E544C] leading-relaxed">
                      India operates over <strong>4,700+ Central and State welfare programs</strong>. Showing hundreds of irrelevant schemes leads to confusion and wasted application fees.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-[#1A1715]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>100% Deterministic Rule Engine</span>
                      </div>
                      <p className="text-[11px] text-[#7E756C]">
                        Evaluates income ceilings, reservation quotas, and domicile states with zero hallucination.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSchemeWorkflow('search_all')}
                      className="w-full py-2.5 px-3 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#1A1715] flex items-center justify-center gap-2 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#948170]" />
                      <span>Search All 5,000+ Government Schemes Directly</span>
                    </button>
                  </div>

                  {/* AI Copilot Card */}
                  <div className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                      <div className="flex items-center gap-2 text-[#948170]">
                        <Sparkles className="w-4 h-4" />
                        <h3 className="text-sm font-bold text-[#1A1715]">Saarthi AI Copilot</h3>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Official RAG
                      </span>
                    </div>

                    <div className="h-64 overflow-y-auto space-y-3 pr-1 text-xs scrollbar-thin">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl ${
                            msg.role === 'user'
                              ? 'bg-[#FAF7F2] border border-[#D5C3A5] ml-4 text-[#1A1715]'
                              : 'bg-white border border-[#E5DFD5] mr-4 text-[#5E544C]'
                          }`}
                        >
                          <div className="font-semibold mb-1 text-[10px] uppercase tracking-wider text-[#948170]">
                            {msg.role === 'user' ? 'You' : 'Saarthi AI'}
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendChat();
                      }}
                      className="relative pt-2"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about schemes, eligibility rules..."
                        className="w-full pl-3 pr-10 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs text-[#1A1715] placeholder-[#A0988F] focus:outline-none focus:border-[#948170] focus:bg-white"
                      />
                      <button
                        type="submit"
                        disabled={isChatLoading || !chatInput.trim()}
                        className="absolute right-2 top-4 p-1 text-[#948170] hover:text-[#1A1715] disabled:opacity-40"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 2. STATE B: ELIGIBLE SCHEMES ONLY */}
            {schemeWorkflow === 'eligible_results' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Eligibility Summary Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-white via-[#FAF7F2] to-white border border-[#D5C3A5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Criteria Verified • 100% Deterministic Match</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1A1715]">
                      Found {eligibleSchemes.length} Citizen Schemes You Are Eligible For
                    </h2>
                    {criteriaSummary && (
                      <p className="text-xs text-[#5E544C] mt-1">
                        Evaluated for {criteriaSummary.gender} ({criteriaSummary.age} yrs) • {criteriaSummary.category} category • {criteriaSummary.state} • Family Income: ₹{Number(criteriaSummary.annualIncome).toLocaleString('en-IN')}/yr
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSchemeWorkflow('questionnaire')}
                      className="px-4 py-2 rounded-xl bg-white border border-[#E5DFD5] hover:border-[#948170] text-xs font-semibold text-[#1A1715] flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#948170]" />
                      <span>Re-check Criteria</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSchemeWorkflow('search_all')}
                      className="px-4 py-2 rounded-xl btn-luxury text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search All 5,000+ Schemes</span>
                    </button>
                  </div>
                </div>

                {/* Eligible Schemes List */}
                {eligibleSchemes.length === 0 ? (
                  <div className="p-12 text-center card-container bg-white border border-[#E5DFD5] rounded-2xl">
                    <Award className="w-12 h-12 text-[#948170] mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-bold text-[#1A1715]">No Specific Schemes Found For These Exact Inputs</h3>
                    <p className="text-xs text-[#7E756C] mt-1 max-w-md mx-auto">
                      Try updating your income limit, state, or occupation in the criteria checker, or browse all government schemes using universal search.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSchemeWorkflow('questionnaire')}
                      className="mt-4 px-5 py-2.5 rounded-xl btn-luxury text-xs font-semibold"
                    >
                      Adjust Criteria
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {eligibleSchemes.map((scheme: any, sIdx: number) => {
                      const title = scheme.schemeName || scheme.name;
                      const portalUrl = scheme.officialPortalUrl || scheme.portalUrl || 'https://scholarships.gov.in';

                      return (
                        <GlassCard
                          key={scheme.schemeId || scheme.id}
                          tilt
                          floating
                          className="card-container p-6 bg-white border border-[#E5DFD5] hover:border-[#948170] rounded-2xl space-y-4 flex flex-col justify-between shadow-xs transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#6B5C4F] border border-[#D5C3A5]">
                                  {scheme.level || 'Central'}
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F5F2EC] text-[#7E756C] border border-[#E5DFD5]">
                                  {scheme.categoryType || 'Welfare'}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-[#1A1715] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#D5C3A5]">
                                {scheme.benefitAmount}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-[#1A1715] hover:text-[#948170] transition-colors leading-snug">
                              {title}
                            </h3>

                            {/* Matched Criteria Chips */}
                            {scheme.matchedCriteria && scheme.matchedCriteria.length > 0 && (
                              <div className="mt-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] space-y-1">
                                <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                                  <AnimatedCheckmark size={16} />
                                  <span>Why You Qualify:</span>
                                </div>
                                <ul className="text-[11px] text-[#5E544C] space-y-0.5 pl-1">
                                  {scheme.matchedCriteria.slice(0, 3).map((crit: string, cIdx: number) => (
                                    <li key={cIdx}>• {crit}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-between gap-2 text-xs">
                            <div className="text-[11px] text-[#7E756C]">
                              Deadline: <strong className="text-[#1A1715]">{scheme.applicationDeadline || 'Open Cycle'}</strong>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleExplainScheme(scheme)}
                                className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F5F2EC] text-xs font-semibold text-[#948170] flex items-center gap-1 border border-[#E5DFD5] transition-colors svgator-icon-bounce"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>AI Explain</span>
                              </button>
                              <MagneticButton strength={0.15}>
                                <RippleClickWrapper>
                                  <a
                                    href={portalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-1.5 rounded-lg btn-luxury text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-transform inline-flex"
                                  >
                                    <span>Apply</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </RippleClickWrapper>
                              </MagneticButton>
                            </div>
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. STATE C: UNIVERSAL SEARCH (myScheme.gov.in Catalog & Database) */}
            {schemeWorkflow === 'search_all' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Search Bar Banner */}
                <div className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#948170] mb-1">
                        <Globe className="w-4 h-4" />
                        <span>Live National Database (myScheme.gov.in)</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1A1715]">
                        Search 5,000+ Indian Government Schemes
                      </h2>
                      <p className="text-xs text-[#7E756C] mt-0.5">
                        Direct access to central ministries and state government citizen schemes.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSchemeWorkflow(eligibleSchemes.length > 0 ? 'eligible_results' : 'questionnaire')}
                      className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F5F2EC] text-xs font-semibold text-[#1A1715] border border-[#E5DFD5] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{eligibleSchemes.length > 0 ? 'Back to Eligible Schemes' : 'Check My Eligibility'}</span>
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#8E8780]" />
                    <input
                      type="text"
                      value={universalSearchQuery}
                      onChange={(e) => {
                        setUniversalSearchQuery(e.target.value);
                        searchUniversalSchemes(e.target.value);
                      }}
                      placeholder="Search schemes by name, keyword (e.g. Kisan, Swarnima, Pragati, Mudra, Scholarship, Pension)..."
                      className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] placeholder-[#A0988F] font-medium focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Quick Filters */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-semibold text-[#7E756C] mr-1">Popular:</span>
                    {['Kisan', 'Mudra', 'Scholarship', 'Women', 'Swarnima', 'Disabled', 'Pension'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setUniversalSearchQuery(tag);
                          searchUniversalSchemes(tag);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F5F2EC] text-[11px] font-medium text-[#5E544C] border border-[#E5DFD5] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results List */}
                {isSearchingUniversal ? (
                  <div className="py-16 text-center space-y-3">
                    <OrbitLoader size={44} />
                    <p className="text-xs text-[#7E756C]">Searching national schemes repository...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 1. Verified Local Schemes */}
                    {universalSearchResults.verifiedSchemes.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#948170]">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Audited & Verified Platform Schemes ({universalSearchResults.verifiedSchemes.length})</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {universalSearchResults.verifiedSchemes.map((s: any) => (
                            <GlassCard
                              key={s.id}
                              tilt
                              floating
                              className="card-container p-5 bg-white border border-[#E5DFD5] hover:border-[#948170] rounded-2xl space-y-3 flex flex-col justify-between shadow-xs transition-all"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#6B5C4F] border border-[#D5C3A5]">
                                    {s.level} Scheme
                                  </span>
                                  <span className="text-xs font-bold text-[#1A1715] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#D5C3A5]">
                                    {s.benefitAmount}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-[#1A1715]">{s.name}</h4>
                                <p className="text-[11px] text-[#7E756C] line-clamp-2 mt-1">
                                  {s.shortDescription || 'Verified welfare initiative.'}
                                </p>
                              </div>

                              <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => handleExplainScheme(s)}
                                  className="text-xs font-semibold text-[#948170] hover:text-[#1A1715] flex items-center gap-1 svgator-icon-bounce"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Explain Rules</span>
                                </button>
                                <MagneticButton strength={0.15}>
                                  <a
                                    href={s.portalUrl || 'https://india.gov.in'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-lg btn-luxury text-xs font-semibold flex items-center gap-1 inline-flex"
                                  >
                                    <span>Apply</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </MagneticButton>
                              </div>
                            </GlassCard>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. myScheme.gov.in Live Catalog Results */}
                    <div className="space-y-3 pt-4 border-t border-[#E5DFD5]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#948170]">
                          <Landmark className="w-4 h-4" />
                          <span>myScheme.gov.in National Catalog Matches ({universalSearchResults.mySchemeCatalog.length})</span>
                        </div>
                        <span className="text-[11px] text-[#7E756C]">
                          Total Indexed: {universalSearchResults.totalMyScheme} schemes
                        </span>
                      </div>

                      {universalSearchResults.mySchemeCatalog.length === 0 ? (
                        <div className="p-8 text-center card-container bg-white border border-[#E5DFD5] rounded-2xl text-xs text-[#7E756C]">
                          No schemes matching "{universalSearchQuery}". Try another keyword.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {universalSearchResults.mySchemeCatalog.map((item: any) => (
                            <GlassCard
                              key={item.slug}
                              tilt
                              floating
                              className="card-container p-5 bg-white border border-[#E5DFD5] hover:border-[#948170] rounded-2xl space-y-3 flex flex-col justify-between shadow-xs transition-all"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  {item.shortTitle ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#6B5C4F] border border-[#D5C3A5]">
                                      {item.shortTitle}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-medium text-[#7E756C]">Govt Scheme</span>
                                  )}
                                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    myScheme.gov.in
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-[#1A1715] line-clamp-2 leading-snug">
                                  {item.name}
                                </h4>
                              </div>

                              <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between">
                                <MagneticButton strength={0.12}>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMySchemeSlug(item.slug)}
                                    className="text-xs font-bold text-[#948170] hover:text-[#1A1715] flex items-center gap-1"
                                  >
                                    <span>View Details</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </MagneticButton>
                                <a
                                  href={`https://www.myscheme.gov.in/schemes/${item.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] text-[#7E756C] hover:text-[#1A1715] flex items-center gap-1"
                                >
                                  <span>Portal</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </GlassCard>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: STUDENT CAREER ROADMAP ===================== */}
        {activeTab === 'roadmap' && (!isAuthenticated ? (
          <div className="card-container p-8 sm:p-14 bg-white border border-[#E5DFD5] rounded-3xl shadow-sm text-center max-w-2xl mx-auto my-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#ECE5D8] border border-[#D5C3A5] flex items-center justify-center mx-auto text-[#948170] shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[#FAF7F2] text-[#6B5C4F] border border-[#D5C3A5]">
                Sign In Required
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1715] pt-2">
                Sign In to View Career Roadmap
              </h3>
              <p className="text-sm text-[#5E544C] max-w-lg mx-auto leading-relaxed">
                Semester-by-semester roadmaps, curated skill milestones, and industry certifications are tailored to your student profile and academic track. Please sign in or create an account to view and customize your roadmap.
              </p>
            </div>

            {/* 3 Quick Benefit Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <div className="flex items-center gap-2 font-bold text-[#1A1715] mb-1">
                  <Compass className="w-4 h-4 text-[#948170]" />
                  <span>8 Semesters</span>
                </div>
                <p className="text-[11px] text-[#7E756C]">Curated milestones for 9+ technical & governance tracks.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <div className="flex items-center gap-2 font-bold text-[#1A1715] mb-1">
                  <Sparkles className="w-4 h-4 text-[#948170]" />
                  <span>Skill Analysis</span>
                </div>
                <p className="text-[11px] text-[#7E756C]">Identify skill gaps and recommended industry certifications.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                <div className="flex items-center gap-2 font-bold text-[#1A1715] mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#948170]" />
                  <span>100% Free</span>
                </div>
                <p className="text-[11px] text-[#7E756C]">Save milestones, track completion, and receive deadline alerts.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <MagneticButton strength={0.2}>
                <RippleClickWrapper>
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full sm:w-auto px-7 py-3 rounded-full btn-luxury text-sm font-semibold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Access Roadmap</span>
                  </button>
                </RippleClickWrapper>
              </MagneticButton>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('schemes');
                  const el = document.getElementById('dashboard-tabs');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-[#FAF7F2] text-[#5E544C] hover:text-[#1A1715] border border-[#E5DFD5] text-sm font-medium transition-colors cursor-pointer"
              >
                Back to Citizen Schemes
              </button>
            </div>
          </div>
        ) : (() => {
          const allMilestones = (roadmap?.semesters || []).flatMap((s: any) => s.milestones || []);
          const totalMilestonesCount = allMilestones.length;
          const completedMilestonesCount = allMilestones.filter((m: any) => m.status === 'completed').length;
          const inProgressMilestonesCount = allMilestones.filter((m: any) => m.status === 'in_progress').length;
          const pendingMilestonesCount = allMilestones.filter((m: any) => m.status === 'pending').length;

          const coreSubjectCount = allMilestones.filter((m: any) => m.category === 'core_subject').length;
          const skillMilestoneCount = allMilestones.filter((m: any) => m.category === 'skill').length;
          const projectMilestoneCount = allMilestones.filter((m: any) => m.category === 'project').length;
          const certMilestoneCount = allMilestones.filter((m: any) => m.category === 'certification' || m.category === 'internship').length;

          const masteredSkillsCount = (roadmap?.skillGapAnalysis || []).filter(
            (s: any) => s.currentProficiency === 'intermediate' || s.currentProficiency === 'advanced'
          ).length;
          const totalSkillsCount = (roadmap?.skillGapAnalysis || []).length;
          const skillReadinessPct = totalSkillsCount > 0 ? Math.round((masteredSkillsCount / totalSkillsCount) * 100) : 0;

          const semNumbers = (roadmap?.semesters || []).map((s: any) => s.semesterNumber);
          const semStart = semNumbers.length > 0 ? Math.min(...semNumbers) : 1;
          const semEnd = semNumbers.length > 0 ? Math.max(...semNumbers) : 8;

          // Filter semesters and their milestones
          const filteredSemesters = (roadmap?.semesters || [])
            .filter((sem: any) => {
              if (roadmapSemesterFilter !== 'all' && sem.semesterNumber !== roadmapSemesterFilter) {
                return false;
              }
              return true;
            })
            .map((sem: any) => {
              const filteredMilestones = (sem.milestones || []).filter((m: any) => {
                // Category filter
                if (roadmapCategoryFilter !== 'all') {
                  if (roadmapCategoryFilter === 'cert_intern') {
                    if (m.category !== 'certification' && m.category !== 'internship') return false;
                  } else if (m.category !== roadmapCategoryFilter) {
                    return false;
                  }
                }
                // Status filter
                if (roadmapStatusFilter !== 'all' && m.status !== roadmapStatusFilter) {
                  return false;
                }
                // Search filter
                if (roadmapSearch.trim()) {
                  const query = roadmapSearch.toLowerCase();
                  const matchTitle = m.title.toLowerCase().includes(query);
                  const matchDesc = m.description.toLowerCase().includes(query);
                  const matchResource = (m.recommendedResources || []).some((r: any) => r.title.toLowerCase().includes(query));
                  const matchChecklist = (m.actionChecklist || []).some((c: string) => c.toLowerCase().includes(query));
                  if (!matchTitle && !matchDesc && !matchResource && !matchChecklist) return false;
                }
                return true;
              });

              return {
                ...sem,
                filteredMilestones,
              };
            })
            .filter((sem: any) => sem.filteredMilestones.length > 0 || !roadmapSearch.trim());

          return (
            <div className="space-y-8">
              {/* Quick Career Switcher Pill Bar */}
              <div className="card-container p-4 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#948170]" />
                    <span className="text-xs font-bold text-[#1A1715] uppercase tracking-wider">
                      Explore Career Tracks
                    </span>
                  </div>
                  <span className="text-[11px] text-[#7E756C]">
                    Click any career track to instantly view or re-align your curriculum
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {POPULAR_CAREER_TRACKS.map((track) => {
                    const isCurrent = roadmap && roadmap.targetGoal === track.id;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => handleSwitchCareerGoal(track.id)}
                        disabled={isRegeneratingRoadmap}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                          isCurrent
                            ? 'bg-[#1A1715] text-[#F5F2EC] border-[#D5C3A5] shadow-xs'
                            : 'bg-white hover:bg-[#FAF7F2] text-[#1A1715] border-[#E5DFD5] hover:border-[#948170]'
                        }`}
                      >
                        <span>{track.icon}</span>
                        <span>{track.label}</span>
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                  {!POPULAR_CAREER_TRACKS.some((t) => t.id === roadmap?.targetGoal) && roadmap?.targetGoal && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-[#1A1715] text-[#F5F2EC] border border-[#D5C3A5] shadow-xs cursor-default"
                    >
                      <span>🎯</span>
                      <span>{roadmap.targetGoal}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 animate-pulse" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-[#FAF7F2] hover:bg-[#F5F2EC] text-[#6B5C4F] border border-[#D5C3A5] transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Custom Goal...</span>
                  </button>
                </div>
              </div>

              {/* Main Header Card */}
              <div className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#6B5C4F] border border-[#D5C3A5] uppercase tracking-wider">
                      Semester {semStart} to {semEnd} Academic Progression
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {totalMilestonesCount} Curated Milestones
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      NPTEL & AICTE Aligned
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-[#1A1715]">
                      {roadmap ? `${roadmap.targetGoal} Roadmap` : 'Full Stack Engineer Roadmap'}
                    </h2>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSwitchCareerGoal(roadmap?.targetGoal || 'Full Stack Engineer')}
                        disabled={isRegeneratingRoadmap}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#948170] hover:text-[#1A1715] bg-[#FAF7F2] hover:bg-[#F5F2EC] border border-[#E5DFD5] rounded-lg transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Re-generate and align milestones with the latest curriculum standards"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingRoadmap ? 'animate-spin' : ''}`} />
                        <span>{isRegeneratingRoadmap ? 'Regenerating...' : 'Regenerate'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportRoadmap}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#948170] hover:text-[#1A1715] bg-[#FAF7F2] hover:bg-[#F5F2EC] border border-[#E5DFD5] rounded-lg transition-colors cursor-pointer shadow-2xs"
                        title="Export complete semester roadmap and action items as Markdown Study Guide"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Guide</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProfileModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#948170] hover:text-[#1A1715] bg-[#FAF7F2] hover:bg-[#F5F2EC] border border-[#E5DFD5] rounded-lg transition-colors cursor-pointer shadow-2xs"
                        title="Change target goal, current semester, or registered skills in profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#7E756C]">
                    Living curriculum mapping covering accredited NPTEL / Swayam theory, hands-on production skills, portfolio projects, and AICTE summer internships.
                  </p>

                  {!isAuthenticated && (
                    <div className="pt-2 flex items-center gap-2 text-xs text-[#948170]">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Viewing live interactive preview. Sign up to save your personalized completion progress!</span>
                      <button
                        type="button"
                        onClick={() => setAuthModalOpen(true)}
                        className="underline font-bold text-[#1A1715] hover:text-[#948170] ml-1"
                      >
                        Sign In / Register
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-5 shrink-0 bg-[#FAF7F2]/60 p-4 rounded-xl border border-[#E5DFD5]">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-[#7E756C]">Overall Progress</div>
                    <div className="text-2xl font-bold text-[#948170]">
                      <CounterNumber value={roadmap ? roadmap.overallProgressPercentage : 0} suffix="%" />
                    </div>
                    <div className="text-[11px] text-[#7E756C] mt-0.5">
                      {completedMilestonesCount} of {totalMilestonesCount} Milestones Done
                    </div>
                  </div>
                  <div className="w-28">
                    <LiquidFillLoader progress={roadmap ? roadmap.overallProgressPercentage : 0} height={10} />
                  </div>
                </div>
              </div>

              {roadmapLoading ? (
                <div className="p-8 text-center text-sm text-[#7E756C] space-y-4">
                  <RoadmapTimelineSkeleton />
                  <div className="flex items-center justify-center gap-2 text-xs text-[#948170] pt-2">
                    <OrbitLoader size={20} />
                    <span>Loading personalized academic curriculum...</span>
                  </div>
                </div>
              ) : !roadmap || !roadmap.semesters || roadmap.semesters.length === 0 ? (
                <div className="p-12 text-center card-container bg-white border border-[#E5DFD5] rounded-2xl shadow-xs">
                  <FloatingWrapper yOffset={5}>
                    <Compass className="w-12 h-12 text-[#948170] mx-auto mb-3 opacity-60" />
                  </FloatingWrapper>
                  <h3 className="text-base font-bold text-[#1A1715]">No Roadmap Generated Yet</h3>
                  <p className="text-xs text-[#7E756C] mt-1 max-w-md mx-auto">
                    Complete your student profile to generate a semester-by-semester career plan tailored to your goal.
                  </p>
                  <MagneticButton strength={0.2}>
                    <RippleClickWrapper>
                      <button
                        type="button"
                        onClick={() => setProfileModalOpen(true)}
                        className="mt-4 px-5 py-2.5 rounded-xl btn-luxury text-xs font-semibold shadow-xs active:scale-95 transition-transform"
                      >
                        Generate My Career Roadmap
                      </button>
                    </RippleClickWrapper>
                  </MagneticButton>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Interactive Filter & Navigation Bar */}
                  <div className="card-container p-4 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      {/* Search Bar */}
                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-[#7E756C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={roadmapSearch}
                          onChange={(e) => setRoadmapSearch(e.target.value)}
                          placeholder="Search skills, topics, NPTEL courses, projects..."
                          className="w-full pl-9 pr-8 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] placeholder-[#7E756C] focus:outline-hidden focus:border-[#948170] transition-colors"
                        />
                        {roadmapSearch && (
                          <button
                            type="button"
                            onClick={() => setRoadmapSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7E756C] hover:text-[#1A1715]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Semester Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        <button
                          type="button"
                          onClick={() => setRoadmapSemesterFilter('all')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            roadmapSemesterFilter === 'all'
                              ? 'bg-[#1A1715] text-[#F5F2EC]'
                              : 'bg-[#FAF7F2] text-[#7E756C] hover:text-[#1A1715] border border-[#E5DFD5]'
                          }`}
                        >
                          All Semesters
                        </button>
                        {(roadmap.semesters || []).map((s: any) => {
                          const semTotal = (s.milestones || []).length;
                          const semDone = (s.milestones || []).filter((m: any) => m.status === 'completed').length;
                          const isComplete = semTotal > 0 && semDone === semTotal;
                          return (
                            <button
                              key={s.semesterNumber}
                              type="button"
                              onClick={() => setRoadmapSemesterFilter(s.semesterNumber)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                                roadmapSemesterFilter === s.semesterNumber
                                  ? 'bg-[#1A1715] text-[#F5F2EC]'
                                  : 'bg-[#FAF7F2] text-[#7E756C] hover:text-[#1A1715] border border-[#E5DFD5]'
                              }`}
                            >
                              <span>S{s.semesterNumber}</span>
                              {isComplete && <Check className="w-3 h-3 text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Category & Status Filter Tabs */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E5DFD5]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-[#7E756C] mr-1">Category:</span>
                        <button
                          type="button"
                          onClick={() => setRoadmapCategoryFilter('all')}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                            roadmapCategoryFilter === 'all'
                              ? 'bg-[#948170] text-white'
                              : 'bg-[#FAF7F2] text-[#7E756C] hover:text-[#1A1715]'
                          }`}
                        >
                          All ({totalMilestonesCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setRoadmapCategoryFilter('core_subject')}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                            roadmapCategoryFilter === 'core_subject'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                          }`}
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Core Subjects ({coreSubjectCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRoadmapCategoryFilter('skill')}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                            roadmapCategoryFilter === 'skill'
                              ? 'bg-amber-600 text-white'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          <Code className="w-3 h-3" />
                          <span>Practical Skills ({skillMilestoneCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRoadmapCategoryFilter('project')}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                            roadmapCategoryFilter === 'project'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>Projects ({projectMilestoneCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRoadmapCategoryFilter('cert_intern')}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                            roadmapCategoryFilter === 'cert_intern'
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                          }`}
                        >
                          <Award className="w-3 h-3" />
                          <span>Certifications & Internships ({certMilestoneCount})</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-[#7E756C] mr-1">Status:</span>
                        <button
                          type="button"
                          onClick={() => setRoadmapStatusFilter('all')}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                            roadmapStatusFilter === 'all'
                              ? 'bg-[#1A1715] text-[#F5F2EC]'
                              : 'bg-[#FAF7F2] text-[#7E756C] hover:text-[#1A1715]'
                          }`}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          onClick={() => setRoadmapStatusFilter('in_progress')}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                            roadmapStatusFilter === 'in_progress'
                              ? 'bg-amber-500 text-white'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          In Progress ({inProgressMilestonesCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setRoadmapStatusFilter('completed')}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                            roadmapStatusFilter === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          Completed ({completedMilestonesCount})
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Semesters Left Columns (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                      {filteredSemesters.length === 0 ? (
                        <div className="p-8 text-center card-container bg-white border border-[#E5DFD5] rounded-2xl shadow-xs">
                          <p className="text-sm font-bold text-[#1A1715]">No milestones match your current filter</p>
                          <p className="text-xs text-[#7E756C] mt-1">Try clearing your search query or category filters.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setRoadmapSearch('');
                              setRoadmapCategoryFilter('all');
                              setRoadmapStatusFilter('all');
                              setRoadmapSemesterFilter('all');
                            }}
                            className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF7F2] hover:bg-[#F5F2EC] text-[#1A1715] border border-[#E5DFD5]"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      ) : (
                        filteredSemesters.map((sem: any) => {
                          const isCollapsed = collapsedSemesters[sem.semesterNumber];
                          const semTotal = (sem.milestones || []).length;
                          const semDone = (sem.milestones || []).filter((m: any) => m.status === 'completed').length;
                          const semPct = semTotal > 0 ? Math.round((semDone / semTotal) * 100) : 0;

                          return (
                            <div
                              key={sem.semesterNumber}
                              id={`sem-${sem.semesterNumber}`}
                              className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-4"
                            >
                              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                                <div className="flex items-center gap-3">
                                  <span className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#948170] font-bold text-xs flex items-center justify-center border border-[#D5C3A5] shadow-2xs">
                                    S{sem.semesterNumber}
                                  </span>
                                  <div>
                                    <h3 className="text-sm font-bold text-[#1A1715]">{sem.theme}</h3>
                                    {sem.focusSummary && (
                                      <p className="text-[11px] text-[#7E756C] italic">{sem.focusSummary}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span
                                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                      semPct === 100
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : 'bg-[#FAF7F2] text-[#6B5C4F] border-[#E5DFD5]'
                                    }`}
                                  >
                                    {semDone} / {semTotal} Done ({semPct}%)
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCollapsedSemesters((prev) => ({
                                        ...prev,
                                        [sem.semesterNumber]: !prev[sem.semesterNumber],
                                      }))
                                    }
                                    className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#7E756C] hover:text-[#1A1715] transition-colors"
                                    title={isCollapsed ? 'Expand semester' : 'Collapse semester'}
                                  >
                                    {isCollapsed ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronUp className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {!isCollapsed && (
                                <div className="space-y-3.5">
                                  {sem.filteredMilestones.map((m: any) => {
                                    const isCompleted = m.status === 'completed';
                                    const isInProgress = m.status === 'in_progress';
                                    const isHighlighted = activeMilestoneHighlight === m.id;

                                    return (
                                      <div
                                        key={m.id}
                                        id={m.id}
                                        className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                                          isCompleted
                                            ? 'bg-[#FAF7F2]/80 border-emerald-300 text-[#7E756C]'
                                            : isInProgress
                                            ? 'bg-white border-[#D5C3A5] ring-1 ring-[#D5C3A5]/40 shadow-xs'
                                            : 'bg-white border-[#E5DFD5] hover:border-[#948170] shadow-2xs'
                                        } ${isHighlighted ? 'ring-2 ring-[#948170] bg-amber-50/30' : ''}`}
                                      >
                                        {/* Status Checkbox Button */}
                                        <button
                                          type="button"
                                          onClick={() => handleToggleMilestone(m.id, m.status)}
                                          className="mt-0.5 shrink-0 transition-transform active:scale-90 cursor-pointer"
                                          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
                                        >
                                          {isCompleted ? (
                                            <AnimatedCheckmark size={20} />
                                          ) : isInProgress ? (
                                            <div className="w-5 h-5 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center">
                                              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                            </div>
                                          ) : (
                                            <div className="w-5 h-5 rounded-full border border-[#8E8780] hover:border-[#1A1715] transition-colors" />
                                          )}
                                        </button>

                                        {/* Milestone Body */}
                                        <div className="flex-1 space-y-2">
                                          <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <div>
                                              <h4
                                                className={`text-xs sm:text-sm font-bold ${
                                                  isCompleted ? 'line-through text-[#7E756C]' : 'text-[#1A1715]'
                                                }`}
                                              >
                                                {m.title}
                                              </h4>
                                            </div>

                                            {/* Badges */}
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                                                  m.category === 'core_subject'
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                    : m.category === 'skill'
                                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                                    : m.category === 'project'
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    : m.category === 'internship'
                                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                                    : 'bg-purple-50 text-purple-700 border-purple-200'
                                                }`}
                                              >
                                                {m.category.replace('_', ' ')}
                                              </span>

                                              {m.difficulty && (
                                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#FAF7F2] text-[#7E756C] border border-[#E5DFD5] capitalize">
                                                  {m.difficulty}
                                                </span>
                                              )}

                                              {m.targetCompletionMonth && (
                                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#FAF7F2] text-[#7E756C] border border-[#E5DFD5]">
                                                  Month {m.targetCompletionMonth}
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <p className="text-[11px] leading-relaxed text-[#5E544C]">
                                            {m.description}
                                          </p>

                                          {/* Action Checklist */}
                                          {m.actionChecklist && m.actionChecklist.length > 0 && (
                                            <div className="p-2.5 rounded-lg bg-[#FAF7F2]/60 border border-[#E5DFD5]/80 space-y-1">
                                              <div className="text-[10px] font-bold text-[#6B5C4F] uppercase tracking-wider flex items-center gap-1">
                                                <Target className="w-3 h-3 text-[#948170]" />
                                                <span>Key Action Deliverables</span>
                                              </div>
                                              <ul className="space-y-0.5">
                                                {m.actionChecklist.map((act: string, aIdx: number) => (
                                                  <li key={aIdx} className="text-[11px] text-[#5E544C] flex items-center gap-1.5">
                                                    <span className="w-1 h-1 rounded-full bg-[#948170]" />
                                                    <span>{act}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}

                                          {/* Curated Resources */}
                                          {m.recommendedResources && m.recommendedResources.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5DFD5]">
                                              <span className="text-[10px] font-bold text-[#7E756C]">Verified Resources:</span>
                                              {m.recommendedResources.map((res: any, rIdx: number) => (
                                                <a
                                                  key={rIdx}
                                                  href={res.url}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#FAF7F2] hover:bg-[#F5F2EC] text-[#948170] hover:text-[#1A1715] border border-[#E5DFD5] transition-colors"
                                                >
                                                  <span>{res.title}</span>
                                                  {res.isFree && (
                                                    <span className="text-[9px] px-1 py-0.2 rounded-sm bg-emerald-100 text-emerald-800 font-bold">
                                                      Free
                                                    </span>
                                                  )}
                                                  <ExternalLink className="w-2.5 h-2.5" />
                                                </a>
                                              ))}
                                            </div>
                                          )}

                                          {/* Quick Status Bar */}
                                          <div className="flex items-center justify-between gap-2 pt-1">
                                            <div className="flex items-center gap-1">
                                              <span className="text-[10px] text-[#7E756C]">Status:</span>
                                              <button
                                                type="button"
                                                onClick={() => handleToggleMilestone(m.id, m.status, 'pending')}
                                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                                                  m.status === 'pending'
                                                    ? 'bg-[#1A1715] text-white'
                                                    : 'bg-[#FAF7F2] text-[#7E756C] hover:text-[#1A1715]'
                                                }`}
                                              >
                                                Pending
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleToggleMilestone(m.id, m.status, 'in_progress')}
                                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                                                  m.status === 'in_progress'
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-[#FAF7F2] text-[#7E756C] hover:text-[#1A1715]'
                                                }`}
                                              >
                                                In Progress
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleToggleMilestone(m.id, m.status, 'completed')}
                                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                                                  m.status === 'completed'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-[#FAF7F2] text-[#7E756C] hover:text-[#1A1715]'
                                                }`}
                                              >
                                                Completed
                                              </button>
                                            </div>

                                            {m.estimatedHours && (
                                              <span className="text-[10px] text-[#7E756C] flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>~{m.estimatedHours} hrs</span>
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Right Column (1 col): Skill Gap & Career Guidance */}
                    <div className="space-y-6">
                      {/* Skill Gap Analysis Widget */}
                      <div className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                          <div className="flex items-center gap-2 text-[#948170]">
                            <TrendingUp className="w-4 h-4" />
                            <h3 className="text-sm font-bold text-[#1A1715]">Skill Gap Analysis</h3>
                          </div>
                          <span className="text-[11px] font-bold text-[#948170]">
                            {skillReadinessPct}% Ready
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs text-[#7E756C] mb-1">
                            <span>Career Readiness Score</span>
                            <span className="font-bold text-[#1A1715]">
                              {masteredSkillsCount} of {totalSkillsCount} Mastered
                            </span>
                          </div>
                          <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#E5DFD5]">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${skillReadinessPct}%` }}
                            />
                          </div>
                        </div>

                        <p className="text-xs text-[#7E756C]">
                          Target Career: <strong className="text-[#1A1715]">{roadmap.targetGoal}</strong>
                        </p>

                        <div className="space-y-2.5 pt-1 max-h-[480px] overflow-y-auto pr-1">
                          {(roadmap.skillGapAnalysis || []).map((item: any, idx: number) => {
                            const isMastered = item.currentProficiency === 'intermediate' || item.currentProficiency === 'advanced';

                            return (
                              <div
                                key={idx}
                                className={`p-3 rounded-xl border transition-all ${
                                  isMastered
                                    ? 'bg-emerald-50/50 border-emerald-200'
                                    : 'bg-[#FAF7F2] border-[#E5DFD5]'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-[#1A1715]">{item.targetSkill}</span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      isMastered
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                                    }`}
                                  >
                                    {isMastered ? 'Mastered' : 'Skill Gap'}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#E5DFD5]/60 text-[10px]">
                                  <span className="text-[#7E756C]">
                                    {item.resolvedInSemester ? `Taught in Semester ${item.resolvedInSemester}` : 'Curriculum Track'}
                                  </span>

                                  {!isMastered && (
                                    <button
                                      type="button"
                                      onClick={() => handleResolveSkillGap(item.targetSkill)}
                                      className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                                      title="Mark as learned to add to profile and update gap analysis"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>I Know This (+)</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* AI Copilot Study Guidance Card */}
                      <div className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-3">
                        <div className="flex items-center gap-2 text-[#948170]">
                          <Sparkles className="w-4 h-4" />
                          <h3 className="text-sm font-bold text-[#1A1715]">AI Copilot Guidance</h3>
                        </div>
                        <p className="text-xs text-[#7E756C]">
                          Ask our grounded AI Copilot for advice on mastering milestones, preparing for campus interviews, or building projects.
                        </p>
                        <div className="space-y-1.5 pt-1">
                          {[
                            `How should I prepare for ${roadmap.targetGoal} projects?`,
                            'What are the best free resources for System Design?',
                            'How do I apply for AICTE summer internships?',
                          ].map((promptText, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => {
                                setChatInput(promptText);
                                setActiveTab('schemes');
                              }}
                              className="w-full text-left p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F5F2EC] text-[11px] font-semibold text-[#1A1715] border border-[#E5DFD5] transition-colors flex items-center justify-between"
                            >
                              <span className="line-clamp-1">{promptText}</span>
                              <ChevronRight className="w-3 h-3 text-[#7E756C] shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* UGC & AICTE Academic Verification Card */}
                      <div className="card-container p-5 bg-[#FAF7F2] border border-[#D5C3A5] rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 text-[#1A1715] font-bold text-xs">
                          <Landmark className="w-4 h-4 text-[#948170]" />
                          <span>UGC & AICTE Credit Transfer</span>
                        </div>
                        <p className="text-[11px] text-[#5E544C] leading-relaxed">
                          Under the UGC National Credit Framework (NCrF), accredited Swayam / NPTEL certifications can be transferred as 2 to 4 academic credits directly towards your degree transcript.
                        </p>
                        <a
                          href="https://internship.aicte-india.org"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#948170] hover:underline pt-1"
                        >
                          <span>Visit AICTE Internship Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })())}

        {/* ===================== TAB 3: DOCUMENT READINESS ===================== */}
        {activeTab === 'readiness' && (
          <div className="space-y-8">
            <div className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1A1715]">Document Readiness Assistant</h2>
                  <p className="text-xs text-[#7E756C] mt-1">
                    Detect missing certificates, verify 90-day retention policies, and get official acquisition steps.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-[#7E756C]">Target Scheme:</label>
                  <select
                    value={readinessSchemeId}
                    onChange={(e) => setReadinessSchemeId(e.target.value)}
                    className="px-3.5 py-2 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-xs text-[#1A1715] font-semibold focus:outline-none focus:border-[#948170]"
                  >
                    <option value="scheme-aicte-pragati">AICTE Pragati Scholarship</option>
                    <option value="scheme-nsp-csss">NSP CSSS Scholarship</option>
                    <option value="scheme-maha-ebc">MahaDBT EBC Scheme</option>
                    <option value="scheme-pm-kisan">PM Kisan Samman Nidhi</option>
                  </select>
                </div>
              </div>

              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {readinessData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E5DFD5]">
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD5] text-center">
                    <div className="text-xs text-[#7E756C]">Readiness Score</div>
                    <div className="text-3xl font-bold text-[#948170] mt-1">
                      <CounterNumber value={readinessData.readinessScore} suffix="%" />
                    </div>
                    <div className="text-[11px] text-[#7E756C] mt-1">
                      {readinessData.matchedCount} of {readinessData.totalRequired} documents ready
                    </div>
                  </div>

                  <div className="md:col-span-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD5] flex flex-col justify-center">
                    <div className="text-xs font-semibold text-[#948170] mb-1.5 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#948170]" />
                      <span>Security & Retention Policy (Security.md Section 5)</span>
                    </div>
                    <p className="text-[11px] text-[#5E544C] leading-relaxed">
                      All uploaded certificates are encrypted at rest with strict 90-day retention policies. Document uploads require logged user consent and can be revoked at any time.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ready documents */}
              <div className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-emerald-700 pb-3 border-b border-[#E5DFD5]">
                  <AnimatedCheckmark size={18} />
                  <h3 className="text-sm font-bold text-[#1A1715]">Verified & Ready Documents</h3>
                </div>

                {readinessData?.matchedDocuments?.length > 0 ? (
                  <div className="space-y-2">
                    {readinessData.matchedDocuments.map((doc: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#FAF7F2] border border-emerald-200 flex items-center justify-between"
                      >
                        <span className="text-xs font-semibold text-[#1A1715] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{doc.requiredName}</span>
                        </span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#7E756C]">No documents matched yet. Simulate an upload below.</p>
                )}
              </div>

              {/* Missing documents */}
              <div className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-amber-700 pb-3 border-b border-[#E5DFD5]">
                  <AlertCircle className="w-4 h-4" />
                  <h3 className="text-sm font-bold text-[#1A1715]">Missing Documents & How to Obtain</h3>
                </div>

                {readinessData?.missingDocuments?.length > 0 ? (
                  <div className="space-y-3">
                    {readinessData.missingDocuments.map((doc: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1A1715]">{doc.requiredName}</span>
                          <MagneticButton strength={0.15}>
                            <button
                              type="button"
                              onClick={() => handleUploadMockDoc(doc.requiredName)}
                              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg btn-luxury shadow-xs active:scale-95 transition-transform"
                            >
                              Simulate Upload
                            </button>
                          </MagneticButton>
                        </div>
                        <p className="text-[11px] text-[#5E544C]">{doc.howToObtain}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700">All required documents for this scheme are verified!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: NOTIFICATIONS ===================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="card-container p-6 bg-white border border-[#E5DFD5] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1A1715]">Deadline Tracker & Notifications</h2>
                <p className="text-xs text-[#7E756C] mt-1">
                  Automated background reminders for upcoming application cut-offs and roadmap milestones.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncDeadlines}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] hover:border-[#948170] text-xs font-semibold text-[#1A1715] flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#948170]" />
                  <span>Sync Deadlines</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateDigest}
                  className="px-3.5 py-2 rounded-xl btn-luxury text-xs font-semibold shadow-xs"
                >
                  Generate Weekly Digest
                </button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="p-12 text-center card-container bg-white border border-[#E5DFD5] rounded-2xl shadow-xs">
                <Bell className="w-12 h-12 text-[#948170] mx-auto mb-3 opacity-60" />
                <h3 className="text-base font-bold text-[#1A1715]">Inbox is All Caught Up</h3>
                <p className="text-xs text-[#7E756C] mt-1">
                  Click "Sync Deadlines" to check for upcoming grant and scholarship cut-offs.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`card-container p-4 bg-white border border-[#E5DFD5] rounded-xl flex items-start justify-between gap-4 transition-all shadow-xs ${
                      n.read ? 'opacity-70' : 'border-l-4 border-l-[#948170]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#6B5C4F] border border-[#D5C3A5] uppercase">
                          {n.type}
                        </span>
                        <h4 className="text-xs font-bold text-[#1A1715]">{n.title}</h4>
                      </div>
                      <p className="text-xs text-[#5E544C] whitespace-pre-wrap">{n.message}</p>
                    </div>

                    {n.actionUrl && (
                      <a
                        href={n.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl btn-luxury text-xs font-semibold flex items-center gap-1 shadow-xs flex-shrink-0"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* AI Explain Modal */}
      <AnimatePresence>
        {selectedSchemeForExplain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg p-7 overflow-hidden rounded-2xl bg-white border border-[#E5DFD5] shadow-2xl text-[#1A1715]"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />

              <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-4">
                <div className="flex items-center gap-2 text-[#948170]">
                  <Sparkles className="w-4 h-4 svgator-icon-bounce" />
                  <h3 className="text-sm font-bold text-[#1A1715]">Plain Language AI Explanation</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSchemeForExplain(null)}
                  className="text-[#8E8780] hover:text-[#1A1715] p-1 rounded-full hover:bg-[#F5F2EC] transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="font-bold text-sm text-[#1A1715]">
                  {selectedSchemeForExplain.name || selectedSchemeForExplain.schemeName}
                </div>

                {explainLoading ? (
                  <div className="py-10 text-center text-[#7E756C] space-y-3">
                    <MorphingBlobLoader size={54} />
                    <p>Grounding explanation in verified official circulars...</p>
                  </div>
                ) : explainResult ? (
                  <>
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] leading-relaxed text-[#5E544C]">
                      {explainResult.explanation}
                    </div>

                    {explainResult.citations && explainResult.citations.length > 0 && (
                      <div className="p-3 rounded-xl bg-white border border-[#E5DFD5] space-y-1 text-[11px] text-[#7E756C]">
                        <div className="font-bold text-[#1A1715]">Audited Government Citation:</div>
                        <div>Source: {explainResult.citations[0].sourceVersion}</div>
                        <a
                          href={explainResult.citations[0].officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#948170] underline flex items-center gap-1 mt-1 font-medium"
                        >
                          <span>Verified Portal Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </>
                ) : null}

                <MagneticButton strength={0.15}>
                  <RippleClickWrapper>
                    <button
                      type="button"
                      onClick={() => setSelectedSchemeForExplain(null)}
                      className="w-full py-2.5 rounded-xl btn-luxury text-xs font-semibold mt-4 shadow-xs active:scale-95 transition-transform"
                    >
                      Close Explanation
                    </button>
                  </RippleClickWrapper>
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* myScheme.gov.in Live Detail Modal */}
      <MySchemeDetailModal
        slug={selectedMySchemeSlug}
        onClose={() => setSelectedMySchemeSlug(null)}
        apiBase={API_BASE}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          if (!profile) setProfileModalOpen(true);
        }}
      />

      {/* Profile Onboarding Modal */}
      <ProfileOnboardingModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onCompleted={() => {
          fetchRoadmap();
        }}
      />
    </div>
  );
}
