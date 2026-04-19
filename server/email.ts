import { ENV } from "./_core/env";

/**
 * E-posta gönderimi için yardımcı fonksiyonlar
 * Manus built-in notification API'sini kullanır
 */

export async function sendApplicationStatusEmail(
  applicantEmail: string,
  applicantName: string,
  status: "pending" | "reviewed" | "accepted" | "rejected",
  notes?: string
): Promise<boolean> {
  try {
    const statusMessages = {
      pending: "Başvurunuz alındı ve inceleme için sıraya alındı.",
      reviewed: "Başvurunuz incelendi.",
      accepted: "Tebrikler! Başvurunuz kabul edildi. Yakında sizinle iletişime geçeceğiz.",
      rejected: "Başvurunuz değerlendirildi ancak bu sefer seçilmedi. Başka fırsatlarda başvurabilirsiniz.",
    };

    const subject = `Müzik Grubu - Başvuru Durumu Güncellemesi`;
    const message = `
Merhaba ${applicantName},

${statusMessages[status]}

${notes ? `\nYönetici Notu: ${notes}` : ""}

Sorularınız için bizimle iletişime geçebilirsiniz.

Saygılarımla,
Müzik Grubu Yönetimi
    `.trim();

    // Manus built-in notification API'sini kullan
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      console.warn("[Email] Notification API not configured");
      return false;
    }

    const response = await fetch(`${ENV.forgeApiUrl}/notification/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: applicantEmail,
        subject,
        body: message,
        type: "email",
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send email:", response.statusText);
      return false;
    }

    console.log(`[Email] Sent status update email to ${applicantEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}

/**
 * Başvuru formu gönderimi sonrası onay e-postası
 */
export async function sendApplicationConfirmationEmail(
  applicantEmail: string,
  applicantName: string
): Promise<boolean> {
  try {
    const subject = `Müzik Grubu - Başvurunuz Alındı`;
    const message = `
Merhaba ${applicantName},

Müzik grubumuz için başvurunuz başarıyla alındı. Başvurunuz inceleme sürecine alınmıştır.

Yakında sizinle iletişime geçeceğiz.

Saygılarımla,
Müzik Grubu Yönetimi
    `.trim();

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      console.warn("[Email] Notification API not configured");
      return false;
    }

    const response = await fetch(`${ENV.forgeApiUrl}/notification/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: applicantEmail,
        subject,
        body: message,
        type: "email",
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send confirmation email:", response.statusText);
      return false;
    }

    console.log(`[Email] Sent confirmation email to ${applicantEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending confirmation email:", error);
    return false;
  }
}
