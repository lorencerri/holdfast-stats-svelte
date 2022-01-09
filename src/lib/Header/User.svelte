<script>
	import { sdk } from '$lib/client.js';

	const fetchUser = async () => {
		const account = await sdk.account.get();
		console.log(account);
		return account;
	};

	const login = async () => {
		sdk.account.createOAuth2Session(
			'discord',
			'http://paste.plexidev.org?success=true',
			'http://paste.plexidev.org?success=false'
		);
	};

	const logout = async () => {
		sdk.account.deleteSession('current');
	};

	let promise = fetchUser();
</script>

{#await promise}
	<button class="btn btn-circle btn-ghost loading" />
{:then user}
	{user.name}
	<button on:click={logout} class="btn btn-sm btn-ghost">Logout</button>
{:catch}
	<button on:click={login} class="btn btn-sm btn-ghost">Login with Discord</button>
{/await}
