import ModulePlaceholder from "@/features/modules/components/ModulePlaceholder";
export const metadata = { title: "Sales" };
export default function SalesPage() { return <ModulePlaceholder eyebrow="Operations" title="Sales" description="A focused billing workflow for fast counter service." items={[{ title: "New bill", description: "Customer and medicine billing flow." }, { title: "Sales history", description: "Search, filter, and review completed bills." }, { title: "Returns", description: "Auditable sale-return handling." }]} />; }
