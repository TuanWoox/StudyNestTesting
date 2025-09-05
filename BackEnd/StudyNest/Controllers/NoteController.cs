using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyNest.Business.v1;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Note;
using StudyNest.Common.Models.Paging;
using StudyNest.Common.Utils.Extensions;

namespace StudyNest.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class NoteController : ControllerBase
    {
        public INoteBusiness _noteBusiness;
        public NoteController(INoteBusiness noteBusiness)

        {
            this._noteBusiness = noteBusiness;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOneById(string id)
        {
            ReturnResult<Note> result = new ReturnResult<Note>();
            try
            {
                result = await _noteBusiness.GetOneById(id);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPost("GetPaging")]
        public async Task<IActionResult> GetPaging(Page<string> page, bool isExported = false)
        {
            ReturnResult<PagedData<SelectNoteDTO, string>> result = new ReturnResult<PagedData<SelectNoteDTO, string>>();
            try
            {
                result = await _noteBusiness.GetPaging(page, isExported);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> CreateNote(CreateNoteDTO newEntity)
        {
            ReturnResult<Note> result = new ReturnResult<Note>();
            try
            {
                result = await _noteBusiness.CreateNote(newEntity);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateNote(UpdateNoteDTO updateEntity)
        {
            ReturnResult<Note> result = new ReturnResult<Note>();
            try
            {
                result = await _noteBusiness.UpdateNote(updateEntity);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoteById(string id)
        {
            ReturnResult<bool> result = new ReturnResult<bool>();
            try
            {
                result = await _noteBusiness.DeleteNote(id);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
        [HttpPost("DeleteNotes")]
        public async Task<IActionResult> DeleteNotes(Page<string> page)
        {
            ReturnResult<int> result = new ReturnResult<int>();
            try
            {
                result = await _noteBusiness.DeleteNotes(page.Selected);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
