using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Utils.Extensions;

namespace StudyNest.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class ImageController : ControllerBase
    {
        public IImageService _imageService;
        public ImageController(IImageService imageService)
        {
            this._imageService = imageService;
        }
        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            ReturnResult<object> result = new ReturnResult<object>();
            try
            {
                result = await _imageService.UploadImage(file);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return Ok(result);
        }
    }
}
