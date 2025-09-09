using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Folder;
using StudyNest.Common.Models.Paging;
using StudyNest.Common.Utils.Extensions;
using System.Threading.Tasks;

namespace StudyNest.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class FolderController : ControllerBase
    {
        public IFolderBusiness _folderBusiness;
        public FolderController(IFolderBusiness folderBusiness)
        {
            this._folderBusiness = folderBusiness;
        }
        [HttpPost("GetPaging")]
        public async Task<IActionResult> GetPaging(Page<string> page)
        {
            ReturnResult<PagedData<SelectFolderDTO, string>> result = new ReturnResult<PagedData<SelectFolderDTO, string>>();
            try
            {
                result = await _folderBusiness.GetPaging(page);
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
            ReturnResult<Folder> result = new ReturnResult<Folder>();
            try
            {
                result = await _folderBusiness.GetOneById(id);
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> CreateFolder(CreateFolderDTO newEntity)
        {
            ReturnResult<Folder> result = new ReturnResult<Folder>();
            try
            {
                result = await _folderBusiness.CreateFolder(newEntity);
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateFolder(UpdateFolderDTO newEntity)
        {
            ReturnResult<Folder> result = new ReturnResult<Folder>();
            try
            {
                result = await _folderBusiness.UpdateFolder(newEntity);
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFolder(string id)
        {
            ReturnResult<bool> result = new ReturnResult<bool>();
            try
            {
                result = await _folderBusiness.DeleteFolder(id);
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPost("DeleteFolders")]
        public async Task<IActionResult> DeleteListFolder(Page<string> page)
        {
            ReturnResult<int> result = new ReturnResult<int>();
            try
            {
                result = await _folderBusiness.DeleteFolders(page.Selected);
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
