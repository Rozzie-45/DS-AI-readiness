import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogAction,
  DialogContent,
  DialogHeader,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Tr,
} from '@ocean-network-express/magenta-react';
import { TrashDeleteOutline } from '@ocean-network-express/magenta-react-icons';
import { css } from '../../styled-system/css';

type Booking = {
  id: string;
  vessel: string;
  route: string;
  created: string;
};

const initialBookings: Booking[] = [
  { id: 'BK-1001', vessel: 'ONE Apus', route: 'Singapore to Rotterdam', created: '2026-11-02' },
  { id: 'BK-1002', vessel: 'ONE Minato', route: 'Yokohama to Los Angeles', created: '2026-11-04' },
  { id: 'BK-1003', vessel: 'ONE Competence', route: 'Hong Kong to Hamburg', created: '2026-11-06' },
];

export function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [pendingDelete, setPendingDelete] = useState<Booking | null>(null);

  const closeDialog = () => setPendingDelete(null);

  const confirmDelete = () => {
    if (pendingDelete) {
      setBookings((current) => current.filter((b) => b.id !== pendingDelete.id));
    }
    closeDialog();
  };

  return (
    <>
      <TableContainer
        title={<span id="bookings-title">Bookings</span>}
        subTitle="Bookings created this week"
      >
        <Table aria-labelledby="bookings-title">
          <Thead>
            <Tr>
              <Th scope="col">Booking</Th>
              <Th scope="col">Vessel</Th>
              <Th scope="col">Route</Th>
              <Th scope="col">
                <span className={css({ srOnly: true })}>Actions</span>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr key={booking.id}>
                <Td>
                  {booking.id}
                  <Text level="body2" className={css({ color: 'neutral.700' })}>
                    {booking.created}
                  </Text>
                </Td>
                <Td>{booking.vessel}</Td>
                <Td>{booking.route}</Td>
                <Td>
                  <Tooltip size="responsive">
                    <TooltipTrigger asChild>
                      <IconButton
                        aria-label={`Delete booking ${booking.id}`}
                        color="danger"
                        variant="ghost"
                        size="md"
                        onClick={() => setPendingDelete(booking)}
                      >
                        <TrashDeleteOutline size="md" aria-hidden="true" />
                      </IconButton>
                    </TooltipTrigger>
                    <TooltipContent>Delete booking</TooltipContent>
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Dialog
        open={pendingDelete !== null}
        onClose={closeDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogHeader>
          <Text level="h5">Delete booking</Text>
        </DialogHeader>
        <DialogContent>
          <Text>
            {pendingDelete
              ? `You are about to delete booking ${pendingDelete.id}. You will not be able to recover it.`
              : ''}
          </Text>
        </DialogContent>
        <DialogAction>
          <Button variant="ghost" color="danger" size="responsive" onClick={closeDialog}>
            Cancel
          </Button>
          <Button variant="fill" color="danger" size="responsive" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogAction>
      </Dialog>
    </>
  );
}

export default BookingList;
