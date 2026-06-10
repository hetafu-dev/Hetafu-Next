import ProductPage from '@/app/products/[slug]/page';
export default function PopsPage() {
  return <ProductPage params={{ slug: 'pops' }} />;
}
