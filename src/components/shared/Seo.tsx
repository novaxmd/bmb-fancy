import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

const Seo = ({ title }: { title: string }) => {
  const tileText = title ? `${title} · Sinstagram` : 'Sinstagram'

  return (
    <HelmetProvider>
      <Helmet>
        <title>{tileText}</title>
      </Helmet>
    </HelmetProvider>
  )
}

export default Seo
