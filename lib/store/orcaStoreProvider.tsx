'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage } from "zustand/middleware"
import { devtools } from "zustand/middleware"
import { generateOrcaStats, parseOrcaFiles } from "@/lib/orca/processingUtils"
import type { OrcaStats, UnprocessedOrcaCard } from "@/lib/orca/types"

// Define store types
export interface OrcaState {
  rawData: UnprocessedOrcaCard[] | null
  processedStats: OrcaStats | null
  lastUploadDate: string | null
  filter2024: boolean
}

export interface OrcaActions {
  setRawData: (data: UnprocessedOrcaCard[]) => void
  processData: () => void
  uploadFiles: (files: File[]) => Promise<void>
  clearData: () => void
  setFilter2024: (filter: boolean) => void
}

export type OrcaStore = OrcaState & OrcaActions

// Create store factory
export const createOrcaStore = (initState: OrcaState = { 
  rawData: null, 
  processedStats: null, 
  lastUploadDate: null,
  filter2024: false
}) => {
  return createStore<OrcaStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initState,
          setRawData: (data) => {
            const existingData = get().rawData || []
            set({ 
              rawData: [...existingData, ...data],
              lastUploadDate: new Date().toISOString()
            })
            get().processData()
          },
          processData: () => {
            const rawData = get().rawData
            const filter2024 = get().filter2024
            if (!rawData) return
            const stats = generateOrcaStats(rawData, filter2024)
            set({ processedStats: stats })
          },
          uploadFiles: async (files) => {
            const newData = await parseOrcaFiles(files)
            get().setRawData(newData)
          },
          clearData: () => {
            set({ rawData: null, processedStats: null, lastUploadDate: null })
          },
          setFilter2024: (filter) => {
            set({ filter2024: filter })
            get().processData()
          }
        }),
        {
          name: "orca-storage",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({ 
            rawData: state.rawData,
            lastUploadDate: state.lastUploadDate,
            filter2024: state.filter2024
          }),
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