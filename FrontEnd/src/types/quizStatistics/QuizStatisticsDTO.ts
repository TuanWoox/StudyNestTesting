// quiz-statistics.dto.ts

import { QuestionDTO } from "../question/questionDTO";

export interface QuizStatisticsDTO {
    quizId: string;
    quizTitle: string;
    attemptSummary: QuizAttemptSummaryDTO;
    scoreStatistics: QuizScoreStatisticsDTO;
    progress: QuizProgressDTO;
}

export interface QuizAttemptSummaryDTO {
    totalAttempts: number;
    firstAttemptDate?: Date;
    lastAttemptDate?: Date;
    scores: QuizScore[];
    totalRightQuestion: number;
    totalWrongQuestion: number;
    questionErrorCounts: QuestionErrorCount[];
}

export interface QuizScoreStatisticsDTO {
    bestScore: number;
    worstScore: number;
    averageScore: number;
    latestScore: number;
    medianScore: number;
}

export interface QuizProgressDTO {
    isImproving: boolean;
    improvementRate: number; // % change from first to last
    scoreChange: number; // latest - first attempt
    trendDirection: 'Improving' | 'Declining' | 'Stable';
}

export interface QuestionErrorCount {
    question: QuestionDTO;
    wrongCounts: number;
}

export interface QuizScore {
    dateCreated: Date,
    score: number,
}