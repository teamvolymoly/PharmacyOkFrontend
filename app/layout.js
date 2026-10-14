import "@fontsource-variable/plus-jakarta-sans";
import "@/styles/globals.css";

export const metadata = {
  title: {
    default: "PharmacyOK",
    template: "%s | PharmacyOK",
  },
  description: "Simple, secure pharmacy operations for growing teams.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}

