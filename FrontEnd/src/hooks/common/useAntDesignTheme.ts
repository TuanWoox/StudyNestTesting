import { theme } from "antd";

const useAntDesignTheme = () => {
    const { token } = theme.useToken();
    const primaryColor = token.colorPrimary;
    const borderColor = `${primaryColor}E0`; // 88% opacity
    const shadowColor = `${primaryColor}55`; // 33% opacity
    const bgColor = `${token.colorBgLayout}`;
    const textColor = `${token.colorText}`;
    return {
        token,
        primaryColor,
        borderColor,
        shadowColor,
        bgColor,
        textColor,
    }
}

export default useAntDesignTheme;