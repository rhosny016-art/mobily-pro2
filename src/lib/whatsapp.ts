// WhatsApp helper - number: 01554671424 (Egypt)
export const WHATSAPP_NUMBER = "201554671424";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappServiceLink(serviceTitle?: string): string {
  const message = serviceTitle
    ? `مرحباً، أريد الاستفسار عن خدمة: ${serviceTitle} 🙏`
    : "مرحباً، أريد الاستفسار عن خدماتكم 🙏";
  return buildWhatsAppLink(message);
}
