import React, { useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../../contexts/userContext'
import { unfollowUser, deleteUserPost } from '../../firebase'

const OptionsDialog = ({
  postId,
  authorId,
  username,
}: {
  postId: string
  authorId: string
  username: string
}) => {
  const { currentUserId, currentUser } = useUserContext()
  const isOwner = authorId === currentUserId
  const isFollowing = currentUser?.following?.includes(authorId)
  const isUnrelatedUser = !isOwner && !isFollowing
  const navigate = useNavigate()

  const handleDeletePost = async () => {
    await deleteUserPost(currentUserId, postId)
    navigate('/')
    window.location.reload()
  }

  const handleUnfollowUser = async () => {
    try {
      await unfollowUser(authorId, currentUserId)
      navigate(`/${username}`)
      window.location.reload()
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <>
      <label htmlFor='options-dialog'>
        <MdMoreHoriz size={20} className='cursor-pointer' />
      </label>

      <input type='checkbox' id='options-dialog' className='modal-toggle' />
      <label htmlFor='options-dialog' className='modal'>
        <label
          className='modal-box relative px-0 rounded-xl text-center'
          htmlFor=''
        >
          {!isUnrelatedUser && (
            <>
              <button
                type='button'
                onClick={isOwner ? handleDeletePost : handleUnfollowUser}
                className='text-red-600 font-semibold'
              >
                {isOwner ? 'Delete' : 'Unfollow'}
              </button>
              <div className='divider' />
            </>
          )}

          <Link to={`/p/${postId}`}>
            <button type='button'>Go to post</button>
          </Link>
          <div className='divider' />
          <label htmlFor='options-dialog'>
            <span className='cursor-pointer'>Cancel</span>
          </label>
        </label>
      </label>
    </>
  )
}

export default OptionsDialog
