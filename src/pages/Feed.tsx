import React, { Suspense, useEffect, useState } from 'react'
import FeedPostSkeleton from '../components/feed/FeedPostSkeleton'
import FeedSideSuggestions from '../components/feed/FeedSideSuggestions'
import Layout from '../components/shared/Layout'
import LoadingScreen from '../components/shared/LoadingScreen'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import UserCard from '../components/shared/UserCard'
import { useUserContext } from '../contexts/userContext'
import { getFeed, getNextFeed, PostProps } from '../firebase'
import InfiniteScroll from 'react-infinite-scroll-component'
const FeedPost = React.lazy(() => import('../components/feed/FeedPost'))

const Feed = () => {
  const [isEndOfFeed, setIsEndOfFeed] = useState(false)
  const { currentUser, currentUserId, loading } = useUserContext()
  const [feedPosts, setFeedPosts] = useState<PostProps[]>([])
  const lastPostTimestamp = feedPosts[feedPosts.length - 1]?.createdAt

  const handleLoadMore = async () => {
    if (currentUser) {
      const nextFeed = await getNextFeed(
        currentUserId,
        currentUser.following,
        lastPostTimestamp
      )

      if (nextFeed.length === 0) setIsEndOfFeed(true)

      setFeedPosts((prev) => {
        return [...prev, ...nextFeed]
      })
    }
  }

  if (loading || !currentUser) return <LoadingScreen />

  useEffect(() => {
    const getFeedPosts = async () => {
      const tempPosts = await getFeed(currentUserId, currentUser.following)
      setFeedPosts(tempPosts)
    }
    getFeedPosts()
  }, [])

  return (
    <Layout title='Feed'>
      <section className='grid grid-cols-6 max-w-5xl mx-auto gap-5'>
        <div className='col-span-6 md:col-span-4'>
          <InfiniteScroll
            dataLength={feedPosts.length}
            next={handleLoadMore}
            hasMore={!isEndOfFeed}
            scrollThreshold={1}
            loader={<LoadingSpinner />}
          >
            {feedPosts.map((post, index) => (
              <Suspense key={post.id} fallback={<FeedPostSkeleton />}>
                <FeedPost key={post.id} index={index} post={post} />
              </Suspense>
            ))}
          </InfiniteScroll>
        </div>
        <div className='hidden md:col-span-2 md:block'>
          <div className='w-full flex flex-col gap-5 sticky top-20'>
            <div className='pl-5 mt-4'>
              <UserCard user={currentUser} />
            </div>

            <FeedSideSuggestions />
            <h3 className='text-center font-semibold -mt-6'>
              <a href='mailto:kenizaya@outlook.com?subject=%F0%9F%A4%98%20Hi%20Prashant,%20I%27d%20like%20to%20hire%20you'>
                HIRE ME
              </a>
            </h3>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Feed
