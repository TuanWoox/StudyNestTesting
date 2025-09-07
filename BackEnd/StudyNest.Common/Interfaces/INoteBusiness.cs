using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Note;
using StudyNest.Common.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface INoteBusiness
    {
        public Task<ReturnResult<PagedData<SelectNoteDTO, string>>> GetPaging(Page<string> page, bool isExported = false);
        public Task<ReturnResult<Note>> GetOneById(string id);
        public Task<ReturnResult<Note>> CreateNote(CreateNoteDTO newEntity);
        public Task<ReturnResult<Note>> UpdateNote(UpdateNoteDTO newEntity);
        public Task<ReturnResult<bool>> DeleteNote(string id);
        public Task<ReturnResult<int>> DeleteNotes(List<string> ids);
    }
}
