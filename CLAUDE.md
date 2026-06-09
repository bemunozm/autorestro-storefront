# CLAUDE.md

Este archivo guía a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

Sitio de pedidos para clientes. Next.js 15 (App Router) + React 19, multi-tenant por subdominio/dominio personalizado. Consume la API `/storefront/{slug}/...` del backend. Ver el `CLAUDE.md` raíz del workspace para los contratos entre repos (auth, tenancy, enums de estado, pagos).

> **Atención: este NO es el Next.js que conoces.** Esta versión puede traer cambios incompatibles respecto a lo aprendido en el entrenamiento — APIs, convenciones y estructura de archivos pueden diferir. Ante la duda sobre una API de Next.js, consulta `node_modules/next/dist/docs/` y respeta los avisos de deprecación. (Esta advertencia venía en el `AGENTS.md` original generado por `create-next-app`.)

## Comandos

```bash
npm run dev      # next dev (puerto 3000)
npm run build    # next build
npm run start    # next start (prod)
npm run lint     # eslint
```

Entorno: una sola variable pública, `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:4000`), en `.env` / `.env.local`.

## Arquitectura

### Ruteo por tenant (`src/middleware.ts`)
Cada petición se resuelve a un `slug` de restaurante y se **reescribe de forma transparente a `/[slug]/...`**:
- Dominios de plataforma (`autorestro.cl`, `localhost`, `*.vercel.app`): slug desde el subdominio o el path.
- Dominios personalizados: se resuelven con `GET /storefront/resolve-domain?domain={host}` (caché de 5 min).
- **Quita el puerto** del hostname antes de comparar (dev `:3000`, puertos personalizados). Setea un header `x-restaurant-slug`.

### Layouts y providers
`app/layout.tsx` (server) envuelve todo en `<QueryProvider>`. `app/[slug]/layout.tsx` (server) lee `headers()` para el host, calcula `basePath` y envuelve los hijos en `<RestaurantProvider>` + `<DynamicTheme>`. Los colores/fuentes del tema vienen de `restaurant.landingConfig.theme` y se aplican como variables CSS (`--theme-primary`, etc.) en `<html>`. La mayoría de las páginas `/[slug]/*` son `'use client'`.

### Rutas bajo `app/[slug]/`
`menu`, `checkout`, `payments/{confirm,success,webpay-return}`, `order/[orderId]`, `orders`, `track/[orderId]` + `track`, `loyalty`, `session`, `mesa/[tableId]` (entrada dine-in por QR), `auth/{login,register,forgot-password,confirm-account,new-password}`.

### Estado (Zustand, todo persistido en localStorage)
- `stores/auth-store.ts` (`autorestro-auth`) — `user`, `token`, `isAuthenticated`. Recalcula `isAuthenticated` al rehidratar. **Checkout de invitado** = `login(token, null)`: autenticado pero `user === null`.
- `stores/cart-store.ts` (`autorestro-cart`) — items (incluidas recompensas de fidelización con `isLoyaltyReward`/`pointsCost`), `restaurantSlug` (**vacía el carrito al cambiar de tenant**), `orderType`, `orderNotes`. `getTotal()` excluye items de fidelización; `getTotalPoints()` los suma.
- `stores/session-store.ts` (`autorestro-session`) — `tableId`, `sessionId` para dine-in.

**Hidratación:** usa el patrón `hasMounted` (renderiza un spinner hasta que un `useEffect` marca montado) antes de leer estado persistido de Zustand, para evitar errores de hidratación.

### Capa de datos
- Instancia de axios en **`src/lib/api.ts`**: base `NEXT_PUBLIC_API_URL`, el interceptor de request inyecta el token Bearer desde `useAuthStore`; el de response desempaqueta `error.response.data.message`. **El 401 es silencioso para endpoints `/loyalty/` y `/storefront/`** (los invitados legítimamente no tienen acceso); a los usuarios autenticados se les redirige al login.
- TanStack Query en `src/providers/query-provider.tsx` (`staleTime: 60s`, `retry: 1`).
- Los hooks de datos viven en `src/hooks/use*.ts` (`useMenu`, `useOrders`, `useLoyalty*`, `usePaymentMethods`, `useCreateOrder`, `useInitPayment`). **No hay carpeta `src/api/`** — los hooks llaman directo a la instancia de axios.
- `src/lib/guest-orders.ts` rastrea pedidos activos de invitados en localStorage (máx 5) para que puedan seguir sus pedidos sin cuenta.

### Pagos y checkout (`app/[slug]/checkout`)
Tipo de pedido → descuento automático opcional (`GET /storefront/{slug}/auto-discounts`) / código promocional → preview de costo de envío (el servidor es la autoridad) → datos de invitado si hace falta → `POST /storefront/{slug}/orders` → si el total > 0, `POST /storefront/{slug}/payments/init` → redirige a Webpay/MercadoPago. Webpay retorna a `payments/webpay-return` (route handler) → `payments/confirm`.

### Tiempo real
`src/hooks/useOrderSocket.ts` conecta al namespace `/orders` con `auth: { token }`, se une a la sala `session` por `restaurantId`, y escucha `order:item:updated` para actualizar la UI de seguimiento.

### UI
Primitivas shadcn/Radix en `src/components/ui/`, Tailwind v4 (theming por variables CSS). El carrito es drawer inferior `vaul` en móvil / `Sheet` de Radix en desktop (`CartDrawer.tsx`, alternado por `useIsMobile()`). Las plantillas de landing se cargan en lazy desde `src/templates/registry.ts` (fallback `hero-centered`).

## Convenciones
TS strict, sin `any`, named exports. **Envía los valores de enum del backend** en las llamadas a la API (ej. estado de pedido/item), traduce a español solo para mostrar. La UX de seguimiento de pedidos vive dentro de las pestañas del cart drawer, no en el header. Agrega `text-white` a los botones `bg-(--theme-primary)` (el default de shadcn es texto oscuro). Los hosts de imágenes remotas están en lista blanca en `next.config.ts` (`*.r2.dev` para el storage actual en Cloudflare R2, `*.supabase.co` legacy, `images.unsplash.com`).
