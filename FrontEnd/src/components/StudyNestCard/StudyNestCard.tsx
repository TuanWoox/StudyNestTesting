import { useAntDesignTheme } from "@/hooks/common";
import { Card } from "antd";
import React from "react";

interface StudyNestCardProps {
    children: React.ReactNode;
}

const StudyNestCard: React.FC<StudyNestCardProps> = ({ children }) => {
    const {
        cardBorderStyle,
        cardShadowStyle,
        cardHoverShadowStyle,
        cardHoverTransform,
        cardDefaultTransform,
    } = useAntDesignTheme();

    return (
        <Card
            hoverable
            style={{
                border: cardBorderStyle,
                borderRadius: 0,
                boxShadow: cardShadowStyle,
                transition: "all 0.3s ease",
            }}
            bodyStyle={{
                padding: "16px", // replace with responsive logic if needed
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = cardHoverShadowStyle;
                e.currentTarget.style.transform = cardHoverTransform;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = cardShadowStyle;
                e.currentTarget.style.transform = cardDefaultTransform;
            }}
        >
            {children}
        </Card>
    );
};

export default StudyNestCard;
