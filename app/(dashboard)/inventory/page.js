import ModulePlaceholder from "@/features/modules/components/ModulePlaceholder";
export const metadata = { title: "Inventory" };
export default function InventoryPage() { return <ModulePlaceholder eyebrow="Stock control" title="Inventory" description="Batch-aware medicine stock designed for pharmacy operations." items={[{ title: "Stock on hand", description: "Review availability by branch and batch." }, { title: "Expiry watch", description: "Surface medicines before they expire." }, { title: "Stock movement", description: "Understand every inventory adjustment." }]} />; }
