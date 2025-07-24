import React, { createContext, useContext, useState, useEffect } from 'react';

interface Quiz {
  id: string;
  title: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct: number;
    difficulty: 'easy' | 'medium' | 'hard';
    skill: string;
  }>;
  completed: boolean;
  score?: number;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  skill: string;
  difficulty: string;
  duration: string;
  type: 'video' | 'article' | 'practice';
  url: string;
  completed: boolean;
  xpReward: number;
}

interface DataContextType {
  quizzes: Quiz[];
  learningModules: LearningModule[];
  skillGaps: string[];
  updateQuizScore: (quizId: string, score: number) => void;
  completeModule: (moduleId: string) => void;
  getRecommendedModules: (skills: string[]) => LearningModule[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: 'react-basics',
      title: 'React Fundamentals',
      completed: false,
      questions: [
        {
          id: '1',
          question: 'What is JSX?',
          options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extension', 'JavaScript eXtension'],
          correct: 0,
          difficulty: 'easy',
          skill: 'React'
        },
        {
          id: '2',
          question: 'Which hook is used for state management in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correct: 1,
          difficulty: 'medium',
          skill: 'React'
        }
      ]
    },
    {
      id: 'python-advanced',
      title: 'Python Advanced Concepts',
      completed: false,
      questions: [
        {
          id: '1',
          question: 'What is a decorator in Python?',
          options: ['A design pattern', 'A function that modifies another function', 'A data structure', 'A built-in module'],
          correct: 1,
          difficulty: 'hard',
          skill: 'Python'
        }
      ]
    }
  ]);

  const [learningModules, setLearningModules] = useState<LearningModule[]>([
    {
      id: 'react-hooks-deep-dive',
      title: 'React Hooks Deep Dive',
      description: 'Master advanced React hooks and custom hook patterns',
      skill: 'React',
      difficulty: 'Intermediate',
      duration: '45 min',
      type: 'video',
      url: '#',
      completed: false,
      xpReward: 200
    },
    {
      id: 'python-data-structures',
      title: 'Python Data Structures & Algorithms',
      description: 'Learn efficient data structures and algorithm implementation',
      skill: 'Python',
      difficulty: 'Advanced',
      duration: '60 min',
      type: 'practice',
      url: '#',
      completed: false,
      xpReward: 300
    },
    {
      id: 'system-design-basics',
      title: 'System Design Fundamentals',
      description: 'Understanding scalable system architecture',
      skill: 'System Design',
      difficulty: 'Intermediate',
      duration: '90 min',
      type: 'article',
      url: '#',
      completed: false,
      xpReward: 250
    }
  ]);

  const [skillGaps] = useState<string[]>(['Python', 'System Design', 'Docker', 'AWS']);

  const updateQuizScore = (quizId: string, score: number) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId ? { ...quiz, completed: true, score } : quiz
    ));
  };

  const completeModule = (moduleId: string) => {
    setLearningModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, completed: true } : module
    ));
  };

  const getRecommendedModules = (skills: string[]) => {
    return learningModules.filter(module => 
      skillGaps.includes(module.skill) || skills.includes(module.skill)
    );
  };

  return (
    <DataContext.Provider value={{
      quizzes,
      learningModules,
      skillGaps,
      updateQuizScore,
      completeModule,
      getRecommendedModules
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}