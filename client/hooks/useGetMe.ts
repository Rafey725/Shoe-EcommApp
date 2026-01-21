import { API_BASE_URL } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import { isTokenExpired } from "./isTokenExpired";
import { useRouter } from "expo-router";

export default function useGetMe() {
    const router = useRouter()
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const token = await SecureStore.getItemAsync('token')
            if (!token) throw new Error('NO_TOKEN')

            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.status === 401) throw new Error('TOKEN_EXPIRED')

            return res.json()
        },
        enabled: true,
        retry: false,
        staleTime: 60_000
    })
}