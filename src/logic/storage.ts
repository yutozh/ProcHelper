import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const storageConf = useStorageLocal<any>('settings', {})
