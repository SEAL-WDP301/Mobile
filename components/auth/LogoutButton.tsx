import { router } from "expo-router";

import Button from "@/components/ui/Button";

import { useAuth } from "@/contexts/AuthContext";

export default function LogoutButton() {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();

        router.replace(
            "/auth/login"
        );
    };

    return (
        <Button
            title="Logout"
            onPress={handleLogout}
        />
    );
}