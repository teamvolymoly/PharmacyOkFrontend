import Image from "next/image";

import RegistrationForm from "@/features/auth/components/RegistrationForm";

export default function RegistrationPage() {
  return (
    <div className="login-page registration-page">
      <section className="login-panel">
        <div className="login-panel-content">
          <div className="login-top">
            <a className="login-phone" href="tel:+917000795310" aria-label="Call PharmacyOK at 70007 95310">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.4 3.8 6.7 2.1a1.7 1.7 0 0 0-2.4 0L2.7 3.7c-1.6 1.6.1 6.7 4.4 11s9.4 6 11 4.4l1.6-1.6a1.7 1.7 0 0 0 0-2.4L18 13.4a1.7 1.7 0 0 0-2.2-.2l-1.7 1.2c-.7.5-2.3-.3-3.6-1.6s-2.1-2.9-1.6-3.6l1.2-1.7a1.7 1.7 0 0 0-.2-2.2L8.4 3.8Z" /><path d="M14.8 3.2a7.2 7.2 0 0 1 6 6M14.8 7a3.4 3.4 0 0 1 2.2 2.2" /></svg>
              <span>70007 95310</span>
            </a>
            <div className="login-card registration-card">
              <div className="login-logo-wrap"><Image className="login-logo" src="/assets/logos/PharmacyOk.svg" alt="PharmacyOK" width={225} height={35} priority /></div>
              <RegistrationForm />
            </div>
          </div>
          <a className="login-help" href="tel:+917000795310" aria-label="Call PharmacyOK support">?</a>
        </div>
      </section>
      <div className="login-visual" role="img" aria-label="Pharmacist standing in a modern pharmacy" />
    </div>
  );
}
