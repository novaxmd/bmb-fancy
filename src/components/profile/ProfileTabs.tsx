import React from 'react'
import { FaRegBookmark } from 'react-icons/fa'
import { MdGridOn } from 'react-icons/md'
import { CiSaveDown1 } from 'react-icons/ci'
import GridPost from '../shared/GridPost'
import LoadingSpinner from '../shared/LoadingSpinner'
import { type UserProfileProps } from '../../pages/Profile'

const ProfileTabs = ({
  user,
  isOwner,
}: {
  user: UserProfileProps
  isOwner: boolean
}) => {
  const [value, setValue] = React.useState(0)

  if (!user.posts) return <LoadingSpinner />

  return (
    <>
      <div className='hidden md:block divider mt-5 mb-2' />
      <div className='hidden md:flex tabs justify-center gap-5'>
        <a
          onClick={() => setValue(0)}
          className={`font-semibold tab tab-bordered ${
            value === 0 && 'tab-active'
          }`}
        >
          <span className='flex items-center justify-center gap-2'>
            <MdGridOn size={10} />
            POSTS
          </span>
        </a>
        {isOwner && (
          <a
            onClick={() => setValue(1)}
            className={`font-semibold tab tab-bordered ${
              value === 1 && 'tab-active'
            }`}
          >
            SAVED
          </a>
        )}
      </div>

      <div className='md:hidden tabs justify-center gap-20'>
        <a
          onClick={() => setValue(0)}
          className={`tab tab-bordered ${value === 0 && 'tab-active'}`}
        >
          <MdGridOn size={24} className={`${value === 0 && 'fill-primary'}`} />
        </a>
        {isOwner && (
          <a
            onClick={() => setValue(1)}
            className={`tab tab-bordered ${value === 1 && 'tab-active'}`}
          >
            <FaRegBookmark
              size={22}
              className={`${value === 1 && 'fill-primary'}`}
            />
          </a>
        )}
      </div>
      {user.posts.length === 0 && <div className='md:hidden divider' />}
      {value === 0 && <ProfilePosts user={user} isOwner={isOwner} />}
      {value === 1 && <SavedPosts user={user} />}
    </>
  )
}

const ProfilePosts = ({
  user,
  isOwner,
}: {
  user: UserProfileProps
  isOwner: boolean
}) => {
  if (user.posts?.length === 0)
    return (
      <section className='pt-16'>
        <div className='flex flex-col gap-3 justify-center items-center'>
          <h4 className='font-semibold text-3xl'>
            {isOwner ? 'Upload a Photo' : 'No Photos'}
          </h4>
        </div>
      </section>
    )

  return (
    <section className='grid mt-5'>
      <div className='grid grid-cols-3 gap-1 md:gap-6'>
        {user.posts?.map((post) => (
          <GridPost key={post?.id} post={post} />
        ))}
      </div>
    </section>
  )
}
const SavedPosts = ({ user }: { user: UserProfileProps }) => {
  if (user?.savedPosts?.length === 0) {
    return (
      <section className='pt-16'>
        <div className='flex flex-col gap-3 justify-center items-center'>
          <CiSaveDown1 size={80} />
          <h4 className='font-semibold text-3xl'>Save</h4>
          <div className='text-center text-[0.9rem] md:text-base'>
            <p>Save photos and videos that you want to see again.</p>
            <p>No one is notified, and only you can see what you've saved.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='grid mt-5'>
      <div className='grid grid-cols-3 gap-2'>
        {user.savedPosts?.map((post) => (
          <GridPost key={post?.id} post={post} />
        ))}
      </div>
    </section>
  )
}

export default ProfileTabs
