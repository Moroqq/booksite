import { getCurrentUser } from "@/lib/customer-auth";
import OrderForm from "./OrderForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Оформление заказа — Духовная звукотерапия" };

export default function BookOrderPage() {
  const user = getCurrentUser();

  return <OrderForm user={user} />;
}
