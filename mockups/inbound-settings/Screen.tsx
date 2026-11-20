import {
  Avatar,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  DropdownMenu,
  DropdownMenuTrigger,
  IconButton,
  Indicator,
  ListItemText,
  Menu,
  MenuBody,
  MenuItem,
  MenuList,
  Pagination,
  Select,
  SelectOption,
  Table,
  TableContainer,
  TabHeader,
  TabList,
  TabListItem,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
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
import {
  AddOutline,
  BuildingOutline,
  FileCopyOutline,
  FileEditOutline,
  GearSettingOutline,
  HamburgerMenuOutline,
  MenuMoreVerticalOutline,
  NotificationOutline,
  OneLogoFill,
  PenEditOutline,
  RenewOutline,
  SortFilterListOutline,
  TableEditOutline,
  TrashDeleteOutline,
  UserCircleOutline,
  VesselFrontOutline,
} from '@ocean-network-express/magenta-react-icons';
import { type ReactNode, useState } from 'react';

import { css } from 'styled-system/css';

export const title = 'Inbound Settings';

// Columns and widths as in the Figma frame "inbound-settings/office-setup-rule" (node 40000121:24474).
const columns: { name: string; width: number; required?: boolean }[] = [
  { name: 'ID', width: 120 },
  { name: 'Task Type', width: 140 },
  { name: 'POD Country', width: 180, required: true },
  { name: 'POD Code', width: 200 },
  { name: 'DEL Country', width: 200 },
  { name: 'DEL Code', width: 200 },
  { name: "BL Customer's Country", width: 200 },
  { name: 'Customer Group', width: 200 },
  { name: 'Customer Code', width: 200 },
  { name: 'Cargo Nature', width: 200 },
  { name: 'Transport Mode', width: 200 },
  { name: 'Inbound Office', width: 200 },
  { name: 'Inbound Office Email', width: 320, required: true },
  { name: 'Rule Type', width: 140 },
  { name: 'Updated By', width: 200 },
  { name: 'Updated Time', width: 160 },
];

// A cell: plain text, a status tag, a value with a "+N more" badge under it, a user, or a date and time.
type Cell =
  | string
  | { tag: string; color?: 'neutral' | 'blue' | 'primary' | 'secondary' }
  | { value: string; more: string }
  | { user: string; office: string }
  | { date: string; time: string };
const any: Cell = { tag: '*' };
const AN: Cell = { tag: 'A/N', color: 'blue' };
const DO: Cell = { tag: 'D/O', color: 'primary' };
// The last seven columns are the same in every row of the frame.
const tail: Cell[] = [
  'SGNBB',
  { value: 'office1@one.com', more: '+2 more' },
  { tag: 'standard', color: 'secondary' },
  { user: 'Huy Pham', office: 'AARBB' },
  { date: '2026-30-07', time: '12:25' },
];
const rows: Cell[][] = [
  ['0000001', any, 'VN', any, any, any, any, any, any, any, any, ...tail],
  ['0000002', AN, 'VN', 'VNCMP', any, any, any, any, any, any, any, ...tail],
  ['0000003', any, 'AU', any, any, any, any, any, any, any, any, ...tail],
  ['0000004', any, 'AU', any, any, any, any, any, any, any, any, ...tail],
  ['0000005', AN, 'AU', any, any, 'VNCMP', any, any, any, any, any, ...tail],
  ['0000006', DO, 'AU', any, any, any, { value: 'VN', more: '+4 more' }, any, any, any, any, ...tail],
  ['0000007', any, 'BR', any, any, any, any, any, any, any, any, ...tail],
  ['0000008', AN, 'BR', 'VNCMP', any, 'VNCMP', any, 'G-DE012345', any, any, any, ...tail],
  ['0000009', DO, 'BR', any, any, any, 'VN', any, any, any, any, ...tail],
  ['0000010', any, 'BG', any, any, any, any, any, any, any, any, ...tail],
  ['0000011', AN, 'BG', { value: 'VNCMP', more: '+4 more' }, any, any, any, any, any, 'Reefer', any, ...tail],
];
// Page sizes as in the system's story: Show 10, 20 and 30 items.
const pageSizes = [10, 20, 30].map((n) => ({ label: `Show ${n} items`, value: String(n) }));
const rowActions = [
  { label: 'Issue Delivery Order', value: 'issue-do' },
  { label: 'Full CTNR Release', value: 'full-release' },
  { label: 'Arrival Information', value: 'arrival' },
];

const stack = css({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4' });
const inline = css({ display: 'flex', alignItems: 'center', gap: '8' });
const required = css({ ml: '4', color: 'red.500', fontWeight: 'semi-bold' });
const shellIcon = css({ color: 'white', w: '24', h: '24' });
const railIcon = css({ color: 'neutral.700', w: '24', h: '24' });
// A status tag (Figma Tag Type=Status): upper case, as the Tag note maps it.
const status = css({ textTransform: 'uppercase' });

function renderCell(c: Cell): ReactNode {
  if (typeof c === 'string') return c;
  if ('tag' in c) return <Tag size="responsive" color={c.color ?? 'neutral'} className={status}>{c.tag}</Tag>;
  if ('more' in c)
    return (
      <span className={stack}>
        {c.value}
        <Indicator text label={c.more} color="neutral" variant="light" size="responsive" />
      </span>
    );
  if ('user' in c)
    return (
      <span className={stack}>
        <span className={inline}>
          {/* Fixed sizes: the frame uses Avatar xs and Tag Medium in this cell at every width. */}
          <Avatar size="xs" alt="" />
          {c.user}
        </span>
        <Tag size="md" color="neutral" className={status}>{c.office}</Tag>
      </span>
    );
  return (
    <span className={stack}>
      <span>{c.date}</span>
      <span>{c.time}</span>
    </span>
  );
}

function IconAction({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip size="responsive">
      <TooltipTrigger asChild>
        <IconButton aria-label={label}>{children}</IconButton>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function RowMenu({ id }: { id: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton aria-label={`Actions for rule ${id}`} variant="ghost" color="neutral" size="xs">
          <MenuMoreVerticalOutline aria-hidden="true" />
        </IconButton>
      </DropdownMenuTrigger>
      <Menu size="responsive">
        <MenuBody>
          <MenuList size="responsive">
            {rowActions.map((a) => (
              <MenuItem key={a.value} item={a}>
                <ListItemText primaryText={a.label} />
              </MenuItem>
            ))}
          </MenuList>
        </MenuBody>
      </Menu>
    </DropdownMenu>
  );
}

export default function InboundSettings() {
  const [selected, setSelected] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState('30');
  // An emptied page input gives undefined; keep it apart from a real page (Pagination note).
  const [page, setPage] = useState<number | undefined>(1);
  const ids = rows.map((r) => r[0] as string);
  const all = selected.length === ids.length;
  const some = selected.length > 0 && !all;
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', minH: '100vh', bg: 'white' })}>
      {/* Gap: Magenta has no app shell. Plain header with library icons and tokens only. */}
      <header className={css({ display: 'flex', alignItems: 'center', gap: '24', px: '24', h: '48', bg: 'primary.500', color: 'white' })}>
        <HamburgerMenuOutline aria-hidden="true" className={shellIcon} />
        <OneLogoFill aria-label="ONE" className={css({ color: 'white', w: '32', h: '32' })} />
        <Text level="body1-semibold" component="span" className={css({ color: 'white' })}>CHORUS</Text>
        <span className={css({ flex: '1' })} />
        <BuildingOutline aria-hidden="true" className={shellIcon} />
        <Text level="body1-semibold" component="span" className={css({ color: 'white' })}>SINHO</Text>
        <NotificationOutline aria-label="Notifications" className={shellIcon} />
        <UserCircleOutline aria-label="Account" className={shellIcon} />
      </header>

      <div className={css({ display: 'flex', flex: '1', minH: '0' })}>
        {/* Gap: Magenta has no side navigation. */}
        <nav
          aria-label="Main"
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24',
            pt: '16',
            w: '64',
            flexShrink: '0',
            bg: 'white',
            borderRight: 'token(borders.1) solid token(colors.neutral.200)',
          })}
        >
          <VesselFrontOutline aria-label="Vessels" className={railIcon} />
          <FileEditOutline aria-label="Documents" className={railIcon} />
          <GearSettingOutline aria-label="Settings" className={railIcon} />
        </nav>

        <main className={css({ display: 'flex', flexDirection: 'column', flex: '1', minW: '0' })}>
          <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', pt: '24', px: '24', pb: '16' })}>
            <Text level="h4" component="h1" className={css({ color: 'neutral.900' })}>Inbound Settings</Text>
            <Text level="body1" className={css({ color: 'neutral.700' })}>
              Configure the rules that drive inbound office assignment, priority resolution, and task cut-off timing.
            </Text>
          </div>
          <Divider />

          {/* As in the frame, the tabs and the table sit flat on the page, edge to edge: Tabs loses its card look
              (shadows.sm and radii.lg), and the panel's padding is reset from here because TabPanel puts className on an inner element. */}
          <Tabs
            size="responsive"
            defaultIndex={0}
            className={css({ boxShadow: 'none', borderRadius: '0', '& .mag-tab-panel__base': { p: '0' } })}
          >
            <TabHeader>
              <TabList>
                <TabListItem size="responsive">Inbound Office Setup Rule</TabListItem>
              </TabList>
            </TabHeader>
            <TabPanels>
              <TabPanel>
                {/* As in the frame, the table runs to the left and right edges: no container padding, and no empty
                    title block (TableContainer keeps one when it has no title; see the Table note's Open questions). */}
                <TableContainer className={css({ p: '0', '& .mag-table__textContainer': { display: 'none' } })}>
                  {/* Toolbar (Data table toolbar v1.2): 16 padding; sync status at the left; Sync, row actions, Add Rule and settings at the right, 16 apart. */}
                  <div className={css({ display: 'flex', alignItems: 'center', gap: '16', p: '16' })}>
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '8' })}>
                      <RenewOutline aria-hidden="true" className={css({ w: '16', h: '16', color: 'neutral.700' })} />
                      <Text level="body1" component="span" className={css({ color: 'neutral.700' })}>Last sync: dd/mm/yyyy hh:mm</Text>
                    </div>
                    <span className={css({ flex: '1' })} />
                    <Button size="responsive" variant="outline" color="secondary" leftIcon={<RenewOutline />}>Sync</Button>
                    <ButtonGroup size="responsive" disabled={selected.length === 0}>
                      <IconAction label="Edit rule"><PenEditOutline aria-hidden="true" /></IconAction>
                      <IconAction label="Copy rule"><FileCopyOutline aria-hidden="true" /></IconAction>
                      <IconAction label="Delete rule"><TrashDeleteOutline aria-hidden="true" /></IconAction>
                    </ButtonGroup>
                    <Button size="responsive" variant="outline" color="primary" leftIcon={<AddOutline />}>Add Rule</Button>
                    <Tooltip size="responsive">
                      <TooltipTrigger asChild>
                        <IconButton aria-label="Priority Tier Configuration" size="responsive" variant="outline" color="neutral">
                          <GearSettingOutline aria-hidden="true" />
                        </IconButton>
                      </TooltipTrigger>
                      <TooltipContent>Priority Tier Configuration</TooltipContent>
                    </Tooltip>
                  </div>

                  <div>
                    <div tabIndex={0} role="region" aria-label="Inbound office setup rules" className={css({ overflowX: 'auto' })}>
                      <Table aria-label="Inbound office setup rules">
                        <Thead>
                          <Tr>
                            <Th scope="col" divider="none" width={48}>
                              <Checkbox
                                aria-label="Select all rules"
                                size="responsive"
                                checked={all}
                                indeterminate={some}
                                onChange={() => setSelected(selected.length ? [] : ids)}
                              />
                            </Th>
                            {columns.map((c) => (
                              <Th key={c.name} scope="col" width={c.width}>
                                <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4' })}>
                                  <span className={css({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>
                                    {c.name}
                                    {c.required && (
                                      <>
                                        <span className={required} aria-hidden="true">*</span>
                                        <span className={css({ srOnly: true })}>(required)</span>
                                      </>
                                    )}
                                  </span>
                                  <IconButton aria-label={`Filter ${c.name}`} variant="ghost" color="neutral" size="xs">
                                    <SortFilterListOutline aria-hidden="true" />
                                  </IconButton>
                                </div>
                              </Th>
                            ))}
                            {/* Fixed at the end: Action, then the show and hide columns cell (Header cell item ver 1.2, 48 wide). */}
                            <Th scope="col" columnPinningPosition="right" right={48} width={120} isColumnPinningLastOrFirst>Action</Th>
                            <Th scope="col" columnPinningPosition="right" right={0} width={48} divider="none">
                              <Tooltip size="responsive">
                                <TooltipTrigger asChild>
                                  <IconButton aria-label="Show and hide columns" variant="ghost" color="neutral" size="sm">
                                    <TableEditOutline aria-hidden="true" />
                                  </IconButton>
                                </TooltipTrigger>
                                <TooltipContent>Show and hide columns</TooltipContent>
                              </Tooltip>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {rows.map((r) => {
                            const id = r[0] as string;
                            const on = selected.includes(id);
                            return (
                              <Tr key={id} selected={on}>
                                <Td>
                                  <Checkbox aria-label={`Select rule ${id}`} size="responsive" checked={on} onChange={() => toggle(id)} />
                                </Td>
                                {r.map((c, i) => (
                                  <Td key={columns[i].name}>{renderCell(c)}</Td>
                                ))}
                                <Td columnPinningPosition="right" right={48} width={120} isColumnPinningLastOrFirst>
                                  <RowMenu id={id} />
                                </Td>
                                <Td columnPinningPosition="right" right={0} width={48} />
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </div>
                  </div>

                  {/* Footer, as the system's table footer (Pagination note): page size select and result count at the left,
                      the editable pagination with first and last buttons at the right (user's choice, 2026-11-19). */}
                  <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8', py: '8', px: '24' })}>
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '24' })}>
                      <Select
                        aria-label="Items per page"
                        size="responsive"
                        items={pageSizes}
                        value={[pageSize]}
                        onValueChange={([v]) => v && setPageSize(v)}
                      >
                        {pageSizes.map((o) => (
                          <SelectOption key={o.value} item={o} size="responsive">
                            <ListItemText primaryText={o.label} />
                          </SelectOption>
                        ))}
                      </Select>
                      <Text level="body1-semibold">Total 199 results</Text>
                    </div>
                    <Pagination
                      aria-label="Rule pages"
                      type="editable"
                      withEdges
                      size="responsive"
                      total={10}
                      page={page}
                      onPageChange={(p) => setPage(p)}
                      className={css({ ml: 'auto' })}
                    />
                  </div>
                </TableContainer>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
