const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export interface DaySchedule {
  open: string;
  close: string;
}

export function isDaySchedule(value: unknown): value is DaySchedule {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj['open'] === 'string' && typeof obj['close'] === 'string';
}

function parseTimeToMinutes(time: string): number {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10) || 0;
  if (isNaN(hours) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return NaN;
  return hours * 60 + minutes;
}

export function isOpenNow(openingHours?: Record<string, unknown>): boolean {
  if (!openingHours) return false;

  const now = new Date();
  const dayKey = DAY_KEYS[now.getDay()];
  const schedule = openingHours[dayKey];

  if (!isDaySchedule(schedule)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTimeToMinutes(schedule.open);
  const closeMinutes = parseTimeToMinutes(schedule.close);

  if (isNaN(openMinutes) || isNaN(closeMinutes)) return false;

  // Handle overnight schedules (e.g. 22:00 - 02:00)
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function getTodayHours(openingHours?: Record<string, unknown>): string | null {
  if (!openingHours) return null;

  const now = new Date();
  const dayKey = DAY_KEYS[now.getDay()];
  const schedule = openingHours[dayKey];

  if (!isDaySchedule(schedule)) return null;

  return `${schedule.open} - ${schedule.close}`;
}

const ALL_HOURS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function getAllHours(
  openingHours?: Record<string, unknown>,
): Array<{ day: string; schedule: DaySchedule | null }> {
  if (!openingHours) return ALL_HOURS_ORDER.map((day) => ({ day, schedule: null }));

  return ALL_HOURS_ORDER.map((day) => {
    const value = openingHours[day];
    return {
      day,
      schedule: isDaySchedule(value) ? value : null,
    };
  });
}
