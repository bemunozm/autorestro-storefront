'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Clock } from 'lucide-react';

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const DAY_SHORT: Record<string, string> = {
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mié',
  thursday: 'Jue',
  friday: 'Vie',
  saturday: 'Sáb',
  sunday: 'Dom',
};

interface DaySchedule {
  open: string;
  close: string;
}

function isDaySchedule(value: unknown): value is DaySchedule {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj['open'] === 'string' && typeof obj['close'] === 'string';
}

function getCurrentDayKey(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

interface GroupedSchedule {
  days: string[];
  label: string;
  hours: string | null; // null = cerrado
  includestoday: boolean;
}

function groupSchedule(openingHours: Record<string, unknown>, today: string): GroupedSchedule[] {
  const groups: GroupedSchedule[] = [];

  for (const day of DAY_ORDER) {
    const schedule = openingHours[day];
    const hours = isDaySchedule(schedule) ? `${schedule.open} - ${schedule.close}` : null;

    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.hours === hours) {
      lastGroup.days.push(day);
      if (day === today) lastGroup.includestoday = true;
    } else {
      groups.push({
        days: [day],
        label: '',
        hours,
        includestoday: day === today,
      });
    }
  }

  for (const group of groups) {
    if (group.days.length === 1) {
      group.label = DAY_SHORT[group.days[0]];
    } else {
      const first = DAY_SHORT[group.days[0]];
      const last = DAY_SHORT[group.days[group.days.length - 1]];
      group.label = `${first} - ${last}`;
    }
  }

  return groups;
}

interface OpeningHoursSheetProps {
  openingHours: Record<string, unknown>;
  isOpen: boolean;
  onClose: () => void;
}

export function OpeningHoursSheet({ openingHours, isOpen, onClose }: OpeningHoursSheetProps) {
  const today = getCurrentDayKey();
  const groups = groupSchedule(openingHours, today);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[70vh] p-0 [&>button]:hidden">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />

        <SheetHeader className="px-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Clock size={20} />
            Horarios de atención
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 pb-8 space-y-1 overflow-y-auto">
          {groups.map((group) => (
            <div
              key={group.label}
              className={`flex items-center justify-between py-3.5 px-4 rounded-xl transition-colors ${
                group.includestoday ? 'bg-(--color-primary)/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {group.includestoday && (
                  <span className="w-2 h-2 rounded-full bg-(--color-primary) shrink-0" />
                )}
                {!group.includestoday && <span className="w-2 h-2 shrink-0" />}
                <span className={`text-sm ${group.includestoday ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                  {group.label}
                  {group.includestoday && <span className="text-xs ml-1.5 opacity-60">Hoy</span>}
                </span>
              </div>
              <span
                className={`text-sm ${
                  !group.hours
                    ? 'text-red-500/70'
                    : group.includestoday
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground'
                }`}
              >
                {group.hours ?? 'Cerrado'}
              </span>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
