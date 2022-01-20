<script context="module">
	import { supabase } from '$lib/client';
	import { user } from '$lib/user';

	export async function load(ctx) {
		const { id } = ctx.params;

		let { data: server } = await supabase.from('servers').select('*').eq('id', id);
		server = server[0];

		let { data: kills } = await supabase
			.from('kills')
			.select('*, killer(steam_id, *), victim(steam_id, *)')
			.eq('server', server.id);

		return { props: { server, kills } };
	}
</script>

<script>
	import AdminSettings from '$lib/AdminSettings.svelte';

	export let server;
	export let kills;

	let separateByTarget = false;

	// Separate By Player
	const combineByPlayer = (kills) => {
		const k = kills.reduce((acc, cur) => {
			const { steam_id: asi, username: au, regiment: ar } = cur.killer;
			const { steam_id: vsi, username: vu, regiment: vr } = cur.victim;

			// Killer
			if (!acc[asi]) {
				acc[asi] = { steam_id: asi, kills: 1, deaths: 0, username: au, regiment: ar };
			} else acc[asi].kills += 1;

			// Victim
			if (!acc[vsi]) {
				acc[vsi] = { steam_id: vsi, kills: 0, deaths: 1, username: vu, regiment: vr };
			} else acc[vsi].deaths += 1;

			return acc;
		}, {});
		return Object.values(k).sort((a, b) => (a.kills < b.kills ? 1 : -1));
	};

	// Separate By Player vs Target
	const separateByPlayerVsTarget = (kills) => {
		const k = kills.reduce((acc, cur) => {
			const { steam_id: asi, username: au, regiment: ar } = cur.killer;
			const { steam_id: vsi, username: vu, regiment: vr } = cur.victim;

			// Find the index of the fight in the accumulator
			let index = acc.findIndex((f) => f[asi] && f[vsi]);

			// If not found, add the fight to the accumulator
			if (index == -1) {
				acc.push({
					[asi]: { steam_id: asi, username: au, regiment: ar, kills: 0, deaths: 0 },
					[vsi]: { steam_id: vsi, username: vu, regiment: vr, kills: 0, deaths: 0 }
				});
				index = acc.length - 1;
			}

			// Update the fight
			acc[index][asi].kills += 1;
			acc[index][vsi].deaths += 1;

			return acc;
		}, []);
		return k
			.map((f) => Object.values(f))
			.sort((a, b) => (a[0].kills + a[1].kills < b[0].kills + b[1].kills ? 1 : -1));
	};

	console.log(separateByPlayerVsTarget(kills));

	supabase
		.from('kills')
		.on('*', async () => {
			let { data } = await supabase
				.from('kills')
				.select('*, killer(steam_id, *), victim(steam_id, *)')
				.eq('server', server.id);
			kills = data;
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
						<label class="cursor-pointer label">
							<span class="label-text">Separate By Fight</span>
							<input type="checkbox" bind:checked={separateByTarget} class="toggle" />
						</label>
						<table class="table w-full">
							<thead>
								<tr>
									{#if separateByTarget}
										<th>Kills</th>
										<th />
										<th>Fight</th>
										<th />
										<th>Kills</th>
									{:else}
										<th>Player</th>
										<th>Kills</th>
										<th>Deaths</th>
									{/if}
								</tr>
							</thead>
							<div class="mb-2" />
							<tbody>
								{#if separateByTarget}
									{#each separateByPlayerVsTarget(kills) as fight, i}
										<tr>
											<td
												class={`border-none ${i === 0 && 'rounded-tl-lg'} ${
													separateByPlayerVsTarget(kills).length === i + 1 && 'rounded-bl-lg'
												} ${fight[0].kills > fight[1].kills ? 'text-success' : 'text-error'}`}
												>{fight[0].kills}</td
											>
											<td class="border-none text-right">
												<span class="text-warning"
													>{fight[0].regiment ? `[${fight[0].regiment}]` : ''}</span
												>
												{fight[0].username}
											</td>
											<td class="border-none text-center">
												<span class="font-bold">VS</span>
											</td>
											<td class="border-none text-left">
												<span class="text-warning"
													>{fight[1].regiment ? `[${fight[1].regiment}]` : ''}</span
												>
												{fight[1].username}
											</td>
											<td
												class={`border-none ${
													separateByPlayerVsTarget(kills).length === i + 1 && 'rounded-br-lg'
												} ${i === 0 && 'rounded-tr-lg'} ${
													fight[1].kills > fight[0].kills ? 'text-success' : 'text-error'
												}`}>{fight[1].kills}</td
											>
										</tr>
									{/each}
								{:else}
									{#each combineByPlayer(kills) as player, i}
										<tr>
											<td
												class={`${i === 0 && 'rounded-tl-lg'} ${
													combineByPlayer(kills).length === i + 1 && 'rounded-bl-lg'
												} border-none`}>{player.username}</td
											>
											<td class="border-none">{player.kills}</td>
											<td
												class={`${combineByPlayer(kills).length === i + 1 && 'rounded-br-lg'} ${
													i === 0 && 'rounded-tr-lg'
												} border-none`}>{player.deaths}</td
											>
										</tr>
									{/each}
								{/if}
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
