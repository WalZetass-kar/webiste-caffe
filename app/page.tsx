import { HomePageView } from "@/components/pages/home-page";
import { getMenuItems, getRecommendedMenuItems, getTopRatings } from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [menus, recommendedMenus, topRatings] = await Promise.all([
    getMenuItems(),
    getRecommendedMenuItems(4),
    getTopRatings(3),
  ]);

  return <HomePageView menus={menus} recommendedMenus={recommendedMenus} ratings={topRatings} />;
}
