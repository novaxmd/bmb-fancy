import React from 'react'
import FollowSuggestions from '../shared/FollowSuggestions'

const ExploreSuggestions = () => {
  return (
    <div className='hidden md:block md:px-1'>
      <h3 className='text-gray-500 m-2 md:ml-0'>Discover People</h3>
      <FollowSuggestions hideHeader />
    </div>
  )
}

export default ExploreSuggestions
