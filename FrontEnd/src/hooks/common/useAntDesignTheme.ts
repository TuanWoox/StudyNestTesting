import { theme } from "antd";

const useAntDesignTheme = () => {
    const { token } = theme.useToken();

    const primaryColor = token.colorPrimary;
    const borderColor = `${primaryColor}E0`; // 88% opacity
    const shadowColor = `${primaryColor}55`; // 33% opacity
    const bgColor = token.colorBgLayout;
    const textColor = token.colorText;

    // Effect / CSS styles for card
    const cardBorderStyle = `2px solid ${borderColor}`;
    const cardShadowStyle = `4px 4px 0px ${shadowColor}`;
    const cardHoverShadowStyle = `6px 6px 0px ${shadowColor}`;
    const cardHoverTransform = "translate(-2px, -2px)";
    const cardDefaultTransform = "translate(0, 0)";

    return {
        token,
        primaryColor,
        borderColor,
        shadowColor,
        bgColor,
        textColor,
        cardBorderStyle,
        cardShadowStyle,
        cardHoverShadowStyle,
        cardHoverTransform,
        cardDefaultTransform,
    };

}

export default useAntDesignTheme;