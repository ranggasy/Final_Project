import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'scanned_qrcodes';

export const saveScannedData = async (data: string) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const list = existing ? JSON.parse(existing) : [];
    list.push({ id: Date.now(), data, timestamp: new Date().toISOString() });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save QR code:', err);
  }
};

export const getScannedData = async () => {
  try {
    const result = await AsyncStorage.getItem(STORAGE_KEY);
    return result ? JSON.parse(result) : [];
  } catch (err) {
    console.error('Failed to get QR data:', err);
    return [];
  }
};

export const clearScannedData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear QR data:', err);
  }
};