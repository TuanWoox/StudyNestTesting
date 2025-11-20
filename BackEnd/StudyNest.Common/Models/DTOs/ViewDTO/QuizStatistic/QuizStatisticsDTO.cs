using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Models.DTOs.EntityDTO.Question;
using System;

namespace StudyNest.Common.Models.DTOs.ViewDTO.QuizStatistic
{
    public class QuizStatisticsDTO
    {
        public string QuizId { get; set; }
        public string QuizTitle { get; set; }
        public QuizAttemptSummaryDTO AttemptSummary { get; set; }
        public QuizScoreStatisticsDTO ScoreStatistics { get; set; }
        public QuizProgressDTO Progress { get; set; }
    }

    public class QuizAttemptSummaryDTO
    {
        public int TotalAttempts { get; set; }
        public DateTime? FirstAttemptDate { get; set; }
        public DateTime? LastAttemptDate { get; set; }
        public List<QuizScore> Scores { get; set; }
        public int TotalRightQuestion { get; set; }
        public int TotalWrongQuestion { get; set; }
        public List<QuestionErrorCount> QuestionErrorCounts { get; set; }
    }

    public class QuizScoreStatisticsDTO
    {
        public double BestScore { get; set; }
        public double WorstScore { get; set; }
        public double AverageScore { get; set; }
        public double LatestScore { get; set; }
        public double MedianScore { get; set; }
    }

    public class QuizProgressDTO
    {
        public bool IsImproving { get; set; }
        public decimal ImprovementRate { get; set; } // % change from first to last
        public decimal ScoreChange { get; set; } // latest - first attempt
        public string TrendDirection { get; set; } // "Improving", "Declining", "Stable"
    }
    public class QuizScore
    {
        public DateTimeOffset? DateCreated;
        public int Score;
    }

    public class QuestionErrorCount
    {
        public QuestionDTO Question;
        public int WrongCounts = 0;
    }
}
