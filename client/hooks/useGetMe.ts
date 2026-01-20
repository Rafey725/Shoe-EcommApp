import { API_BASE_URL } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';

export default function useGetMe() {
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const token = await SecureStore.getItemAsync('token')
            if (!token) throw new Error('No token found')

            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await res.json()
        },
        enabled: true
    })
}