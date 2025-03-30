'use client'

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  Suspense,
  createContext,
  useContext,
} from 'react'
import { useNewSimulation } from './new-simulation-modals'

export const ModalContext = createContext<{
  setShowNewSimulationModal: Dispatch<SetStateAction<boolean>>
}>({
  setShowNewSimulationModal: () => {},
})

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <ModalProviderClient>{children}</ModalProviderClient>
    </Suspense>
  )
}

const ModalProviderClient = ({ children }: { children: ReactNode }) => {
  const { NewSimulationModal, setShowNewSimulationModal } = useNewSimulation()

  return (
    <ModalContext.Provider value={{ setShowNewSimulationModal }}>
      <NewSimulationModal />
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = ModalContext

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }

  return useContext(ModalContext)
}
