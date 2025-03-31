'use client'

import { useCallback, useMemo, useState } from 'react'
import { Modal } from '../modal'
import { Button } from '../ui/button'

const ExecuteSimulationModal = ({
  setShowExecuteSimulationModal,
  showExecuteSimulationModal,
}: {
  showExecuteSimulationModal: boolean
  setShowExecuteSimulationModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Modal
      showModal={showExecuteSimulationModal}
      setShowModal={setShowExecuteSimulationModal}
    >
      <h3 className="border-b border-neutral-200 px-4 py-4 text-lg font-medium sm:px-6">
        Executar simulação
      </h3>
    </Modal>
  )
}

const ExecuteSimulationModalButton = ({
  setShowExecuteSimulationModal,
}: {
  setShowExecuteSimulationModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div>
      <Button
        text="Executar simulação"
        variant="success"
        shortcut="E"
        onClick={() => setShowExecuteSimulationModal(true)}
      />
    </div>
  )
}

export const useExecuteSimulation = () => {
  const [showExecuteSimulationModal, setShowExecuteSimulationModal] =
    useState(false)

  const ExecuteSimulationModalCallback = useCallback(() => {
    return (
      <ExecuteSimulationModal
        showExecuteSimulationModal={showExecuteSimulationModal}
        setShowExecuteSimulationModal={setShowExecuteSimulationModal}
      />
    )
  }, [showExecuteSimulationModal])

  const ExecuteSimulationModalButtonCallback = useCallback(() => {
    return (
      <ExecuteSimulationModalButton
        setShowExecuteSimulationModal={setShowExecuteSimulationModal}
      />
    )
  }, [])

  return useMemo(
    () => ({
      ExecuteSimulationModal: ExecuteSimulationModalCallback,
      ExecuteSimulationModalButton: ExecuteSimulationModalButtonCallback,
      setShowExecuteSimulationModal,
    }),
    [ExecuteSimulationModalCallback, ExecuteSimulationModalButtonCallback]
  )
}
