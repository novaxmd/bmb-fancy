import React from 'react'
import Modal from 'react-modal'
import { useNavigate, useParams } from 'react-router-dom'
import { MdClose } from 'react-icons/md'
import Post from './Post'

const PostModal = () => {
  const navigate = useNavigate()
  const { postId } = useParams()

  const customStyles: Modal.Styles = {
    overlay: {
      position: 'fixed',
      zIndex: '20',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      display: 'flex',
      alignItems: 'center',
      maxWidth: 935,
      width: '100%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      margin: 0,
      padding: 0,
      overflow: 'none',
      WebkitOverflowScrolling: 'touch',
    },
  }

  return (
    <>
      <Modal
        isOpen
        ariaHideApp={false}
        onRequestClose={() => navigate(-1)}
        style={customStyles}
      >
        {postId && <Post postId={postId} />}
      </Modal>
      <div
        className='fixed top-0 right-0 cursor-pointer z-30 p-5'
        onClick={() => navigate(-1)}
      >
        <MdClose size={30} />
      </div>
    </>
  )
}

export default PostModal
