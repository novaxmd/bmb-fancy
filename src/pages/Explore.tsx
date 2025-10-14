import React from 'react'
import ExploreGrid from '../components/explore/ExploreGrid'
import ExploreSuggestions from '../components/explore/ExploreSuggestions'
import Layout from '../components/shared/Layout'

const Explore = () => {
  return (
    <Layout title='Explore'>
      <ExploreSuggestions />
      <ExploreGrid />
    </Layout>
  )
}

export default Explore
