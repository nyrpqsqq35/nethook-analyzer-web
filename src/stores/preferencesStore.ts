import { create } from 'zustand/react'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

export type DisplayAsBytes = 'vdf' | 'vdf.lzma' | 'pb' | 'ascii' | 'utf8' | 'hex'
export type DisplayAsSteamID = 'steamid.2' | 'steamid.3'
export type DisplayAsIP = 'ip.4' | 'ip.6'
export type DisplayAsString = 'str.raw' | 'str.jwt'
export type DisplayAsNumeric = 'gid' | 'datetime' | 'chars' | 'chars.reversed'
export type DisplayAs = DisplayAsBytes | DisplayAsSteamID | DisplayAsIP | DisplayAsString | DisplayAsNumeric

type FieldKey = string
export type DescLocator = [folderName: 'steam' | 'webui' | 'csgo', fileDescName: string, messageDescTypeName: string]
export interface FieldPrefsPb {
  desc: DescLocator
}
export interface FieldPrefsEnum {
  _: null
}
export interface FieldPrefs {
  displayAs?: DisplayAs
  displayAsAdditional?: FieldPrefsPb | FieldPrefsEnum
}

export type EconItemAttributeDisplayAs = 'string' | 'float' | 'uint32' | 'hex'
export interface EconItemAttributePrefs {
  displayAs?: EconItemAttributeDisplayAs
}

export interface PreferencesState {
  hideDefaultFields: boolean
  qualifiedTypeNames: boolean
  fields: Record<FieldKey, FieldPrefs>
  econItemAttributes: Record<string, EconItemAttributePrefs>
}

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      // @ts-expect-error types need the set function for some reason
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      immer((set) => {
        return { hideDefaultFields: false, qualifiedTypeNames: false, fields: {}, econItemAttributes: {} }
      }),
      {
        name: 'PreferencesStore',
        storage: createJSONStorage(() => localStorage),
        migrate: (persistedState, curVer) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ps = persistedState as any
          if (ps) {
            if (curVer < 2) {
              ps.fields = {}
            }
            if (curVer < 3) {
              ps.qualifiedTypeNames = false
            }
            if (curVer < 4) {
              ps.econItemAttributes = {}
            }
            if (curVer < 5) {
              for (const key in ps.fields) {
                if (ps.fields[key].displayAs === 'pb') {
                  delete ps.fields[key]
                }
              }
            }
          }
          return ps
        },
        version: 5,
      },
    ),
  ),
)

export function useFieldPrefs(fieldKey?: FieldKey): FieldPrefs | undefined {
  return usePreferencesStore(useShallow((e) => (fieldKey ? e.fields[fieldKey] : undefined)))
}

export function removeFieldPrefs(fieldKey: FieldKey) {
  return usePreferencesStore.setState((e) => {
    delete e.fields[fieldKey]
  })
}
export function updateDisplayAs<T extends FieldPrefs['displayAsAdditional']>(
  fieldKey: FieldKey,
  displayAs: DisplayAs,
  displayAsAdditional?: T,
) {
  return usePreferencesStore.setState((e) => {
    if (e.fields[fieldKey]) {
      if (e.fields[fieldKey].displayAs === displayAs) {
        // TODO: later should change this to just erase the displayAs member?
        delete e.fields[fieldKey]
      } else {
        e.fields[fieldKey].displayAs = displayAs
        e.fields[fieldKey].displayAsAdditional = displayAsAdditional
      }
    } else {
      e.fields[fieldKey] = { displayAs, displayAsAdditional }
    }
  })
}

export function useEconPrefs(key?: string): EconItemAttributePrefs | undefined {
  return usePreferencesStore(useShallow((e) => (key ? e.econItemAttributes[key] : undefined)))
}

export function removeEconPrefs(key: string) {
  return usePreferencesStore.setState((e) => {
    delete e.fields[key]
  })
}
export function updateEconDisplayAs(key: string, displayAs: EconItemAttributeDisplayAs) {
  return usePreferencesStore.setState((e) => {
    if (e.econItemAttributes[key]) {
      if (e.econItemAttributes[key].displayAs === displayAs) {
        delete e.econItemAttributes[key]
      } else {
        e.econItemAttributes[key].displayAs = displayAs
      }
    } else {
      e.econItemAttributes[key] = { displayAs }
    }
  })
}
