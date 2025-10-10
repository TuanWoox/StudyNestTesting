import instance from "@/config/axiosConfig";
import { ReturnResult } from "@/types/common/return-result";
import { QuizAttemptSnapshotDTO } from "@/types/quizAttemptSnapshot/quizAttemptSnapshotDTO";


const quizAttemptSnapshotService = {

    getOneByIdForAttempting: async (id: string): Promise<QuizAttemptSnapshotDTO> => {
        const { data } = await instance.get<ReturnResult<QuizAttemptSnapshotDTO>>(`/QuizAttemptSnapshot/GetOneByIdForAttempting/${id}`)
        return data.result;
    }

}
export default quizAttemptSnapshotService;
