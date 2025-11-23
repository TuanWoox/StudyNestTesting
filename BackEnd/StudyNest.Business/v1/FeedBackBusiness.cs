using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudyNest.Business.Repository;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.FeedBack;
using StudyNest.Common.Models.Paging;
using StudyNest.Common.Utils.Enums;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Common.Utils.Helper;
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

        public async Task<ReturnResult<PagedData<SelectFeedBackDTO,string>>> GetPaging(Page<string> page, bool isExported = false)
        {
            ReturnResult<PagedData<SelectFeedBackDTO,string>> result = new ReturnResult<PagedData<SelectFeedBackDTO,string>>();
            try
            {
                var query = _context.FeedBacks.Where(x => x.UserId == _userContext.UserId);
                result.Result = await _repository.GetPagingAsync<Page<string>, SelectFeedBackDTO>(query,page,isExported);
            }
            catch(Exception ex)
            {
                result.Message = ex.Message;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
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

        public async Task<ReturnResult<FeedBackDTO>> UpdateFeedBack(UpdateFeedBackDTO updateFeedBackDTO)
        {
            ReturnResult<FeedBackDTO> result = new ReturnResult<FeedBackDTO>();
            try
            {
                var existingFeedBack = await _context.FeedBacks.Where(x => x.Id == updateFeedBackDTO.Id 
                                                                        && x.UserId == _userContext.UserId
                                                                        && x.Status == FeedBackStatus.Pending
                                                                        ).FirstOrDefaultAsync();
                if (existingFeedBack == null)
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "feedback", updateFeedBackDTO.Id);
                }
                else
                {
                    existingFeedBack.Rating = updateFeedBackDTO.Rating;
                    existingFeedBack.Category = updateFeedBackDTO.Category;
                    existingFeedBack.Description = updateFeedBackDTO.Description;
                    var updatedResult = await _repository.UpdateAsync(existingFeedBack);
                    if (updatedResult.Message == null)
                    {
                        result.Result = _mapper.Map<FeedBackDTO>(updatedResult.Result);
                    }
                    else
                    {
                        result.Message = updatedResult.Message;
                    }
                }
            }
            catch(Exception ex)
            {
                result.Message = ex.Message;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
        public async Task<ReturnResult<bool>> DeleteFeedBack(string id)
        {
            ReturnResult<bool> result = new ReturnResult<bool>();
            try
            {
                var existingFeedBack = await _context.FeedBacks.Where(x => x.Id == id
                                                                && x.UserId == _userContext.UserId 
                                                                && x.Status == FeedBackStatus.Pending)
                                                                .FirstOrDefaultAsync();
                if (existingFeedBack == null)
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "feedback", id);
                }
                else
                {
                    result = await _repository.DeleteByIdAsync(id);
                }
            }
            catch(Exception ex)
            {
                result.Message = ex.Message;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
        public async Task<ReturnResult<int>> DeleteFeedBacks(List<string> ids)
        {
            ReturnResult<int> result = new ReturnResult<int>();
            try
            {
                var existingFeedBacks = await _context.FeedBacks.Where(x => ids.Contains(x.Id) 
                                                                && x.UserId == _userContext.UserId
                                                                && x.Status == FeedBackStatus.Pending
                                                                ).ToListAsync();
                if (!existingFeedBacks.Any())
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "feedback", string.Join(", ", ids));
                }
                else
                {
                    result = await _repository.DeleteByIdsAsync(ids);
                }
            }
            catch(Exception ex)
            {
                result.Message = ex.Message;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
    }
}
