import ProductPage from '@/app/products/[slug]/page';
export default function SmartsPage() {
  return <ProductPage params={{ slug: 'smarts' }} />;
}
