import { create } from 'zustand/react'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface PreferencesState {
  hideDefaultFields: boolean
}

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      immer(() => {
        return { hideDefaultFields: false } as PreferencesState
      }),
      {
        name: 'PreferencesStore',
        storage: createJSONStorage(() => localStorage),
        // partialize: (state) => ({ hideDefaultFields: state.hideDefaultFields }),
        version: 1,
      },
    ),
  ),
)
