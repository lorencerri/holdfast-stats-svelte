import { writable } from 'svelte/store';

function createDataStore() {
	const { subscribe, set, update } = writable({});

	const get = () => {
		return ''
	}

	return { subscribe, set, update, get }
}

export const dataStore = createDataStore();

// Realtime updates for active table & filters