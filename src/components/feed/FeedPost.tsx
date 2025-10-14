import React, { useEffect, useState } from 'react'
import {
  FaRegComment,
  FaShare,
  FaRegBookmark,
  FaBookmark,
} from 'react-icons/fa'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import UserCard from '../shared/UserCard'
import FollowSuggestions from '../shared/FollowSuggestions'
import OptionsDialog from '../shared/OptionsDialog'
import {
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  addComment,
  getUserDoc,
  PostProps,
  UserProps,
  CommentProps,
} from '../../firebase'
import { useUserContext } from '../../contexts/userContext'
import { formatDateToNow } from '../../utils/formatDate'
import { v4 as uuid } from 'uuid'
import LoadingSpinner from '../shared/LoadingSpinner'
import FeedPostSkeleton from './FeedPostSkeleton'

const FeedPost = ({ post, index }: { post: PostProps; index: number }) => {
  const { id, media, likes, userId, caption, createdAt } = post
  const [comments, setComments] = useState(post.comments)
  const [user, setUser] = useState<UserProps | null>(null)
  const [totalLikes, setTotalLikes] = useState(likes.length)
  const [showCaption, setShowCaption] = useState(false)
  const showFollowSuggestions = index === 1

  useEffect(() => {
    const getUser = async () => {
      setUser(await getUserDoc(userId))
    }

    getUser()
  }, [])

  if (!user) return <FeedPostSkeleton />

  return (
    <>
      <article className='border-2 bg-white mb-5 rounded'>
        <div className='flex justify-between items-center px-4 py-2'>
          <UserCard user={user} />
          <OptionsDialog
            postId={id}
            authorId={userId}
            username={user.username}
          />
        </div>

        <div>
          <img
            src={media}
            alt='media'
            className='w-full object-cover aspect-square'
          />
        </div>

        <div className='p-4 pb-2'>
          <div className='flex pb-2 gap-5 justify-between items-center'>
            <div className='flex gap-5 items-center'>
              <LikeButton
                postId={id}
                profileId={user?.uid}
                setTotalLikes={setTotalLikes}
              />
              <Link to={`/p/${id}`}>
                <FaRegComment size={20} />
              </Link>
              <FaShare size={20} />
            </div>
            <SaveButton postId={id} />
          </div>

          <span className='font-semibold'>
            {totalLikes === 1 ? '1 like' : `${totalLikes} likes`}
          </span>
          <div className='flex flex-col mb-0'>
            <Link to={`/${user.username}`} className='font-bold inline-block'>
              {`${user.username} `}
            </Link>
            {showCaption ? (
              <p dangerouslySetInnerHTML={{ __html: caption }}></p>
            ) : (
              <div className='inline-block'>
                {caption.length >= 45 ? (
                  `${caption.slice(0, 45)}...   `
                ) : (
                  <p
                    dangerouslySetInnerHTML={{ __html: caption }}
                    className='-mb-5'
                  ></p>
                )}
                <button
                  type='button'
                  className='pl-2 text-gray-500'
                  onClick={() => setShowCaption(true)}
                >
                  {caption.length >= 45 && ' more'}
                </button>
              </div>
            )}
          </div>
          <Link to={`/p/${id}`} className='text-gray-500 text-sm'>
            View all {comments.length > 1 ? comments.length : ''} comments
          </Link>
          {comments?.map((comment) => {
            return (
              <div key={comment.id}>
                <Link to={`/${comment.user.username}`}>
                  <span className='font-semibold mr-1.5'>
                    {comment.user.username}
                  </span>
                </Link>
                <span>{comment.content}</span>
              </div>
            )
          })}
          <p className='text-xs text-gray-500'>{formatDateToNow(createdAt)}</p>
        </div>
        <div className='py-0'>
          <div className='divider mt-2 mb-0' />
          <Comment postId={id} setComments={setComments} />
        </div>
      </article>
      {showFollowSuggestions && <FollowSuggestions hideHeader={false} />}
    </>
  )
}

const LikeButton = ({
  postId,
  profileId,
  setTotalLikes,
}: {
  postId: string
  profileId: string
  setTotalLikes: React.Dispatch<React.SetStateAction<number>>
}) => {
  const { currentUserId, currentUser } = useUserContext()
  const isAlredyLiked = currentUser?.likes.includes(postId)
  const [liked, setLiked] = useState(isAlredyLiked)

  const Icon = liked ? (
    <BsHeartFill size={20} className='fill-red-500 animate-ping-once' />
  ) : (
    <BsHeart size={20} />
  )

  const handleLike = async () => {
    setLiked(true)
    setTotalLikes((prev) => prev + 1)
    await likePost(postId, currentUserId, profileId)
  }

  const handleUnlike = async () => {
    setLiked(false)
    setTotalLikes((prev) => prev - 1)
    await unlikePost(postId, currentUserId, profileId)
  }

  return (
    <div
      className='flex items-center justify-center '
      onClick={liked ? handleUnlike : handleLike}
    >
      {Icon}
    </div>
  )
}

const SaveButton = ({ postId }: { postId: string }) => {
  const { currentUserId, currentUser } = useUserContext()
  const isAlreadySaved = currentUser?.savedPosts.includes(postId)
  const [saved, setSaved] = useState(isAlreadySaved)
  const Icon = saved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />

  const handleSave = async () => {
    setSaved(true)
    await savePost(postId, currentUserId)
  }

  const handleRemove = async () => {
    setSaved(false)
    await unsavePost(postId, currentUserId)
  }

  return (
    <div
      className='flex items-center justify-center '
      onClick={saved ? handleRemove : handleSave}
    >
      {Icon}
    </div>
  )
}

const Comment = ({
  postId,
  setComments,
}: {
  postId: string
  setComments: React.Dispatch<React.SetStateAction<CommentProps[]>>
}) => {
  const [content, setContent] = useState('')
  const { currentUserId, currentUser } = useUserContext()

  if (!currentUser) return <LoadingSpinner />

  const handleSubmitComment = async () => {
    const comment = {
      content: content,
      createdAt: Date.now(),
      id: uuid(),
      userId: currentUserId,
      user: {
        username: currentUser.username,
        profileImage: currentUser.profileImage,
        uid: currentUserId,
      },
    }

    setComments((prev) => {
      return [...prev, comment]
    })
    setContent('')
    await addComment(postId, comment)
  }

  return (
    <div className='flex gap-5 px-4'>
      <textarea
        className='textarea textarea-ghost w-full focus:outline-none border-none resize-none p-0 m-0 overflow-hidden'
        value={content}
        rows={1}
        placeholder='Add a comment...'
        onChange={(event) => setContent(event.target.value)}
      />
      <button
        disabled={!content.trim()}
        type='button'
        className='text-primary disabled:opacity-60 self-start'
        onClick={handleSubmitComment}
      >
        Post
      </button>
    </div>
  )
}

export default FeedPost
