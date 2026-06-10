import ProductPage from '@/app/products/[slug]/page';
export default function BitsPage() {
  return <ProductPage params={{ slug: 'bits' }} />;
}
