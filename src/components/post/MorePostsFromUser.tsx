import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GridPost from '../shared/GridPost'
import LoadingSpinner from '../shared/LoadingSpinner'
import {
  getMorePostsFromUser,
  getPostData,
  getUserDoc,
  PostProps,
} from '../../firebase'

const MorePostsFromUser = ({ postId }: { postId: string }) => {
  const [posts, setPosts] = useState<PostProps[]>([])
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true)
        const userId = (await getPostData(postId)).userId
        setUsername((await getUserDoc(userId)).username)
        const tempPosts = await getMorePostsFromUser(userId, postId)
        setPosts(tempPosts)
        setLoading(false)
      } catch (error: any) {
        console.log(error)
      }
    }

    getPosts()
  }, [])

  return (
    <div className='mt-8'>
      <h3 className='mb-2'>
        More Posts from{' '}
        <Link to={`/${username}`} className='font-bold'>
          {username}
        </Link>
      </h3>
      {loading ? (
        <LoadingSpinner size={28} />
      ) : (
        <article className='grid'>
          <div className='grid md:grid-cols-3 gap-5 md:gap-6'>
            {posts.map((post) => {
              return <GridPost key={post.id} post={post} />
            })}
          </div>
        </article>
      )}
    </div>
  )
}

export default MorePostsFromUser
