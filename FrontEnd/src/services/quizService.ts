import instance from "@/config/axiosConfig";
import { ReturnResult } from "@/types/common/return-result";
import { CreateQuizDTO } from "@/types/quiz/createQuizDTO";
import { QuizDetail, QuizList } from "@/types/quiz/quiz";

interface GenerateQuizResult {
  id: string;
}

const quizService = {
  generateQuiz: async (payload: CreateQuizDTO): Promise<GenerateQuizResult> => {
    const { data } = await instance.post<ReturnResult<GenerateQuizResult>>(
      "/Quiz",
      payload
    );
    return data.result;
  },
  getQuizDetail: async (id: string): Promise<QuizDetail> => {
    const { data } = await instance.get<ReturnResult<QuizDetail>>(
      `/Quiz/${id}`
    );
    return data.result; // dateCreated is string here
  },
  getAllQuiz: async (): Promise<QuizList[]> => {
    const { data } = await instance.get<ReturnResult<QuizList[]>>("/Quiz");
    return data.result; // no 'key' added
  },
  deleteQuiz: async (id: string): Promise<boolean> => {
    // If backend sends { message }, interceptor will have rejected already.
    const { data } = await instance.delete<ReturnResult<boolean>>(
      `/Quiz/${id}`
    );
    // In a happy path, data.message is falsy and result should be true.
    return data.result === true;
  },
};

export default quizService;
