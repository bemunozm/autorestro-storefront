'use client';

import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';

const PAYMENT_INFO: Record<string, { label: string; description: string; icon: typeof CreditCard }> = {
  webpay: {
    label: 'Tarjeta (Webpay)',
    description: 'Paga con tarjeta de débito o crédito',
    icon: CreditCard,
  },
  mercadopago: {
    label: 'MercadoPago',
    description: 'Paga con tu cuenta de MercadoPago',
    icon: Smartphone,
  },
  cash: {
    label: 'Efectivo',
    description: 'Paga en tu mesa',
    icon: Banknote,
  },
};

interface PaymentMethodSelectorProps {
  orderType: string;
  value: string;
  onChange: (method: string) => void;
}

export function PaymentMethodSelector({ orderType, value, onChange }: PaymentMethodSelectorProps) {
  const { data: methods, isLoading } = usePaymentMethods(orderType);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!methods || methods.length === 0) {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-600">
        No hay métodos de pago configurados para este restaurante.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {methods.map(method => {
        const info = PAYMENT_INFO[method];
        if (!info) return null;
        const isSelected = value === method;
        const Icon = info.icon;

        return (
          <button
            key={method}
            type="button"
            onClick={() => onChange(method)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              isSelected
                ? 'border-(--color-primary) bg-(--color-primary)/5'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isSelected ? 'bg-(--color-primary) text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{info.label}</p>
              <p className="text-xs text-gray-400">{info.description}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              isSelected ? 'border-(--color-primary)' : 'border-gray-200'
            }`}>
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-(--color-primary)" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
