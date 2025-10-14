import React, { useState } from 'react'
import { useUserContext } from '../../contexts/userContext'
import { followUser, unfollowUser } from '../../firebase'

const FollowButton = ({ side = false, id }: { id: string; side: boolean }) => {
  const { currentUser, currentUserId } = useUserContext()
  const isAlreadyFollowing = currentUser?.following.includes(id)
  const [isFollowing, setIsFollowing] = useState(isAlreadyFollowing)

  const handleFollowUser = async () => {
    setIsFollowing(true)
    await followUser(id, currentUserId)
  }

  const handleUnfollowUser = async () => {
    setIsFollowing(false)
    await unfollowUser(id, currentUserId)
  }

  const followButton = (
    <button
      type='button'
      className={
        side
          ? 'btn-link btn-sm no-underline text-primary'
          : 'text-white text-xs md:text-base rounded btn-sm py-1  mt-2 bg-primary border-transparent hover:bg-primary hover:border-transparent'
      }
      onClick={handleFollowUser}
    >
      Follow
    </button>
  )

  const followingButton = (
    <button
      type='button'
      className={
        side
          ? 'btn btn-outline btn-xs text-gray-900 font-normal px-1 rounded normal-case bg-white hover:bg-base-100 hover:text-gray-900'
          : 'text-white text-xs md:text-base btn-sm rounded py-1  mt-2 bg-primary border-transparent hover:bg-primary hover:border-transparent'
      }
      onClick={handleUnfollowUser}
    >
      Following
    </button>
  )

  return isFollowing ? followingButton : followButton
}

export default FollowButton
