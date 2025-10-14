import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/shared/Layout'

const NotFound = () => {
  return (
    <Layout title='Page Not Found'>
      <section className='max-w-5xl mx-auto text-center text-gray-800 pt-10  '>
        <h2 className='text-2xl font-bold mb-8'>
          Sorry, this page isn't available.
        </h2>
        <p>
          The link you followed may be broken, or the page may have been
          removed.{' '}
          <Link to='/' className='text-primary'>
            Go back to Sinstagram.
          </Link>
        </p>
      </section>
    </Layout>
  )
}

export default NotFound
