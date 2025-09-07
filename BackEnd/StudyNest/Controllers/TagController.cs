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
    public class TagController : ControllerBase
    {
        public ITagBusiness _tagBusiness;
        public TagController(ITagBusiness tagBusiness)
        {
            this._tagBusiness = tagBusiness;
        }
        [AllowAnonymous]
        [HttpPost("GetPaging")]
        public async Task<IActionResult> GetPaging(Page page)
        {
            ReturnResult<PagedData<SelectTagDTO, string>> result = new ReturnResult<PagedData<SelectTagDTO, string>>();
            try
            {
                result = await _tagBusiness.GetPaging(page);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [RoleAuthorize([UserRoleEnum.admin, UserRoleEnum.user])]
        [HttpPost("GetOwnPaging")]
        public async Task<IActionResult> GetOwnPaging(Page page)
        {
            ReturnResult<PagedData<SelectTagDTO, string>> result = new ReturnResult<PagedData<SelectTagDTO, string>>();
            try
            {
                result = await _tagBusiness.GetOwnPaging(page);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpGet("{id}")]
        [RoleAuthorize([UserRoleEnum.admin])]
        public async Task<IActionResult> GetById(string id)
        {
            ReturnResult<Tag> result = new ReturnResult<Tag>();
            try
            {
                result = await _tagBusiness.GetOneById(id);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPost]
        [RoleAuthorize([UserRoleEnum.admin])]
        public async Task<IActionResult> CreateTag(CreateTagDTO newEntity)
        {
            ReturnResult<Tag> result = new ReturnResult<Tag>();
            try
            {
                result = await _tagBusiness.CreateTag(newEntity.Name);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPut]
        [RoleAuthorize([UserRoleEnum.admin])]
        public async Task<IActionResult> UpdateTag(UpdateTagDTO newEntity)
        {
            ReturnResult<Tag> result = new ReturnResult<Tag>();
            try
            {
                result = await _tagBusiness.UpdateTag(newEntity);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpDelete("{id}")]
        [RoleAuthorize([UserRoleEnum.admin])]
        public async Task<IActionResult> DeleteById(string id)
        {
            ReturnResult<bool> result = new ReturnResult<bool>();
            try
            {
                result = await _tagBusiness.DeleteTag(id);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPost("DeleteTags")]
        [RoleAuthorize([UserRoleEnum.admin])]
        public async Task<IActionResult> DeleteTags(Page<string> page)
        {
            ReturnResult<int> result = new ReturnResult<int>();
            try
            {
                result = await _tagBusiness.DeleteTags(page.Selected);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
