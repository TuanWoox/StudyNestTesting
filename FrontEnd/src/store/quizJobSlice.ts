import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuizJob {
  jobId: string;
  noteTitle: string;
  timestamp: string;
  status: "queued" | "processing" | "success" | "failed";
  quizId?: string;
  errorMessage?: string;
  isViewed: boolean;
  createdAt: number;
}

const initialState: QuizJob[] = [];

const quizJobSlice = createSlice({
  name: "quizJob",
  initialState,
  reducers: {
    addJob: (state, action: PayloadAction<QuizJob>) => {
      const existingIndex = state.findIndex((j) => j.jobId === action.payload.jobId);
      if (existingIndex >= 0) {
        state[existingIndex].status = action.payload.status;
        state[existingIndex].timestamp = action.payload.timestamp;
      } else {
        state.push(action.payload);
      }
      state.sort((a, b) => b.createdAt - a.createdAt);
    },
    updateJob: (
      state,
      action: PayloadAction<{ jobId: string; updates: Partial<QuizJob> }>
    ) => {
      const job = state.find((j) => j.jobId === action.payload.jobId);
      if (job) {
        Object.assign(job, action.payload.updates);
        if (action.payload.updates.status && !action.payload.updates.timestamp) {
          job.timestamp = new Date().toISOString();
        }
      }
      state.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeB - timeA;
      });
    },
    markViewed: (state, action: PayloadAction<string>) => {
      const job = state.find((j) => j.jobId === action.payload);
      if (job) job.isViewed = true;
    },
    cleanupOldJobs: (state) => {
      const now = Date.now();
      const TEN_MINUTES = 10 * 60 * 1000;
      const THIRTY_MINUTES = 30 * 60 * 1000;
      const ONE_HOUR = 60 * 60 * 1000;
      const MAX_JOBS = 10;

      let filtered = state.filter((job) => {
        const age = now - job.createdAt;
        if (age > ONE_HOUR) return false;

        if (job.status === "queued" || job.status === "processing") return true;

        if (job.status === "failed") return age < THIRTY_MINUTES;

        return !job.isViewed || age < TEN_MINUTES;
      });

      if (filtered.length > MAX_JOBS) {
        filtered = filtered
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, MAX_JOBS);
      }

      return filtered;
    },
  },
});

export const { addJob, updateJob, markViewed, cleanupOldJobs } =
  quizJobSlice.actions;
export default quizJobSlice.reducer;
