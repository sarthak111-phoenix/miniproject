import { db } from '../db/store';

export type DocumentType =
  | 'Aadhaar Card'
  | 'Income Certificate'
  | 'Caste Certificate'
  | 'Marksheet'
  | 'Domicile Certificate'
  | 'Bank Account Passbook'
  | 'College Admission Proof'
  | 'Other';

export interface UserDocument {
  id: string;
  userId: string;
  fileName: string;
  documentType: DocumentType;
  fileSize: number;
  uploadedAt: string;
  expiresAt: string; // 90-day concrete retention per Security.md
  consentLogged: boolean;
  status: 'verified' | 'pending';
}

export interface ReadinessReport {
  schemeId: string;
  schemeName: string;
  readinessPercentage: number;
  isReadyToApply: boolean;
  matchedDocuments: { requiredName: string; matchedDocId: string; documentType: DocumentType }[];
  missingDocuments: { requiredName: string; howToObtain: string }[];
}

const DOCUMENT_INSTRUCTIONS: Record<string, string> = {
  'Aadhaar': 'Download digital e-Aadhaar from https://eaadhaar.uidai.gov.in or obtain from nearest Aadhaar Seva Kendra.',
  'Income': 'Apply via state revenue portal or local Tehsildar / Taluk office (validity 1-3 years).',
  'Caste': 'Obtain permanent caste certificate from SDO / Tehsildar office or respective state caste portal.',
  'Marksheet': 'Download verified digital marksheet from DigiLocker or request from board/university controller.',
  'Domicile': 'Issued by Sub-Divisional Magistrate (SDM) or Tehsildar upon submission of residential proof.',
  'Bank': 'Obtain copy of passbook with IFSC and Aadhaar DBT seeding status from your bank branch.',
  'Admission': 'Obtain stamped Bonafide / Fee Receipt from college admission / registrar section.',
};

export class DocumentService {
  public static async uploadDocument(params: {
    userId: string;
    fileName: string;
    textSnippet?: string;
    fileSize: number;
    consentGiven: boolean;
  }): Promise<UserDocument> {
    if (!params.consentGiven) {
      const err: any = new Error('Explicit user consent is mandatory for document storage and OCR verification.');
      err.status = 400;
      throw err;
    }

    const docType = this.classifyDocument(params.fileName, params.textSnippet || '');
    const now = new Date();
    // Concrete 90-day retention policy per Security.md Section 5
    const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const newDoc: UserDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      fileName: params.fileName,
      documentType: docType,
      fileSize: params.fileSize,
      uploadedAt: now.toISOString(),
      expiresAt,
      consentLogged: true,
      status: 'verified',
    };

    await db.addDocument(params.userId, newDoc);
    return newDoc;
  }

  public static async getUserDocuments(userId: string): Promise<UserDocument[]> {
    const docs = await db.getUserDocuments(userId);
    // Filter out expired documents (90-day TTL auto-purge)
    const now = new Date().toISOString();
    return docs.filter((d: UserDocument) => d.expiresAt > now);
  }

  public static async checkReadiness(userId: string, schemeId: string): Promise<ReadinessReport> {
    const scheme = await db.findSchemeById(schemeId);
    if (!scheme) {
      const err: any = new Error(`Scheme '${schemeId}' not found.`);
      err.status = 404;
      throw err;
    }

    const userDocs = await this.getUserDocuments(userId);
    const requiredList: string[] = scheme.requiredDocuments || [];

    const matchedDocuments: ReadinessReport['matchedDocuments'] = [];
    const missingDocuments: ReadinessReport['missingDocuments'] = [];

    for (const reqName of requiredList) {
      const reqLower = reqName.toLowerCase();
      // Match against user uploaded documents
      const match = userDocs.find((d) => {
        const typeLower = d.documentType.toLowerCase();
        const fileLower = d.fileName.toLowerCase();

        if (reqLower.includes('aadhaar') && (typeLower.includes('aadhaar') || fileLower.includes('aadhaar'))) return true;
        if (reqLower.includes('income') && (typeLower.includes('income') || fileLower.includes('income'))) return true;
        if (reqLower.includes('caste') && (typeLower.includes('caste') || fileLower.includes('caste'))) return true;
        if (reqLower.includes('marksheet') && (typeLower.includes('marksheet') || fileLower.includes('marksheet'))) return true;
        if (reqLower.includes('domicile') && (typeLower.includes('domicile') || fileLower.includes('domicile'))) return true;
        if (reqLower.includes('bank') && (typeLower.includes('bank') || fileLower.includes('passbook'))) return true;
        if (reqLower.includes('admission') && (typeLower.includes('admission') || fileLower.includes('fee') || fileLower.includes('bonafide'))) return true;
        return false;
      });

      if (match) {
        matchedDocuments.push({
          requiredName: reqName,
          matchedDocId: match.id,
          documentType: match.documentType,
        });
      } else {
        let howTo = 'Obtain from issuing government department or institution.';
        for (const [key, instructions] of Object.entries(DOCUMENT_INSTRUCTIONS)) {
          if (reqLower.includes(key.toLowerCase())) {
            howTo = instructions;
            break;
          }
        }
        missingDocuments.push({
          requiredName: reqName,
          howToObtain: howTo,
        });
      }
    }

    const totalRequired = requiredList.length;
    const matchedCount = matchedDocuments.length;
    const readinessPercentage = totalRequired === 0 ? 100 : Math.round((matchedCount / totalRequired) * 100);

    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      readinessPercentage,
      isReadyToApply: readinessPercentage === 100,
      matchedDocuments,
      missingDocuments,
    };
  }

  private static classifyDocument(fileName: string, textSnippet: string): DocumentType {
    const combined = `${fileName} ${textSnippet}`.toLowerCase();
    if (combined.includes('aadhaar') || combined.includes('uidai')) return 'Aadhaar Card';
    if (combined.includes('income') || combined.includes('tehsildar') || combined.includes('parivar')) return 'Income Certificate';
    if (combined.includes('caste') || combined.includes('jaati') || combined.includes('category cert')) return 'Caste Certificate';
    if (combined.includes('marksheet') || combined.includes('grade card') || combined.includes('cbse') || combined.includes('hsc') || combined.includes('ssc')) return 'Marksheet';
    if (combined.includes('domicile') || combined.includes('resident') || combined.includes('niwas')) return 'Domicile Certificate';
    if (combined.includes('passbook') || combined.includes('bank') || combined.includes('ifsc')) return 'Bank Account Passbook';
    if (combined.includes('bonafide') || combined.includes('admission') || combined.includes('fee receipt')) return 'College Admission Proof';
    return 'Other';
  }
}
