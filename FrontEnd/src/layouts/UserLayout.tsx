import useLayoutValidateToken from "@/hooks/authHook/useLayoutValidateToken";
import { ERole } from "@/utils/enums/ERole";
import InnerLayout from "./InnerLayout";

const UserLayout = () => {
    const { isLoading } = useLayoutValidateToken(ERole.User);

    return <InnerLayout
        role={ERole.User}
        isValidatingToken={isLoading}
    />
};

export default UserLayout;
