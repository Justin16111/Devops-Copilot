import type { Incident, IncidentAnalysis, PostmortemReport } from '../types/index';

const STORAGE_KEY_INCIDENTS = 'devops_copilot_incidents_v1';
const STORAGE_KEY_REPORTS = 'devops_copilot_reports_v1';

export class ApiClient {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
        ...options,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Request failed with status ${res.status}`);
      }

      const json = await res.json();
      return json.data as T;
    } catch (err) {
      console.warn(`[ApiClient] API route ${endpoint} call error:`, err);
      throw err;
    }
  }

  static async getIncidents(): Promise<Incident[]> {
    try {
      const data = await this.request<Incident[]>('/api/incidents');
      localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(data));
      return data;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEY_INCIDENTS);
      if (cached) return JSON.parse(cached);
      throw new Error('Could not fetch incidents');
    }
  }

  static async getIncident(id: string): Promise<Incident> {
    try {
      return await this.request<Incident>(`/api/incidents/${id}`);
    } catch {
      const incidents = await this.getIncidents();
      const found = incidents.find((i) => i.id === id);
      if (found) return found;
      throw new Error(`Incident ${id} not found`);
    }
  }

  static async analyzeIncident(id: string): Promise<Incident> {
    return await this.request<Incident>(`/api/incidents/${id}/analyze`, {
      method: 'POST',
    });
  }

  static async approveRemediation(id: string, approver = 'Maya Lin (Lead SRE)'): Promise<Incident> {
    return await this.request<Incident>(`/api/incidents/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approver }),
    });
  }

  static async executeRemediation(id: string): Promise<Incident> {
    return await this.request<Incident>(`/api/incidents/${id}/execute`, {
      method: 'POST',
    });
  }

  static async verifyRecovery(id: string): Promise<Incident> {
    return await this.request<Incident>(`/api/incidents/${id}/verify`, {
      method: 'POST',
    });
  }

  static async generateReport(id: string): Promise<PostmortemReport> {
    const report = await this.request<PostmortemReport>(`/api/incidents/${id}/report`, {
      method: 'POST',
    });
    return report;
  }

  static async getReports(): Promise<PostmortemReport[]> {
    try {
      const reports = await this.request<PostmortemReport[]>('/api/reports');
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
      return reports;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (cached) return JSON.parse(cached);
      return [];
    }
  }

  static async getReport(id: string): Promise<PostmortemReport> {
    return await this.request<PostmortemReport>(`/api/reports/${id}`);
  }

  static async resetAll(): Promise<Incident[]> {
    return await this.request<Incident[]>('/api/incidents/reset', {
      method: 'POST',
    });
  }
}
