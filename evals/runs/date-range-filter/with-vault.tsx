import { useMemo, useState } from 'react';
import { DateRangePicker } from '@ocean-network-express/magenta-react-dates';
import type { DatesRangeValue } from '@ocean-network-express/magenta-react-dates';
import { css } from '../../styled-system/css';

export interface Voyage {
  id: string;
  departureDate: Date;
}

export interface VoyageDateFilterProps<T extends Voyage> {
  voyages: T[];
  /** Called with the voyages that depart inside the chosen range (all voyages when no range is set). */
  onFilter: (filtered: T[]) => void;
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export function VoyageDateFilter<T extends Voyage>({ voyages, onFilter }: VoyageDateFilterProps<T>) {
  const [range, setRange] = useState<DatesRangeValue>([null, null]);

  // Today at 00:00, so today itself stays selectable and earlier days are disabled.
  const minDate = useMemo(() => startOfDay(new Date()), []);

  const handleChange = (value: DatesRangeValue | null) => {
    const next: DatesRangeValue = value ?? [null, null];
    setRange(next);

    const [start, end] = next;
    if (!start || !end) {
      // A range is only applied once both ends are picked.
      if (!start && !end) onFilter(voyages);
      return;
    }
    const from = startOfDay(start).getTime();
    const to = startOfDay(end).getTime();
    onFilter(
      voyages.filter((voyage) => {
        const departure = startOfDay(voyage.departureDate).getTime();
        return departure >= from && departure <= to;
      }),
    );
  };

  return (
    <div>
      <DateRangePicker
        size="responsive"
        clearable
        label={<span id="departure-label">Departure date</span>}
        helperText="Show voyages departing between two dates. Dates before today cannot be chosen."
        renderHelperType="inline"
        minDate={minDate}
        value={range}
        onChange={handleChange}
        startInputProps={{ 'aria-labelledby': 'departure-label departure-start' }}
        endInputProps={{ 'aria-labelledby': 'departure-label departure-end' }}
      />
      <span id="departure-start" className={css({ srOnly: true })}>start date</span>
      <span id="departure-end" className={css({ srOnly: true })}>end date</span>
    </div>
  );
}
