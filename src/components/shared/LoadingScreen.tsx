import React from 'react'
import { FaInstagram } from 'react-icons/fa'

const LoadingScreen = () => {
  return (
    <section className='flex justify-center items-center bg-base-200 h-screen'>
      <FaInstagram size={65} className='fill-gray-400' />
    </section>
  )
}

export default LoadingScreen
