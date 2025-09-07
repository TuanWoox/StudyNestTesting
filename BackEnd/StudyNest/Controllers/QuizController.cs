using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;
using StudyNest.Business.v1;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Quizzes;
using StudyNest.Common.Utils.Extensions;

namespace StudyNest.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class QuizController : ControllerBase
    {
        private readonly IQuizBusiness _quizBusiness;

        public QuizController(IQuizBusiness quizBusiness)
        {
            this._quizBusiness = quizBusiness;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuiz()
        {
            var rs = new ReturnResult<List<QuizDTO>>();
            try
            {
                rs = await _quizBusiness.GetAllQuiz();
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(rs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuizDetail(string id)
        {
            var rs = new ReturnResult<Quiz>();
            try
            {
                rs = await _quizBusiness.GetQuizDetail(id);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(rs);
        }
        [HttpPost]
        public async Task<IActionResult> CreateQuiz([FromBody] CreateQuizDTO model)
        {
            var rs = new ReturnResult<object>();
            try
            {
                rs = await _quizBusiness.GenerateAsync(model);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(rs);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuiz(string id)
        {
            ReturnResult<bool> result = new ReturnResult<bool>();
            try
            {
                result = await _quizBusiness.DeleteById(id);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
