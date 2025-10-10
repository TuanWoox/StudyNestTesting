import instance from "@/config/axiosConfig";
import { CreateQuestionDTO } from "./../types/question/createQuestionDTO";
import { ReturnResult } from "@/types/common/return-result";
import { UpdateQuestionDTO } from "@/types/question/updateQuestionDTO";

const questionService = {
  createQuestion: async (payload: CreateQuestionDTO): Promise<boolean> => {
    const { data } = await instance.post<ReturnResult<boolean>>(
      "Question",
      payload
    );
    return data.result;
  },
  updateQuestion: async (payload: UpdateQuestionDTO): Promise<boolean> => {
    console.log("payload: " + JSON.stringify(payload, null, 2));
    const { data } = await instance.put<ReturnResult<boolean>>(
      "Question",
      payload
    );
    return data.result;
  },
  deleteQuestion: async (id: string): Promise<boolean> => {
    const { data } = await instance.delete<ReturnResult<boolean>>(
      `/Question/${id}`
    );
    return data.result;
  },
};

export default questionService;
