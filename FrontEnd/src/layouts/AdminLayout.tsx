import useLayoutValidateToken from "@/hooks/authHook/useLayoutValidateToken";
import { ERole } from "@/utils/enums/ERole";
import InnerLayout from "./InnerLayout";

const AdminLayout = () => {
    const { isLoading } = useLayoutValidateToken(ERole.Admin);

    return <InnerLayout
        role={ERole.Admin}
        isValidatingToken={isLoading}
    />
};

export default AdminLayout;
