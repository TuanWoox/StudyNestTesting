using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswer;
using StudyNest.Common.Utils.Extensions;

namespace StudyNest.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class QuizAttemptAnswerController : ControllerBase
    {
        IQuizAttemptAnswerBusiness _quizAttemptAnswerBusiness;
        public QuizAttemptAnswerController(IQuizAttemptAnswerBusiness quizAttemptAnswerBusiness)
        {
            this._quizAttemptAnswerBusiness = quizAttemptAnswerBusiness;
        }
        [HttpPost]
        public async Task<IActionResult> CreateQuizAttemptAnswer(CreateQuizAttemptAnswerDTO newEntity)
        {
            ReturnResult<QuizAttemptAnswerDTO> result = new ReturnResult<QuizAttemptAnswerDTO>();
            try
            {
                result = await _quizAttemptAnswerBusiness.CreateQuizAttemptAnswer(newEntity);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
