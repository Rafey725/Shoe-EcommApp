import { API_BASE_URL } from "@/config/api";
import { useMutation } from "@tanstack/react-query";

export default function useAuthPost() {
    return useMutation({
        mutationFn: async ({ endpoint, data }: { endpoint: string, data: any }) => {
            const res = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            return res
        }
    })
}