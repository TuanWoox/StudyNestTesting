using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Models.DTOs.CoreDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface INoteTagBusiness
    {
        public Task<ReturnResult<bool>> SaveTagsToNote(string noteId, List<string> tagIds);
        public Task<ReturnResult<int>> DeleteTagsByNoteId(string noteId);
        public Task<ReturnResult<List<NoteTag>>> GetNoteTagsByIdAndListOfTagNames(string id, List<string> tagsName);
    }
}
