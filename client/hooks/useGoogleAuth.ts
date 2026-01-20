import { API_BASE_URL } from "@/config/api";
import { useMutation } from "@tanstack/react-query";

export default function useGoogleAuth() {
    return useMutation({
        mutationFn: async ({ endpoint, idToken }: { endpoint: string, idToken: string | null }) => {
            const res = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: idToken })
            })
            return res
        }
    })
}