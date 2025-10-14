import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  onAuthStateChangedListener,
  getUserDoc,
  getUsers,
  getNotifications,
  NotificationProps,
  UserProps,
  UsersCollectionProps,
} from '../firebase'

interface UserContextType {
  currentUser: UserProps | null
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProps | null>>
  currentUserId: string
  setCurrentUserId: React.Dispatch<React.SetStateAction<string>>
  loading: boolean
  users: UsersCollectionProps
  setUsers: React.Dispatch<React.SetStateAction<UsersCollectionProps>>
  notifications: NotificationProps[]
}

const createCtx = <T extends {}>() => {
  const ctx = createContext<T | undefined>(undefined)
  const useCtx = () => {
    const c = useContext(ctx)
    if (!c) throw new Error('useCtx must be inside a Provider with a value')
    return c
  }
  return [useCtx, ctx.Provider] as const
}

export const [useUserContext, UserContextProvider] =
  createCtx<UserContextType>()

export const UserProvider = ({ children }: { children?: ReactNode }) => {
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [users, setUsers] = useState<UsersCollectionProps>({})
  const [currentUser, setCurrentUser] = useState<UserProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const value: UserContextType = {
    currentUser,
    setCurrentUser,
    currentUserId,
    setCurrentUserId,
    loading,
    users,
    setUsers,
    notifications,
  }

  useEffect(() => {
    const getUsersData = async () => {
      const users = await getUsers()
      setUsers(users)
    }

    if (currentUser) {
      const getNotificationsData = async () => {
        if (currentUserId) {
          const tempNotifications = await getNotifications(currentUserId)
          setNotifications(tempNotifications)
        }
      }
      getNotificationsData()
    }

    getUsersData()
  }, [currentUser, currentUserId])

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      if (user) {
        setCurrentUserId(user ? user?.uid : null)
        setCurrentUser(await getUserDoc(user.uid))
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return <UserContextProvider value={value}>{children}</UserContextProvider>
}
