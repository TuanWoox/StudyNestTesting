using StudyNest.Common.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Attributes
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class KebabCaseAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null)
                return ValidationResult.Success;

            var property = validationContext.ObjectType.GetProperty(validationContext.MemberName);
            if (property == null)
                return ValidationResult.Success;

            // Single string
            if (value is string str)
            {
                property.SetValue(validationContext.ObjectInstance, str.ToKebabCase());
                return ValidationResult.Success;
            }

            // IEnumerable<string>
            if (value is IEnumerable<string> list)
            {
                var convertedList = list.Select(x => x.ToKebabCase()).ToList();
                property.SetValue(validationContext.ObjectInstance, convertedList);
                return ValidationResult.Success;
            }

            return new ValidationResult($"{validationContext.DisplayName} must be a string or a list of strings.");
        }
    }
}
