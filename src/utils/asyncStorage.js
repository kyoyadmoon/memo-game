import { AsyncStorage } from 'react-native';

const STORAGE_PREFIX = '@App:';

export async function setItem(key, data) {
  try {
    await AsyncStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

export async function getItem(key) {
  try {
    let value = await AsyncStorage.getItem(STORAGE_PREFIX + key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export async function removeItem(key) {
  await AsyncStorage.removeItem(STORAGE_PREFIX + key);
}
