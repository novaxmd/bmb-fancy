import React, { useEffect, useState } from 'react'
import GridPost from '../shared/GridPost'
import LoadingSpinner from '../shared/LoadingSpinner'
import { getExplorePosts, PostProps } from '../../firebase'
import { useUserContext } from '../../contexts/userContext'

const ExploreGrid = () => {
  const { currentUser, currentUserId } = useUserContext()
  const [posts, setPosts] = useState<PostProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getExplorePostsData = async () => {
      if (currentUser) {
        try {
          setLoading(true)
          const tempPosts = await getExplorePosts(
            currentUserId,
            currentUser.following
          )
          setPosts(tempPosts)
          setLoading(false)
        } catch (error: any) {
          console.log(error)
        }
      }
    }

    getExplorePostsData()
  }, [])

  if (loading) return <LoadingSpinner size={28} />

  return (
    <div>
      <h3 className='text-gray-500  mb-2'>Explore</h3>
      <article className='grid'>
        <div className='grid md:grid-cols-3 gap-5 md:gap-6'>
          {posts.map((post) => {
            return <GridPost key={post.id} post={post} />
          })}
        </div>
      </article>
    </div>
  )
}

export default ExploreGrid
