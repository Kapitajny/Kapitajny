import { ServicePage } from "@/components/ServicePage";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/seo";

const data = services.doradztwo;

export const metadata = pageMetadata({ title: data.metaTitle, description: data.metaDescription, path: data.path });

export default function Page() {
  return <ServicePage data={data} />;
}
