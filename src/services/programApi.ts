const API_BASE_URL = 'http://localhost:8080';

export interface Program {
  id: number;
  program_name: string;
}

export interface CreateProgramRequest {
  program_name: string;
}

export interface UpdateProgramRequest {
  program_name: string;
}

export const programApi = {
  // Get all programs
  getAll: async (): Promise<Program[]> => {
    const response = await fetch(`${API_BASE_URL}/program`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch programs');
    }
    return response.json();
  },

  // Create a new program
  create: async (data: CreateProgramRequest): Promise<Program> => {
    const response = await fetch(`${API_BASE_URL}/program`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create program');
    }
    return response.json();
  },

  // Update an existing program
  update: async (id: number, data: UpdateProgramRequest): Promise<Program> => {
    const response = await fetch(`${API_BASE_URL}/program/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update program');
    }
    return response.json();
  },

  // Delete a program
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/program/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete program');
    }
    return response.json();
  },
};
