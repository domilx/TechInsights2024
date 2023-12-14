import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { syncData } from './SyncService';

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Call your sync function
    const response = await syncData();
    if (response.success) {
      console.log('Background fetch executed, new data fetched.');
      return 'new-data';
    } else {
      console.log('Background fetch executed, but no new data.');
      return 'no-data';
    }
  } catch (err) {
    console.error('Background fetch failed:', err);
    return 'failed';
  }
});

export async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
