import ProductPage from '@/app/products/[slug]/page';
export default function CutePage() {
  return <ProductPage params={{ slug: 'cute' }} />;
}
