using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Image;
using StudyNest.Common.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Business.v1
{
    public class ImageService: IImageService
    {
        private readonly Cloudinary _cloudinary;
        private readonly IConfiguration _configuration;
        private readonly ISettingBusiness _settingBusiness;
        public ImageService(Cloudinary cloudinary, IConfiguration configuration, ISettingBusiness settingBusiness)
        {
           this._cloudinary = cloudinary;
           this._configuration = configuration;
           this._settingBusiness = settingBusiness;
        }
        public async Task<ReturnResult<object>> UploadImage(IFormFile file)
        {
            ReturnResult<object> result = new ReturnResult<object>();
            try
            {
                if (!file.HasValidImageExtension())
                {
                    result.Message = "File is invalid";
                } 
                else
                {
                    await using var stream = file.OpenReadStream();
                    var folder = (await _settingBusiness.GetOneByKeyAndGroup("Folder", "CloudinarySettings", true)).Result?.Value;
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Folder = !string.IsNullOrEmpty(folder) ? folder : "StudyNest/Notes"
                    };
                    ImageUploadResult uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    if (uploadResult.Error != null)
                    {
                        result.Result = new
                        {
                            Success = 0,
                        };
                        result.Message = uploadResult.Error.Message;
                    }
                    else
                    {
                        result.Result = new
                        {
                            Success = 1,
                            File = new EditorJsImageResultDTO
                            {
                                Url = uploadResult.SecureUrl.ToString(),
                            }
                        };
                    }

                }
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
        public async Task<ReturnResult<object>> UploadQuestionImage(IFormFile file)
        {
            ReturnResult<object> result = new ReturnResult<object>();
            try
            {
                if (!file.HasValidImageExtension())
                {
                    result.Message = "File is invalid";
                }
                else
                {
                    await using var stream = file.OpenReadStream();
                    var folder = (await _settingBusiness.GetOneByKeyAndGroup("Question_Folder", "CloudinarySettings", true)).Result?.Value;
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Folder = !string.IsNullOrEmpty(folder) ? folder : "StudyNest/Question"
                    };
                    ImageUploadResult uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    if (uploadResult.Error != null)
                    {
                        result.Result = new
                        {
                            Success = 0,
                        };
                        result.Message = uploadResult.Error.Message;
                    }
                    else
                    {
                        result.Result = new
                        {
                            Success = 1,
                            File = new EditorJsImageResultDTO
                            {
                                Url = uploadResult.SecureUrl.ToString(),
                            }
                        };
                    }

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
