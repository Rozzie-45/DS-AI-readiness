import React, { useMemo, useState } from 'react';
import { Table, TextField, Pagination, Badge } from '@ocean-network-express/magenta-react';

type Shipment = {
  id: string;
  shipmentNumber: string;
  vessel: string;
  portOfLoading: string;
  etd: string;
  status: 'Booked' | 'Loaded' | 'Sailing' | 'Arrived';
};

const PAGE_SIZE = 20;

const SHIPMENTS: Shipment[] = Array.from({ length: 95 }, (_, i) => ({
  id: String(i),
  shipmentNumber: `SHP${String(100000 + i)}`,
  vessel: ['ONE Apus', 'ONE Trust', 'ONE Harmony'][i % 3],
  portOfLoading: ['Singapore', 'Hong Kong', 'Yokohama', 'Rotterdam'][i % 4],
  etd: new Date(2026, 10, 1 + (i % 28)).toISOString().slice(0, 10),
  status: (['Booked', 'Loaded', 'Sailing', 'Arrived'] as const)[i % 4],
}));

export function ShipmentList({ shipments = SHIPMENTS }: { shipments?: Shipment[] }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      shipments.filter((s) =>
        s.shipmentNumber.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [shipments, query],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div>
      <TextField
        label="Search by shipment number"
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
          setPage(1);
        }}
      />
      <Table>
        <thead>
          <tr>
            <th>Shipment number</th>
            <th>Vessel</th>
            <th>Port of loading</th>
            <th>ETD</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id}>
              <td>{s.shipmentNumber}</td>
              <td>{s.vessel}</td>
              <td>{s.portOfLoading}</td>
              <td>{s.etd}</td>
              <td>
                <Badge>{s.status}</Badge>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5}>No shipments found.</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination
        page={current}
        pageCount={pageCount}
        onPageChange={(p: number) => setPage(p)}
      />
    </div>
  );
}

export default ShipmentList;
