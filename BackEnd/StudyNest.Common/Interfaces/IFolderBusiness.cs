using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Folder;
using StudyNest.Common.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface IFolderBusiness
    {
        public Task<ReturnResult<PagedData<SelectFolderDTO, string>>> GetPaging(Page<string> page);
        public Task<ReturnResult<Folder>> GetOneById(string id);
        public Task<ReturnResult<Folder>> CreateNew(CreateFolderDTO folder);
        public Task<ReturnResult<Folder>> UpdateFolder(UpdateFolderDTO folder);
        public Task<ReturnResult<bool>> DeleteById(string id);
        public Task<ReturnResult<int>> DeleteByList(List<string> ids);
    }
}
