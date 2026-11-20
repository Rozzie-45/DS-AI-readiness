import React, { useState } from 'react';
import { Button, Modal, Table, Typography } from '@ocean-network-express/magenta-react';
import { TrashIcon } from '@ocean-network-express/magenta-react-icons';

type Booking = {
  id: string;
  bookingNumber: string;
  origin: string;
  destination: string;
  status: string;
};

const initialBookings: Booking[] = [
  { id: '1', bookingNumber: 'ONEY1234567', origin: 'Singapore', destination: 'Rotterdam', status: 'Confirmed' },
  { id: '2', bookingNumber: 'ONEY7654321', origin: 'Tokyo', destination: 'Los Angeles', status: 'Pending' },
];

export function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [pending, setPending] = useState<Booking | null>(null);

  const confirmDelete = () => {
    if (pending) {
      setBookings((prev) => prev.filter((b) => b.id !== pending.id));
    }
    setPending(null);
  };

  return (
    <div>
      <Typography variant="h2">Bookings</Typography>
      <Table>
        <thead>
          <tr>
            <th>Booking no.</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.bookingNumber}</td>
              <td>{b.origin}</td>
              <td>{b.destination}</td>
              <td>{b.status}</td>
              <td>
                <Button
                  size="responsive"
                  variant="secondary"
                  aria-label={`Delete booking ${b.bookingNumber}`}
                  onClick={() => setPending(b)}
                >
                  <TrashIcon /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title="Delete booking?"
      >
        <Typography>
          Booking {pending?.bookingNumber} will be permanently deleted. This cannot be undone.
        </Typography>
        <Button size="responsive" variant="secondary" onClick={() => setPending(null)}>
          Cancel
        </Button>
        <Button size="responsive" variant="primary" onClick={confirmDelete}>
          Delete booking
        </Button>
      </Modal>
    </div>
  );
}

export default BookingList;
