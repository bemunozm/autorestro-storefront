import { RestaurantProvider } from '@/providers/restaurant-provider';
import { DynamicTheme } from '@/providers/theme-provider';
import { StorefrontHeader } from '@/components/layout/StorefrontHeader';

export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <RestaurantProvider slug={slug}>
      <DynamicTheme>
        <StorefrontHeader />
        <div className="flex-1">
          {children}
        </div>
      </DynamicTheme>
    </RestaurantProvider>
  );
}
