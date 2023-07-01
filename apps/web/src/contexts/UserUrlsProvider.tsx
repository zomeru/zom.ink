import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";
import { type inferRouterOutputs } from "@trpc/server";
import { useSession } from "next-auth/react";

import { type AppRouter } from "@zomink/api";
import { slugGenerator } from "@zomink/utilities";

import { LOCAL_USER_ID_KEY } from "~/constants";
import { api } from "~/utils";

type UrlQuery = UseTRPCQueryResult<
  inferRouterOutputs<AppRouter>["url"]["all"],
  TRPCClientErrorLike<AppRouter>
>;

interface UserUrlsContextType {
  urls: UrlQuery;
  localUserId: string;
}

export const UserUrlsContext = createContext<UserUrlsContextType>(
  null as unknown as UserUrlsContextType,
);

export const useUserUrls = () => useContext(UserUrlsContext);

interface UserUrlsProviderProps {
  children: React.ReactNode;
}

export const UserUrlsProvider = ({ children }: UserUrlsProviderProps) => {
  const { data: session } = useSession();

  const [localUserId, setLocalUserId] = useState("default");

  useEffect(() => {
    const local = localStorage.getItem(LOCAL_USER_ID_KEY) ?? slugGenerator(10);

    localStorage.setItem(LOCAL_USER_ID_KEY, local);
    setLocalUserId(local);
  }, []);

  const urls = api.url.all.useQuery(session?.user?.id ?? localUserId);

  const value = useMemo(() => ({ urls, localUserId }), [urls, localUserId]);

  return (
    <UserUrlsContext.Provider value={value}>
      {children}
    </UserUrlsContext.Provider>
  );
};
