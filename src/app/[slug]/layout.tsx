import { RestaurantProvider } from '@/providers/restaurant-provider';
import { DynamicTheme } from '@/providers/theme-provider';

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
        {children}
      </DynamicTheme>
    </RestaurantProvider>
  );
}
