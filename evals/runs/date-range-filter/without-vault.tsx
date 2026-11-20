import { useMemo, useState } from 'react';
import { Button } from '@ocean-network-express/magenta-react';
import { DateRangePicker } from '@ocean-network-express/magenta-react-dates';

type Voyage = { id: string; vessel: string; departure: Date };

type DateRange = { start: Date | null; end: Date | null };

type Props = {
  voyages: Voyage[];
  onFilter?: (filtered: Voyage[]) => void;
};

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function VoyageDateRangeFilter({ voyages, onFilter }: Props) {
  const today = useMemo(startOfToday, []);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  const filtered = useMemo(() => {
    const { start, end } = range;
    if (!start || !end) return voyages;
    const endOfEnd = new Date(end);
    endOfEnd.setHours(23, 59, 59, 999);
    return voyages.filter((v) => v.departure >= start && v.departure <= endOfEnd);
  }, [voyages, range]);

  const handleChange = (value: DateRange) => {
    setRange(value);
    if (value.start && value.end) onFilter?.(filtered);
  };

  const reset = () => {
    setRange({ start: null, end: null });
    onFilter?.(voyages);
  };

  return (
    <div>
      <DateRangePicker
        label="Departure date range"
        value={range}
        minDate={today}
        isDateUnavailable={(date: Date) => date < today}
        onChange={handleChange}
      />
      <Button variant="secondary" onClick={reset}>
        Clear
      </Button>
      <ul>
        {filtered.map((v) => (
          <li key={v.id}>
            {v.vessel} - {v.departure.toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
