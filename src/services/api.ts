// Base API configuration
const API_BASE_URL = 'http://localhost:8080';

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Handle empty responses (like DELETE)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// ==================== COURSES ====================
export interface Course {
  id: number;
  course_code: string;
  course_title: string;
  credits: number;
}

export const coursesApi = {
  getAll: () => fetchApi<Course[]>('/courses'),
  getDropdown: () => fetchApi<{ id: number; course_code: string; course_title: string }[]>('/courses/dropdown'),
  create: (data: Omit<Course, 'id'>) => fetchApi<Course>('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<Omit<Course, 'id'>>) => fetchApi<Course>(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/courses/${id}`, { method: 'DELETE' }),
};

// ==================== USERS ====================
export interface User {
  id: number;
  name: string;
  username?: string;
  roles: string[];
  courses?: string[];
}

export interface UserCreatePayload {
  username: string;
  name: string;
  password: string;
  roles: { id: number }[];
}

export interface Role {
  id: number;
  role_name: string;
}

export const usersApi = {
  getAll: () => fetchApi<User[]>('/users'),
  getDropdown: () => fetchApi<{ id: number; username: string; name: string }[]>('/users/dropdown'),
  getRolesDropdown: () => fetchApi<Role[]>('/roles/dropdown'),
  create: (data: UserCreatePayload) => fetchApi<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<UserCreatePayload>) => fetchApi<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/users/${id}`, { method: 'DELETE' }),
};

// ==================== DEPARTMENTS ====================
export interface Department {
  id: number;
  department_name: string;
  abbreviation?: string;
  reviewer_name: string;
}

export interface DepartmentCreatePayload {
  department: {
    department_name: string;
    abbreviation: string;
  };
  user_id: number;
}

export const departmentsApi = {
  getAll: () => fetchApi<Department[]>('/departments'),
  getDropdown: () => fetchApi<{ id: number; abbreviation: string }[]>('/departments/dropdown'),
  create: (data: DepartmentCreatePayload) => fetchApi<Department>('/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<DepartmentCreatePayload>) => fetchApi<Department>(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/departments/${id}`, { method: 'DELETE' }),
};

// ==================== REGULATIONS ====================
export interface SectionRule {
  id?: number;
  section_name: string;
  marks: number;
  min_questions_count: number;
}

export interface Regulation {
  id: number;
  regulation_name: string;
  section_rules: SectionRule[];
}

export interface RegulationCreatePayload {
  regulation_name: string;
  section_rules: Omit<SectionRule, 'id'>[];
}

export const regulationsApi = {
  getAll: () => fetchApi<Regulation[]>('/regulations'),
  getDropdown: () => fetchApi<{ id: number; regulation: string }[]>('/regulations/dropdown'),
  create: (data: RegulationCreatePayload) => fetchApi<Regulation>('/regulations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<RegulationCreatePayload>) => fetchApi<Regulation>(`/regulations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/regulations/${id}`, { method: 'DELETE' }),
};

// ==================== PROGRAMS ====================
export interface Program {
  id: number;
  program_name: string;
}

export const programsApi = {
  getAll: () => fetchApi<Program[]>('/programs'),
  getDropdown: () => fetchApi<{ id: number; program_name: string }[]>('/programs/dropdown'),
  create: (data: Omit<Program, 'id'>) => fetchApi<Program>('/programs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<Omit<Program, 'id'>>) => fetchApi<Program>(`/programs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/programs/${id}`, { method: 'DELETE' }),
};

// ==================== COURSE OFFERINGS ====================
export interface CourseOfferingListItem {
  id: number;
  course_code: string;
  course_title: string;
  program: string;
  department: string;
}

export interface CourseOfferingDetail {
  id: number;
  academic_year: string;
  semester: string;
  year_of_study: string;
  department_name: string;
  course_code: string;
  course_title: string;
  program_name: string;
  regulation_name: string;
  submitter_name: string;
  instructor_names: string[];
  modules_info: { module_no: number; module_name: string }[];
}

export interface CourseOfferingCreatePayload {
  academic_year: string;
  semester: string;
  year_of_study: string;
  module_count: number;
  department: { id: number };
  course: { id: number };
  program: { id: number };
  regulation: { id: number };
  submitter: { id: number };
  instructor: { id: number }[];
  module_infos: { module_no: number; module_name: string }[];
}

export const courseOfferingsApi = {
  getAll: () => fetchApi<CourseOfferingListItem[]>('/courseofferings'),
  getById: (id: number) => fetchApi<CourseOfferingDetail>(`/courseofferings/${id}`),
  create: (data: CourseOfferingCreatePayload) => fetchApi<CourseOfferingListItem>('/courseofferings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<CourseOfferingCreatePayload>) => fetchApi<CourseOfferingListItem>(`/courseofferings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/courseofferings/${id}`, { method: 'DELETE' }),
};
