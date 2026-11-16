'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
  Share2,
  Search,
} from 'lucide-react';
import { AdminApi } from '../../../lib/adminApi';

export default function WebsiteConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [siteName, setSiteName] = useState('Saarthi AI');
  const [tagline, setTagline] = useState('National Scholarship & Welfare Intelligence Platform');
  const [logoUrl, setLogoUrl] = useState('/logo.svg');
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');
  const [contactEmail, setContactEmail] = useState('support@saarthi.ai');
  const [contactPhone, setContactPhone] = useState('+91 1800-SAARTHI');
  const [defaultLang, setDefaultLang] = useState('en');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'Saarthi AI is briefly undergoing planned maintenance. We will be back online shortly.'
  );

  // Feature Flags
  const [featureAiCopilot, setFeatureAiCopilot] = useState(true);
  const [featureDocumentOcr, setFeatureDocumentOcr] = useState(true);
  const [featureRoadmap, setFeatureRoadmap] = useState(true);
  const [featureNotifications, setFeatureNotifications] = useState(true);

  // Social Links
  const [twitter, setTwitter] = useState('https://x.com/SaarthiAI');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/company/saarthi-ai');
  const [github, setGithub] = useState('https://github.com/saarthi-ai');

  async function loadConfig() {
    setLoading(true);
    try {
      const data = await AdminApi.getSiteConfig();
      const cfg = data.config || {};
      if (cfg.siteName) setSiteName(cfg.siteName);
      if (cfg.tagline) setTagline(cfg.tagline);
      if (cfg.logoUrl) setLogoUrl(cfg.logoUrl);
      if (cfg.faviconUrl) setFaviconUrl(cfg.faviconUrl);
      if (cfg.contactEmail) setContactEmail(cfg.contactEmail);
      if (cfg.contactPhone) setContactPhone(cfg.contactPhone);
      if (cfg.defaultLanguage) setDefaultLang(cfg.defaultLanguage);
      if (typeof cfg.maintenanceMode === 'boolean') setMaintenanceMode(cfg.maintenanceMode);
      if (cfg.maintenanceMessage) setMaintenanceMessage(cfg.maintenanceMessage);

      if (cfg.featureToggles) {
        setFeatureAiCopilot(cfg.featureToggles.aiCopilot ?? true);
        setFeatureDocumentOcr(cfg.featureToggles.documentOcr ?? true);
        setFeatureRoadmap(cfg.featureToggles.careerRoadmap ?? true);
        setFeatureNotifications(cfg.featureToggles.notifications ?? true);
      }

      if (cfg.socialLinks) {
        setTwitter(cfg.socialLinks.twitter || '');
        setLinkedin(cfg.socialLinks.linkedin || '');
        setGithub(cfg.socialLinks.github || '');
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load site configuration.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConfig();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setAlert(null);
    try {
      await AdminApi.updateSiteConfig({
        siteName,
        tagline,
        logoUrl,
        faviconUrl,
        contactEmail,
        contactPhone,
        defaultLanguage: defaultLang,
        maintenanceMode,
        maintenanceMessage,
        featureToggles: {
          aiCopilot: featureAiCopilot,
          documentOcr: featureDocumentOcr,
          careerRoadmap: featureRoadmap,
          notifications: featureNotifications,
        },
        socialLinks: {
          twitter,
          linkedin,
          github,
        },
      });
      setAlert({ type: 'success', message: 'Website configuration updated successfully!' });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to save configuration.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5DFD5]/40 text-[#948170]">
              <Sliders className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#948170]">System Parameters</span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#1A1715] mt-1">Website Configuration</h1>
          <p className="text-xs text-[#948170] mt-0.5">
            Configure global brand identities, contact channels, feature gating, and emergency maintenance mode.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadConfig()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1A1715] bg-white border border-[#E5DFD5] rounded-xl hover:bg-[#FAF7F2] transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1A1715] rounded-xl hover:bg-[#2C2724] transition shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {alert && (
        <div
          className={`flex items-center gap-3 p-3.5 rounded-xl text-xs font-sans border ${
            alert.type === 'success'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
              : 'bg-rose-50/70 border-rose-200 text-rose-800'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand & Identity */}
        <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5DFD5]">
            <Globe className="w-4 h-4 text-[#948170]" />
            <h3 className="text-sm font-medium text-[#1A1715]">Brand & Identity</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">Platform Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Logo URL / Path</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4A3E36] mb-1">Favicon URL / Path</label>
                <input
                  type="text"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">Default Portal Language</label>
              <select
                value={defaultLang}
                onChange={(e) => setDefaultLang(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
              >
                <option value="en">English (Default)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Support Channels */}
        <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5DFD5]">
            <Mail className="w-4 h-4 text-[#948170]" />
            <h3 className="text-sm font-medium text-[#1A1715]">Support & Social Coordinates</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">Official Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">Support Helpline Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">Twitter / X URL</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3E36] mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1A1715]"
              />
            </div>
          </div>
        </div>

        {/* Feature Switches */}
        <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5DFD5]">
            <ToggleRight className="w-4 h-4 text-[#948170]" />
            <h3 className="text-sm font-medium text-[#1A1715]">Platform Feature Switches</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
              <div>
                <p className="text-xs font-medium text-[#1A1715]">AI Scheme Copilot</p>
                <p className="text-[11px] text-[#948170]">Enables Gemini RAG queries and grounded scheme citations</p>
              </div>
              <input
                type="checkbox"
                checked={featureAiCopilot}
                onChange={(e) => setFeatureAiCopilot(e.target.checked)}
                className="w-4 h-4 accent-[#1A1715] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
              <div>
                <p className="text-xs font-medium text-[#1A1715]">Document OCR Verification Engine</p>
                <p className="text-[11px] text-[#948170]">Automated document validation with 90-day retention policies</p>
              </div>
              <input
                type="checkbox"
                checked={featureDocumentOcr}
                onChange={(e) => setFeatureDocumentOcr(e.target.checked)}
                className="w-4 h-4 accent-[#1A1715] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
              <div>
                <p className="text-xs font-medium text-[#1A1715]">Living Career Roadmaps</p>
                <p className="text-[11px] text-[#948170]">Progressive academic milestone sequencing for students</p>
              </div>
              <input
                type="checkbox"
                checked={featureRoadmap}
                onChange={(e) => setFeatureRoadmap(e.target.checked)}
                className="w-4 h-4 accent-[#1A1715] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
              <div>
                <p className="text-xs font-medium text-[#1A1715]">Real-time Push Notifications</p>
                <p className="text-[11px] text-[#948170]">Deadline reminders and critical citizen broadcast feeds</p>
              </div>
              <input
                type="checkbox"
                checked={featureNotifications}
                onChange={(e) => setFeatureNotifications(e.target.checked)}
                className="w-4 h-4 accent-[#1A1715] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5DFD5]">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-medium text-[#1A1715]">Maintenance & Safety Gate</h3>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-900">Activate Maintenance Mode</p>
                <p className="text-[11px] text-amber-700">
                  When enabled, public visitors see a maintenance interstitial. Admins retain full portal access.
                </p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 accent-amber-700 cursor-pointer"
              />
            </div>

            {maintenanceMode && (
              <div>
                <label className="block text-xs font-medium text-amber-900 mb-1">
                  Public Interstitial Message
                </label>
                <textarea
                  rows={3}
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

