import { QuestionBank, User } from '@/types';

export const mockUsers: User[] = [
  { id: '1', username: 'admin', name: 'Dr. Admin', role: 'admin' },
  { id: '2', username: 'examcell', name: 'Dr. Rao', role: 'exam_cell' },
  { id: '3', username: 'faculty1', name: 'Prof. Ram', role: 'faculty' },
  { id: '4', username: 'faculty2', name: 'Dr. Lalitha', role: 'faculty' },
];

export const mockQuestionBanks: QuestionBank[] = [
  {
    id: '1',
    facultyId: '3',
    reviewer: 'Dr. Rao',
    date: '31-01-2026',
    facultyName: 'Prof. Ram',
    subject: 'Data Structures',
    status: 'pending',
    submittedAt: '2024-01-15',
    modules: [
      {
        id: 'm1',
        moduleNumber: 1,
        categories: [
          {
            id: 'c1',
            categoryNumber: 1,
            marks: 2,
            questions: [
              { id: 'q1', sno: 1, content: 'Define array and its types.' },
              { id: 'q2', sno: 2, content: 'What is a linked list?' },
              { id: 'q3', sno: 3, content: 'Explain stack operations.' },
            ],
          },
          {
            id: 'c2',
            categoryNumber: 2,
            marks: 5,
            questions: [
              { id: 'q4', sno: 1, content: 'Implement a queue using two stacks.' },
              { id: 'q5', sno: 2, content: 'Write an algorithm for binary search.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    facultyId: '4',
    date: '31-01-2026',
    reviewer: 'Dr. Sujitha',
    facultyName: 'Dr. Lalitha',
    subject: 'Database Management',
    status: 'accepted',
    submittedAt: '2024-01-10',
    modules: [
      {
        id: 'm2',
        moduleNumber: 1,
        categories: [
          {
            id: 'c3',
            categoryNumber: 1,
            marks: 2,
            questions: [
              { id: 'q6', sno: 1, content: 'What is DBMS?' },
              { id: 'q7', sno: 2, content: 'Define normalization.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '3',
    facultyId: '3',
    reviewer: 'Dr. Rao',
    date: '31-01-2026',
    facultyName: 'Prof. Ram',
    subject: 'Computer Networks',
    status: 'rejected',
    comment: 'Please add more questions for Module 2 and include diagrams for network topologies.',
    submittedAt: '2024-01-12',
    modules: [
      {
        id: 'm3',
        moduleNumber: 1,
        categories: [
          {
            id: 'c4',
            categoryNumber: 1,
            marks: 2,
            questions: [
              { id: 'q8', sno: 1, content: 'What is OSI model?' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '4',
    facultyId: '4',
    date: '31-01-2026',
    reviewer: 'Dr. Sujitha',
    facultyName: 'Dr. Lalitha',
    subject: 'Operating Systems',
    status: 'pending',
    submittedAt: '2024-01-18',
    modules: [],
  },
];
