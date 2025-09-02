using Microsoft.EntityFrameworkCore;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
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
    public class NoteTagBusiness: INoteTagBusiness
    {
        public ApplicationDbContext _dbcontext;
        public NoteTagBusiness(ApplicationDbContext dbContext)
        { 
            this._dbcontext = dbContext;
        }
        public async Task<ReturnResult<bool>> SaveTagsToNote(string noteId, List<string> tagIds)
        {
            var result = new ReturnResult<bool>();
            try
            {
                // Get current active tags
                var existingTags = await _dbcontext.NoteTags
                    .Where(nt => nt.NoteId == noteId)
                    .ToListAsync();
                var existingTagIds = existingTags.Select(nt => nt.TagId).ToList();
                // --- 1. Remove tags that are not in new list (will be soft deleted automatically) ---
                var tagsToRemove = existingTags
                    .Where(nt => !tagIds.Contains(nt.TagId))
                    .ToList();
                if (tagsToRemove.Any())
                {
                    _dbcontext.NoteTags.RemoveRange(tagsToRemove);
                }
                // --- 2. Restore soft-deleted tags that are now in the new list ---
                var tagsToRestore = await _dbcontext.NoteTags
                    .IgnoreQueryFilters()
                    .Where(nt => nt.NoteId == noteId && tagIds.Contains(nt.TagId) && nt.Deleted)
                    .ToListAsync();
                foreach (var tag in tagsToRestore)
                {
                    tag.Deleted = false;
                    tag.DateDeleted = null;
                }
                // --- 3. Add new tags that don’t exist at all ---
                var newTagIds = tagIds.Except(existingTagIds).ToList();
                if (newTagIds.Any())
                {
                    var tagsToAdd = newTagIds.Select(tagId => new NoteTag
                    {
                        NoteId = noteId,
                        TagId = tagId
                    }).ToList();
                    _dbcontext.NoteTags.AddRange(tagsToAdd);
                }
                if (await _dbcontext.SaveChangesAsync() > 0)
                {
                    result.Result = true;
                }
                else
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_SAVE_ERROR, "Note tag");
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = "An unexpected error occurred while saving tags.";
            }

            return result;
        }
    }
}
