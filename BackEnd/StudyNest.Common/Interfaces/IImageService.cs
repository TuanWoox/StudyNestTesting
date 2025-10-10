using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using StudyNest.Common.Models.DTOs.CoreDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface IImageService
    {
        public Task<ReturnResult<object>> UploadImage(IFormFile file);
    }
}
