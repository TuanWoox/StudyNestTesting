using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyNest.Common.Attributes;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Setting;
using StudyNest.Common.Models.Paging;
using StudyNest.Common.Utils.Enums;
using StudyNest.Common.Utils.Extensions;

namespace StudyNest.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class SettingController : ControllerBase
    {
        ISettingBusiness _settingBusiness;
        public SettingController(ISettingBusiness settingBusiness)
        {
            this._settingBusiness = settingBusiness;
        }
        [HttpGet("GetSettingByKeyAndGroup")]
        public async Task<IActionResult> GetOneByKeyAndGroup(string key, string group)
        {
            ReturnResult<Setting> result = new ReturnResult<Setting>();
            try
            {
                result = await _settingBusiness.GetOneByKeyAndGroup(key, group);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [RoleAuthorize(UserRoleEnum.admin)]
        [HttpPost("GetPaging")]
        public async Task<IActionResult> GetPaging(Page<string> page)
        {
            ReturnResult<PagedData<SelectSettingDTO, string>> result = new ReturnResult<PagedData<SelectSettingDTO, string>>();
            try
            {
                result = await _settingBusiness.GetPaging(page);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [RoleAuthorize(UserRoleEnum.admin)]
        [HttpPost]
        public async Task<IActionResult> CreateSetting(CreateSettingDTO newEntity)
        {
            ReturnResult<Setting> result = new ReturnResult<Setting>();
            try
            {
                result = await _settingBusiness.CreateSetting(newEntity);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [RoleAuthorize(UserRoleEnum.admin)]
        [HttpPut]
        public async Task<IActionResult> UpdateSetting(UpdateSettingDTO newEntity)
        {
            ReturnResult<Setting> result = new ReturnResult<Setting>();
            try
            {
                result = await _settingBusiness.UpdateSetting(newEntity);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [RoleAuthorize(UserRoleEnum.admin)]
        [HttpDelete]
        public async Task<IActionResult> DeleteSetting(string id)
        {
            ReturnResult<bool> result = new ReturnResult<bool>();
            try
            {
                result = await _settingBusiness.DeleteSetting(id);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [RoleAuthorize(UserRoleEnum.admin)]
        [HttpPost("DeleteSettings")]
        public async Task<IActionResult> DeleteSettings(Page<string> page)
        {
            ReturnResult<int> result = new ReturnResult<int>();
            try
            {
                result = await _settingBusiness.DeleteSettings(page.Selected);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
