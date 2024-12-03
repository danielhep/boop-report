'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage } from "zustand/middleware"
import { devtools } from "zustand/middleware"
import { generateOrcaStats, parseOrcaFiles } from "@/orca_lib/processingUtils"
import type { OrcaStats, UnprocessedOrcaCard } from "@/orca_lib/types"

// Define store types
export interface OrcaState {
  rawData: UnprocessedOrcaCard[] | null
  processedStats: OrcaStats | null
}

export interface OrcaActions {
  setRawData: (data: UnprocessedOrcaCard[]) => void
  processData: () => void
  uploadFiles: (files: File[]) => Promise<void>
}

export type OrcaStore = OrcaState & OrcaActions

// Create store factory
export const createOrcaStore = (initState: OrcaState = { rawData: null, processedStats: null }) => {
  return createStore<OrcaStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initState,
          setRawData: (data) => {
            set({ rawData: data })
            get().processData()
          },
          processData: () => {
            const rawData = get().rawData
            if (!rawData) return
            const stats = generateOrcaStats(rawData)
            set({ processedStats: stats })
          },
          uploadFiles: async (files) => {
            const rawData = await parseOrcaFiles(files)
            get().setRawData(rawData)
          },
        }),
        {
          name: "orca-storage",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({ rawData: state.rawData }),
          onRehydrateStorage: () => {
            return (state) => {
              if (state?.rawData) {
                state.processData()
              }
            }
          },
        }
      )
    )
  )
}

// Create context
export type OrcaStoreApi = ReturnType<typeof createOrcaStore>

export const OrcaStoreContext = createContext<OrcaStoreApi | undefined>(
  undefined
)

// Create provider component
export interface OrcaStoreProviderProps {
  children: ReactNode
}

export const OrcaStoreProvider = ({ children }: OrcaStoreProviderProps) => {
  const storeRef = useRef<OrcaStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createOrcaStore()
  }

  return (
    <OrcaStoreContext.Provider value={storeRef.current}>
      {children}
    </OrcaStoreContext.Provider>
  )
}

// Create hook to use the store
export const useOrcaStore = <T,>(selector: (store: OrcaStore) => T): T => {
  const orcaStoreContext = useContext(OrcaStoreContext)

  if (!orcaStoreContext) {
    throw new Error('useOrcaStore must be used within OrcaStoreProvider')
  }

  return useStore(orcaStoreContext, selector);
} 