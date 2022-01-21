import { writable } from 'svelte/store';
import { getUser, supabase } from '$lib/client';

function createUser() {
	const { subscribe, set, update } = writable(getUser());

	return {
		subscribe,
		set,
		update,
		getUser: () => {
			return getUser()
		},
		getUsername: () => {
			return getUser()?.user_metadata?.name;
		},
		getAvatar: () => {
			return getUser()?.user_metadata?.avatar_url;
		},
		getId: () => {
			return getUser()?.user_metadata?.provider_id;
		},
		getServers: async function () {
			const user_id = this.getId();
			const { data } = await supabase.from('servers').select('*').eq('owner_id', user_id)

			return data;
		}
	};
}

export const user = createUser(getUser());

supabase.auth.onAuthStateChange((_, session) => {
	user.set(session?.user);
});
