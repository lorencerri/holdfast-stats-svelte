<script>
	import { sdk } from '$lib/client.js';

	const fetchUser = async () => {
		const account = sdk.account.get();
		return account;
	};

	const login = async () => {
		sdk.account.createOAuth2Session('discord', 'https://plexidev-paste.vercel.app?success=true');
	};

	let promise = fetchUser();
</script>

{#await promise}
	<button class="btn btn-circle btn-ghost loading" />
{:then identity}
	{console.log(identity)}
{:catch}
	<button on:click={login} class="btn btn-sm btn-ghost">Login with Discord</button>
{/await}
