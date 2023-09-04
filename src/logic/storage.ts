import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const storageSettings = useStorageLocal<any>('settings', {})
export const storageConf = useStorageLocal<any>('conf', {})
