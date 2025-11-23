using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.FeedBack;
using StudyNest.Common.Utils.Extensions;

namespace StudyNest.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class FeedBackController : ControllerBase
    {
        public IFeedBackBusiness _feedBackBusiness;
        public FeedBackController(IFeedBackBusiness feedBackBusiness)
        {
            this._feedBackBusiness = feedBackBusiness;
        }
        [HttpPost]
        public async Task<IActionResult> CreateFeedBack(CreateFeedBackDTO createFeedBackDTO)
        {
            ReturnResult<FeedBackDTO> result = new ReturnResult<FeedBackDTO>();
            try
            {
                result = await _feedBackBusiness.CreateFeedBack(createFeedBackDTO);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
