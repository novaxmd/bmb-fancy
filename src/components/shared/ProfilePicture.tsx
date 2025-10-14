import React from 'react'
import { BsPersonFill } from 'react-icons/bs'

const ProfilePicture = ({
  className = '',
  image,
}: {
  className?: string
  image: string
}) => {
  return (
    <div className={`w-40 md:w-44 md:my-16 ${className}`}>
      {image ? (
        <img
          src={image}
          className='w-20 h-20 md:w-40 md:h-40 object-cover rounded-full'
          alt='profile'
        />
      ) : (
        <BsPersonFill className='fill-white w-20 h-20 md:w-40 md:h-40' />
      )}
    </div>
  )
}

export default ProfilePicture
