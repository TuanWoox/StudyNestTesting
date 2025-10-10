import instance from "@/config/axiosConfig";
import { Page } from "@/types/common/page";
import { PagedData } from "@/types/common/paged-data";
import { ReturnResult } from "@/types/common/return-result";
import { CreateQuizDTO } from "@/types/quiz/createQuizDTO";
import { QuizDetail, QuizList } from "@/types/quiz/quiz";
import { UpdateQuizDTO } from "@/types/quiz/updateQuizDTO";

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
    console.log("Quiz Details: " + JSON.stringify(data.result, null, 2));
    return data.result; // dateCreated is string here
  },
  getAllQuiz: async (
    payload: Page<string>
  ): Promise<PagedData<QuizList, string>> => {
    const { data } = await instance.post<
      ReturnResult<PagedData<QuizList, string>>
    >("/Quiz/GetPaging", payload);
    return data.result;
  },
  updateQuiz: async (payload: UpdateQuizDTO): Promise<boolean> => {
    const { data } = await instance.put<ReturnResult<boolean>>(
      "/Quiz",
      payload
    );
    console.log("updateQuiz: " + JSON.stringify(data.result, null, 2));
    return data.result;
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
