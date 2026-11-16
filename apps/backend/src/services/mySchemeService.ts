import * as fs from 'fs';
import * as path from 'path';

export interface MySchemeSummary {
  id: string;
  slug: string;
  name: string;
  shortTitle: string;
  category?: string;
  level?: string;
  state?: string;
  ministry?: string;
  brief?: string;
}

export interface MySchemeDetail {
  id: string;
  slug: string;
  name: string;
  shortTitle: string;
  level: string;
  state?: string;
  ministry?: string;
  briefDescription: string;
  benefits: string[];
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationProcess: string[];
  portalUrl: string;
  sourceVersion: string;
}

export class MySchemeService {
  private static cachedSchemes: MySchemeSummary[] = [];
  private static isInitialized = false;
  private static cacheFilePath = path.resolve(__dirname, '../../data/myscheme-catalog.json');
  private static detailCache = new Map<string, MySchemeDetail>();

  /**
   * Initialize catalog from local cache or fetch from official myscheme.gov.in API
   */
  public static async init(): Promise<void> {
    if (this.isInitialized && this.cachedSchemes.length > 0) return;

    // 1. Try reading from disk cache first
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const fileContent = fs.readFileSync(this.cacheFilePath, 'utf-8');
        this.cachedSchemes = JSON.parse(fileContent);
        this.isInitialized = true;
        console.log(`[MySchemeService] Loaded ${this.cachedSchemes.length} schemes from disk cache.`);
        // Refresh in background if older than 24h
        this.fetchLiveCatalogInBackground();
        return;
      }
    } catch (err: any) {
      console.warn(`[MySchemeService] Could not read local cache: ${err.message}`);
    }

    // 2. Fetch live catalog from myscheme.gov.in
    await this.fetchLiveCatalog();
  }

  public static async fetchLiveCatalog(): Promise<void> {
    try {
      console.log('[MySchemeService] Fetching schemes from https://www.myscheme.gov.in/api/apisetu/schemes?lang=en ...');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const res = await fetch('https://www.myscheme.gov.in/api/apisetu/schemes?lang=en', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SaarthiAI/1.0',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`myScheme API returned status ${res.status}`);
      }

      const json: any = await res.json();
      if (!json.data || !Array.isArray(json.data)) {
        throw new Error('Invalid data format returned by myScheme API');
      }

      const formatted: MySchemeSummary[] = json.data.map((item: any) => ({
        id: item._id || item.slug,
        slug: item.slug,
        name: item.en?.basicDetails?.schemeName || item.slug,
        shortTitle: item.en?.basicDetails?.schemeShortTitle || '',
      }));

      this.cachedSchemes = formatted;
      this.isInitialized = true;

      // Save to cache file for instant offline startup
      try {
        const dir = path.dirname(this.cacheFilePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(this.cacheFilePath, JSON.stringify(formatted), 'utf-8');
        console.log(`[MySchemeService] Cached ${formatted.length} schemes to ${this.cacheFilePath}`);
      } catch (writeErr: any) {
        console.warn(`[MySchemeService] Failed to write cache to disk: ${writeErr.message}`);
      }
    } catch (err: any) {
      console.warn(`[MySchemeService] Failed to fetch live myScheme catalog: ${err.message}`);
      if (this.cachedSchemes.length === 0) {
        // Fallback to essential national schemes
        this.cachedSchemes = this.getFallbackCatalog();
        this.isInitialized = true;
      }
    }
  }

  private static fetchLiveCatalogInBackground() {
    setTimeout(() => {
      this.fetchLiveCatalog().catch((e) => console.warn('[MySchemeService] Background refresh error:', e.message));
    }, 500);
  }

  /**
   * Search all schemes with keyword, category, state filters
   */
  public static async searchSchemes(params: {
    query?: string;
    category?: string;
    state?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ total: number; schemes: MySchemeSummary[] }> {
    await this.init();

    let filtered = this.cachedSchemes;
    const q = params.query?.trim().toLowerCase();

    if (q) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortTitle.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const offset = params.offset || 0;
    const limit = params.limit || 30;
    const paginated = filtered.slice(offset, offset + limit);

    return { total, schemes: paginated };
  }

  /**
   * Fetch full scheme details by slug from myscheme.gov.in API
   */
  public static async getSchemeDetail(slug: string): Promise<MySchemeDetail | null> {
    if (this.detailCache.has(slug)) {
      return this.detailCache.get(slug)!;
    }

    try {
      const url = `https://www.myscheme.gov.in/api/apisetu/schemes?slug=${encodeURIComponent(slug)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SaarthiAI/1.0',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) return null;
      const json: any = await res.json();
      const en = json.data?.en;
      if (!en) return null;

      // Helper to extract text from Slate rich text format
      const extractText = (blocks: any[]): string[] => {
        if (!blocks || !Array.isArray(blocks)) return [];
        const lines: string[] = [];
        for (const block of blocks) {
          if (typeof block === 'string') lines.push(block);
          else if (block.children) {
            const inner = block.children
              .map((c: any) => (typeof c === 'string' ? c : c.text || ''))
              .join(' ')
              .trim();
            if (inner) lines.push(inner);
          }
        }
        return lines;
      };

      const detail: MySchemeDetail = {
        id: json.data._id || slug,
        slug: json.data.slug || slug,
        name: en.basicDetails?.schemeName || slug,
        shortTitle: en.basicDetails?.schemeShortTitle || '',
        level: en.basicDetails?.level?.label || 'Central',
        ministry: en.basicDetails?.nodalMinistryName?.label || en.basicDetails?.implementingAgency || 'Government of India',
        briefDescription:
          en.schemeContent?.briefDescription ||
          (extractText(en.schemeContent?.detailedDescription)[0] || 'Official welfare initiative by the Government of India.'),
        benefits: extractText(en.schemeContent?.benefits),
        eligibilityCriteria: extractText(en.eligibilityCriteria?.eligibilityDescription),
        requiredDocuments: extractText(en.eligibilityCriteria?.documentsRequired || en.schemeContent?.documentsRequired),
        applicationProcess: extractText(en.applicationProcess?.[0]?.process),
        portalUrl: en.schemeContent?.references?.[0]?.url || `https://www.myscheme.gov.in/schemes/${slug}`,
        sourceVersion: `MYSCHEME-GOV-${new Date().getFullYear()}`,
      };

      this.detailCache.set(slug, detail);
      return detail;
    } catch (err: any) {
      console.warn(`[MySchemeService] Failed to fetch slug ${slug}: ${err.message}`);
      return null;
    }
  }

  /**
   * Fallback curated list in case government network is totally offline
   */
  private static getFallbackCatalog(): MySchemeSummary[] {
    return [
      { id: 'pm-kisan', slug: 'pm-kisan', name: 'Pradhan Mantri Kisan Samman Nidhi', shortTitle: 'PM-KISAN' },
      { id: 'nssw', slug: 'nssw', name: 'New Swarnima Scheme For Women', shortTitle: 'NSSW' },
      { id: 'pmmy', slug: 'pmmy', name: 'Pradhan Mantri MUDRA Yojana', shortTitle: 'PMMY' },
      { id: 'psgs-deg', slug: 'psgs-deg', name: 'AICTE Pragati Scholarship Scheme for Girl Students', shortTitle: 'PRAGATI' },
      { id: 'kkjby', slug: 'kkjby', name: 'Khadi Karigar Janashree Bima Yojana', shortTitle: 'KKJBY' },
      { id: 'post-dis', slug: 'post-dis', name: 'Post Matric Scholarship for Students with Disabilities', shortTitle: 'PMS-PWD' },
      { id: 'post-st', slug: 'post-st', name: 'Post Matric Scholarship for ST Students', shortTitle: 'PMS-ST' },
      { id: 'lbssf-gtl', slug: 'lbssf-gtl', name: 'Loan Based Scheme For Safai Karamchari - General Term Loan', shortTitle: 'LBSSF-GTL' },
      { id: 'sag', slug: 'sag', name: 'Scheme For Adolescent Girls', shortTitle: 'SAG' },
      { id: 'pdunwfs', slug: 'pdunwfs', name: 'Pandit Deendayal Upadhyay National Welfare Fund For Sportspersons', shortTitle: 'PDUNWFS' },
      { id: 'sui', slug: 'sui', name: 'Stand-Up India Scheme', shortTitle: 'SUI' },
    ];
  }
}
