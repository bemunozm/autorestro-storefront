import { headers } from 'next/headers';
import { RestaurantProvider } from '@/providers/restaurant-provider';
import { DynamicTheme } from '@/providers/theme-provider';
import { StorefrontHeader } from '@/components/layout/StorefrontHeader';
import { FloatingCartButton } from '@/components/menu/FloatingCartButton';

const PLATFORM_DOMAINS = ['autorestro.cl', 'localhost', 'vercel.app'];

function computeBasePath(host: string, slug: string): string {
  const hostname = host.split(':')[0];
  const isRootPlatform = PLATFORM_DOMAINS.some(
    (d) => hostname === d || hostname === `www.${d}`
  );
  return isRootPlatform ? `/${slug}` : '';
}

export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost';
  const basePath = computeBasePath(host, slug);

  return (
    <RestaurantProvider slug={slug} basePath={basePath}>
      <DynamicTheme>
        <StorefrontHeader />
        <div className="flex-1">
          {children}
        </div>
        <FloatingCartButton />
      </DynamicTheme>
    </RestaurantProvider>
  );
}
