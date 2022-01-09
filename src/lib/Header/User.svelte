<script>
	import { sdk } from '$lib/client.js';

	const fetchUser = async () => {
		const account = await sdk.account.get();
		console.log(account);

		sdk.subscribe('account', () => {
			promise = fetchUser();
		});

		return account;
	};

	const login = async () => {
		sdk.account.createOAuth2Session(
			'discord',
			`${document.location.origin}?success=true`,
			`${document.location.origin}?success=false`
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
	<button on:click={logout} class="btn btn-sm btn-ghost">{user.name}</button>
{:catch error}
	{(console.log(error), '')}
	<button on:click={login} class="btn btn-sm btn-ghost">Login with Discord</button>
{/await}
