using Microsoft.EntityFrameworkCore;
using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.Paging;
using StudyNest.Data;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Common.Utils.Helper;
using AutoMapper;
namespace StudyNest.Business.Repository
{
    public class Repository<TEntity, TKey> : IRepository<TEntity, TKey> where TEntity : class, IBaseKey<TKey>


    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;
        public Repository(ApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<ReturnResult<TEntity>> CreateAsync<TCreateDto>(TCreateDto entity) where TCreateDto : class, IBaseKey<TKey>
        {
            var result = new ReturnResult<TEntity>();
            try
            {
                if (entity != null)
                {
                    var newEntity = _mapper.Map<TEntity>(entity);
                    var checkValid = await GetByIdAsync(newEntity.Id);
                    if (checkValid != null && checkValid.Result == null)
                    {
                        var addNewEntity = _dbContext.Set<TEntity>().Add(newEntity);
                        if (await _dbContext.SaveChangesAsync() > 0)
                        {
                            result.Result = _mapper.Map<TEntity>(addNewEntity.Entity);
                        }
                    }
                    else
                    {
                        result.Message = ResponseMessage.MESSAGE_CREATE_ERROR;
                    }
                }

            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }

        public async Task<ReturnResult<bool>> DeleteByIdAsync(TKey id)
        {
            ReturnResult<bool> result = new ReturnResult<bool>();
            try
            {
                var dbSet = _dbContext.Set<TEntity>();
                var instance = await dbSet.FindAsync(id);
                if (instance != null)
                {
                    var removeObj = dbSet.Remove(instance);
                    if (await _dbContext.SaveChangesAsync() > 0)
                    {
                        result.Result = true;
                    }
                }

            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }

        public async Task<ReturnResult<int>> DeleteByIdsAsync(List<TKey> ids)
        {
            var rs = new ReturnResult<int>();
            try
            {
                var dbSet = _dbContext.Set<TEntity>();
                var deletedLst = await dbSet.Where(x => ids.Contains(x.Id)).ToListAsync();
                if (deletedLst.Any())
                {
                    dbSet.RemoveRange(deletedLst);
                    if (await _dbContext.SaveChangesAsync() > 0)
                    {
                        rs.Result = deletedLst.Count;
                    }
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return rs;

        }

        public async Task<ReturnResult<TEntity>> GetByIdAsync(TKey id)
        {
            ReturnResult<TEntity> result = new ReturnResult<TEntity>();
            try
            {
                var instance = await _dbContext.Set<TEntity>().FindAsync(id);
                if (instance != null)
                {
                    result.Result = instance;
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }

        public async Task<PagedData<TResponse, TKey>> GetPagingAsync<TPage, TResponse>(IQueryable<TEntity> entities, TPage page, bool isExport = false)
        where TResponse : IBaseKey<TKey>
        where TPage : Page<TKey>
        {
            PagedData<TResponse, TKey> result = new PagedData<TResponse, TKey>(page);
            try
            {
                //var customView = await customViewBusiness.GetCustomViewByID(page.ViewId);
                var query = entities;
                page.FormatFilter(ref query);
                page.FormatOrder(ref query);
                var generalQuery = query;
                if (!isExport)
                {
                    if (page.Size != -1)
                    {
                        generalQuery = generalQuery
                        .Skip(page.PageNumber * page.Size)
                        .Take(page.Size);
                    }
                }
                if (isExport)
                {
                    if (page.Selected != null && page.Selected.Count > 0)
                    {
                        generalQuery = generalQuery.Where(x => page.Selected.Contains(x.Id)).AsQueryable();
                    }
                }
                var tempResult = await generalQuery.ToListAsync();

                if (tempResult != null && tempResult.Count > 0)
                {
                    result.Data = _mapper.Map<List<TResponse>>(tempResult);
                    result.Page.TotalElements = await query.CountAsync();
                }
                else
                {
                    result.Data = new List<TResponse>();
                    result.Page.TotalElements = await query.CountAsync();
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }

        public async Task<ReturnResult<TEntity>> UpdateAsync<TUpdateDto>(TUpdateDto entity)
        where TUpdateDto : class, IBaseKey<TKey>
        {
            ReturnResult<TEntity> returnResult = new ReturnResult<TEntity>();
            try
            {
                var dbSet = _dbContext.Set<TEntity>();
                var updatingEntity = await dbSet.FindAsync(entity.Id);
                if (updatingEntity != null)
                {
                    updatingEntity = StudyNestExtension.UpdateProperties(updatingEntity, entity);
                    var updatedEntity = dbSet.Update(updatingEntity);
                    if (await _dbContext.SaveChangesAsync() > 0)
                    {
                        returnResult.Result = _mapper.Map<TEntity>(updatedEntity.Entity);
                    }
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return returnResult;
        }
    }
}
