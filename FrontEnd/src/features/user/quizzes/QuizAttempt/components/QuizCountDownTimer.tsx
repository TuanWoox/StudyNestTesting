import { Card, Typography, theme } from "antd";
import { ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { triggerSubmit } from "@/store/quizAttemptSlice";

const { Text } = Typography;

const QuizTimerCount = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const { token } = theme.useToken();

    const [timeLeft, setTimeLeft] = useState(() => {
        if (!id) return -1;
        const saved = window.localStorage.getItem(id);
        return saved ? Number(saved) : -1;
    });

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    dispatch(triggerSubmit());
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, dispatch]);

    const formatTime = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60)
            .toString()
            .padStart(2, "0")}`;

    const getColor = () => {
        if (timeLeft <= 0) return token.colorError;
        if (timeLeft <= 60) return token.colorWarning;
        return token.colorTextSecondary;
    };

    const color = getColor();
    const isWarning = timeLeft <= 60 && timeLeft > 0;

    if (timeLeft === -1) return;

    return (
        <Card
            size="small"
            style={{
                border: `1.5px dashed ${color}`,
                backgroundColor: "#fffef9",
                fontFamily: '"Courier New", "IBM Plex Mono", monospace',
                boxShadow: `3px 3px 0 ${color}55`,
                transition: "all 0.4s ease",
                margin: "12px auto 0 auto",
            }}
            className={isWarning ? "animate-pulse" : ""}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ClockCircleOutlined
                        style={{
                            color,
                            fontSize: 20,
                            transition: "color 0.3s ease",
                        }}
                    />
                    <div>
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 12,
                                letterSpacing: 0.5,
                            }}
                        >
                            {timeLeft <= 0 ? "Time's Up" : "Time Left"}
                        </Text>
                        <div>
                            <Text
                                strong
                                style={{
                                    color,
                                    fontSize: 18,
                                    letterSpacing: "1px",
                                }}
                            >
                                {formatTime(timeLeft)}
                            </Text>
                        </div>
                    </div>
                </div>

                {isWarning && (
                    <ExclamationCircleOutlined
                        style={{
                            color: token.colorWarning,
                            fontSize: 18,
                            transition: "transform 0.3s ease",
                        }}
                        className="animate-bounce"
                    />
                )}
            </div>
        </Card>
    );
};

export default QuizTimerCount;
