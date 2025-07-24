import React, { createContext, useContext, useState, useEffect } from 'react';
import { quizAPI, learningAPI } from '../services/api';

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
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [skillGaps] = useState<string[]>(['Python', 'System Design', 'Docker', 'AWS']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesResponse, modulesResponse] = await Promise.all([
          quizAPI.getQuizzes(),
          learningAPI.getModules()
        ]);

        if (quizzesResponse.data.success) {
          setQuizzes(quizzesResponse.data.quizzes.map((quiz: any) => ({
            ...quiz,
            id: quiz._id,
            completed: false // This will be updated based on user progress
          })));
        }

        if (modulesResponse.data.success) {
          setLearningModules(modulesResponse.data.modules.map((module: any) => ({
            ...module,
            id: module._id,
            url: module.content?.url || '#',
            duration: module.content?.duration || '30 min'
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateQuizScore = async (quizId: string, score: number) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId ? { ...quiz, completed: true, score } : quiz
    ));
  };

  const completeModule = async (moduleId: string) => {
    try {
      const response = await learningAPI.completeModule(moduleId);
      if (response.data.success) {
        setLearningModules(prev => prev.map(module => 
          module.id === moduleId ? { ...module, completed: true } : module
        ));
      }
    } catch (error) {
      console.error('Error completing module:', error);
    }
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