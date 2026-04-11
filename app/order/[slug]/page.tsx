import { notFound } from "next/navigation";
import { OrderDetailPageView } from "@/components/pages/order-detail-page";
import { getMenuItemBySlug, getRecommendedMenuItems } from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

type OrderDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { slug } = await params;
  const item = await getMenuItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const recommendations = await getRecommendedMenuItems(3, item.id);

  return <OrderDetailPageView item={item} recommendations={recommendations} />;
}
