import {
  checkEmail,
  checkName,
  checkOptionalText,
  checkPhone,
  cleanText,
  hasErrors,
  type FieldErrors,
  type ValidationResult,
} from "./fields";

export type OrderCustomerValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  acceptTerms: boolean;
  acceptDemo: boolean;
};
export type OrderCustomerField = keyof OrderCustomerValues;

export const emptyOrderCustomer: OrderCustomerValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  acceptTerms: false,
  acceptDemo: false,
};

export function normalizeOrderCustomer(raw: Record<string, unknown>): OrderCustomerValues {
  return {
    name: cleanText(raw.name, 80),
    email: cleanText(raw.email, 160).toLowerCase(),
    phone: cleanText(raw.phone, 30),
    company: cleanText(raw.company, 160),
    acceptTerms: raw.acceptTerms === true,
    acceptDemo: raw.acceptDemo === true,
  };
}

export function validateOrderCustomer(v: OrderCustomerValues): FieldErrors<OrderCustomerField> {
  const e: FieldErrors<OrderCustomerField> = {};
  const set = (k: OrderCustomerField, msg: string | undefined) => {
    if (msg) e[k] = msg;
  };
  set("name", checkName(v.name));
  set("email", checkEmail(v.email));
  set("phone", checkPhone(v.phone));
  set("company", checkOptionalText(v.company, 120, "Nazwa firmy"));
  set("acceptTerms", v.acceptTerms ? undefined : "Zaakceptuj demonstracyjny regulamin, aby kontynuować.");
  set("acceptDemo", v.acceptDemo ? undefined : "Potwierdź, że rozumiesz demonstracyjny charakter zamówienia.");
  return e;
}

export function parseOrderCustomer(raw: Record<string, unknown>): ValidationResult<OrderCustomerValues, OrderCustomerField> {
  const values = normalizeOrderCustomer(raw);
  const errors = validateOrderCustomer(values);
  return hasErrors(errors) ? { ok: false, errors } : { ok: true, data: values };
}
