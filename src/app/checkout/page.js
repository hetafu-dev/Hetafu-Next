import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import CheckoutPage from "@/app/Components/Common/Checkout/CheckoutPage";

export default function Checkout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CheckoutPage />
      </main>
      <Footer />
    </div>
  );
}
