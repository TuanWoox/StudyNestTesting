using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.FeedBack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface IFeedBackBusiness
    {
        public Task<ReturnResult<FeedBackDTO>> CreateFeedBack(CreateFeedBackDTO createFeedBackDTO);
    }
}
