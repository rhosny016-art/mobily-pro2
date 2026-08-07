import assert from "node:assert/strict";
import test from "node:test";
import { validateContactRequest } from "./contactValidation";

test("rejects a too-short name and accepts a complete request", () => {
  const invalid = validateContactRequest({
    name: "أ",
    email: "qa@test.com",
    phone: "",
    subject: "",
    message: "رسالة اختبار كاملة",
  });
  assert.ok(invalid.name);

  assert.deepEqual(
    validateContactRequest({
      name: "اختبار جودة",
      email: "qa@test.com",
      phone: "",
      subject: "",
      message: "رسالة اختبار كاملة",
    }),
    {},
  );
});

test("rejects malformed email, phone, and short message", () => {
  const errors = validateContactRequest({
    name: "اختبار جودة",
    email: "not-an-email",
    phone: "123",
    subject: "",
    message: "قصير",
  });

  assert.ok(errors.email);
  assert.ok(errors.phone);
  assert.ok(errors.message);
});
