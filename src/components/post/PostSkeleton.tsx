import React from 'react'
import PostLoader from '../../images/FeedPostSkeletonLoader.gif'

const PostSkeleton = () => {
  return (
    <div className='flex flex-col md:flex-row bg-white w-full'>
      <div className='w-full bg-cover'>
        <img className='w-full' src={PostLoader} alt='' />
      </div>
      <div className='flex gap-5 w-96 items-center h-16 px-4 py-2 mt-5'>
        <div className='flex rounded-full h-8 w-8 bg-base-300' />
        <div className='flex flex-col gap-2 justify-center flex-grow-1'>
          <div className='bg-base-300 w-20 h-3 mb-1' />
          <div className='bg-base-300 w-32 h-3' />
        </div>
      </div>
    </div>
  )
}

export default PostSkeleton
