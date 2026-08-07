export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export function validateContactRequest(form: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (form.name.trim().length < 3) {
    errors.name = "يجب أن يكون الاسم 3 أحرف على الأقل";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح (مثال: you@example.com)";
  }

  if (form.phone.trim() && !/^[\d+\-\s()]{8,15}$/.test(form.phone.trim())) {
    errors.phone = "يرجى إدخال رقم هاتف صحيح (8 إلى 15 رقماً)";
  }

  if (form.message.trim().length < 10) {
    errors.message = "يجب أن تحتوي الرسالة على 10 أحرف على الأقل";
  }

  return errors;
}
