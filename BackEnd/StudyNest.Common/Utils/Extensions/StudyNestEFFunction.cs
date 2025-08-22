using Microsoft.EntityFrameworkCore;
using StudyNest.Common.Utils.Enums;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace StudyNest.Common.Utils.Extensions
{
    public static class StudyNestEFFunction
    {
        [DbFunction("jsonb_extract_path", IsBuiltIn = true, IsNullable = true)]
        public static string JsonExtract(this string json, string path)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        [DbFunction("jsonb_extract_path_text", IsBuiltIn = true, IsNullable = true)]
        public static string JsonExtractToString(string expression, string path)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        // jsonb_extract_path_text already returns unquoted string
        [DbFunction("jsonb_extract_path_text", IsBuiltIn = true, IsNullable = true)]
        public static string Unquote(string expression)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        [DbFunction("CAST", IsBuiltIn = true, IsNullable = true)]
        public static int UnquoteToNumber(string expression)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        [DbFunction("CAST", IsBuiltIn = true, IsNullable = true)]
        public static bool UnquoteToBool(string expression)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        [DbFunction("regexp_replace", IsBuiltIn = true, IsNullable = true)]
        public static string RegexReplace(this string input, string pattern, string replace)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        [DbFunction("lower", IsBuiltIn = true, IsNullable = true)]
        public static string ToLower(this string input)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        [DbFunction("extract", IsBuiltIn = true, IsNullable = true)]
        public static double UnixTimeStamp(string timestamp)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        [DbFunction("jsonb_contains", IsBuiltIn = true, IsNullable = true)]
        public static bool JsonContains(this string json, string candidate, string path)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        public static double ToDouble(string expression)
        {
            return Convert.ToDouble(expression);
        }

        public static DateTime ToDateTime(string dateTime)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        [DbFunction("extract", IsBuiltIn = true, IsNullable = true)]
        public static long ConvertDateTimeToMilisecond(DateTimeOffset expression)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        [DbFunction("make_interval", IsBuiltIn = true, IsNullable = true)]
        public static DateTimeOffset DateAdd(DateTimeOffset? date, long millisecond)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }

        public static MethodCallExpression ExtractAndConvertUnixTimeStamp(Expression parameter, string json, string propertyName)
        {
            try
            {
                var jsonExtractCall = ExtractAndUnquote(parameter, json, propertyName);
                var timeStamp = typeof(StudyNestEFFunction).GetMethod("UnixTimeStamp");
                return Expression.Call(timeStamp, jsonExtractCall);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                return null;
            }
        }

        public static MethodCallExpression ExtractAndConvertDateTime(Expression parameter, string json, string propertyName)
        {
            try
            {
                var jsonExtractCall = ExtractAndUnquote(parameter, json, propertyName);
                var toDateTime = typeof(StudyNestEFFunction).GetMethod("ToDateTime");
                return Expression.Call(toDateTime, jsonExtractCall);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                return null;
            }
        }

        public static MethodCallExpression ExtractAndConvertToDouble(Expression parameter, string json, string propertyName)
        {
            try
            {
                var jsonExtractMethod = typeof(StudyNestEFFunction).GetMethod("JsonExtract");
                var jsonExtractCall = Expression.Call(jsonExtractMethod, Expression.Property(parameter, json), Expression.Constant(propertyName));
                var convert = typeof(Convert).GetMethod("ToDouble", new[] { typeof(object) });
                var extract = Expression.Convert(jsonExtractCall, typeof(object));
                return Expression.Call(convert, extract);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                return null;
            }
        }

        public static MethodCallExpression ExtractAndUnquote(Expression parameter, string json, string propertyName)
        {
            try
            {
                var jsonExtractMethod = typeof(StudyNestEFFunction).GetMethod("JsonExtract");
                var jsonExtractCall = Expression.Call(jsonExtractMethod, Expression.Property(parameter, json), Expression.Constant(propertyName));
                var jsonUnquote = typeof(StudyNestEFFunction).GetMethod("Unquote");
                return Expression.Call(jsonUnquote, jsonExtractCall);
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                return null;
            }
        }

        public static MethodCallExpression ExtractAndConvertToString(Expression parameter, string json, string propertyName)
        {
            try
            {
                var jsonExtractMethod = typeof(StudyNestEFFunction).GetMethod("JsonExtract");
                return Expression.Call(jsonExtractMethod, Expression.Property(parameter, json), Expression.Constant(propertyName));
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                return null;
            }
        }

        public static MethodCallExpression ExtractAndContains(Expression parameter, string json, string propertyName, string value)
        {
            try
            {
                var jsonExtractMethod = typeof(StudyNestEFFunction).GetMethod("JsonExtract");
                var jsonExtractCall = Expression.Call(jsonExtractMethod, Expression.Property(parameter, json), Expression.Constant(propertyName));
                var jsonUnquote = typeof(StudyNestEFFunction).GetMethod("Unquote");
                jsonExtractCall = Expression.Call(jsonUnquote, jsonExtractCall);
                var toLower = typeof(StudyNestEFFunction).GetMethod("ToLower");
                jsonExtractCall = Expression.Call(toLower, jsonExtractCall);
                var method = typeof(DbFunctionsExtensions).GetMethod("Like", new[] { typeof(DbFunctions), typeof(string), typeof(string) });
                var dbFunctions = typeof(EF).GetProperty("Functions").GetValue(null);
                var extract = Expression.Convert(jsonExtractCall, typeof(string));
                return Expression.Call(method, Expression.Constant(dbFunctions), extract, Expression.Constant(value));
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                return null;
            }
        }

        public static IQueryable<T> OrderByPropertyOrField<T>(ref IQueryable<T> queryable, ParameterExpression parameter, string json, string propertyName, string dataType, SortOrderType sortType)
        {
            try
            {
                if (dataType != "Number")
                {
                    var jsonExtract = ExtractAndConvertToString(parameter, json, propertyName);
                    var selector = Expression.Lambda<Func<T, string>>(jsonExtract, parameter);
                    queryable = sortType == SortOrderType.ASC ? queryable.OrderBy(selector) : queryable.OrderByDescending(selector);
                }
                else
                {
                    var jsonExtract = ExtractAndConvertToDouble(parameter, json, propertyName);
                    var selector = Expression.Lambda<Func<T, double>>(jsonExtract, parameter);
                    queryable = sortType == SortOrderType.ASC ? queryable.OrderBy(selector) : queryable.OrderByDescending(selector);
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return queryable;
        }

        [DbFunction("date", IsBuiltIn = true, IsNullable = true)]
        public static DateTime ToDate(this DateTimeOffset? expression)
        {
            throw new InvalidOperationException("This method is for use in EF queries only");
        }
    }
}
