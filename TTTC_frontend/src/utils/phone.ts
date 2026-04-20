export function formatPhoneForTel(phone?: string | null){
    const digits = (phone ?? "").replace(/\D/g, "");
    if (!digits) return null;
    return `tel: +91${digits}`
}

export function formatPhoneForDisplay (phone?: string | null){
    const digits = (phone ?? "").replace(/\D/g,"")
    if (!digits) return null;
    return `+91 ${digits}`;
}