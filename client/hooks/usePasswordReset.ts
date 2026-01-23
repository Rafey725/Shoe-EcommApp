import { useMutation } from "@tanstack/react-query"
import { API_BASE_URL } from '@/config/api';

export default function usePasswordReset() {
    return useMutation({
        mutationFn: async ({ resetToken, newPass }: { resetToken: string | null, newPass: string }) => {
            const res = await fetch(`${API_BASE_URL}/auth/newPassword`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resetToken: resetToken, pass: newPass })
            })
            return res
        },
        retry: false
    })
}