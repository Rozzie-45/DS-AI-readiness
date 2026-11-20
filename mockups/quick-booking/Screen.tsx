import {
  Button,
  ButtonGroup,
  Divider,
  FormCheck,
  IconButton,
  Input,
  ListItemText,
  Radio,
  Select,
  SelectOption,
  Step,
  Stepper,
  Text,
} from '@ocean-network-express/magenta-react';
import { AddOutline, DesktopVideoOutline, QuestionCircleOutline } from '@ocean-network-express/magenta-react-icons';
import { useState } from 'react';

import { css } from 'styled-system/css';

export const title = 'Quick Booking';

const summary = [
  ['Company', 'MasterCard', 'Branch', 'Branch Name'],
  ['Bank', 'South Dakota', 'Account Use', 'Payable, Recivables'],
  ['Country', 'USA', 'Zip Code', '04359'],
  ['Founded Year', '2023', 'Number of Employees', '1,500'],
  ['CEO', 'Chris Kempczinski', 'Key Products/Services', 'Electronics'],
  ['Cargo Type', 'Dry/General', 'Contract No.', 'JPN0016N21'],
];

const countries = [
  { label: 'Singapore', value: 'sg' },
  { label: 'Japan', value: 'jp' },
  { label: 'United States', value: 'us' },
];

const page = css({ bg: 'white', minH: '100vh', display: 'flex', flexDirection: 'column' });
const header = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16',
  px: '24',
  py: '16',
  borderBottom: 'token(borders.1) solid token(colors.neutral.200)',
});
const headerActions = css({ display: 'flex', alignItems: 'center', gap: '12' });
const stepperBar = css({
  px: '24',
  py: '16',
  borderBottom: 'token(borders.1) solid token(colors.neutral.200)',
});
const body = css({ display: 'flex', gap: '24', p: '24', alignItems: 'flex-start' });
// token-audit-ignore: the summary column width is a layout width no token covers
const summaryCard = css({
  // token-audit-ignore: layout width
  width: '23%',
  flexShrink: 0,
  border: 'token(borders.1) solid token(colors.neutral.200)',
  borderRadius: 'lg',
  p: '24',
  display: 'flex',
  flexDirection: 'column',
  gap: '24',
});
const summaryGrid = css({ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '16', rowGap: '24' });
const main = css({ flex: '1', minW: '0', display: 'flex', flexDirection: 'column', gap: '24' });
const formCard = css({
  border: 'token(borders.1) solid token(colors.neutral.200)',
  borderRadius: 'lg',
  p: '24',
  display: 'flex',
  flexDirection: 'column',
  gap: '16',
});
const fields = css({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20' });
const span2 = css({ gridColumn: 'span 2' });
const footer = css({ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16' });
const label = css({ color: 'neutral.700' });
const value = css({ color: 'neutral.900' });

export default function QuickBookingScreen() {
  const [country, setCountry] = useState<string[]>([]);
  const [addressType, setAddressType] = useState('home');

  const addressTypes = [
    ['home', 'Home'],
    ['work', 'Work'],
    ['others', 'Others'],
  ];

  return (
    <div className={page}>
      <header className={header}>
        <div>
          <Text level="h4" component="h1" className={css({ color: 'neutral.1000' })}>Quick Booking</Text>
          <Text level="body1" className={css({ color: 'neutral.800' })}>Title Description</Text>
        </div>
        <div className={headerActions}>
          <Button size="responsive" variant="outline" color="neutral">Booking template</Button>
          <Button size="responsive" variant="outline" leftIcon={<AddOutline />}>Add New Booking</Button>
          <Divider direction="vertical" className={css({ alignSelf: 'stretch' })} />
          <ButtonGroup size="responsive">
            <IconButton aria-label="Watch tutorial"><DesktopVideoOutline /></IconButton>
            <IconButton aria-label="Help"><QuestionCircleOutline /></IconButton>
          </ButtonGroup>
        </div>
      </header>

      <div className={stepperBar}>
        <Stepper activeStep={1} fullWidth size="responsive" aria-label="Quick booking steps">
          <Step label="Search Schedule" />
          <Step label="Booking Parties" />
          <Step label="Review Booking" />
        </Stepper>
      </div>

      <div className={body}>
        <aside className={summaryCard} aria-labelledby="summary-title">
          <Text level="h5" component="h2" id="summary-title" className={css({ color: 'neutral.1000' })}>Summary</Text>
          <Divider />
          <div className={summaryGrid}>
            {summary.flatMap(([l1, v1, l2, v2]) => [
              <div key={l1}>
                <Text level="body2" className={label}>{l1}</Text>
                <Text level="body1" className={value}>{v1}</Text>
              </div>,
              <div key={l2}>
                <Text level="body2" className={label}>{l2}</Text>
                <Text level="body1" className={value}>{v2}</Text>
              </div>,
            ])}
          </div>
        </aside>

        <main className={main}>
          <section className={formCard} aria-labelledby="contact-title">
            <div>
              <Text level="h5" component="h2" id="contact-title" className={css({ color: 'neutral.1000' })}>
                Contact Information<span className={css({ color: 'red.600' })} aria-hidden="true"> *</span>
              </Text>
              <Text level="body2" className={label}>Required fields are marked with asterisk</Text>
            </div>
            <Divider />
            <div className={fields}>
              <Input id="first-name" label="First Name" placeholder="Company Name" size="responsive" fullWidth />
              <Input id="last-name" label="Last Name" placeholder="Branch Name" size="responsive" fullWidth />
              <Input id="address" label="Address" placeholder="Address" size="responsive" fullWidth />
              <FormCheck label="Address type" name="address-type" size="responsive" radioGroupClassName={css({ display: 'grid', gridAutoFlow: 'column', columnGap: '20' })}>
                {addressTypes.map(([v, l]) => (
                  <Radio key={v} value={v} label={l} checked={addressType === v} onChange={() => setAddressType(v)} />
                ))}
              </FormCheck>
              <div className={span2}>
                <Input id="apt" label="Apt / Suite" placeholder="Founded Year" size="responsive" fullWidth />
              </div>
              <div className={span2}>
                <Select
                  id="country"
                  label="Country"
                  placeholder="Country"
                  size="responsive"
                  fullWidth
                  items={countries}
                  value={country}
                  onValueChange={setCountry}
                >
                  {countries.map((c) => (
                    <SelectOption key={c.value} item={c}>
                      <ListItemText primaryText={c.label} />
                    </SelectOption>
                  ))}
                </Select>
              </div>
            </div>
          </section>

          <div>
            <Button size="responsive" variant="ghost" leftIcon={<AddOutline />}>Add New Contact</Button>
          </div>

          <div className={footer}>
            <Button size="responsive" variant="ghost">Previous</Button>
            <Button size="responsive">Next</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
