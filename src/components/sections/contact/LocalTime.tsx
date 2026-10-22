'use client';
// A live local clock (updates on each minute boundary). The server renders a placeholder (a static
// build cannot know the visitor's moment), the client fills it in on hydration.
import { useSyncExternalStore } from 'react';
import styles from '../Contact.module.css';

const MINUTE = 60_000;
const minuteNow = () => Math.floor(Date.now() / MINUTE);

function subscribe(onChange: () => void) {
  let id: ReturnType<typeof setTimeout>;
  const arm = () => {
    id = setTimeout(() => {
      onChange();
      arm();
    }, MINUTE - (Date.now() % MINUTE) + 40);
  };
  arm();
  return () => clearTimeout(id);
}

export function LocalTime({ timeZone, zoneLabel, city }: { timeZone: string; zoneLabel: string; city: string }) {
  const minute = useSyncExternalStore(subscribe, minuteNow, () => 0);
  const date = minute ? new Date(minute * MINUTE) : null;
  const time = date
    ? new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date)
    : '00:00';

  return (
    <span className={styles.clock}>
      <time className={styles.clockTime} dateTime={date?.toISOString()} data-ready={date ? '' : undefined}>
        {time}
      </time>
      <span className={styles.clockZone}>
        {city}, {zoneLabel}
      </span>
    </span>
  );
}
