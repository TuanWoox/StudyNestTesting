import instance from "@/config/axiosConfig";
import { ReturnResult } from "@/types/common/return-result";
import { QuizAttemptDTO } from "@/types/quizAttempt/quizAttemptDTO";
import { CreateQuizAttemptAnswerDTO } from "@/types/quizAttemptAnswer/createQuizAttemptAnswerDTO";

const quizAttemptService = {

    getOneById: async (quizAttemptId: string) => {
        const { data } = await instance.get<ReturnResult<QuizAttemptDTO>>(`/QuizAttempt/${quizAttemptId}`);
        return data.result;
    },

    submitQuizAttempt: async (quizId: string, submittedAnswers: CreateQuizAttemptAnswerDTO[]) => {
        const { data } = await instance.post<ReturnResult<string>>(`/QuizAttempt/SubmitQuizAttempt/${quizId}`, submittedAnswers);
        return data.result;
    }

}

export default quizAttemptService;