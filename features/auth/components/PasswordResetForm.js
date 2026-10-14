"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function responseMessage(payload, fallback) {
  if (typeof payload?.detail === "string") return payload.detail;
  if (typeof payload?.error?.details?.detail === "string") return payload.error.details.detail;
  return fallback;
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.8v5.1M10 14.1v.1" />
    </svg>
  );
}

function PasswordIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9 5.2 9 5.2a14 14 0 0 1-2.4 2.9M6.6 6.6A15.4 15.4 0 0 0 3 9.2s3.5 5.2 9 5.2c1 0 2-.2 2.8-.5" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.5-5.2 9-5.2S21 12 21 12s-3.5 5.2-9 5.2S3 12 3 12Z" /><circle cx="12" cy="12" r="2.4" /></svg>
  );
}

export default function PasswordResetForm() {
  const router = useRouter();
  const [step, setStep] = useState("request");
  const [contact, setContact] = useState({ mobile_number: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function clearFieldError(field) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function sanitizeMobile(value) {
    const hasCountryPrefix = value.startsWith("+");
    const digits = value.replace(/\D/g, "").slice(0, 15);
    return `${hasCountryPrefix ? "+" : ""}${digits}`;
  }

  function validateContact(data) {
    const errors = {};
    if (!data.mobile_number) errors.mobile_number = "Mobile number is required";
    else if (!/^\+?\d{10,15}$/.test(data.mobile_number)) errors.mobile_number = "Invalid mobile number";
    if (!data.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Invalid email";
    return errors;
  }

  async function requestOtp(event) {
    event.preventDefault();
    setToast(null);
    const form = new FormData(event.currentTarget);
    const nextContact = {
      mobile_number: form.get("mobile_number")?.trim(),
      email: form.get("email")?.trim(),
    };
    const errors = validateContact(nextContact);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContact),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(responseMessage(payload, "We could not send the OTP. Please try again."));
      setContact(nextContact);
      setFieldErrors({});
      setStep("reset");
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message });
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setToast(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(responseMessage(payload, "We could not resend the OTP. Please try again."));
      setToast({ type: "success", message: "A new OTP has been sent to your email." });
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message });
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    setToast(null);
    const form = new FormData(event.currentTarget);
    const otp = form.get("otp")?.trim();
    const newPassword = form.get("new_password");
    const errors = {};
    if (!otp) errors.otp = "OTP is required";
    else if (!/^\d{4}$/.test(otp)) errors.otp = "Enter a valid 4-digit OTP";
    if (!newPassword) errors.new_password = "New Password is required";
    else if (newPassword.length < 6) errors.new_password = "Password length must be of 6 Characters";
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, otp, new_password: newPassword }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(responseMessage(payload, "Invalid OTP"));
      setToast({ type: "success", message: "Password reset successfully." });
      setTimeout(() => router.replace("/login"), 1200);
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message });
    } finally {
      setLoading(false);
    }
  }

  const returnToContact = () => {
    setStep("request");
    setFieldErrors({});
    setToast(null);
  };

  return (
    <>
      <div className="login-heading">
        <h1>Forgot your password?</h1>
        <p>{step === "request" ? <>Enter your registered mobile number<br />and recovery email to reset it.</> : <>Enter the OTP we sent you and<br />create your new password.</>}</p>
      </div>

      {step === "request" ? (
        <form className="login-form" onSubmit={requestOtp} noValidate>
          <div className="login-fields">
            <div className={`login-field${fieldErrors.mobile_number ? " login-field-error" : ""}`}>
              <label htmlFor="reset-mobile">Mobile Number</label>
              <input id="reset-mobile" name="mobile_number" type="tel" inputMode="tel" autoComplete="tel" placeholder="Enter your mobile number" maxLength={16} defaultValue={contact.mobile_number} aria-invalid={Boolean(fieldErrors.mobile_number)} aria-describedby={fieldErrors.mobile_number ? "reset-mobile-error" : undefined} onChange={(event) => { event.currentTarget.value = sanitizeMobile(event.currentTarget.value); clearFieldError("mobile_number"); }} />
              {fieldErrors.mobile_number ? <span className="field-error-message" id="reset-mobile-error"><AlertIcon />{fieldErrors.mobile_number}</span> : null}
            </div>
            <div className={`login-field${fieldErrors.email ? " login-field-error" : ""}`}>
              <label htmlFor="reset-email">Email</label>
              <input id="reset-email" name="email" type="email" autoComplete="email" placeholder="Enter your recovery email" defaultValue={contact.email} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "reset-email-error" : undefined} onChange={() => clearFieldError("email")} />
              {fieldErrors.email ? <span className="field-error-message" id="reset-email-error"><AlertIcon />{fieldErrors.email}</span> : null}
            </div>
          </div>
          <button className="login-button" disabled={loading} type="submit">{loading ? "Requesting…" : "Request OTP"}</button>
        </form>
      ) : (
        <form className="login-form" onSubmit={resetPassword} noValidate>
          <div className="login-fields forgot-reset-fields">
            <div className="login-field">
              <div className="login-label-row"><label>Mobile Number</label><button type="button" onClick={returnToContact}>Wrong Number?</button></div>
              <input value={contact.mobile_number} readOnly aria-label="Mobile Number" />
            </div>
            <div className="login-field">
              <div className="login-label-row"><label>Email</label><button type="button" onClick={returnToContact}>Wrong Email?</button></div>
              <input value={contact.email} readOnly aria-label="Email" />
            </div>
            <div className={`login-field${fieldErrors.otp ? " login-field-error" : ""}`}>
              <label htmlFor="reset-otp">OTP</label>
              <span className="password-control">
                <input id="reset-otp" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="Enter verification code" maxLength={4} aria-invalid={Boolean(fieldErrors.otp)} aria-describedby={fieldErrors.otp ? "reset-otp-error" : undefined} onChange={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 4); clearFieldError("otp"); }} />
                <button className="password-toggle otp-resend" type="button" onClick={resendOtp} disabled={loading} aria-label="Send a new OTP"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 8.5A7 7 0 0 1 18.7 7L20 9M4 15l1.3 2A7 7 0 0 0 18 15.5" /></svg></button>
              </span>
              {fieldErrors.otp ? <span className="field-error-message" id="reset-otp-error"><AlertIcon />{fieldErrors.otp}</span> : null}
            </div>
            <div className={`login-field${fieldErrors.new_password ? " login-field-error" : ""}`}>
              <label htmlFor="new-password">New Password</label>
              <span className="password-control">
                <input id="new-password" name="new_password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter your new password" aria-invalid={Boolean(fieldErrors.new_password)} aria-describedby={fieldErrors.new_password ? "new-password-error" : undefined} onChange={() => clearFieldError("new_password")} />
                <button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}><PasswordIcon visible={showPassword} /></button>
              </span>
              {fieldErrors.new_password ? <span className="field-error-message" id="new-password-error"><AlertIcon />{fieldErrors.new_password}</span> : null}
            </div>
          </div>
          <button className="login-button" disabled={loading} type="submit">{loading ? "Resetting…" : "Reset Password"}</button>
        </form>
      )}

      {step === "request" ? <div className="login-register"><span>Register Your Pharmacy</span><Link href="/register">Join as Chemist</Link></div> : null}

      {toast ? (
        <div className={`login-toast${toast.type === "success" ? " login-toast-success" : ""}`} role="alert" aria-live="assertive">
          <svg className="login-toast-icon" viewBox="0 0 24 24" aria-hidden="true">{toast.type === "success" ? <path d="m5 12 4 4L19 6" /> : <><path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" /><path d="M12 8v4.5M12 15.5v.1" /></>}</svg>
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss message"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        </div>
      ) : null}
    </>
  );
}
