import { OrderPageView } from "@/components/pages/order-page";
import { getMenuItems, getOrders, getRecommendedMenuItems } from "@/lib/server/data-store";
import { getBranchItems } from "@/lib/server/branch-store";
import { getPaymentSettings } from "@/lib/server/payment-settings-store";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
  const [menus, paymentSettings, recommendedMenus, branches, orders] = await Promise.all([
    getMenuItems(),
    getPaymentSettings(),
    getRecommendedMenuItems(4),
    getBranchItems(),
    getOrders(),
  ]);

  return (
    <OrderPageView
      menus={menus}
      paymentSettings={paymentSettings}
      recommendedMenus={recommendedMenus}
      branches={branches}
      initialOrders={orders}
    />
  );
}
