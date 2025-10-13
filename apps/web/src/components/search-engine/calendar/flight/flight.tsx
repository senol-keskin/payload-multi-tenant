import { useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import clsx from 'clsx'
import { CloseButton, Paper, Transition, Portal } from '@mantine/core'

import { useMediaQuery, useClickOutside } from '@mantine/hooks'
import type { DatesRangeValue, DateValue } from '@mantine/dates'

import { IoArrowForwardSharp } from 'react-icons/io5'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'
import { FlightCalendarWrappers } from './_datepicker'

type Props = {
  tripKind?: 'one-way' | 'round-trip'
  onDateSelect?: (dates: DatesRangeValue) => void
  defaultDates: DatesRangeValue
}
const defaultFormat = 'DD MMM, ddd'

const FlightCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  tripKind = 'one-way',
  defaultDates,
}) => {
  const [formattedDateValues, setFormattedValues] = useState<
    [string | null, string | null]
  >([
    dayjs(defaultDates?.at(0)).format(defaultFormat),
    dayjs(defaultDates?.at(1)).format(defaultFormat),
  ])

  const matches = useMediaQuery('(min-width: 62em)')
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

  const handleDateSelections = (dates: DatesRangeValue | DateValue) => {
    let departureDate
    let returnDate

    if (Array.isArray(dates)) {
      departureDate = dates.at(0)
      returnDate = dates.at(1)
      onDateSelect(dates)
      setFormattedValues([
        dayjs(departureDate).format(defaultFormat),
        dayjs(returnDate).format(defaultFormat),
      ])
    } else if (dayjs(dates).isValid()) {
      departureDate = dates
      onDateSelect([dates, dates])
      setFormattedValues([
        dayjs(departureDate).format(defaultFormat),
        dayjs(departureDate).format(defaultFormat),
      ])
    }
  }

  return (
    <Provider>
      <div className='relative h-full'>
        <Input
          label={
            tripKind === 'round-trip' ? (
              <div className='flex w-full gap-[76px] md:px-2'>
                <span>Gidiş</span>
                <span>Dönüş</span>
              </div>
            ) : (
              <div className='md:px-2'>Gidiş</div>
            )
          }
          onClick={() => setContainerTransitionState(true)}
          title={
            tripKind === 'round-trip' ? (
              <div className='flex w-full items-center justify-between gap-2 md:px-2'>
                <span>{formattedDateValues[0] ?? 'Gidiş'}</span>
                <span>-</span>
                <span>{formattedDateValues[1] ?? 'Dönüş'}</span>
              </div>
            ) : (
              <span className='md:px-2'>
                {formattedDateValues[0] ?? 'Gidiş'}
              </span>
            )
          }
        />
        <Transition
          keepMounted={false}
          mounted={containerTransitionState}
          transition={matches ? 'pop-top-left' : 'pop'}
          onExit={() => {
            handleDateSelections([
              defaultDates[0],
              defaultDates[1]
                ? defaultDates[1]
                : dayjs(defaultDates[0]).add(2, 'd').toDate(),
            ])
          }}
        >
          {(styles) => (
            <div
              className='fixed start-0 end-0 top-0 bottom-0 z-50 mx-auto rounded-lg border md:absolute md:start-[-75px] md:end-auto md:bottom-auto'
              ref={clickOutsideRef}
              style={{ ...styles }}
            >
              <Paper className='mx-auto flex h-full flex-col rounded-lg shadow-xl'>
                <div className='px-3 pt-3'>
                  <div className='flex justify-end p-2 md:hidden'>
                    <CloseButton
                      size='lg'
                      onClick={() => setContainerTransitionState(false)}
                    />
                  </div>
                  <div className='flex items-center justify-center gap-8 pb-5 md:justify-start md:pb-0'>
                    <div className='flex'>
                      <div
                        className={clsx(
                          'border-b-4 px-2 text-start text-lg font-bold',
                          defaultDates[0]
                            ? 'border-blue-800'
                            : 'border-gray-300'
                        )}
                      >
                        {formattedDateValues[0] ? (
                          formattedDateValues[0]
                        ) : (
                          <span className='text-gray-400'>Gidiş</span>
                        )}
                      </div>
                    </div>
                    {tripKind === 'round-trip' && (
                      <>
                        <div className='text-xl'>
                          <IoArrowForwardSharp />
                        </div>
                        <div className='flex'>
                          <button
                            type='button'
                            className={clsx(
                              'border-b-4 px-2 text-start text-lg font-bold',
                              defaultDates[1]
                                ? 'border-blue-800'
                                : 'border-gray-300'
                            )}
                          >
                            {defaultDates[1] ? (
                              formattedDateValues[1]
                            ) : (
                              <span className='text-gray-400'>Dönüş</span>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <FlightCalendarWrappers
                  defaultDates={defaultDates}
                  onChange={handleDateSelections}
                  onClose={setContainerTransitionState}
                  tripKind={tripKind}
                />
              </Paper>
            </div>
          )}
        </Transition>
      </div>

      {containerTransitionState && (
        <Portal>
          <div className='fixed start-0 end-0 top-0 bottom-0 bg-black/50 md:hidden' />
        </Portal>
      )}
    </Provider>
  )
}

export { FlightCalendar }
