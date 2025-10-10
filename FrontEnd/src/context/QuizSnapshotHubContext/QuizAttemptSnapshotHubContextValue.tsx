import { createContext, useContext } from "react";
import * as signalR from "@microsoft/signalr";

export interface QuizAttemptSnapshotHubContextValue {
    notificationConnection: signalR.HubConnection | null;
    onSetAccessToken: () => void;
}

export const QuizAttemptSnapshotHubContext = createContext<QuizAttemptSnapshotHubContextValue>({
    notificationConnection: null,
    onSetAccessToken: () => { },
});

export const useQuizAttemptSnapshotHub = () => useContext(QuizAttemptSnapshotHubContext);