using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyNest.Business.v1;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttempt;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswer;
using StudyNest.Common.Models.Paging;
using StudyNest.Common.Utils.Extensions;

namespace StudyNest.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class QuizAttemptController : ControllerBase
    {
        IQuizAttemptBusiness _quizAttemptBusiness;
        public QuizAttemptController(IQuizAttemptBusiness quizAttemptBusiness)
        {
            _quizAttemptBusiness = quizAttemptBusiness;
        }
        [HttpPost("GetPaging")]
        public async Task<IActionResult> GetPaging(Page<string> page, bool isExported = false)
        {
            ReturnResult<PagedData<SelectQuizAttemptDTO, string>> result = new ReturnResult<PagedData<SelectQuizAttemptDTO, string>>();
            try
            {
                result = await _quizAttemptBusiness.GetPaging(page, isExported);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOneById(string id)
        {
            ReturnResult<QuizAttemptDTO> result = new ReturnResult<QuizAttemptDTO>();
            try
            {
                result = await _quizAttemptBusiness.GetOneById(id);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> CreateQuizAttempt(CreateQuizAttemptDTO newEntity)
        {
            ReturnResult<QuizAttemptDTO> result = new ReturnResult<QuizAttemptDTO>();
            try
            {
                result = await _quizAttemptBusiness.CreateQuizAttempt(newEntity);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPut("SubmitQuizAttempt/{id}")]
        public async Task<IActionResult> SubmitQuizAttempt(string id)
        {
            ReturnResult<QuizAttemptDTO> result = new ReturnResult<QuizAttemptDTO>();
            try
            {
                result = await _quizAttemptBusiness.SubmitQuizAttempt(id);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
