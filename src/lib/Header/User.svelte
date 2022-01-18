<script>
	const fetchUser = async () => {};

	const login = async () => {};

	const logout = async () => {};

	let promise = fetchUser();
</script>

{#await promise}
	<button class="btn btn-circle btn-ghost loading" />
{:then user}
	<button on:click={logout} class="btn btn-sm btn-ghost">{user.name}</button>
{:catch error}
	<button on:click={login} class="btn btn-sm btn-ghost">Login with Discord</button>
{/await}
