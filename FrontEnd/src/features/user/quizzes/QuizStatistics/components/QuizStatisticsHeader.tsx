import { useAntDesignTheme } from "@/hooks/common";
import { DatePicker, Divider, Typography, Button, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface QuizStatisticsHeaderProps {
    dateFilter: [Dayjs | null, Dayjs | null];
    setDateFilter: (dates: [Dayjs | null, Dayjs | null]) => void;
}

const QuizStatisticsHeader: React.FC<QuizStatisticsHeaderProps> = ({ dateFilter, setDateFilter }) => {
    const getDefaultRange = (): [Dayjs, Dayjs] => {
        const today = dayjs();
        const oneMonthAgo = today.subtract(1, "month");
        return [oneMonthAgo, today];
    };

    const defaultRange = getDefaultRange();
    const { shadowColor } = useAntDesignTheme();

    const handleReset = () => {
        setDateFilter(getDefaultRange());
    };

    return (
        <div className="mb-6">
            <div className="flex flex-row justify-between items-center">
                <div>
                    <Title level={3}>Quiz Statistics</Title>
                    <Title level={5} type="secondary" style={{ marginTop: 0 }}>
                        Detailed analytics for this quiz attempt performance.
                    </Title>
                </div>
                <Space>
                    <RangePicker
                        value={dateFilter || defaultRange}
                        onChange={(dates) => {
                            if (dates?.[0] && dates?.[1]) {
                                const startDate = dates[0];
                                const endDate = dates[1];

                                // Match C# validation: DateTo > DateFrom.AddMonths(1)
                                const oneMonthFromStart = startDate.add(1, "month");

                                // Enforce maximum 1 month range
                                if (endDate.isAfter(oneMonthFromStart)) {
                                    // Adjust end date to be 1 month from start
                                    setDateFilter([startDate, oneMonthFromStart]);
                                } else {
                                    setDateFilter(dates as [Dayjs | null, Dayjs | null]);
                                }
                            }
                        }}
                        disabledDate={(currentDate) => {
                            if (!currentDate) return false;
                            const today = dayjs();
                            const oneMonthAgo = today.subtract(1, "month");

                            // Disable future dates
                            if (currentDate.isAfter(today, "day")) return true;

                            // Disable dates before 1 month ago from today
                            if (currentDate.isBefore(oneMonthAgo, "day")) return true;

                            return false;
                        }}
                        style={{ boxShadow: `2px 2px 0 ${shadowColor}`, borderRadius: 0 }}
                    />
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleReset}
                        style={{
                            borderRadius: 0,
                            fontFamily: "monospace",
                            fontWeight: 600,
                            boxShadow: `2px 2px 0 ${shadowColor}`,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
            <Divider />
        </div>
    );
};

export default QuizStatisticsHeader;
