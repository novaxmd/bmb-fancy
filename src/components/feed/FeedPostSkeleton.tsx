import React from 'react'
import PostLoader from '../../images/FeedPostSkeletonLoader.gif'

const FeedPostSkeleton = () => {
  return (
    <div className='flex flex-col bg-white w-full min-w-[640px] mb-10   '>
      <div className='flex gap-5 w-96 items-center h-16 px-4 py-2 mt-5'>
        <div className='flex rounded-full h-8 w-8 bg-base-300' />
        <div className='flex flex-col gap-2 justify-center flex-grow-1'>
          <div className='bg-base-300 w-20 h-3 mb-1' />
          <div className='bg-base-300 w-32 h-3' />
        </div>
      </div>
      <div className='w-full min-w-[640px] bg-cover'>
        <img
          className='w-full h-96 md:h-full min-w-[640px]'
          src={PostLoader}
          alt=''
        />
      </div>
    </div>
  )
}

export default FeedPostSkeleton
