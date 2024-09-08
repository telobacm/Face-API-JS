import { create } from 'zustand'

// Define the User type based on your API response
interface User {
  id: number
  name: string
  password: string
  nip: string
  email: string
  role: string
  position: string
  gender: string
  whitelist: boolean
  kampusId: number
  unitId: number
  subunitId: number
  descriptors: object
  kampus: object
  unit: object
  subunit: object
  isDeleted: boolean
  // Add other user properties here
}

// Define the store's state and actions types
interface UserStore {
  user: User | null
  setUser: (user: User) => void
  updateUser: (updatedUser: Partial<User>) => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updatedUser) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    })),
}))

export default useUserStore
