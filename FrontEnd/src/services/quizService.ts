import instance from "@/config/axiosConfig";
import { CreateQuizDTO } from "@/types/quiz/createQuizDTO";

const quizService = {
  generateQuiz: async (payload: CreateQuizDTO) => {
    const response = await instance.post("/Quiz", payload);
    return response.data?.result;
  },
  getQuizDetail: async (id: string) => {
    const response = await instance.get(`/Quiz/${id}`);
    return response.data?.result;
  },
  getAllQuiz: async () => {
    const response = await instance.get(`/Quiz`);
    return response.data?.result;
  },
};

export default quizService;
