using Microsoft.AspNetCore.SignalR;

namespace StudyNest.Business.Hubs
{
    public interface IQuizAttemptSnapshotClient
    {
        Task CompleteCreateQuizAttemptSnapshot(object dataSendBack);
    }
    public class QuizAttemptSnapshotHub: Hub<IQuizAttemptSnapshotClient>
    {
    }
}
