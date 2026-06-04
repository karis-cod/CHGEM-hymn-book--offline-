// FILE PATH: constants/storage-keys.ts
// PURPOSE: All AsyncStorage key constants in one place.
// RULE: Never hardcode storage key strings anywhere else.

export const StorageKeys = {
  FAVOURITES: '@chgem/favourites',
  RECENTS: '@chgem/recents',
  SETTINGS: '@chgem/settings',
  DB_VERSION: '@chgem/db_version',
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];