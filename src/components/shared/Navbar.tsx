import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineCompass,
  AiFillCompass,
  AiOutlineHeart,
  AiFillHeart,
} from 'react-icons/ai'
import { RiArrowUpSFill } from 'react-icons/ri'
import { FiPlusSquare } from 'react-icons/fi'
import logo from '../../images/logo.svg'
import LoadingSpinner from './LoadingSpinner'
import { MdCancel } from 'react-icons/md'
import UserCard from './UserCard'
import NotificationTooltip from '../notifications/NotificationTooltip'
import NotificationList from '../notifications/NotificationList'
import { useNProgress } from '@tanem/react-nprogress'
import { useUserContext } from '../../contexts/userContext'
import Fuse from 'fuse.js'
import AddPostDialog from '../post/AddPostDialog'
import { checkNotifications, PartialUser } from '../../firebase'
import { isAfter } from 'date-fns'

const Navbar = () => {
  const location = useLocation()
  const path = location.pathname
  const [isLoadingPage, setIsLoadingPage] = useState(true)
  const { currentUser } = useUserContext()

  useEffect(() => {
    setIsLoadingPage(false)
  }, [path])

  return (
    <div className='md:fixed bg-white w-full z-20'>
      <PrograssBar isAnimating={isLoadingPage} />
      <div className='border-b-2 px-5 '>
        <nav className='bg-white flex items-center max-w-5xl justify-between mx-auto gap-5 py-3 '>
          <Link to='/'>
            <img src={logo} alt='logo' className='w-' />
          </Link>
          <Search />

          {!currentUser ? (
            <div className='flex gap-2'>
              <Link to='/accounts/login'>
                <button
                  type='button'
                  className='btn bg-primary hover:bg-primary hover:border-transparent border-transparent text-white btn-sm normal-case rounded'
                >
                  Log In
                </button>
              </Link>

              <Link to='/accounts/emailsignup'>
                <button
                  type='button'
                  className='btn btn-link btn-sm text-primary no-underline  normal-case'
                >
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <NavLinks path={path} />
          )}
        </nav>
      </div>
    </div>
  )
}

const Search = () => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [results, setResults] = useState<
    Fuse.FuseResult<PartialUser & { name: string }>[]
  >([])
  const { users } = useUserContext()
  const usersList = Object.values(users)
  const fuse = new Fuse(usersList, { keys: ['username', 'name'] })

  const hasResults = query && results.length > 0

  useEffect(() => {
    if (!query.trim()) return

    setLoading(true)
    setResults(fuse.search(query))
    setLoading(false)
  }, [query])

  const handleClearInput = () => {
    setQuery('')
  }

  return (
    <div className='hidden md:block relative'>
      {!(hasFocus || query) && (
        <label
          htmlFor='search'
          className='text-gray-400 flex items-center absolute top-1.5 left-2 cursor-text'
        >
          <FaSearch className='fill-gray-400 focus:hidden' size={15} />
          <span className='pl-2'>Search</span>
        </label>
      )}
      <input
        type='text'
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        value={query}
        id='search'
        onChange={(event) => setQuery(event.target.value)}
        className='input input-sm max-w-xs bg-base-200 text-base w-54 h-9 focus:outline-transparent focus:border-transparent '
      />
      {loading ? (
        <span className='absolute right-2 top-2.5'>
          <LoadingSpinner size={15} className='fill-gray-400' />
        </span>
      ) : (
        (hasFocus || query) && (
          <span className='absolute right-2 top-2.5' onClick={handleClearInput}>
            <MdCancel className='fill-gray-400' size={15} />
          </span>
        )
      )}
      {hasResults && <SearchCard results={results} />}
    </div>
  )
}

const SearchCard = ({
  results,
}: {
  results: Fuse.FuseResult<
    PartialUser & {
      name: string
    }
  >[]
}) => {
  return (
    <div className='absolute top-8 w-full flex flex-col gap-0 justify-center items-center m-0'>
      <RiArrowUpSFill size={50} className='fill-white p-0' />
      <div className='card w-full bg-base-100 shadow-xl rounded -mt-5'>
        <div className='card-body p-0 m-0'>
          {results.map((result) => {
            return (
              <div key={result.item.uid}>
                <Link to={`/${result.item.username}`}>
                  <div className='cursor-pointer hover:bg-base-300 p-4 pb-0 -mt-2'>
                    <UserCard user={result.item} />
                  </div>
                </Link>
                <div className='divider -m-2'></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const NavLinks = ({ path }: { path: string }) => {
  const { currentUser, currentUserId, notifications } = useUserContext()
  if (!currentUser) return null
  const newNotifications = notifications.filter(({ createdAt }) =>
    isAfter(new Date(createdAt), new Date(currentUser.lastChecked))
  )
  const hasNotifications = newNotifications.length > 0
  const [showNotificationsTooltip, setShowNotificationsTooltip] =
    useState(hasNotifications)
  const [showNotifications, setShowNotifications] = useState(false)
  const [media, setMedia] = useState<File>()
  const [showAddPostDialog, setShowAddPostDialog] = useState(false)
  const notificationListRef = useRef(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleToggleNotifications = () => {
    setShowNotifications((prevShowNotifications) => !prevShowNotifications)
  }

  const handleHideNotificationsTooltip = () => {
    setShowNotificationsTooltip(false)
  }

  const openFileInput = () => {
    inputRef.current?.click()
  }

  const handleAddPost = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    setMedia(event.target.files[0])
    setShowAddPostDialog(true)
  }

  const handleClose = () => {
    setShowAddPostDialog(false)
  }

  useEffect(() => {
    const timeout = setTimeout(handleHideNotificationsTooltip, 2500)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className='flex gap-5 items-center'>
      {showAddPostDialog && media && (
        <AddPostDialog media={media} handleClose={handleClose} />
      )}
      <div className='cursor-pointer'>
        <input
          type='file'
          ref={inputRef}
          onChange={handleAddPost}
          className='hidden'
        />
        <FiPlusSquare size={28} onClick={openFileInput} />
      </div>

      <Link to='/'>
        {path === '/' ? (
          <AiFillHome size={28} />
        ) : (
          <AiOutlineHome
            size={28}
            onClick={() => {
              navigate('/')
              window.location.reload()
            }}
          />
        )}
      </Link>
      <Link to='/explore'>
        {path === '/explore' ? (
          <AiFillCompass size={28} />
        ) : (
          <AiOutlineCompass size={28} />
        )}
      </Link>
      <div className='cursor-pointer relative' ref={notificationListRef}>
        <div
          onClick={async () => {
            handleHideNotificationsTooltip()
            handleToggleNotifications()
            await checkNotifications(currentUserId)
          }}
        >
          {showNotifications ? (
            <AiFillHeart size={28} />
          ) : (
            <AiOutlineHeart size={28} />
          )}{' '}
        </div>
        {showNotificationsTooltip && (
          <NotificationTooltip
            notifications={newNotifications}
            className='absolute -left-9 animate-ping-once'
          />
        )}
        {showNotifications && (
          <NotificationList
            notifications={notifications}
            className='-right-3 top-8'
          />
        )}
      </div>

      <Link to={`/${currentUser.username}`}>
        <div className='avatar flex justify-center items-center'>
          <div
            className={`w-10 rounded-full border-2 border-transparent ${
              path === `/${currentUser.username}` &&
              'border-gray-700 ring-offset-base-100 ring-offset-1'
            }`}
          >
            <img src={currentUser.profileImage} className='rounded-full' />
          </div>
        </div>
      </Link>
    </div>
  )
}

const PrograssBar = ({ isAnimating }: { isAnimating: boolean }) => {
  const { animationDuration, progress, isFinished } = useNProgress({
    isAnimating,
  })

  return (
    <div
      className={`${
        isFinished ? 'opacity-0' : 'opacity-100'
      } absolute z-20 w-full`}
    >
      <div
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`,
          background:
            '#27c4f5 linear-gradient(to right,#24c4e5,#a307bb,#fd8e32,#70b060,#24c4e5)',
          backgroundSize: '500%',
        }}
        className={`h-1 w-full`}
      ></div>
    </div>
  )
}

export default Navbar
