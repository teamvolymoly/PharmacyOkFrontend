import ModulePlaceholder from "@/features/modules/components/ModulePlaceholder";
export const metadata = { title: "Purchases" };
export default function PurchasesPage() { return <ModulePlaceholder eyebrow="Operations" title="Purchases" description="Bring supplier invoices and incoming stock into one workflow." items={[{ title: "Record purchase", description: "Capture supplier, invoice, and medicine batches." }, { title: "Suppliers", description: "Keep supplier relationships organized." }, { title: "Purchase returns", description: "Track returns with a clear audit trail." }]} />; }
