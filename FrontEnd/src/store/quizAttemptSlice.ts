import { CreateQuizAttemptAnswerDTO } from "@/types/quizAttemptAnswer/createQuizAttemptAnswerDTO";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { QuizAttemptSnapshotDTO } from "@/types/quizAttemptSnapshot/quizAttemptSnapshotDTO";

interface QuizAttemptState {
    createQuizAttemptAnswerList: CreateQuizAttemptAnswerDTO[];
    quizId: string;
    questionId: string;
    quizAttemptSnapshot: string;
}

const initialState: QuizAttemptState = {
    createQuizAttemptAnswerList: [],
    quizId: "",
    questionId: "",
    quizAttemptSnapshot: ""
};

const quizAttemptSlice = createSlice({
    name: "quizAttempt",
    initialState,
    reducers: {
        initState: (state, action: PayloadAction<QuizAttemptState>) => {
            return action.payload;
        },
        addAnswer: (state, action: PayloadAction<CreateQuizAttemptAnswerDTO>) => {
            const newAnswer = { ...action.payload, quizAttemptId: "" };
            const filteredAnswers = state.createQuizAttemptAnswerList.filter(
                answer => answer.snapShotQuestionId !== newAnswer.snapShotQuestionId
            );
            state.createQuizAttemptAnswerList = [...filteredAnswers, newAnswer];
        },
        removeAnswer: (state, action: PayloadAction<string>) => {
            state.createQuizAttemptAnswerList = state.createQuizAttemptAnswerList.filter(x => x.snapShotQuestionId != action.payload);
        },
        nextQuestion: (state) => {
            const snapshot = getQuizSnapshot(state.quizAttemptSnapshot);
            if (!snapshot) return;

            const currentIndex = snapshot.quizQuestionsParsed.findIndex(
                q => q.id === state.questionId
            );

            if (currentIndex < snapshot.quizQuestionsParsed.length - 1) {
                state.questionId = snapshot.quizQuestionsParsed[currentIndex + 1].id;
            }
        },
        previousQuestion: (state) => {
            const snapshot = getQuizSnapshot(state.quizAttemptSnapshot);
            if (!snapshot) return;

            const currentIndex = snapshot.quizQuestionsParsed.findIndex(
                q => q.id === state.questionId
            );

            if (currentIndex > 0) {
                state.questionId = snapshot.quizQuestionsParsed[currentIndex - 1].id;
            }
        },
        resetState: () => initialState,
    },
});

// Helper function to parse quiz snapshot
const getQuizSnapshot = (snapshotString: string): QuizAttemptSnapshotDTO | null => {
    if (!snapshotString) return null;
    try {
        return JSON.parse(snapshotString) as QuizAttemptSnapshotDTO;
    } catch {
        return null;
    }
};

// Helper function to get common quiz data
const getQuizData = (state: RootState) => {
    const snapshot = getQuizSnapshot(state.quizAttempt.quizAttemptSnapshot);

    if (!snapshot) {
        return null;
    }

    const questions = snapshot.quizQuestionsParsed;
    const currentQuestionIndex = questions.findIndex(
        q => q.id === state.quizAttempt.questionId
    );
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = state.quizAttempt.createQuizAttemptAnswerList.find(
        answer => answer.snapShotQuestionId === currentQuestion?.id
    );

    return {
        questions,
        currentQuestionIndex,
        currentQuestion,
        currentAnswer,
        answeredList: state.quizAttempt.createQuizAttemptAnswerList
    };
};

// Selector to get answer for a specific question
export const selectAnswerByQuestionId = (questionId: string) => (state: RootState) =>
    state.quizAttempt.createQuizAttemptAnswerList.find(
        answer => answer.snapShotQuestionId === questionId
    );

// Selector to get the entire quiz attempt state
export const selectQuizAttempt = (state: RootState): QuizAttemptState =>
    state.quizAttempt;

//Using createSelector to memoize data
export const selectQuizNavigation = createSelector(
    [getQuizData],
    (data) => {
        if (!data) {
            return {
                isLastQuestion: false,
                isFirstQuestion: false,
                hasAnswer: false,
            };
        }

        const { questions, currentQuestionIndex, currentAnswer } = data;

        return {
            isLastQuestion: currentQuestionIndex === questions.length - 1,
            isFirstQuestion: currentQuestionIndex === 0,
            hasAnswer: !!currentAnswer,
        };
    }
);

//Using createSelector to memoize data
export const selectQuizProgress = createSelector(
    [getQuizData],
    (data) => {
        if (!data) {
            return {
                currentQuestionIndex: -1,
                answeredCount: 0,
                progressPercentage: 0,
                totalQuestions: 0,
            };
        }

        const { questions, currentQuestionIndex, answeredList } = data;
        const answeredQuestionIds = new Set(
            answeredList.map((answer) => answer.snapShotQuestionId)
        );
        const answeredCount = answeredQuestionIds.size;
        const progressPercentage =
            questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

        return {
            currentQuestionIndex,
            answeredCount,
            progressPercentage,
            totalQuestions: questions.length,
        };
    }
);

//Using createSelector to memoize data
export const selectQuizCard = createSelector(
    [getQuizData],
    (data) => {
        if (!data) {
            return {
                currentQuestion: null,
                currentAnswer: undefined,
            };
        }

        return {
            currentQuestion: data.currentQuestion,
            currentAnswer: data.currentAnswer,
        };
    }
);

export const { initState, addAnswer, nextQuestion, previousQuestion, resetState, removeAnswer } = quizAttemptSlice.actions;
export default quizAttemptSlice.reducer;