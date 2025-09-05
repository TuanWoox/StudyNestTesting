using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Tag;
using StudyNest.Common.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface ITagBusiness
    {
        public Task<ReturnResult<PagedData<SelectTagDTO, string>>> GetPaging(Page<string> pageTag);
        public Task<ReturnResult<Tag>> GetOneById(string id);
        public Task<ReturnResult<Tag>> CreateTag(string Name);
        public Task<ReturnResult<Tag>> UpdateTag(UpdateTagDTO newEntity);
        public Task<ReturnResult<bool>> DeleteTag(string id);
        public Task<ReturnResult<int>> DeleteTags(List<string> ids);
        public Task<ReturnResult<List<string>>> GetTagIdsByListOfName(List<string> tagsName);
    }
}
