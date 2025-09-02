using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyNest.Common.Attributes;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Tag;
using StudyNest.Common.Models.Paging;
using StudyNest.Common.Utils.Enums;
using StudyNest.Common.Utils.Extensions;

namespace StudyNest.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    [RoleAuthorize([UserRoleEnum.admin])]
    public class TagController : ControllerBase
    {
        public ITagBusiness _tagBusiness;
        public TagController(ITagBusiness tagBusiness)
        {
            this._tagBusiness = tagBusiness;
        }
        [HttpPost("GetPaging")]
        public IActionResult GetPaging(Page page)
        {
            ReturnResult<PagedData<SelectTagDTO, string>> result = new ReturnResult<PagedData<SelectTagDTO, string>>();
            try
            {
                result = _tagBusiness.GetTags(page).Result;
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            ReturnResult<Tag> result = new ReturnResult<Tag>();
            try
            {
                result = _tagBusiness.GetTagById(id).Result;
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPost]
        public IActionResult CreateTag(CreateTagDTO newEntity)
        {
            ReturnResult<Tag> result = new ReturnResult<Tag>();
            try
            {
                result = _tagBusiness.CreateTag(newEntity.Name).Result;
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPut]
        public IActionResult UpdateTag(UpdateTagDTO newEntity)
        {
            ReturnResult<Tag> result = new ReturnResult<Tag>();
            try
            {
                result = _tagBusiness.UpdateTag(newEntity).Result;
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpDelete]
        public IActionResult DeleteById(string id)
        {
            ReturnResult<bool> result = new ReturnResult<bool>();
            try
            {
                result = _tagBusiness.DeleteById(id).Result;
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPost("DeleteListTag")]
        public IActionResult DeleteListTag(Page<string> page)
        {
            ReturnResult<int> result = new ReturnResult<int>();
            try
            {
                result = _tagBusiness.DeleteListTag(page.Selected).Result;
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
