using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using StudyNest.Business.Repository;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Setting;
using StudyNest.Common.Models.Paging;
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
    public class SettingBusiness: ISettingBusiness
    {
        ApplicationDbContext _dbContext;
        IRepository<Setting, string> _repository;
        public SettingBusiness(ApplicationDbContext context, IRepository<Setting,string> repository)
        {
            _dbContext = context;
            _repository = repository;
        }
        public async Task<ReturnResult<PagedData<SelectSettingDTO, string>>> GetPaging(Page<string> page)
        {
            ReturnResult<PagedData<SelectSettingDTO, string>> result = new ReturnResult<PagedData<SelectSettingDTO, string>>();
            try
            {
                var query = _dbContext.Settings.Where(x => x.SettingLevel != 1).AsQueryable();
                result.Result = await _repository.GetPagingAsync<Page<string>,SelectSettingDTO>(query,page);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
        public async Task<ReturnResult<Setting>> GetOneByKeyAndGroup(string key, string group)
        {
            ReturnResult<Setting> result = new ReturnResult<Setting>();
            try
            {
                var existing = await _dbContext.Settings.Where(x => x.Key == key && x.Group == group).AsNoTracking().FirstOrDefaultAsync();
                if(existing != null)
                {
                    if(existing.SettingLevel == 1)
                    {
                        result.Message = "This cannot be displayed on the interface, please use database to retrieve and update";
                    } else result.Result = existing;
                } 
                else
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_EXIST, $"The setting with key '{key.Trim()}' and group '{group.Trim()}'");
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
        public async Task<ReturnResult<Setting>> CreateSetting(CreateSettingDTO newEntity)
        {
            ReturnResult<Setting> result = new ReturnResult<Setting>();
            try
            {
                var existing = await _dbContext.Settings.Where(x => x.Key == newEntity.Key.Trim() && x.Group == newEntity.Group.Trim()).IgnoreQueryFilters().FirstOrDefaultAsync();
                if(existing != null)
                {
                    //First we need to find if the existing one is deleted
                    if (existing.Deleted)
                    {
                        // If it is deleted, we will update the deleted one instead of trying to create a new one
                        existing.Description = newEntity.Description;
                        existing.Value = newEntity.Value;
                        existing.SettingLevel = newEntity.SettingLevel;
                        existing.Deleted = false;
                        existing.DateDeleted = null;
                        if(await _dbContext.SaveChangesAsync() > 0)
                        {
                            result.Result = existing;
                        } else result.Message = ResponseMessage.MESSAGE_CREATE_ERROR;   // SaveChangesAsync failed                   
                    } 
                    else
                    {
                        // If it is not deleted, we will return error message that the item already exists
                        result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_EXIST, $"The setting with key '{newEntity.Key.Trim()}' and group '{newEntity.Group.Trim()}'");
                    }
                } 
                else
                {
                    // Create new setting if not existing
                    var formatEntity = new CreateSettingDTO
                    {
                        Key = newEntity.Key,
                        Group = newEntity.Group,
                        Value = newEntity.Value,
                        Description = newEntity.Description,
                        SettingLevel = newEntity.SettingLevel
                    };
                    result = await _repository.CreateAsync(formatEntity);
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
        public async Task<ReturnResult<Setting>> UpdateSetting(UpdateSettingDTO newEntity)
        {
            var result = new ReturnResult<Setting>();
            try
            {
                // Based on the ID to get the old setting, only take the not deleted one
                var currentExisting = await _dbContext.Settings.Where(x => x.Id == newEntity.Id).FirstOrDefaultAsync();

                // Then we can fetch the setting ( maybe existing one for handling) by KEY and GROUP. We do not care if it has been deleted or not
                var movingExisting = await _dbContext.Settings.IgnoreQueryFilters().Where(x => x.Key == newEntity.Key.Trim() && x.Group == newEntity.Group.Trim()).FirstOrDefaultAsync();

                if (currentExisting != null)
                {
                    if (movingExisting != null)
                    {
                        // Same record, just update values
                        if (currentExisting.Id == movingExisting.Id)
                        {

                            currentExisting.Value = newEntity.Value;
                            currentExisting.Description = newEntity.Description;
                            currentExisting.SettingLevel = newEntity.SettingLevel;

                            if (await _dbContext.SaveChangesAsync() > 0)
                            {
                                result.Result = currentExisting;
                            }
                        }
                        else
                        {
                            // Not the same record and it is active => so we cannot override
                            if (!movingExisting.Deleted)
                            {
                                result.Message = string.Format( ResponseMessage.MESSAGE_ITEM_EXIST,$"The setting with key '{newEntity.Key.Trim()}' and group '{newEntity.Group.Trim()}'") ;
                            }
                            else
                            {
                                // Not the same record but it is deleted => so we can deleted the old one and move the value to the new one
                                _dbContext.Remove(currentExisting);
                                movingExisting.Value = newEntity.Value;
                                movingExisting.Description = newEntity.Description;
                                movingExisting.SettingLevel = newEntity.SettingLevel;
                                movingExisting.Deleted = false;
                                movingExisting.DateDeleted = null;
                                if(await _dbContext.SaveChangesAsync() > 0)
                                {
                                    result.Result = movingExisting;
                                }
                            }
                        }
                    } 
                    else
                    {
                        //If there is no movingExisting => so we can change the value freely
                        currentExisting.Key = newEntity.Key.Trim();
                        currentExisting.Group = newEntity.Group.Trim();
                        currentExisting.Value = newEntity.Value;
                        currentExisting.Description = newEntity.Description;
                        currentExisting.SettingLevel = newEntity.SettingLevel;

                        if (await _dbContext.SaveChangesAsync() > 0)
                        {
                            result.Result = currentExisting;
                        }
                    }
                }
                else
                {
                    result.Message = "Setting does not exist or has been deleted.";
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = "An error occurred while updating the setting.";
            }

            return result;
        }
        public async Task<ReturnResult<bool>> DeleteSetting(string id)
        {
            ReturnResult<bool> result = new ReturnResult<bool>();
            try
            {
                result = await _repository.DeleteByIdAsync(id);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
        public async Task<ReturnResult<int>> DeleteSettings(List<string> ids)
        {
            ReturnResult<int> result = new ReturnResult<int>();
            try
            {
                result = await _repository.DeleteByIdsAsync(ids);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
    }
}
