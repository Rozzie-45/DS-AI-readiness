import React, { useState } from 'react';
import { Button, TextField, NumberField, Select, SelectItem } from '@ocean-network-express/magenta-react';
import { DatePicker } from '@ocean-network-express/magenta-react-dates';

const CONTAINER_TYPES = ['20GP', '40GP', '40HC', '45HC'];

export interface CreateBookingFormProps {
  onSubmit?: (values: {
    customerReference: string;
    containerCount: number;
    containerType: string;
    estimatedDeparture: string;
  }) => void;
  onCancel?: () => void;
}

export function CreateBookingForm({ onSubmit, onCancel }: CreateBookingFormProps) {
  const [customerReference, setCustomerReference] = useState('');
  const [containerCount, setContainerCount] = useState<number>(1);
  const [containerType, setContainerType] = useState<string>('');
  const [estimatedDeparture, setEstimatedDeparture] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const refError = !customerReference.trim() ? 'Customer reference is required' : undefined;
  const countError =
    !Number.isInteger(containerCount) || containerCount < 1 || containerCount > 99
      ? 'Enter a whole number from 1 to 99'
      : undefined;
  const typeError = !containerType ? 'Select a container type' : undefined;
  const dateError = !estimatedDeparture ? 'Select an estimated departure date' : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (refError || countError || typeError || dateError) return;
    onSubmit?.({ customerReference: customerReference.trim(), containerCount, containerType, estimatedDeparture });
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Create booking">
      <TextField
        label="Customer reference"
        isRequired
        value={customerReference}
        onChange={setCustomerReference}
        errorMessage={submitted ? refError : undefined}
        isInvalid={submitted && !!refError}
      />
      <NumberField
        label="Number of containers"
        isRequired
        minValue={1}
        maxValue={99}
        step={1}
        value={containerCount}
        onChange={setContainerCount}
        errorMessage={submitted ? countError : undefined}
        isInvalid={submitted && !!countError}
      />
      <Select
        label="Container type"
        isRequired
        selectedKey={containerType || null}
        onSelectionChange={(key: React.Key | null) => setContainerType(key ? String(key) : '')}
        errorMessage={submitted ? typeError : undefined}
        isInvalid={submitted && !!typeError}
      >
        {CONTAINER_TYPES.map((t) => (
          <SelectItem key={t} id={t}>
            {t}
          </SelectItem>
        ))}
      </Select>
      <DatePicker
        label="Estimated departure date"
        isRequired
        onChange={(value: { toString(): string } | null) => setEstimatedDeparture(value ? value.toString() : '')}
        errorMessage={submitted ? dateError : undefined}
        isInvalid={submitted && !!dateError}
      />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button type="button" variant="secondary" onPress={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </div>
    </form>
  );
}

export default CreateBookingForm;
