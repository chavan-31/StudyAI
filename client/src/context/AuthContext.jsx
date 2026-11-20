import { createContext, useContext, useState } from "react";
import {
    loginUser,
    registerUser
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch (error) {
            localStorage.removeItem("user");
            return null;
        }
    });


    // ==========================
    // LOGIN
    // ==========================

    const login = async (userData) => {

        try {

            const data = await loginUser(userData);

            console.log("Login API response:", data);

            if (!data) {
                throw new Error(
                    "No response received from server."
                );
            }

            if (!data.token) {
                throw new Error(
                    data.message ||
                    "Login failed. Token was not received."
                );
            }

            localStorage.setItem(
                "token",
                data.token
            );

            if (data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                setUser(data.user);

            } else {

                localStorage.removeItem("user");
                setUser(null);
            }

            setToken(data.token);

            return data;

        } catch (error) {

            console.error(
                "Auth login error:",
                error
            );

            throw error;
        }
    };


    // ==========================
    // REGISTER
    // ==========================

    const register = async (userData) => {

        try {

            const data =
                await registerUser(userData);

            return data;

        } catch (error) {

            console.error(
                "Auth registration error:",
                error
            );

            throw error;
        }
    };


    // ==========================
    // LOGOUT
    // ==========================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };


    // ==========================
    // PROVIDER
    // ==========================

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


// ==========================
// USE AUTH
// ==========================

export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}