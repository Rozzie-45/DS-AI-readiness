import { useState } from 'react';
import { Button, InlineBanner, message } from '@ocean-network-express/magenta-react';
import {
  CheckCircleOutline,
  ErrorCircleOutline,
  SaveOutline,
} from '@ocean-network-express/magenta-react-icons';
import { css } from '../../styled-system/css';

// Render <FeedbackMessages /> once at the app root so the success toast can show.

type SaveShipmentProps = {
  /** Saves the shipment. Rejects when the server returns an error. */
  onSave: () => Promise<void>;
};

export function SaveShipment({ onSave }: SaveShipmentProps) {
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const save = async () => {
    setSaving(true);
    setFailed(false);
    try {
      await onSave();
      // Brief confirmation of the user's action: a toast, which closes by itself.
      message('Shipment saved', {
        color: 'green',
        icon: <CheckCircleOutline />,
        size: 'responsive',
      });
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '16' })}>
      {failed && (
        // An error the user must act on stays on the page next to the form (not a toast).
        <InlineBanner
          color="red"
          size="responsive"
          icon={<ErrorCircleOutline />}
          title="Shipment not saved"
          message="Something went wrong on our side, so your changes were not saved. Try again."
          actions={[
            {
              label: 'Try again',
              variant: 'outline',
              color: 'danger',
              size: 'responsive',
              loading: saving,
              onClick: save,
            },
          ]}
          onClose={() => setFailed(false)}
        />
      )}
      <div>
        <Button
          size="responsive"
          leftIcon={<SaveOutline />}
          loading={saving}
          onClick={save}
        >
          Save shipment
        </Button>
      </div>
    </div>
  );
}
