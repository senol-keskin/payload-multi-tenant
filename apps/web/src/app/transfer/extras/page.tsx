import { Suspense } from 'react'
import { ExtraPage } from './_client'
import { Skeleton } from '@mantine/core'

export default function TransferExtraPage() {
  return (
    <Suspense>
      <ExtraPage />
    </Suspense>
  )
}
