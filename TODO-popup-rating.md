# TODO: Popup Rating Pelanggan SETELAH Order "Selesai"

## Plan (Approved: "gas")
1. [ ] Update RatingRecord + Zod (`lib/models.ts`) → add `orderId?: string` link
2. [ ] Update data-store (`lib/server/data-store.ts`) → createRating accept orderId
3. [ ] Update API (`app/api/ratings/route.ts`) → support orderId
4. [ ] Create RatingModal (`components/ui/rating-modal.tsx`) → customer popup form
5. [ ] Integrate to OrderPageView (`components/pages/order-page.tsx`) → detect order success → auto-popup
6. [ ] Admin trigger in kanban (`components/dashboard/order-kanban.tsx`) → "Request Rating" button on "Selesai"
7. [ ] Migrate /penilaian → dashboard view only or redirect
8. [ ] Test + complete

Progress: 5/8 ✅ (Modal created + integrated to order success flow)




