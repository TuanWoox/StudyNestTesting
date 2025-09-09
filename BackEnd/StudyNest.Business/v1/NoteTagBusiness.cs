using Microsoft.EntityFrameworkCore;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
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
    public class NoteTagBusiness: INoteTagBusiness
    {
        public ApplicationDbContext _dbcontext;
        public ITagBusiness _tagBusiness { get; set; }
        public NoteTagBusiness(ApplicationDbContext dbContext, ITagBusiness tagBusiness)
        { 
            this._dbcontext = dbContext;
            this._tagBusiness = tagBusiness;
        }
        public async Task<ReturnResult<bool>> SaveTagsToNote(string noteId, List<string> tagNames)
        {
            var result = new ReturnResult<bool>();
            try
            {
                // Validate note exists
                var tagIds =(await _tagBusiness.GetTagIdsByListOfName(tagNames)).Result;
                if(tagIds.Any())
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
                    // Get the TagIds from tagsToRestore
                    var restoredTagIds = tagsToRestore.Select(x => x.TagId).ToHashSet();
                    // Remove restored tags from newTagIds
                    var newTagIds = tagIds
                        .Except(existingTagIds)
                        .Where(id => !restoredTagIds.Contains(id))
                        .ToList();
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
                } else await DeleteTagsByNoteId(noteId);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = "An unexpected error occurred while saving tags.";
            }

            return result;
        }
        public async Task<ReturnResult<int>> DeleteTagsByNoteId(string noteId)
        {
            var result = new ReturnResult<int>();
            try
            {
                var existingTags = await _dbcontext.NoteTags
                    .Where(nt => nt.NoteId == noteId)
                    .ToListAsync();
                if (existingTags.Any())
                {
                    _dbcontext.NoteTags.RemoveRange(existingTags);
                    var deletedCount = await _dbcontext.SaveChangesAsync();
                    result.Result = deletedCount;
                }
                else
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "note tags", noteId);
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = "An unexpected error occurred while deleting tags.";
            }
            return result;
        }
        public async Task<ReturnResult<List<NoteTag>>> GetNoteTagsByIdAndListOfTagNames(string id, List<string> tagsName)
        {
            ReturnResult<List<NoteTag>> result = new ReturnResult<List<NoteTag>>();
            try
            {
                tagsName = tagsName.Select(name => name.ToKebabCase()).ToList();
                var existingNoteTags = await _dbcontext.NoteTags
                                        .Include(nt => nt.Tag)
                                        .Where(nt => nt.NoteId == id && tagsName.Contains(nt.Tag.Name))
                                        .AsNoTracking()
                                        .ToListAsync();
                if (existingNoteTags.Any())
                {
                    result.Result = existingNoteTags;
                }
                else
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "note tags", id);
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
    }
}
