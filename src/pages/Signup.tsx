import React, { useState } from 'react'
import logo from '../images/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillGoogleSquare, AiOutlineCheckCircle } from 'react-icons/ai'
import Seo from '../components/shared/Seo'
import {
  signInWithGooglePopup,
  signUpWithEmailAndPassword,
  createUserDocument,
  SignUpProps,
} from '../firebase'
import { SubmitHandler, useForm } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import { ImCancelCircle } from 'react-icons/im'
import AuthError from '../components/shared/AuthError'
import { useUserContext } from '../contexts/userContext'
import LoadingScreen from '../components/shared/LoadingScreen'

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields },
  } = useForm<SignUpProps>({
    mode: 'onBlur',
  })
  const [error, setError] = useState('')
  const [usernameNotAvailable, setUsernameNotAvailable] = useState(false)
  const { users, setCurrentUser } = useUserContext()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const errorIcon = (
    <span className='absolute right-2 top-2'>
      <ImCancelCircle size={22} className='fill-red-600' />
    </span>
  )

  const validIcon = (
    <span className='absolute right-2 top-2'>
      <AiOutlineCheckCircle size={24} className='fill-gray-400' />
    </span>
  )

  const logGoogleUser = async () => {
    const { user } = await signInWithGooglePopup()
    await createUserDocument(user)
    window.location.reload()
  }

  const onSubmit: SubmitHandler<SignUpProps> = async (data) => {
    setError('')
    if (!(data.username in users)) {
      try {
        setLoading(true)
        const userData = await signUpWithEmailAndPassword(data)
        if (userData) {
          setCurrentUser(userData)
          setUsernameNotAvailable(false)
          navigate('/')
        }
        setLoading(false)
      } catch (error: any) {
        setError(error.message)
        console.error('Error signing up', error.message)
      }
    } else {
      setError('Username not available')
      setUsernameNotAvailable(true)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <Seo title='Sign up' />
      <div className='flex flex-col gap-5 items-center h-screen bg-base-200'>
        <div className='border flex flex-col pt-16 pb-6 px-10 mt-10 shadow-sm bg-white gap-5 max-w-sm rounded'>
          <div className='w-full flex justify-center h-8 mb-1'>
            <img src={logo} alt='logo' />
          </div>

          <h3 className='font-bold text-xl text-gray-500 text-center'>
            Sign up to see photos and videos from your friends.
          </h3>

          <button
            type='button'
            className='gap-2 bg-[#DB4437] py-1 w-64 mx-auto rounded'
          >
            <div
              className='flex justify-center w-full items-center gap-2 '
              onClick={logGoogleUser}
            >
              <AiFillGoogleSquare color='white' size={22} />{' '}
              <Link
                to='/'
                className='font-bold text-sm tracking-wide text-white'
              >
                Log in with Google
              </Link>
            </div>
          </button>

          <div className='divider text-gray-400 text-sm font-bold p-5'>OR</div>

          <form
            className='flex flex-col gap-2'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className=' w-64 h-9 mx-auto relative'>
              <input
                type='email'
                placeholder='Email'
                {...register('email', {
                  required: true,
                  validate: (input) => isEmail(input),
                })}
                className='pl-2 h-full w-full bg-base-200 border-transparent text-sm rounded'
              />
              {errors.email ? errorIcon : touchedFields.email && validIcon}
            </div>

            <div className=' w-64 h-9 mx-auto relative'>
              <input
                type='text'
                placeholder='Full Name'
                {...register('name', {
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                })}
                className='pl-2 h-full w-full bg-base-200 border-transparent text-sm rounded'
              />
              {errors.name ? errorIcon : touchedFields.name && validIcon}
            </div>

            <div className=' w-64 h-9 mx-auto relative'>
              <input
                type='text'
                placeholder='Username'
                {...register('username', {
                  required: true,
                  maxLength: 20,
                  pattern: /^[a-zA-Z0-9_.]*$/,
                })}
                className='w-64 h-9 pl-2 mx-auto bg-base-200 border-transparent text-sm rounded'
              />
              {errors.username || usernameNotAvailable
                ? errorIcon
                : touchedFields.username && validIcon}
            </div>

            <div className=' w-64 h-9 mx-auto relative'>
              <input
                type='password'
                placeholder='Password'
                {...register('password', { required: true, minLength: 8 })}
                className='w-64 h-9 pl-2 mx-auto bg-base-200 border-transparent text-sm rounded'
              />
              {errors.password
                ? errorIcon
                : touchedFields.password && validIcon}
            </div>

            <span className='text-xs w-64 text-center mx-auto text-gray-500 mt-4'>
              By signing up, you agree to our{' '}
              <span className='font-bold'>
                Terms, Privacy Policy and Cookies Policy.
              </span>
            </span>
            <button
              disabled={!isValid || isSubmitting}
              type='submit'
              className='text-white font-bold rounded py-1 mt-2 w-64 mx-auto bg-primary border-transparent hover:bg-primary hover:border-transparent disabled:bg-primary disabled:opacity-50 disabled:text-white'
            >
              Sign up
            </button>
          </form>
          <AuthError error={error} />
        </div>

        <div className='border py-6 min-w-[24rem] text-center shadow-sm bg-white gap-5 rounded'>
          Have an account?{' '}
          <Link to='/accounts/login' className='text-primary font-bold'>
            Log in
          </Link>
        </div>
      </div>
    </>
  )
}

export default Signup
