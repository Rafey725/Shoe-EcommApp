import { supabaseAdmin } from "../supabaseClient"

export const createSignedUrl = async (path) => {
    const { data, error } = await supabaseAdmin.storage
        .from('Images')
        .createSignedUrl(path, 60 * 60)
    if (error) throw error

    return data.signedUrl;
}