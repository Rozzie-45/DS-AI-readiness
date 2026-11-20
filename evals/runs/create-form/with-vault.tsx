import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Button,
  Input,
  ListItemText,
  NumberInput,
  Select,
  SelectOption,
} from '@ocean-network-express/magenta-react';
import { DatePicker } from '@ocean-network-express/magenta-react-dates';
import { css } from '../../styled-system/css';

const CONTAINER_TYPES = [
  { label: '20GP', value: '20GP' },
  { label: '40GP', value: '40GP' },
  { label: '40HC', value: '40HC' },
  { label: '45HC', value: '45HC' },
];

type BookingFormProps = {
  onSubmit?: (booking: {
    customerReference: string;
    containerCount: number;
    containerType: string;
    estimatedDeparture: Date | null;
  }) => void;
  onCancel?: () => void;
};

export function CreateBookingForm({ onSubmit, onCancel }: BookingFormProps) {
  const [customerReference, setCustomerReference] = useState('');
  const [containerCount, setContainerCount] = useState<number>(NaN);
  const [containerType, setContainerType] = useState<string[]>([]);
  const [departure, setDeparture] = useState<Date | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const referenceMissing = customerReference.trim() === '';
  const countInvalid =
    Number.isNaN(containerCount) || containerCount < 1 || containerCount > 99;
  const typeMissing = containerType.length === 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (referenceMissing || countInvalid || typeMissing) return;
    onSubmit?.({
      customerReference: customerReference.trim(),
      containerCount,
      containerType: containerType[0],
      estimatedDeparture: departure,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={css({ display: 'flex', flexDirection: 'column', gap: '16' })}
    >
      <Input
        label="Customer reference"
        size="responsive"
        fullWidth
        required
        value={customerReference}
        onChange={(event) => setCustomerReference(event.target.value)}
        state={submitted && referenceMissing ? 'error' : undefined}
        helperText={
          submitted && referenceMissing
            ? 'Enter a customer reference.'
            : undefined
        }
      />

      <NumberInput
        label="Number of containers"
        size="responsive"
        fullWidth
        required
        min={1}
        max={99}
        step={1}
        precision={0}
        stepControl
        value={Number.isNaN(containerCount) ? '' : containerCount}
        onValueChange={(_text, number) => setContainerCount(number)}
        state={submitted && countInvalid ? 'error' : undefined}
        helperText={
          submitted && countInvalid
            ? 'Enter a whole number from 1 to 99.'
            : 'From 1 to 99 containers'
        }
      />

      <Select
        label="Container type"
        size="responsive"
        fullWidth
        required
        placeholder="Select a container type"
        items={CONTAINER_TYPES}
        value={containerType}
        onValueChange={setContainerType}
        state={submitted && typeMissing ? 'error' : undefined}
        helperText={
          submitted && typeMissing ? 'Select a container type.' : undefined
        }
      >
        {CONTAINER_TYPES.map((item) => (
          <SelectOption key={item.value} item={item}>
            <ListItemText primaryText={item.label} />
          </SelectOption>
        ))}
      </Select>

      <DatePicker
        label="Estimated departure date"
        size="responsive"
        fullWidth
        value={departure}
        onChange={(value) => setDeparture(value)}
      />

      <div
        className={css({
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8',
        })}
      >
        <Button type="button" variant="outline" color="neutral" size="responsive" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="responsive">
          Submit
        </Button>
      </div>
    </form>
  );
}

export default CreateBookingForm;
