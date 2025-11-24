import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import questionsReducer from "./slices/questionsSlice";
import examsReducer from "./slices/examsSlice";
import dashboardReducer from "./slices/dashboardSlice";
import communityReducer from "./slices/communitySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    exams: examsReducer,
    dashboard: dashboardReducer,
    community: communityReducer,
  },
});
