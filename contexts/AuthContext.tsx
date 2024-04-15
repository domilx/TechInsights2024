import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import AuthService from "../services/AuthService";

export enum Role {
  UNVALIDATED = "UNVALIDATED",
  VIEW = "VIEW",
  EDIT = "EDIT",
  DEV = "DEV",
}

export interface UserType {
  name: string;
  setName: (name: string) => void;
  insightsRole: Role;
  setInsightsRole: (role: Role) => void;
  email: string;
  setEmail: (email: string) => void;
  isLoggedIn: boolean;
  team: string;
  setTeam: (team: string) => void;
  id: string;
}

export const AuthContext = createContext<UserType>({
  name: "",
  setName: () => {},
  insightsRole: Role.VIEW,
  setInsightsRole: () => {},
  email: "",
  setEmail: () => {},
  isLoggedIn: false,
  team: "",
  setTeam: () => {},
  id: "",
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [name, setName] = useState<string>("");
  const [insightsRole, setInsightsRole] = useState<Role>(Role.VIEW);
  const [email, setEmail] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [team, setTeam] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const unsubscribe = AuthService.getInstance().listenToAuthStateChanges(
      (user: User | null) => {
        if (user) {
          setIsLoggedIn(true);
          setUserId(user.uid);
          AuthService.getInstance()
            .getUserName()
            .then((userName: string | null) => {
              if (userName) setName(userName);
            });
          AuthService.getInstance()
            .getUserRole()
            .then((userRole: string | null) => {
              if (userRole && Object.values(Role).includes(userRole as Role)) {
                setInsightsRole(userRole as Role);
              }
            });
          AuthService.getInstance()
            .getTeam()
            .then((team: string | null) => {
              if (team) setTeam(team);
            });
          setEmail(AuthService.getInstance().getEmail() || "");
        } else {
          setIsLoggedIn(false);
          setName("");
          setInsightsRole(Role.UNVALIDATED);
          setEmail("");
          setTeam("");
          setUserId("");
        }
      }
    );

    const authChecker = async () => {
      const hasAccess =
        (await AuthService.getInstance().getUserRole()) != "UNVALIDATED";

      if (!hasAccess) {
        setIsLoggedIn(false);
      }
    };

    authChecker();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        name,
        setName,
        email,
        setEmail,
        isLoggedIn,
        id: userId,
        insightsRole,
        setInsightsRole,
        team,
        setTeam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
