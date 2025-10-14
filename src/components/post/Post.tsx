import React, { useContext, useEffect, useState } from 'react'
import {
  FaRegComment,
  FaShare,
  FaRegBookmark,
  FaBookmark,
} from 'react-icons/fa'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import UserCard from '../shared/UserCard'
import OptionsDialog from '../shared/OptionsDialog'
import PostSkeleton from './PostSkeleton'
import {
  getPostData,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  addComment,
  PostProps,
  CommentProps,
} from '../../firebase'
import { useUserContext } from '../../contexts/userContext'
import { formatDateToNowShort, formatPostDate } from '../../utils/formatDate'
import { v4 as uuid } from 'uuid'
import LoadingSpinner from '../shared/LoadingSpinner'

const Post = ({ postId }: { postId: string }) => {
  const [post, setPost] = useState<PostProps | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalLikes, setTotalLikes] = useState(0)
  const [comments, setComments] = useState<CommentProps[]>([])

  useEffect(() => {
    const getPost = async () => {
      setLoading(true)
      try {
        const tempPost = await getPostData(postId)
        setPost(tempPost)
        setTotalLikes(tempPost.likes.length)
        setComments(tempPost.comments)
      } catch (error: any) {
        console.log(error)
      }
      setLoading(false)
    }
    getPost()
  }, [])

  if (loading || !post) return <PostSkeleton />

  const { media, user, caption, createdAt } = post

  if (!user) return <PostSkeleton />

  return (
    <div className='bg-white w-full '>
      <article className='flex flex-col md:flex-row border-2 bg-white rounded'>
        <div className='p-4 w-full self-center h-full md:w-[calc(100%-335px)] md:h-[750px]'>
          <img
            src={media}
            alt='media'
            className='object-contain w-full h-full aspect-square'
          />
        </div>
        <div className='flex flex-col'>
          <div className='flex justify-between items-center p-4 py-10 h-16 mr-0 border border-t-0 border-r-0 border-b-base-300 border-l-base-200'>
            <UserCard user={user} />
            <OptionsDialog
              postId={postId}
              authorId={user.uid}
              username={user.username}
            />
          </div>

          <div className='flex flex-col flex-grow overflow-x-hidden overflow-hidden pt-4 px-3 h-full border border-t-0 border-l-0 border-r-0 border-b-base-300 '>
            <AuthorCaption
              user={user}
              createdAt={createdAt}
              caption={caption}
            />

            {comments?.map((comment) => (
              <UserComment key={comment.id} comment={comment} />
            ))}
          </div>

          <div className='p-4 pb-2'>
            <div className='flex pb-2 gap-5 justify-between items-center '>
              <div className='flex gap-5 items-center'>
                <LikeButton
                  postId={postId}
                  profileId={user?.uid!}
                  setTotalLikes={setTotalLikes}
                />
                <Link to={`/p/${postId}`}>
                  <FaRegComment size={20} />
                </Link>
                <FaShare size={20} />
              </div>
              <SaveButton postId={postId} />
            </div>
            <span className='font-semibold'>
              {totalLikes == 1 ? '1 like' : `${totalLikes} likes`}
            </span>

            <p className='text-xs text-gray-500'>{formatPostDate(createdAt)}</p>
            <div className='py-0'>
              <div className='divider mt-2 mb-0' />
              <Comment postId={postId} setComments={setComments} />
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

const AuthorCaption = ({
  user,
  caption,
  createdAt,
}: Pick<PostProps, 'user' | 'caption' | 'createdAt'>) => {
  return (
    <div className='flex'>
      <div className='mr-4 avatar'>
        <div className='w-10 h-10 rounded-full'>
          <img src={user?.profileImage} />
        </div>
      </div>
      <div className='flex flex-col'>
        <Link to={`/${user?.username}`}>
          <span className='font-semibold'>{user?.username}</span>
          <span
            className='pt-1 px-2 '
            dangerouslySetInnerHTML={{ __html: caption }}
          />
          <span className='text-gray-400 text-sm'>
            {formatDateToNowShort(createdAt)}
          </span>
        </Link>
      </div>
    </div>
  )
}

const UserComment = ({ comment }: { comment: CommentProps }) => {
  return (
    <div className='flex pb-2'>
      <div className='mr-4 avatar'>
        <div className='w-8 h-8 rounded-full'>
          <img src={comment?.user?.profileImage} />
        </div>
      </div>
      <div className='flex justify-between w-full'>
        <div>
          <Link to={`/${comment?.user?.username}`}>
            <span className='font-semibold text-sm'>
              {comment?.user?.username}
            </span>
          </Link>
          <span className='pt-1 px-2'>{comment?.content}</span>
        </div>

        <span className='text-base-300 text-sm'>
          {formatDateToNowShort(comment?.createdAt)}
        </span>
      </div>
    </div>
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
    <div className='flex gap-5 px-2'>
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

export default Post
