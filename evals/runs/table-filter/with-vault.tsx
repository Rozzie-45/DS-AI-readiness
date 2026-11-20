import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Pagination,
  SearchInput,
  Table,
  TableContainer,
  Tag,
  TagContent,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@ocean-network-express/magenta-react';
import { css } from '../../styled-system/css';

export type ShipmentStatus = 'Scheduled' | 'Departed' | 'Delayed' | 'Cancelled';

export interface Shipment {
  id: string;
  shipmentNumber: string;
  vessel: string;
  portOfLoading: string;
  /** Estimated time of departure, already formatted for display */
  etd: string;
  status: ShipmentStatus;
}

export interface ShipmentListProps {
  shipments: Shipment[];
}

const PAGE_SIZE = 20;
const SEARCH_DELAY = 400;

const statusColor = {
  Scheduled: 'blue',
  Departed: 'green',
  Delayed: 'orange',
  Cancelled: 'red',
} as const;

export function ShipmentList({ shipments }: ShipmentListProps) {
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // Apply the search 400ms after the last change and go back to page 1.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(searchText.trim());
      setPage(1);
    }, SEARCH_DELAY);
    return () => clearTimeout(timer);
  }, [searchText]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return needle
      ? shipments.filter((s) => s.shipmentNumber.toLowerCase().includes(needle))
      : shipments;
  }, [shipments, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const backToDefault = () => {
    setSearchText('');
    setQuery('');
    setPage(1);
  };

  return (
    <TableContainer
      title={<span id="shipments-title">Shipments</span>}
      subTitle="Search by shipment number"
    >
      <div className={css({ display: 'flex', alignItems: 'center', gap: '8', mb: '8' })}>
        <SearchInput
          aria-label="Search by shipment number"
          placeholder="Search shipment number"
          size="responsive"
          items={[]}
          value={searchText}
          onValueChange={(value) => setSearchText(value ?? '')}
        />
      </div>

      <Table aria-labelledby="shipments-title">
        <Thead>
          <Tr>
            <Th scope="col">Shipment number</Th>
            <Th scope="col">Vessel</Th>
            <Th scope="col">Port of loading</Th>
            <Th scope="col">ETD</Th>
            <Th scope="col">Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.length === 0 ? (
            <Tr>
              <Td colSpan={5}>
                <div
                  role="status"
                  className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8',
                    py: '24',
                  })}
                >
                  <Text level="h5" component="p">
                    No Data Found
                  </Text>
                  <Text className={css({ color: 'neutral.700' })}>
                    Please try another shipment number.
                  </Text>
                  <Button variant="outline" size="responsive" onClick={backToDefault}>
                    Back to default
                  </Button>
                </div>
              </Td>
            </Tr>
          ) : (
            rows.map((shipment) => (
              <Tr key={shipment.id}>
                <Td>{shipment.shipmentNumber}</Td>
                <Td>{shipment.vessel}</Td>
                <Td>{shipment.portOfLoading}</Td>
                <Td>{shipment.etd}</Td>
                <Td>
                  <Tag
                    size="responsive"
                    color={statusColor[shipment.status]}
                    className={css({ textTransform: 'uppercase' })}
                  >
                    <TagContent>{shipment.status}</TagContent>
                  </Tag>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {filtered.length > 0 && (
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8',
          })}
        >
          <Text level="body1-semibold">Total {filtered.length} results</Text>
          <Pagination
            aria-label="Shipments pages"
            size="responsive"
            withEdges
            total={pageCount}
            page={currentPage}
            onPageChange={(next) => {
              if (next) setPage(next);
            }}
            className={css({ ml: 'auto' })}
          />
        </div>
      )}
    </TableContainer>
  );
}
