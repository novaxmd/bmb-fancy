import React, { ReactNode } from 'react'
import SEO from './Seo'
import Navbar from './Navbar'

const Layout = ({
  children,
  title,
  className = '',
}: {
  children: ReactNode
  title: string
  className?: string
}) => {
  return (
    <section>
      <SEO title={title} />
      <Navbar />
      <main className={`${className} ' min-h-screen p-5 bg-base-200'`}>
        <section className='md:mt-20 max-w-5xl mx-auto'>
          <div>{children}</div>
        </section>
      </main>
    </section>
  )
}

export default Layout
