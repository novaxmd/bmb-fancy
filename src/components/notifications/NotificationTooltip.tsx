import React from 'react'
import { RiArrowUpSFill } from 'react-icons/ri'
import { BsPersonFill, BsHeartFill } from 'react-icons/bs'
import { NotificationProps } from '../../firebase'

const NotificationTooltip = ({
  notifications,
  className = '',
}: {
  notifications: NotificationProps[]
  className?: string
}) => {
  const countNotifications = (notificationType: string) => {
    return notifications.filter(({ type }) => type === notificationType).length
  }

  const followCount = countNotifications('follow')
  const likeCount = countNotifications('like')

  return (
    <div className={`${className} flex flex-col items-center `}>
      <RiArrowUpSFill size={25} className='fill-red-500' />
      <div className='bg-red-500 flex gap-3 py-1 px-3 rounded items-center -mt-3'>
        {followCount > 0 && (
          <div className='flex gap-1 items-center'>
            <BsPersonFill size={18} className='fill-white' />{' '}
            <span aria-label='followers' className='text-white'>
              {followCount}
            </span>
          </div>
        )}
        {likeCount > 0 && (
          <div className='flex gap-1 items-center'>
            <BsHeartFill size={18} className='fill-white' />
            <span aria-label='likes' className='text-white'>
              {likeCount}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationTooltip
