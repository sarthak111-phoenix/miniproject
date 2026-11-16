import { apiFetch, safeParseJson } from './api';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('saarthi_admin_token') || localStorage.getItem('saarthi_token');
}

export function setAdminSession(token: string, user: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('saarthi_admin_token', token);
  localStorage.setItem('saarthi_admin_user', JSON.stringify(user));
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('saarthi_admin_token');
  localStorage.removeItem('saarthi_admin_user');
}

export function getStoredAdminUser(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('saarthi_admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function adminFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as any || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Route to /api/admin or direct backend
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const apiPath = normalizedEndpoint.startsWith('/api/admin')
    ? normalizedEndpoint
    : normalizedEndpoint.startsWith('/admin')
      ? `/api${normalizedEndpoint}`
      : `/api/admin${normalizedEndpoint}`;

  const res = await apiFetch(apiPath, {
    ...options,
    headers,
  });

  const { data, text } = await safeParseJson(res);

  if (!res.ok) {
    const errorMsg = data?.message || data?.error || text || `Request failed with status ${res.status}`;
    const err: any = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const AdminApi = {
  // Stats
  getDashboardStats: () => adminFetch('/admin/stats'),
  globalSearch: (q: string) => adminFetch(`/admin/search?q=${encodeURIComponent(q)}`),

  // Users
  getUsers: (params: { search?: string; role?: string; status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.role) query.set('role', params.role);
    if (params.status) query.set('status', params.status);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return adminFetch(`/admin/users?${query.toString()}`);
  },
  getUserById: (id: string) => adminFetch(`/admin/users/${id}`),
  updateUserStatus: (id: string, status: string) =>
    adminFetch(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateUserRole: (id: string, role: string, adminRoleId?: string) =>
    adminFetch(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role, adminRoleId }) }),
  deleteUser: (id: string) => adminFetch(`/admin/users/${id}`, { method: 'DELETE' }),

  // Scholarships & Schemes
  getSchemes: (params: { categoryType?: string; isScholarshipOnly?: boolean; isWelfareOnly?: boolean; status?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.categoryType) query.set('categoryType', params.categoryType);
    if (params.isScholarshipOnly) query.set('isScholarshipOnly', 'true');
    if (params.isWelfareOnly) query.set('isWelfareOnly', 'true');
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return adminFetch(`/admin/schemes?${query.toString()}`);
  },
  getSchemeById: (id: string) => adminFetch(`/admin/schemes/${id}`),
  createScheme: (data: any) => adminFetch('/admin/schemes', { method: 'POST', body: JSON.stringify(data) }),
  updateScheme: (id: string, data: any) => adminFetch(`/admin/schemes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteScheme: (id: string) => adminFetch(`/admin/schemes/${id}`, { method: 'DELETE' }),

  // CMS
  getCmsSections: () => adminFetch('/admin/cms'),
  updateCmsSection: (key: string, data: { title?: string; content: any; status?: string }) =>
    adminFetch(`/admin/cms/${key}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Site Config
  getSiteConfig: () => adminFetch('/admin/config'),
  updateSiteConfig: (data: any) => adminFetch('/admin/config', { method: 'PUT', body: JSON.stringify(data) }),

  // AI
  getAiConfig: () => adminFetch('/admin/ai/config'),
  updateAiConfig: (data: any) => adminFetch('/admin/ai/config', { method: 'PUT', body: JSON.stringify(data) }),
  testAiPrompt: (prompt: string) => adminFetch('/admin/ai/test-prompt', { method: 'POST', body: JSON.stringify({ prompt }) }),

  // Knowledge Base
  getKnowledgeDocs: () => adminFetch('/admin/knowledge'),
  createKnowledgeDoc: (data: any) => adminFetch('/admin/knowledge', { method: 'POST', body: JSON.stringify(data) }),
  deleteKnowledgeDoc: (id: string) => adminFetch(`/admin/knowledge/${id}`, { method: 'DELETE' }),

  // Documents
  getUserDocuments: (params: { page?: number; limit?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    if (params.status) q.set('status', params.status);
    return adminFetch(`/admin/documents?${q.toString()}`);
  },

  // Announcements
  getAnnouncements: () => adminFetch('/admin/announcements'),
  createAnnouncement: (data: any) => adminFetch('/admin/announcements', { method: 'POST', body: JSON.stringify(data) }),
  deleteAnnouncement: (id: string) => adminFetch(`/admin/announcements/${id}`, { method: 'DELETE' }),

  // Support Tickets
  getSupportTickets: (params: { status?: string; priority?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.priority) q.set('priority', params.priority);
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    return adminFetch(`/admin/support?${q.toString()}`);
  },
  updateSupportTicket: (id: string, data: { status?: string; priority?: string; internalNote?: string; resolution?: string }) =>
    adminFetch(`/admin/support/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Roles & RBAC
  getRoles: () => adminFetch('/admin/roles'),
  createRole: (data: any) => adminFetch('/admin/roles', { method: 'POST', body: JSON.stringify(data) }),
  updateRole: (id: string, data: any) => adminFetch(`/admin/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRole: (id: string) => adminFetch(`/admin/roles/${id}`, { method: 'DELETE' }),

  // Audit Logs
  getAuditLogs: (params: { module?: string; action?: string; search?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params.module) q.set('module', params.module);
    if (params.action) q.set('action', params.action);
    if (params.search) q.set('search', params.search);
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    return adminFetch(`/admin/audit-logs?${q.toString()}`);
  },

  // Monitoring
  getSystemHealth: () => adminFetch('/admin/monitoring'),

  // Integrations
  getIntegrations: () => adminFetch('/admin/integrations'),
  testIntegration: (key: string) => adminFetch(`/admin/integrations/${key}/test`, { method: 'POST' }),

  // Backups
  getBackups: () => adminFetch('/admin/backups'),
  createBackup: () => adminFetch('/admin/backups', { method: 'POST' }),

  // Settings
  updatePassword: (oldPassword: string, newPassword: string) =>
    adminFetch('/admin/settings/password', { method: 'POST', body: JSON.stringify({ oldPassword, newPassword }) }),
  toggleTwoFactor: (enabled: boolean) =>
    adminFetch('/admin/settings/2fa', { method: 'POST', body: JSON.stringify({ enabled }) }),
};

