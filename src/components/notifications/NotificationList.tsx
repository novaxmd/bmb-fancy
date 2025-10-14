import React, { useEffect, useRef } from 'react'
import { RiArrowUpSFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { NotificationProps, PartialUser } from '../../firebase'
import { formatDateToNowShort } from '../../utils/formatDate'
import FollowButton from '../shared/FollowButton'

const NotificationList = ({
  notifications,
  className = '',
}: {
  notifications: NotificationProps[]
  className?: string
}) => {
  return (
    <div
      className={`absolute flex flex-col gap-0 justify-center items-end m-0 z-10 ${className}`}
    >
      <RiArrowUpSFill size={50} className='fill-white p-0' />
      <div className='card w-full bg-base-100 shadow-xl rounded -mt-5 pr-2'>
        <div className='card-body p-0 m-0'>
          {notifications.map((notification) => {
            const { username, profileImage } = notification.user as PartialUser
            const isLike = notification.type === 'like'
            const isFollow = notification.type === 'follow'

            return (
              <div
                key={notification.id}
                className='flex hover:bg-base-300 flex-col'
              >
                <div className='flex items-center'>
                  <Link to={`/${username}`}>
                    <div className='cursor-pointer w-56 md:w-80 p-4 pb-0 -mt-2 '>
                      <div className='flex gap-3 items-center'>
                        <div className='avatar'>
                          <div className='w-6 h-6 md:w-12 md:h-12 rounded-full'>
                            <img src={profileImage} />
                          </div>
                        </div>

                        <div className='flex flex-col flex-1'>
                          <span className='text-sm font-semibold'>
                            {username}
                          </span>
                          <span className='text-gray-500 text-xs md:text-sm'>
                            {isLike && (
                              <span className='w-full flex justify-between items-center'>
                                <span>liked your photo.</span>
                                <span>
                                  {formatDateToNowShort(notification.createdAt)}
                                </span>
                              </span>
                            )}

                            {isFollow && (
                              <span className='w-full flex justify-between items-center'>
                                <span>started following you.</span>
                                <span>
                                  {formatDateToNowShort(notification.createdAt)}
                                </span>
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className='md:w-24'>
                    {isLike && (
                      <Link to={`/p/${notification.postId}`}>
                        <div className='avatar py-2'>
                          <div className='rounded w-10 md:w-16'>
                            <img src={notification.post?.media} alt='post' />
                          </div>
                        </div>
                      </Link>
                    )}

                    {isFollow && notification.user && (
                      <FollowButton side={false} id={notification.user?.uid} />
                    )}
                  </div>
                </div>
                <div className='divider -my-1 -mb-2'></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NotificationList
