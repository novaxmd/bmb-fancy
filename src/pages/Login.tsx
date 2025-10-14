import React, { useState } from 'react'
import logo from '../images/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillGoogleSquare } from 'react-icons/ai'
import Seo from '../components/shared/Seo'
import {
  signInWithGooglePopup,
  createUserDocument,
  logInWithEmailAndPassword,
} from '../firebase'
import { SubmitHandler, useForm } from 'react-hook-form'
import AuthError from '../components/shared/AuthError'

interface LoginProps {
  email: string
  password: string
}

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<LoginProps>()
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const hasPassword = Boolean(watch('password'))

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const logGoogleUser = async () => {
    const { user } = await signInWithGooglePopup()
    await createUserDocument(user)
    window.location.reload()
  }

  const onSubmit: SubmitHandler<LoginProps> = async (data) => {
    const { email, password } = data
    try {
      setError('')
      await logInWithEmailAndPassword(email, password)
      navigate('/')
    } catch (error: any) {
      console.error('Error logging in', error)
      setError(error.message)
    }
  }

  return (
    <>
      <Seo title='Log in' />
      <div className='flex flex-col gap-5 items-center h-screen bg-base-200'>
        <div className='border flex flex-col pt-16 pb-6 px-10 mt-20 shadow-sm bg-white gap-5 rounded'>
          <div className='w-full flex justify-center h-8'>
            <img src={logo} alt='logo' />
          </div>

          <div className='self-center'>
            <p>
              <span className='font-semibold'>Email:</span> stark@gmail.com
            </p>
            <p>
              <span className='font-semibold'>Password:</span> tony@stark
            </p>
          </div>

          <form
            className='flex flex-col gap-2'
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              {...register('email', { required: true, minLength: 5 })}
              placeholder='Email'
              className='w-64 h-9 pl-2 m-auto bg-base-200 border-transparent text-sm'
            />
            <div className='w-64 h-9 mx-auto relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                {...register('password', { required: true, minLength: 6 })}
                className='pl-2 h-full w-full bg-base-200 border-transparent text-sm rounded'
              />
              {hasPassword && (
                <button
                  type='button'
                  className='absolute top-2 right-2 text-sm font-semibold'
                  onClick={toggleShowPassword}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              )}
            </div>

            <button
              disabled={!isValid || isSubmitting}
              type='submit'
              className='text-white font-bold rounded py-1  mt-2 bg-primary border-transparent hover:bg-primary hover:border-transparent disabled:bg-primary disabled:opacity-50 disabled:text-white'
            >
              Log in
            </button>
          </form>
          <div className='divider text-gray-400 text-sm font-bold'>OR</div>
          <button
            type='button'
            className='flex items-center gap-2 m-auto'
            onClick={logGoogleUser}
          >
            <AiFillGoogleSquare color='#DB4437' size={22} />{' '}
            <Link
              to='/'
              className='text-[#DB4437] font-bold text-sm tracking-wide'
            >
              Log in with Google
            </Link>
          </button>
          <AuthError error={error} />
          <Link to='/' className='text-sm text-center text-[#4267b2]'>
            Forgot Password?
          </Link>
        </div>

        <div className='border py-6 px-14 shadow-sm bg-white gap-5 rounded'>
          Don't have an account?{' '}
          <Link to='/accounts/emailsignup' className='text-primary font-bold'>
            Sign up
          </Link>
        </div>
      </div>
    </>
  )
}

export default Login
