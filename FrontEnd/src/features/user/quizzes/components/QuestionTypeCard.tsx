import { Badge, Card, InputNumber, Typography } from "antd";
const { Text } = Typography;

const QuestionTypeCard = ({ config, count, percentage, max, onChange }) => (
  <Card
    hoverable
    style={{
      textAlign: "center",
      borderRadius: 12,
      border: `2px solid ${config.border}`,
      background: count > 0 ? config.bg : "white",
    }}
  >
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 40,
          fontWeight: "bold",
          color: config.color,
          marginBottom: 4,
        }}
      >
        {count}
      </div>
      <Text strong style={{ fontSize: 16 }}>
        {config.title}
      </Text>
      <div style={{ marginTop: 4 }}>
        <Badge
          count={`${Math.round(percentage)}%`}
          style={{ backgroundColor: config.color }}
        />
      </div>
    </div>
    <InputNumber
      min={0}
      max={max}
      value={count}
      onChange={onChange}
      style={{ width: "100%" }}
      size="large"
    />
  </Card>
);

export default QuestionTypeCard;
