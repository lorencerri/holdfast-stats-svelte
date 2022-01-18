import { writable } from 'svelte/store';
import { getUser, supabase } from '$lib/client';

function createUser() {
	const { subscribe, set, update } = writable(getUser());

	return {
		subscribe,
		set,
		update,
		getUsername: () => {
			return getUser()?.user_metadata?.name;
		},
		getAvatar: () => {
			return getUser()?.user_metadata?.avatar_url;
		},
		getId: () => {
			return getUser()?.user_metadata?.id;
		}
	};
}

export const user = createUser(getUser());

supabase.auth.onAuthStateChange((_, session) => {
	user.set(session?.user);
});
