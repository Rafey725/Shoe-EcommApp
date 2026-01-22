import { useMutation } from "@tanstack/react-query"
import { API_BASE_URL } from '@/config/api';

export default function useRequestOTP() {
    return useMutation({
        mutationFn: async (email: string) => {
            const res = await fetch(`${API_BASE_URL}/auth/requestOTP`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email })
            })
            return res.json()
        },
        retry: false
    })
}