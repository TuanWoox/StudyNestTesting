import { useEffect, useState, ReactNode } from "react";
import * as signalR from "@microsoft/signalr";

import { QuizAttemptSnapshotHubContext } from "./QuizAttemptSnapshotHubContextValue"
import { toast } from "sonner";

interface ProviderProps {
    children: ReactNode;
}

const baseURL = import.meta.env.VITE_API_URL_BASIC;

export const QuizAttemptSnapshotHubProvider = ({ children }: ProviderProps) => {
    const [accessToken, setAccessToken] = useState<string | null>(() =>
        localStorage.getItem("accessToken")
    );


    const [notificationConnection, setNotificationConnection] =
        useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        if (!accessToken) return;

        let connection: signalR.HubConnection | null = null;

        const connectSignalR = async () => {
            try {
                connection = new signalR.HubConnectionBuilder()
                    .withUrl(`${baseURL}/hub/quiz-attempt-snapshot`, {
                        accessTokenFactory: () => accessToken || "",
                    })
                    .withAutomaticReconnect()
                    .build();

                await connection.start();

                connection.on(
                    'CompleteCreateQuizAttemptSnapshot', ({ quizId, quiztitle }) => {
                        toast.success(
                            `Snapshot for quiz "${quiztitle}" (ID: ${quizId}) created successfully! You can now start your test.`
                        );
                    }
                );

                setNotificationConnection(connection);
            } catch (err) {
                console.error("❌ Error while starting connection:", err);
            }
        };

        connectSignalR();



        return () => {
            if (connection) {
                connection
                    .stop()
                    .then(() => console.log("🛑 SignalR connection stopped"))
                    .catch((err) => console.error("❌ Error stopping connection:", err));
            }
        };
    }, [accessToken]);

    const onSetAccessToken = () => {
        setAccessToken(localStorage.getItem("accessToken"));
    };

    return (
        <QuizAttemptSnapshotHubContext.Provider value={{ notificationConnection, onSetAccessToken }}>
            {children}
        </QuizAttemptSnapshotHubContext.Provider>
    );
};

