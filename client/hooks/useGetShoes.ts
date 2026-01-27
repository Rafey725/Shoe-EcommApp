import { API_BASE_URL } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';

export default function useGetShoes() {
    return useQuery({
        queryKey: ['shoes'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/shoes/popular_shoes`)
            return res.json()
        },
        enabled: true,
        retry: false,
        staleTime: 60_000
    })
}