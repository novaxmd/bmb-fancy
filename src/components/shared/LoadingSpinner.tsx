import React from 'react'
import { ImSpinner } from 'react-icons/im'

const LoadingSpinner = ({ size = 20, className = '' }) => {
  return (
    <div className='flex justify-center items-center pb-4'>
      <ImSpinner className={`${className} animate-spin`} size={size} />
    </div>
  )
}

export default LoadingSpinner
