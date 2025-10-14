import React, { useEffect, useRef } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import PostModal from './components/post/PostModal'
import LoadingScreen from './components/shared/LoadingScreen'
import { useUserContext } from './contexts/userContext'
import {
  EditProfile,
  Explore,
  Feed,
  Login,
  NotFound,
  PostPage,
  Profile,
  Signup,
} from './pages'

const App = () => {
  const location = useLocation()
  const prevLocation = useRef(location)
  const modal = location.state?.modal
  const { currentUser, loading } = useUserContext()

  useEffect(() => {
    if (!modal) prevLocation.current = location
  }, [location, modal])

  const isModalOpen = modal && prevLocation.current !== location

  if (loading) return <LoadingScreen />

  if (!currentUser) {
    return (
      <Routes>
        <Route path='/accounts/login' element={<Login />} />
        <Route path='/accounts/emailsignup' element={<Signup />} />
        <Route path='*' element={<Navigate to='/accounts/login' />} />
      </Routes>
    )
  }

  return (
    <>
      <Routes location={isModalOpen ? prevLocation.current : location}>
        <Route path='/' element={<Feed />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/:username' element={<Profile />} />
        <Route path='/p/:postId' element={<PostPage />} />
        <Route path='/accounts/edit' element={<EditProfile />} />
        <Route path='/accounts/login' element={<Navigate to='/' />} />
        <Route path='/accounts/emailsignup' element={<Navigate to='/' />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Routes>
        {isModalOpen && <Route path='/p/:postId' element={<PostModal />} />}
      </Routes>
    </>
  )
}

export default App
