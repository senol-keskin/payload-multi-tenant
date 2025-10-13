import { Suspense } from 'react'

import { Container, Skeleton } from '@mantine/core'
import { type SearchParams } from 'nuqs'
import { SearchResult } from './search-result'

type PageProps = {
  searchParams: Promise<SearchParams>
}
const CarSearchResultPage: React.FC<PageProps> = async ({ searchParams }) => {
  const params = await searchParams

  return (
    <Suspense fallback={<Loader />}>
      <SearchResult searchParams={params} />
    </Suspense>
  )
}

export default CarSearchResultPage

const Loader = () => (
  <Container className='py-6 md:py-10'>
    <div className='grid items-start gap-4 md:grid-cols-4 md:gap-5'>
      <div className='md:col-span-1'>
        <div className='grid gap-3'>
          <Skeleton h={24} />
          <Skeleton h={12} w='60%' />
          <Skeleton h={12} w='88%' />
          <Skeleton h={12} w='75%' />
          <Skeleton h={12} w='65%' />
          <Skeleton h={12} w='80%' />
          <div className='mt-4'>
            <Skeleton h={20} w='50%' />
            <Skeleton h={12} w='70%' className='mt-2' />
            <Skeleton h={12} w='60%' className='mt-2' />
          </div>
        </div>
      </div>
      <div className='grid gap-3 md:col-span-3'>
        <div className='grid grid-cols-3 items-center gap-2 md:grid-cols-5'>
          <Skeleton h={40} className='col-span-1 md:col-span-3' />
          <Skeleton h={40} className='col-span-2' />
        </div>
        <div className='grid gap-4 pb-20 md:gap-6'>
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className='grid grid-cols-4 items-start gap-3 rounded-md border p-3 md:p-5'
            >
              <div className='col-span-1'>
                <Skeleton h={150} />
              </div>
              <div className='col-span-3 grid gap-3'>
                <Skeleton h={16} maw={250} />
                <Skeleton h={16} maw={120} />
                <Skeleton h={16} maw={180} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Container>
)
