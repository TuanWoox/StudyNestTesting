using AutoMapper;
using StudyNest.Business.Repository;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.FeedBack;
using StudyNest.Common.Utils.Enums;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Business.v1
{
    public class FeedBackBusiness: IFeedBackBusiness
    {
        IUserContext _userContext;
        ApplicationDbContext _context;    
        IRepository<FeedBack, string> _repository;
        IMapper _mapper;
        public FeedBackBusiness(IUserContext userContext, ApplicationDbContext context, IRepository<FeedBack, string> repository, IMapper mapper) 
        {
            this._userContext = userContext;
            this._context = context;
            this._repository = repository;
            this._mapper = mapper;
        }
        public async Task<ReturnResult<FeedBackDTO>> CreateFeedBack(CreateFeedBackDTO createFeedBackDTO)
        {
            ReturnResult<FeedBackDTO> result = new ReturnResult<FeedBackDTO>();
            try
            {
               var savedResult = await _repository.CreateAsync(new FeedBack
               {
                     Rating = createFeedBackDTO.Rating,
                     Category = createFeedBackDTO.Category,
                     Description = createFeedBackDTO.Description,
                     UserId = _userContext.UserId,
                     Status = FeedBackStatus.Pending
                });
                if (savedResult.Message == null)
                {
                    result.Result = _mapper.Map<FeedBackDTO>(savedResult.Result);
                }
                else
                {
                    result.Message = savedResult.Message;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
    }
}
