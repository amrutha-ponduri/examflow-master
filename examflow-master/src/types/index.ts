export type UserRole = 'faculty' | 'admin' | 'exam_cell';

export type SubmissionStatus = 'pending' | 'accepted' | 'rejected';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export interface QuestionBank {
  id: string;
  facultyId: string;
  facultyName: string;
  subject: string;
  status: SubmissionStatus;
  comment?: string;
  submittedAt: string;
  modules: Module[];
}

export interface Module {
  id: string;
  moduleNumber: number;
  categories: Category[];
}

export interface Category {
  id: string;
  categoryNumber: number;
  marks: number;
  questions: Question[];
}

export interface Question {
  id: string;
  sno: number;
  content: string;
  imageUrl?: string;
}

export interface QuestionGenerationConfig {
  moduleNumber: number;
  categories: {
    numberOfQuestions: number;
    marksPerQuestion: number;
  }[];
}
