import { useMutation } from "@tanstack/react-query"
import { API_BASE_URL } from '@/config/api';

export default function useVerifyOTP() {
    return useMutation({
        mutationFn: async ({ email, otp }: { email: string, otp: string }) => {
            const res = await fetch(`${API_BASE_URL}/auth/verifyOTP`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, otp: otp })
            })
            return res
        },
        retry: false
    })
}