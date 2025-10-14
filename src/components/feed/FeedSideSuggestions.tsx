import React, { useEffect, useState } from 'react'
import FollowButton from '../shared/FollowButton'
import UserCard from '../shared/UserCard'
import LoadingSpinner from '../shared/LoadingSpinner'
import { suggestUsers, UserProps } from '../../firebase'
import { useUserContext } from '../../contexts/userContext'

const FeedSideSuggestions = () => {
  const { currentUserId } = useUserContext()
  const [users, setUsers] = useState<UserProps[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true)
      const tempUsers = await suggestUsers(5, currentUserId)
      setUsers(tempUsers)
      setLoading(false)
    }

    getSuggestedUsers()
  }, [])

  return (
    <article className='card bg-white rounded'>
      <div className='card-body p-5'>
        <h3>Suggestions For You</h3>
        {loading ? (
          <LoadingSpinner />
        ) : (
          users.map((user) => {
            return (
              <div key={user.uid} className='flex justify-between items-center'>
                <UserCard user={user} />
                <FollowButton id={user.uid} side />
              </div>
            )
          })
        )}
      </div>
    </article>
  )
}

export default FeedSideSuggestions
