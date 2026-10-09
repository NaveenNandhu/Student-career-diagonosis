import {
  User, StudentProfile, AcademicOverview, SampleCase,
  MisconceptionResult, FollowupResult, CareerGapAnalysis,
  JobShieldResult, SampleScam, NaveenJourney
} from './types';

const getApiBase = (): string => {
  const metaEnv = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env;
  const envUrl = metaEnv?.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl.replace(/\/$/, '')}/api/v1`;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:8000/api/v1';
  }
  return '/api/v1';
};

const API_BASE = getApiBase();

export const getWebSocketUrl = (): string => {
  const base = getApiBase();
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return base.replace(/^http/, 'ws') + '/ws/live-events';
  }
  const host = window.location.host;
  return `${wsProtocol}//${host}${base}/ws/live-events`;
};

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API Error ${res.status}: ${errText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Fetch error for ${endpoint}, using client fallback if available:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  async login(email: string): Promise<{ access_token: string; user: User }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: 'demo' }),
    });
  },

  async logout(): Promise<{ status: string }> {
    return request('/auth/logout', {
      method: 'POST',
    });
  },

  async getMe(): Promise<User> {
    return request('/auth/me');
  },

  // Academic Intelligence
  async getAcademicOverview(attThresh = 80, scoreThresh = 70): Promise<AcademicOverview> {
    return request(`/academic/overview?attendance_threshold=${attThresh}&assessment_threshold=${scoreThresh}`);
  },

  async getStudents(attThresh = 80, scoreThresh = 70): Promise<StudentProfile[]> {
    return request(`/academic/students?attendance_threshold=${attThresh}&assessment_threshold=${scoreThresh}`);
  },

  async getStudentDetail(id: number): Promise<StudentProfile> {
    return request(`/academic/students/${id}`);
  },

  async recordFacultyReview(id: number, review_status: string, note?: string) {
    return request(`/academic/students/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ review_status, note }),
    });
  },

  // AI Misconception Hunter
  async getMisconceptionSamples(): Promise<SampleCase[]> {
    return request('/misconceptions/samples');
  },

  async uploadMisconceptionFile(file: File): Promise<{ text: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/misconceptions/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('File upload failed');
    return await res.json();
  },

  async analyzeMisconception(payload: {
    topic: string;
    question_prompt: string;
    expected_rubric: string;
    student_answer: string;
  }): Promise<MisconceptionResult> {
    return request('/misconceptions/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async submitFollowup(submission_id: number, follow_up_answer: string): Promise<FollowupResult> {
    return request('/misconceptions/followup', {
      method: 'POST',
      body: JSON.stringify({ submission_id, follow_up_answer }),
    });
  },

  // AI Career Compass
  async getTargetRoles(): Promise<{ id: string; title: string; description: string }[]> {
    return request('/career/roles');
  },

  async extractSkills(resume_text: string): Promise<{ extracted_skills: string[]; raw_detected_count: number }> {
    return request('/career/extract-skills', {
      method: 'POST',
      body: JSON.stringify({ resume_text }),
    });
  },

  async uploadResumeFile(file: File): Promise<{ extracted_skills: string[]; raw_detected_count: number; resume_text?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/career/upload-resume`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Resume file upload failed');
    return await res.json();
  },

  async analyzeCareerGap(target_role: string, confirmed_skills: string[]): Promise<CareerGapAnalysis> {
    return request('/career/analyze-gap', {
      method: 'POST',
      body: JSON.stringify({ target_role, confirmed_skills }),
    });
  },

  async toggleRoadmapTask(task_id: number, is_completed: boolean) {
    return request('/career/tasks/toggle', {
      method: 'POST',
      body: JSON.stringify({ task_id, is_completed }),
    });
  },

  // AI JobShield
  async getSampleScams(): Promise<SampleScam[]> {
    return request('/jobshield/samples');
  },

  async analyzeJobShield(payload: {
    raw_text: string;
    company_name?: string;
    job_title?: string;
  }): Promise<JobShieldResult> {
    return request('/jobshield/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getJobShieldHistory(): Promise<JobShieldResult[]> {
    return request('/jobshield/history');
  },

  // Integrated Journey
  async getNaveenJourney(): Promise<NaveenJourney> {
    return request('/journey/naveen');
  }
};
