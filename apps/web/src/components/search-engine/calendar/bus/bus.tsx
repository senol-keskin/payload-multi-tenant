'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import { CloseButton, Paper, Transition, Portal } from '@mantine/core'

import { useClickOutside } from '@mantine/hooks'
import type { DateValue } from '@mantine/dates'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'
import { RiCalendarEventLine } from 'react-icons/ri'
import { clsx } from 'clsx'
import { BusCalendarWrapper } from './_datepicker'

type Props = {
  onDateSelect?: (date: DateValue) => void
  defaultDate: DateValue
}

const BusCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  defaultDate,
}) => {
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )
  const handleDateSelections = (date: DateValue) => {
    onDateSelect(date)
  }

  return (
    <Provider>
      <div className='relative h-full'>
        <RiCalendarEventLine
          size={20}
          className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
        />{' '}
        <Input
          label='Gidiş Tarihi'
          onClick={() => setContainerTransitionState(true)}
          title={`${dayjs(defaultDate).format('DD MMMM')}`}
        />
        <Transition
          mounted={containerTransitionState}
          transition='pop-top-right'
        >
          {(styles) => (
            <div
              className='z-overlay fixed start-0 end-0 top-0 bottom-0 rounded-lg sm:p-20 md:absolute md:bottom-auto md:-ms-1 md:-mt-1 md:w-[350px] md:p-0 2xl:start-0'
              ref={clickOutsideRef}
              style={{ ...styles }}
            >
              <Paper className='mx-auto flex h-full flex-col rounded-lg border shadow-xl'>
                <div>
                  <div className='flex justify-end p-2 md:hidden'>
                    <CloseButton
                      size='lg'
                      onClick={() => setContainerTransitionState(false)}
                    />
                  </div>
                  <div className='flex items-center justify-center gap-8 px-3 pb-5 md:pt-3 md:pb-0'>
                    <div className='flex'>
                      <button
                        type='button'
                        className={clsx(
                          'border-b-4 px-2 text-start text-lg font-bold',
                          defaultDate ? 'border-blue-800' : 'border-gray-300'
                        )}
                      >
                        {defaultDate ? (
                          dayjs(defaultDate).format('DD MMM ddd')
                        ) : (
                          <span className='text-gray-400'>Gidiş Tarihi</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <BusCalendarWrapper
                  defaultDate={defaultDate}
                  onChange={handleDateSelections}
                  onClose={setContainerTransitionState}
                />
              </Paper>
            </div>
          )}
        </Transition>
      </div>

      {containerTransitionState && (
        <Portal>
          <div className='z-modal fixed start-0 end-0 top-0 bottom-0 bg-black/90 md:hidden' />
        </Portal>
      )}
    </Provider>
  )
}

export { BusCalendar }
