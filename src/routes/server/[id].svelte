<script context="module">
	import { supabase } from '$lib/client';
	import { user } from '$lib/user';

	export async function load(ctx) {
		const { id } = ctx.params;

		let { data: server } = await supabase.from('servers').select('*').eq('id', id);
		server = server[0];

		let { data: stats } = await supabase
			.from('stats')
			.select('*, player(steam_id, *)')
			.eq('server', id);

		return { props: { server, stats } };
	}
</script>

<script>
	import AdminSettings from '$lib/AdminSettings.svelte';

	export let server;
	export let stats;

	supabase
		.from('stats')
		.on('*', async () => {
			let { data } = await supabase
				.from('stats')
				.select('*, player(steam_id, *)')
				.eq('server', server.id);
			stats = data;
		})
		.subscribe();

	let settingsState = false;
</script>

<svelte:head>
	{#if server}
		<title>{server.name}</title>
	{/if}
</svelte:head>

<div class="hero">
	<div class="text-center">
		<div>
			{#if server}
				<h1 class="mb-5 text-4xl font-bold">{server.name}</h1>

				<div class="flex flex-col w-full">
					<div class="divider">
						{#if $user && server.owner_id === user.getId()}
							<button class="btn btn-sm" on:click={() => (settingsState = true)}
								>Admin Settings</button
							>
							<div class={`modal ${settingsState && 'modal-open'}`}>
								<div class="modal-box">
									<AdminSettings {server} />
									<div class="modal-action">
										<button on:click={() => (settingsState = false)} class="btn">Close</button>
									</div>
								</div>
							</div>
						{/if}
					</div>
					<div class="overflow-x-auto">
						<table class="table w-full">
							<thead>
								<tr>
									<th>Player</th>
									<th>Kills</th>
									<th>Deaths</th>
								</tr>
							</thead>
							<div class="mb-2" />
							<tbody>
								{#each stats as stat}
									<tr>
										<td class="rounded-l-lg">{stat.player.username}</td>
										<td>{stat.kills}</td>
										<td class="rounded-r-lg">{stat.deaths}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{:else}
				<h1 class="mb-5 text-4xl font-bold">Unknown Server</h1>
				<p class="mb-5">
					A server with the specified ID does not exist. You can create a server by logging in and
					clicking on <a class="link link-accent" href="/servers">servers</a> in the top right.
				</p>
			{/if}
		</div>
	</div>
</div>
