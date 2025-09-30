using CloudinaryDotNet.Actions;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Setting;
using StudyNest.Common.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface ISettingBusiness
    {
        public Task<ReturnResult<PagedData<SelectSettingDTO, string>>> GetPaging(Page<string> page);
        public Task<ReturnResult<Setting>> GetOneByKeyAndGroup(string key, string group, bool fromSystem = false);
        public Task<ReturnResult<Setting>> CreateSetting(CreateSettingDTO newEntity);
        public Task<ReturnResult<Setting>> UpdateSetting(UpdateSettingDTO newEntity);
        public Task<ReturnResult<bool>> DeleteSetting(string id);
        public Task<ReturnResult<int>> DeleteSettings(List<string> ids);
    }
}
