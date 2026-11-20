import React, { useState } from 'react';
import { Button, Alert } from '@ocean-network-express/magenta-react';

type Shipment = { id?: string; [key: string]: unknown };
type Status = 'idle' | 'saving' | 'success' | 'error';

interface SaveShipmentProps {
  shipment: Shipment;
  onSave: (shipment: Shipment) => Promise<void>;
}

export function SaveShipment({ shipment, onSave }: SaveShipmentProps) {
  const [status, setStatus] = useState<Status>('idle');

  const save = async () => {
    setStatus('saving');
    try {
      await onSave(shipment);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <Button onClick={save} disabled={status === 'saving'}>
        {status === 'saving' ? 'Saving...' : 'Save shipment'}
      </Button>

      {status === 'success' && (
        <Alert variant="success" role="status">
          Shipment saved.
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="error" role="alert">
          Shipment could not be saved. Your changes are still here.{' '}
          <Button variant="secondary" onClick={save}>
            Retry
          </Button>
        </Alert>
      )}
    </div>
  );
}
