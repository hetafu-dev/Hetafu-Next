import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import CartPage from "@/app/Components/Common/Cart/CartPage";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

export default function Cart() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CartPage />
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
