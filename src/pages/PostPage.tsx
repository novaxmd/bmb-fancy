import { useParams } from 'react-router-dom'
import Layout from '../components/shared/Layout'
import Post from '../components/post/Post'
import MorePostsFromUser from '../components/post/MorePostsFromUser'

const PostPage = () => {
  const { postId } = useParams()

  if (!postId) return null

  return (
    <Layout title='Sinstagram'>
      <Post postId={postId} />
      <MorePostsFromUser postId={postId} />
    </Layout>
  )
}

export default PostPage
