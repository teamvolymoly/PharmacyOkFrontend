"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function AlertIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" /><path d="M10 5.8v5.1M10 14.1v.1" /></svg>;
}

function errorDetails(payload) {
  return payload?.error?.details ?? payload ?? {};
}

function errorMessage(payload, fallback) {
  const details = errorDetails(payload);
  if (typeof details.detail === "string") return details.detail;
  if (typeof payload?.detail === "string") return payload.detail;
  const first = Object.values(details).flat().find((value) => typeof value === "string");
  return first || fallback;
}

function sanitizeMobile(value) {
  const prefix = value.startsWith("+") ? "+" : "";
  return `${prefix}${value.replace(/\D/g, "").slice(0, 15)}`;
}

export default function RegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState("details");
  const [details, setDetails] = useState({ pharmacy_name: "", mobile_number: "", email: "", postal_code: "" });
  const [registrationId, setRegistrationId] = useState("");
  const [referralOpen, setReferralOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function clearError(field) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validateDetails(data) {
    const errors = {};
    if (!data.pharmacy_name) errors.pharmacy_name = "Pharmacy name is required";
    if (!data.mobile_number) errors.mobile_number = "Mobile number is required";
    else if (!/^\+?\d{10,15}$/.test(data.mobile_number)) errors.mobile_number = "Invalid mobile number";
    if (!data.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Invalid Email";
    if (!data.postal_code) errors.postal_code = "Zip Code is required";
    else if (!/^\d{6}$/.test(data.postal_code)) errors.postal_code = "Invalid Zip Code";
    return errors;
  }

  async function sendRegistrationRequest(data, showSuccess = false) {
    const response = await fetch("/api/auth/register/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw Object.assign(new Error(errorMessage(payload, "We could not send the OTP.")), { payload });
    setRegistrationId(payload.registration_id);
    if (showSuccess) setToast({ type: "success", message: "OTP sent to mobile successfully." });
  }

  async function requestOtp(event) {
    event.preventDefault();
    setToast(null);
    const form = new FormData(event.currentTarget);
    const nextDetails = {
      pharmacy_name: form.get("pharmacy_name")?.trim(),
      mobile_number: form.get("mobile_number")?.trim(),
      email: form.get("email")?.trim(),
      postal_code: form.get("postal_code")?.trim(),
    };
    const errors = validateDetails(nextDetails);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    setLoading(true);
    try {
      await sendRegistrationRequest(nextDetails);
      setDetails(nextDetails);
      setStep("verify");
      setToast({ type: "success", message: "OTP sent to mobile successfully." });
    } catch (requestError) {
      const backendDetails = errorDetails(requestError.payload);
      const backendFields = {};
      for (const field of ["pharmacy_name", "mobile_number", "email", "postal_code"]) {
        if (backendDetails[field]) backendFields[field] = Array.isArray(backendDetails[field]) ? backendDetails[field][0] : backendDetails[field];
      }
      if (Object.keys(backendFields).length) setFieldErrors(backendFields);
      else setToast({ type: "error", message: requestError.message });
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setLoading(true);
    setToast(null);
    try {
      await sendRegistrationRequest(details, true);
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message });
    } finally {
      setLoading(false);
    }
  }

  async function completeRegistration(event) {
    event.preventDefault();
    setToast(null);
    const form = new FormData(event.currentTarget);
    const otp = form.get("otp")?.trim();
    const password = form.get("password");
    const errors = {};
    if (!otp) errors.otp = "OTP is required";
    else if (!/^\d{4}$/.test(otp)) errors.otp = "Invalid OTP";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password length must be of 6 Characters";
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_id: registrationId, otp, password, referral_code: referralCode.trim() }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(errorMessage(payload, "Registration could not be completed."));
      setToast({ type: "success", message: "Registration completed successfully." });
      setTimeout(() => router.replace("/login"), 1200);
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message });
    } finally {
      setLoading(false);
    }
  }

  function renderFieldError(field, id) {
    return fieldErrors[field] ? <span className="field-error-message" id={id}><AlertIcon />{fieldErrors[field]}</span> : null;
  }

  const backToDetails = () => {
    setStep("details");
    setFieldErrors({});
    setToast(null);
  };

  return (
    <>
      <div className="login-heading"><h1>Register</h1><p>Manage your pharmacy, all in one place.</p></div>

      {step === "details" ? (
        <form className="login-form" onSubmit={requestOtp} noValidate>
          <div className="login-fields">
            <div className={`login-field${fieldErrors.pharmacy_name ? " login-field-error" : ""}`}><label htmlFor="pharmacy-name">Pharmacy Name</label><input id="pharmacy-name" name="pharmacy_name" defaultValue={details.pharmacy_name} placeholder="Enter pharmacy name" onChange={() => clearError("pharmacy_name")} />{renderFieldError("pharmacy_name", "pharmacy-name-error")}</div>
            <div className={`login-field${fieldErrors.mobile_number ? " login-field-error" : ""}`}><label htmlFor="register-mobile">Mobile Number</label><input id="register-mobile" name="mobile_number" type="tel" inputMode="tel" maxLength={16} defaultValue={details.mobile_number} placeholder="Enter mobile number" onChange={(event) => { event.currentTarget.value = sanitizeMobile(event.currentTarget.value); clearError("mobile_number"); }} />{renderFieldError("mobile_number", "register-mobile-error")}</div>
            <div className={`login-field${fieldErrors.email ? " login-field-error" : ""}`}><label htmlFor="register-email">Email</label><input id="register-email" name="email" type="email" defaultValue={details.email} placeholder="Enter email" onChange={() => clearError("email")} />{renderFieldError("email", "register-email-error")}</div>
            <div className={`login-field${fieldErrors.postal_code ? " login-field-error" : ""}`}><label htmlFor="postal-code">Zip Code</label><input id="postal-code" name="postal_code" type="text" inputMode="numeric" maxLength={6} defaultValue={details.postal_code} placeholder="Enter zip code" onChange={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 6); clearError("postal_code"); }} />{renderFieldError("postal_code", "postal-code-error")}</div>
          </div>
          <button className="referral-toggle" type="button" onClick={() => setReferralOpen((open) => !open)}>Have a Referral code?</button>
          {referralOpen ? <div className="login-field"><label htmlFor="early-referral">Referral Code (Optional)</label><input id="early-referral" value={referralCode} onChange={(event) => setReferralCode(event.target.value)} /></div> : null}
          <button className="login-button" type="submit" disabled={loading}>{loading ? "Requesting…" : "Request OTP"}</button>
        </form>
      ) : (
        <form className="login-form" onSubmit={completeRegistration} noValidate>
          <div className="login-fields registration-verify-fields">
            <div className="login-field"><label>Pharmacy Name</label><input value={details.pharmacy_name} readOnly /></div>
            <div className="login-field"><div className="login-label-row"><label>Mobile Number</label><button type="button" onClick={backToDetails}>Wrong Number?</button></div><input value={details.mobile_number} readOnly /></div>
            <div className="login-field"><label>Email</label><input value={details.email} readOnly /></div>
            <div className="login-field"><label>Zip Code</label><input value={details.postal_code} readOnly /></div>
            <div className={`login-field${fieldErrors.otp ? " login-field-error" : ""}`}><label htmlFor="registration-otp">OTP</label><span className="password-control"><input id="registration-otp" name="otp" inputMode="numeric" maxLength={4} placeholder="Enter verification code" onChange={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 4); clearError("otp"); }} /><button className="password-toggle otp-resend" type="button" onClick={resendOtp} disabled={loading} aria-label="Send a new OTP"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 8.5A7 7 0 0 1 18.7 7L20 9M4 15l1.3 2A7 7 0 0 0 18 15.5" /></svg></button></span>{renderFieldError("otp", "registration-otp-error")}</div>
            <div className={`login-field${fieldErrors.password ? " login-field-error" : ""}`}><label htmlFor="registration-password">Password</label><span className="password-control"><input id="registration-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" onChange={() => clearError("password")} /><button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.5-5.2 9-5.2S21 12 21 12s-3.5 5.2-9 5.2S3 12 3 12Z" /><circle cx="12" cy="12" r="2.4" /></svg></button></span>{renderFieldError("password", "registration-password-error")}</div>
          </div>
          <button className="referral-toggle" type="button" onClick={() => setReferralOpen((open) => !open)}>{referralOpen ? "Hide Referral code" : "Have a Referral code?"}</button>
          {referralOpen ? <div className="login-field"><label htmlFor="referral-code">Referral Code (Optional)</label><input id="referral-code" value={referralCode} onChange={(event) => setReferralCode(event.target.value)} /></div> : null}
          <p className="registration-terms">By joining with us you have read and agreed to <Link href="/terms">Terms of Use</Link></p>
          <button className="login-button" type="submit" disabled={loading}>{loading ? "Registering…" : "Register"}</button>
        </form>
      )}

      <div className="login-register registration-login"><span>Already have an account?</span><Link href="/login">Login Now</Link></div>

      {toast ? <div className={`login-toast${toast.type === "success" ? " login-toast-success" : ""}`} role="alert"><svg className="login-toast-icon" viewBox="0 0 24 24" aria-hidden="true">{toast.type === "success" ? <path d="m5 12 4 4L19 6" /> : <><path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" /><path d="M12 8v4.5M12 15.5v.1" /></>}</svg><span>{toast.message}</span><button type="button" onClick={() => setToast(null)} aria-label="Dismiss message"><svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div> : null}
    </>
  );
}
