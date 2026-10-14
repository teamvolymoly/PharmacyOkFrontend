import ModulePlaceholder from "@/features/modules/components/ModulePlaceholder";
export const metadata = { title: "Medbook" };
export default function MedbookPage() { return <ModulePlaceholder eyebrow="Medicine reference" title="Medbook" description="A shared medicine catalog for consistent pharmacy records." items={[{ title: "Medicine search", description: "Find normalized medicine information quickly." }, { title: "Alternatives", description: "Prepare for composition-based discovery." }, { title: "Catalog quality", description: "Keep tenant stock linked to clean master data." }]} />; }
