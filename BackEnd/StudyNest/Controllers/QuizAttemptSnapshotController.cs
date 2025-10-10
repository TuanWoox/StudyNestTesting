using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptSnapshot;
using StudyNest.Common.Utils.Extensions;

namespace StudyNest.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class QuizAttemptSnapshotController : ControllerBase
    {
        IQuizAttemptSnapshotBusiness _quizAttemptSnapshotBusiness;
        public QuizAttemptSnapshotController(IQuizAttemptSnapshotBusiness quizAttemptSnapshotBusiness)
        {
            this._quizAttemptSnapshotBusiness = quizAttemptSnapshotBusiness;
        }
        
        [HttpGet("GetOneByIdForAttempting/{quizId}")]
        public async Task<IActionResult> GetOneByIdForAttempting(string quizId)
        {
            ReturnResult<QuizAttemptSnapshotDTO> result = new ReturnResult<QuizAttemptSnapshotDTO>();
            try
            {
                result = await _quizAttemptSnapshotBusiness.GetOneByIdForAttempting(quizId);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
