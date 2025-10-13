import { Button } from '@mantine/core'
import {
  DatePicker,
  DatePickerBaseProps,
  DatesRangeValue,
  DateValue,
  PickerBaseProps,
} from '@mantine/dates'

import classes from '@/styles/Datepicker.module.css'
import { useMediaQuery } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useOfficialDays } from '../useOfficialDays'

type IProps = {
  defaultDates: DatesRangeValue
  tripKind?: 'one-way' | 'round-trip'
  onClose: (state: boolean) => void
  onChange: (value: DatesRangeValue | DateValue) => void
}

const FlightCalendarWrappers: React.FC<IProps> = ({
  defaultDates,
  onClose,
  onChange,
  tripKind,
}) => {
  const matches = useMediaQuery('(min-width: 62em)')
  const numberOfColumns = matches ? 2 : 13
  const today = dayjs()
  const maxDate = today.add(1, 'year')
  const { dayRenderer, handleOfficialDates, officialDayRenderer } =
    useOfficialDays({ numberOfColumns: 2, defaultDate: defaultDates[0] })

  return (
    <>
      <div className='relative grow overflow-y-auto overscroll-contain scroll-smooth p-3'>
        <DatePicker
          highlightToday
          defaultValue={tripKind === 'one-way' ? defaultDates[0] : defaultDates}
          defaultDate={dayjs(defaultDates[0]).toISOString()}
          type={tripKind === 'one-way' ? 'default' : 'range'}
          allowSingleDateInRange
          numberOfColumns={numberOfColumns}
          minDate={today.toDate()}
          maxDate={maxDate.toDate()}
          maxLevel='month'
          classNames={classes}
          renderDay={dayRenderer}
          onChange={onChange}
          onDateChange={handleOfficialDates}
          onNextMonth={handleOfficialDates}
          onPreviousMonth={handleOfficialDates}
        />
      </div>
      <div className='flex items-center border-t p-3 md:justify-between'>
        <div className='hidden flex-col gap-1 md:flex'>
          {officialDayRenderer()}
        </div>
        <Button
          type='button'
          radius='xl'
          className='w-full md:w-auto'
          size='sm'
          onClick={() => onClose(false)}
        >
          Tamam
        </Button>
      </div>
    </>
  )
}

export { FlightCalendarWrappers }
