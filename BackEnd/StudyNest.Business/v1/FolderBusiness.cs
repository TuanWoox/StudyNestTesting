using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudyNest.Business.Repository;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Folder;
using StudyNest.Common.Models.Paging;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Common.Utils.Helper;
using StudyNest.Data;
using System.Globalization;

namespace StudyNest.Business.v1
{
    public class FolderBusiness: IFolderBusiness
    {
        public ApplicationDbContext _dbContext;
        public IRepository<Folder, string> _repository;
        public IUserContext _userContext;
        public FolderBusiness(ApplicationDbContext _dbContext, IRepository<Folder,string> repository, IUserContext userContext)
        {
            this._dbContext = _dbContext;
            this._repository = repository;
            this._userContext = userContext;
        }
      
        public async Task<ReturnResult<PagedData<SelectFolderDTO, string>>> GetPaging(Page<string> page)
        {
            ReturnResult<PagedData<SelectFolderDTO, string>> result = new ReturnResult<PagedData<SelectFolderDTO, string>>();
            try
            {
                var query = _dbContext.Folders.Where(x => x.OwnerId == _userContext.UserId).AsQueryable();
                result.Result = await _repository.GetPagingAsync<Page<string>, SelectFolderDTO>(query, page);
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
            }
            return result;
        }
        public async Task<ReturnResult<Folder>> GetOneById(string id)
        {
            ReturnResult<Folder> result = new ReturnResult<Folder>();
            try
            {
                var existing = await _dbContext.Folders.Where(x => x.Id == id).Include(x => x.Notes).FirstOrDefaultAsync();
                if(existing == null)
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "folder", id);
                } else result.Result = existing;
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
            }
            return result;
        }
        public async Task<ReturnResult<Folder>> CreateNew(CreateFolderDTO newEntity)
        {
            ReturnResult<Folder> result = new ReturnResult<Folder>();
            try
            {
                var formatNewEntity = new Folder
                {
                    FolderName = newEntity.FolderName.Trim(),
                    OwnerId = _userContext.UserId
                };
                if(string.IsNullOrEmpty(formatNewEntity.OwnerId) || string.IsNullOrEmpty(formatNewEntity.FolderName))
                {
                    result.Message = "Invalid fields data";
                } else result = await _repository.CreateAsync(formatNewEntity);
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
            }
            return result;
        }
        public async Task<ReturnResult<Folder>> UpdateFolder(UpdateFolderDTO newEntity)
        {
            ReturnResult<Folder> result = new ReturnResult<Folder>();
            try
            {
                result = await _repository.UpdateAsync(newEntity);
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
            }
            return result;
        }
        public async Task<ReturnResult<bool>> DeleteById(string id)
        {
            var result = new ReturnResult<bool>();
            try
            {
                var foldersToDelete = await _dbContext.Folders.Where(x => x.Id == id).ToListAsync();
                if (!foldersToDelete.Any())
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "folder", id);
                    return result;
                }
                _dbContext.RemoveRange(foldersToDelete);
                var notesToDelete = await _dbContext.Notes.Where(x => x.FolderId == id).ToListAsync();
                if (notesToDelete.Any())
                {
                    _dbContext.RemoveRange(notesToDelete);
                }
                if (await _dbContext.SaveChangesAsync() > 0)
                {
                    result.Result = true;
                }
                else result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
            }
            return result;
        }
        public async Task<ReturnResult<int>> DeleteByList(List<string> ids)
        {
            ReturnResult<int> result = new ReturnResult<int>();
            try
            {
                var foldersToDelete = await _dbContext.Folders.Where(x => ids.Contains(x.Id)).ToListAsync();
                if (!foldersToDelete.Any())
                {
                    result.Message = ResponseMessage.MESSAGE_ALL_ITEM_NOT_FOUND;
                    return result;
                }
                _dbContext.RemoveRange(foldersToDelete);
                var notesToDelete = await _dbContext.Notes.Where(x => ids.Contains(x.FolderId)).ToListAsync();
                if (notesToDelete.Any())
                {
                    _dbContext.RemoveRange(notesToDelete);
                }
                if (await _dbContext.SaveChangesAsync() > 0)
                {
                    result.Result = foldersToDelete.Count;
                }
                else result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
            }
            return result;
        }
    }
}
