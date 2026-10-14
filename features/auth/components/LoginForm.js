"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

function getErrorMessage(payload) {
  if (payload?.detail) return payload.detail;
  if (payload?.error?.details?.detail) return payload.error.details.detail;
  if (payload && typeof payload === "object") {
    const first = Object.values(payload).flat().find(Boolean);
    if (typeof first === "string") return first;
  }
  return "We could not sign you in. Check your details and try again.";
}

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const mobileNumber = form.get("mobile_number")?.trim();
    const password = form.get("password");
    const validationErrors = {};

    if (!mobileNumber) {
      validationErrors.mobile_number = "Mobile number is required";
    } else if (!/^\+?\d{10,15}$/.test(mobileNumber)) {
      validationErrors.mobile_number = "Enter a valid mobile number with country code";
    }
    if (!password) validationErrors.password = "Password is required";

    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          password,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message = [400, 401].includes(response.status)
          ? "Incorrect mobile number or password."
          : getErrorMessage(payload);
        throw new Error(message);
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function clearFieldError(field) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-fields">
        <div className={`login-field${fieldErrors.mobile_number ? " login-field-error" : ""}`}>
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Enter your mobile number"
            pattern="\+?[0-9]{10,15}"
            maxLength={16}
            required
            autoFocus
            aria-invalid={Boolean(fieldErrors.mobile_number)}
            aria-describedby={fieldErrors.mobile_number ? "mobile-number-error" : undefined}
            onChange={(event) => {
              const enteredValue = event.currentTarget.value;
              const hasCountryPrefix = enteredValue.startsWith("+");
              const digits = enteredValue.replace(/\D/g, "").slice(0, 15);
              event.currentTarget.value = `${hasCountryPrefix ? "+" : ""}${digits}`;
              clearFieldError("mobile_number");
            }}
          />
          {fieldErrors.mobile_number ? (
            <span className="field-error-message" id="mobile-number-error">
              <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" /><path d="M10 5.8v5.1M10 14.1v.1" /></svg>
              {fieldErrors.mobile_number}
            </span>
          ) : null}
        </div>
        <div className={`login-field${fieldErrors.password ? " login-field-error" : ""}`}>
          <label htmlFor="password">Password</label>
          <span className="password-control">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              onChange={() => clearFieldError("password")}
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9 5.2 9 5.2a14 14 0 0 1-2.4 2.9M6.6 6.6A15.4 15.4 0 0 0 3 9.2s3.5 5.2 9 5.2c1 0 2-.2 2.8-.5" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.5-5.2 9-5.2S21 12 21 12s-3.5 5.2-9 5.2S3 12 3 12Z" /><circle cx="12" cy="12" r="2.4" /></svg>
              )}
            </button>
          </span>
          {fieldErrors.password ? (
            <span className="field-error-message" id="password-error">
              <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" /><path d="M10 5.8v5.1M10 14.1v.1" /></svg>
              {fieldErrors.password}
            </span>
          ) : null}
        </div>
      </div>
      <button className="login-button" disabled={loading} type="submit">
        {loading ? "Logging in…" : "Login"}
      </button>
      <Link className="forgot-password" href="/forgot-password">Forgot Password?</Link>
      {error ? (
        <div className="login-toast" role="alert" aria-live="assertive">
          <svg className="login-toast-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
            <path d="M12 8v4.5M12 15.5v.1" />
          </svg>
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} aria-label="Dismiss error message">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
      ) : null}
    </form>
  );
}
