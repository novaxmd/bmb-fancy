import firebase from 'firebase/compat/app'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  User,
} from 'firebase/auth'

import {
  getFirestore,
  doc,
  collection,
  getDoc,
  setDoc,
  query,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  where,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { v4 as uuid } from 'uuid'

export interface SignUpProps {
  email: string
  name: string
  password: string
  username: string
}

export interface UserProps {
  bio: string
  createdAt: number
  email: string
  followers: string[]
  following: string[]
  lastChecked: number
  likes: string[]
  name: string
  notifications: NotificationProps[]
  phoneNumber: string
  posts: string[]
  profileImage: string
  savedPosts: string[]
  uid: string
  username: string
  website: string
}

export type PartialUser = Pick<UserProps, 'username' | 'profileImage' | 'uid'>
export type EditProfileProps = Pick<
  UserProps,
  'username' | 'name' | 'uid' | 'website' | 'bio' | 'email' | 'phoneNumber'
>

export interface UsersCollectionProps {
  [key: string]: PartialUser & { name: string }
}

export interface NotificationProps {
  type: string
  id: string
  postId?: string
  userId: string
  createdAt: number
  user?: PartialUser
  post?: {
    postId: string
    media: string
  }
}

export interface PostProps {
  caption: string
  comments: CommentProps[]
  createdAt: number
  id: string
  likes: string[]
  media: string
  userId: string
  user?: UserProps
}

export interface CommentProps {
  userId: string
  id: string
  content: string
  user: PartialUser
  createdAt: number
}

const firebaseConfig = {
  apiKey: 'AIzaSyBvlLhOh5ZnK3_k7SsIxyU-WHsrpOurl9o',
  authDomain: 'sinstagram-pr.firebaseapp.com',
  projectId: 'sinstagram-pr',
  storageBucket: 'sinstagram-pr.appspot.com',
  messagingSenderId: '570314022901',
  appId: '1:570314022901:web:e3dd9b5d73364eb9214abc',
}

const app = firebase.initializeApp(firebaseConfig)

export const storage = getStorage()

const provider = new GoogleAuthProvider()

provider.setCustomParameters({
  prompt: 'select_account',
})

export const auth = getAuth()

export const signInWithGooglePopup = async () =>
  await signInWithPopup(auth, provider)

export const db = getFirestore()

export const createUserDocument = async (userAuth: User) => {
  const userDocRef = doc(db, 'users', userAuth.uid)

  const userSnapshot = await getDoc(userDocRef)

  if (!userSnapshot.exists()) {
    const { uid, email, displayName, photoURL } = userAuth
    const username = `${displayName?.replace(/\s+/g, '')}${uid.slice(-5)}`
    const userData = {
      uid: uid,
      username: username,
      email: email,
      name: displayName,
      lastChecked: Date.now(),
      bio: '',
      posts: [],
      likes: [],
      notifications: [],
      savedPosts: [],
      followers: [],
      following: [],
      createdAt: Date.now(),
      phoneNumber: '',
      website: '',
      profileImage:
        photoURL ||
        'https://firebasestorage.googleapis.com/v0/b/sinstagram-pr.appspot.com/o/default-user-image.jpg?alt=media&token=b60c36ec-f909-4789-bf23-2390f04b406f',
    }

    try {
      await setDoc(userDocRef, userData)
    } catch (error: any) {
      console.log('error creating the user', error.message)
    }
  }

  return userDocRef
}

export const signUpWithEmailAndPassword = async (
  formData: SignUpProps
): Promise<UserProps | undefined> => {
  const { name, email, password, username } = formData
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  const userDocRef = doc(db, 'users', user.uid)

  const userSnapshot = await getDoc(userDocRef)

  try {
    if (!userSnapshot.exists()) {
      const userData = {
        uid: user.uid,
        username: username,
        email: email,
        name: name,
        lastChecked: Date.now(),
        bio: '',
        posts: [],
        likes: [],
        notifications: [],
        savedPosts: [],
        followers: [],
        following: [],
        createdAt: Date.now(),
        phoneNumber: '',
        website: '',
        profileImage:
          'https://firebasestorage.googleapis.com/v0/b/sinstagram-pr.appspot.com/o/default-user-image.jpg?alt=media&token=b60c36ec-f909-4789-bf23-2390f04b406f',
      }
      await setDoc(userDocRef, userData)
      return userData
    }
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      alert('Email already in use')
    } else console.log('error creating the user', error.message)
  }
}

export const logInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return

  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => {
  await signOut(auth)
}

export const updateUserEmail = async (email: string) => {
  if (auth.currentUser) await updateEmail(auth.currentUser, email)
}

export const onAuthStateChangedListener = (callback: (user: any) => void) =>
  onAuthStateChanged(auth, callback)

export const getUserDoc = async (userId: string) => {
  const userDocRef = doc(db, 'users', userId)

  const userSnapshot = await getDoc(userDocRef)

  const userData = userSnapshot.data() as UserProps

  return userData
}

export const setUserDoc = async (
  userId: string,
  data: EditProfileProps | Pick<UserProps, 'profileImage'>
) => {
  await setDoc(doc(db, 'users', userId), data, { merge: true })
}

export const getUsers = async () => {
  const collectionRef = collection(db, 'users')
  const q = query(collectionRef)

  const querySnapshot = await getDocs(q)
  const users = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { username, name, uid, profileImage } = docSnapshot.data()
    acc[username] = { uid, name, profileImage, username }
    return acc
  }, {} as UsersCollectionProps)

  return users
}

export const getUserPosts = async (userId: string) => {
  const posts = []

  const userDocRef = doc(db, 'users', userId)

  const userSnapshot = await getDoc(userDocRef)

  const userData = userSnapshot.data() as UserProps

  for (const postId of userData.posts) {
    const postSnapshot = await getDoc(doc(db, 'posts', postId))
    const tempPost = postSnapshot.data() as PostProps
    tempPost.user = userData
    posts.unshift(tempPost)
  }
  return posts
}

export const getSavedPosts = async (userId: string) => {
  const posts = []
  const userDocRef = doc(db, 'users', userId)

  const userSnapshot = await getDoc(userDocRef)
  const userData = userSnapshot.data() as UserProps

  for (const postId of userData.savedPosts) {
    const postSnapshot = await getDoc(doc(db, 'posts', postId))
    posts.unshift(postSnapshot.data() as PostProps)
  }

  return posts
}

export const setUserPosts = async (
  userId: string,
  media: string,
  caption: string
) => {
  const post = {
    createdAt: Date.now(),
    media: media,
    caption: caption,
    userId: userId,
    likes: [],
    comments: [],
    id: '',
  }

  const postRef = await addDoc(collection(db, 'posts'), post)
  await updateDoc(doc(db, 'users', userId), {
    posts: arrayUnion(postRef.id),
  })

  await updateDoc(doc(db, 'posts', postRef.id), {
    id: postRef.id,
  })
}

export const deleteUserPost = async (userId: string, postId: string) => {
  try {
    await deleteDoc(doc(db, 'posts', postId))
    await updateDoc(doc(db, 'users', userId), {
      posts: arrayRemove(postId),
      savedPosts: arrayRemove(postId),
    })
  } catch (error: any) {
    console.log(error)
  }
}

export const getPostData = async (postId: string) => {
  const postSnapshot = await getDoc(doc(db, 'posts', postId))
  const post = postSnapshot.data() as PostProps

  const ownerSnapshot = await getDoc(doc(db, 'users', post.userId))
  post.user = ownerSnapshot.data() as UserProps

  return post
}

export const getPostLikes = async (postId: string) => {
  const postSnapshot = await getDoc(doc(db, 'posts', postId))
  const postData = postSnapshot.data() as PostProps
  return postData.likes
}

export const likePost = async (
  postId: string,
  userId: string,
  profileId: string
) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      likes: arrayUnion(postId),
    })
    await updateDoc(doc(db, 'posts', postId), {
      likes: arrayUnion(userId),
    })

    if (userId !== profileId) {
      const notification = {
        id: uuid(),
        createdAt: Date.now(),
        postId: postId,
        post: {
          postId: postId,
          media: await getPostData(postId).then((post) => post.media),
        },
        type: 'like',
        userId: userId,
        user: await getUserDoc(userId).then((user) => ({
          uid: user.uid,
          username: user.username,
          profileImage: user.profileImage,
        })),
      }

      await updateDoc(doc(db, 'users', profileId), {
        notifications: arrayUnion(notification),
      })
    }
  } catch (error: any) {
    console.log(error)
  }
}

export const unlikePost = async (
  postId: string,
  userId: string,
  profileId: string
) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      likes: arrayRemove(postId),
    })
    await updateDoc(doc(db, 'posts', postId), {
      likes: arrayRemove(userId),
    })

    const userSnapshot = await getDoc(doc(db, 'users', profileId))
    const userData = userSnapshot.data() as UserProps
    const notifications = userData.notifications.filter(
      (notification) => notification.postId !== postId
    )

    await updateDoc(doc(db, 'users', profileId), {
      notifications: notifications,
    })
  } catch (error: any) {
    console.log(error)
  }
}

export const savePost = async (postId: string, userId: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      savedPosts: arrayUnion(postId),
    })
  } catch (error: any) {
    console.log(error)
  }
}

export const unsavePost = async (postId: string, userId: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      savedPosts: arrayRemove(postId),
    })
  } catch (error: any) {
    console.log(error)
  }
}

export const addComment = async (postId: string, comment: CommentProps) => {
  try {
    await updateDoc(doc(db, 'posts', postId), {
      comments: arrayUnion(comment),
    })
  } catch (error: any) {
    console.log(error)
  }
}

export const getNotifications = async (userId: string) => {
  const currentUserSnapshot = await getDoc(doc(db, 'users', userId))
  const currentUserData = currentUserSnapshot.data() as UserProps
  const notifications = currentUserData.notifications.slice(0, 6)

  return notifications.sort((a, b) => b.createdAt - a.createdAt)
}

export const checkNotifications = async (userId: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), { lastChecked: Date.now() })
  } catch (error: any) {
    console.log(error)
  }
}

export const followUser = async (userId: string, currentUserId: string) => {
  try {
    await updateDoc(doc(db, 'users', currentUserId), {
      following: arrayUnion(userId),
    })

    await updateDoc(doc(db, 'users', userId), {
      followers: arrayUnion(currentUserId),
      notifications: arrayUnion({
        id: uuid(),
        createdAt: Date.now(),
        postId: null,
        type: 'follow',
        userId: currentUserId,
        user: await getUserDoc(currentUserId).then((user) => ({
          uid: user.uid,
          username: user.username,
          profileImage: user.profileImage,
        })),
      }),
    })
  } catch (error: any) {
    console.log(error)
  }
}

export const unfollowUser = async (userId: string, currentUserId: string) => {
  try {
    await updateDoc(doc(db, 'users', currentUserId), {
      following: arrayRemove(userId),
    })

    const userSnapshot = await getDoc(doc(db, 'users', userId))
    const userData = userSnapshot.data() as UserProps
    const notifications = userData.notifications.filter(
      (notification) => notification.userId !== currentUserId
    )

    await updateDoc(doc(db, 'users', userId), {
      followers: arrayRemove(currentUserId),
      notifications: notifications,
    })
  } catch (error: any) {
    console.log(error)
  }
}

export const suggestUsers = async (limit: number, currentUserId: string) => {
  const users: UserProps[] = []

  const collectionRef = collection(db, 'users')
  const q = query(collectionRef, where('uid', '!=', currentUserId))
  const querySnapshot = await getDocs(q)

  querySnapshot.forEach((doc) => users.push(doc.data() as UserProps))

  return users.slice(0, limit)
}

export const getExplorePosts = async (
  currentUserId: string,
  following: string[]
) => {
  const collectionRef = collection(db, 'posts')
  const posts: PostProps[] = []
  let q
  let querySnapshot

  if (following?.length > 0) {
    q = query(collectionRef, where('userId', 'not-in', following))
    querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      if (doc.data().userId !== currentUserId)
        posts.push(doc.data() as PostProps)
    })
  }

  if (posts.length === 0) {
    q = query(collectionRef)
    querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      if (doc.data().userId !== currentUserId)
        posts.push(doc.data() as PostProps)
    })
  }

  posts.sort((a, b) => b.createdAt - a.createdAt)

  return posts
}

export const getMorePostsFromUser = async (userId: string, postId: string) => {
  const userPosts = await getUserPosts(userId)
  const posts = userPosts.filter((post) => post.id !== postId)

  return posts
}

export const getFeed = async (currentUserId: string, following: string[]) => {
  const feedIds = [...following, currentUserId]
  const feedPosts: PostProps[] = []
  const collectionRef = collection(db, 'posts')
  let q
  let querySnapshot

  if (following?.length > 0) {
    q = query(
      collectionRef,
      where('userId', 'in', feedIds),
      orderBy('createdAt', 'desc'),
      limit(6)
    )
    querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => feedPosts.push(doc.data() as PostProps))
  }

  if (feedPosts.length === 0) {
    q = query(collectionRef, orderBy('createdAt', 'desc'), limit(5))
    querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => feedPosts.push(doc.data() as PostProps))
  }

  return feedPosts
}

export const getNextFeed = async (
  currentUserId: string,
  following: string[],
  lastPostTimestamp: number
) => {
  const feedIds = [...following, currentUserId]
  const feedPosts: PostProps[] = []
  const collectionRef = collection(db, 'posts')
  let q
  let querySnapshot

  if (following?.length > 0) {
    q = query(
      collectionRef,
      where('userId', 'in', feedIds),
      orderBy('createdAt', 'desc'),
      startAfter(lastPostTimestamp),
      limit(6)
    )
    querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => feedPosts.push(doc.data() as PostProps))
  }

  if (feedPosts.length === 0) {
    q = query(
      collectionRef,
      orderBy('createdAt', 'desc'),
      startAfter(lastPostTimestamp),
      limit(6)
    )
    querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => feedPosts.push(doc.data() as PostProps))
  }

  return feedPosts
}
