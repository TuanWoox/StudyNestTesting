import instance from "@/config/axiosConfig"
import { ReturnResult } from "@/types/common/return-result"
import { QuizStatisticsDTO } from "@/types/quizStatistics/QuizStatisticsDTO"

const quizStatisticsService = {
    getOneById: async (quizId: string) => {
        const { data } = await instance.get<ReturnResult<QuizStatisticsDTO>>(`/QuizStatistics/${quizId}`)
        return data;
    }
}


export default quizStatisticsService;