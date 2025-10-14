import React from 'react'

const AuthError = ({ error }: { error: string }) => {
  return Boolean(error) ? (
    <span className='text-red-500 text-center'>{error}</span>
  ) : null
}

export default AuthError
