<script context="module">
	import { supabase } from '$lib/client';
	import { user } from '$lib/user';
	import { dataStore } from '$lib/dataStore';

	export async function load(ctx) {
		const { id } = ctx.params;

		if (!id) {
			ctx.redirect('/');
			return;
		}

		let { data: server } = await supabase.from('servers').select('*').eq('id', id);
		server = server[0];
		if (!server) return { props: { server: null } };

		return { props: { server } };
	}
</script>

<script>
	import {
		DataTable,
		Loading,
		Content,
		SideNav,
		Checkbox,
		TreeView,
		Grid,
		Row,
		Column,
		Dropdown,
		DropdownSkeleton,
		InlineLoading,
		Pagination
	} from 'carbon-components-svelte';
	import AdminSettingsModal from '$lib/AdminSettingsModal.svelte';
	import Heatmap from '$lib/Heatmap.svelte';
	import ago from 's-ago';
	import getEnum from '$lib/enums.js';

	export let server;

	let kills = [];
	let rounds = [];
	let roundsIndex = [];
	let loading = false;
	let activeId = 0;
	let selectedIndex = '0';
	let checked = false;
	let separateByInteraction = true;

	const filterByRound = (r, i) => {
		if (i === 0) return r;
		else return r.filter((x) => x.round === roundsIndex[i - 2]?.ref);
	};

	const fetchKills = async () => {
		loading = true;
		const { data } = await supabase
			.from('kills')
			.select('*, killer(steam_id, *), victim(steam_id, *)')
			.eq('server', server.id)
			.order('timestamp', { ascending: false });

		kills = data;
		loading = false;
	};

	const fetchRounds = async () => {
		const { data } = await supabase
			.from('rounds')
			.select('*')
			.eq('server', server.id)
			.order('timestamp', { ascending: false });

		rounds = data;
		roundsIndex = rounds.map((v, i) => ({
			id: i + 2,
			text: i === 0 ? 'Current' : ago(new Date(v.timestamp)),
			ref: v.id
		}));
	};

	const combineByPlayer = (kills) => {
		let count = 0;
		const k = kills.reduce((acc, cur, index) => {
			const { steam_id: asi, username: au, regiment: ar } = cur.killer;
			const { steam_id: vsi, username: vu, regiment: vr } = cur.victim;

			// Killer
			if (!acc[asi]) {
				acc[asi] = {
					steam_id: asi,
					kills: 1,
					deaths: 0,
					username: au,
					regiment: ar,
					id: count++,
					rounds: new Set([cur.round])
				};
			} else {
				acc[asi].rounds.add(cur.round);
				acc[asi].kills += 1;
			}
			// Victim
			if (!acc[vsi]) {
				acc[vsi] = {
					steam_id: vsi,
					kills: 0,
					deaths: 1,
					username: vu,
					regiment: vr,
					id: count++,
					rounds: new Set([cur.round])
				};
			} else {
				acc[vsi].rounds.add(cur.round);
				acc[vsi].deaths += 1;
			}
			return acc;
		}, {});
		return Object.values(k)
			.map((i) => {
				return {
					...i,
					kd: (i.kills / (i.deaths || 1)).toFixed(2),
					rounds: i.rounds.size
				};
			})
			.sort((a, b) => (a.kills < b.kills ? 1 : -1));
	};

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
			.map((f, i) => ({ data: Object.values(f), id: i }))
			.sort((a, b) =>
				a.data[0].kills + a.data[1].kills < b.data[0].kills + b.data[1].kills ? 1 : -1
			);
	};

	supabase
		.from('kills')
		.on('*', async () => {
			console.log('kills updated');
			fetchKills();
		})
		.subscribe();

	supabase
		.from('rounds')
		.on('*', async () => {
			console.log('rounds updated');
			fetchRounds();
		})
		.subscribe();

	if (server) {
		fetchRounds();
		fetchKills();
	}
</script>

<svelte:head>
	{#if server}
		<title>{server.name}</title>
	{/if}
</svelte:head>

{#if loading}
	<Loading />
{/if}

<SideNav isOpen>
	{#if $user && server.owner_id === user.getId()}
		<AdminSettingsModal {server} />
	{/if}
	<span style="color: white; font-weight: bold; margin: 18px 10px 10px 15px;">Data View</span>
	{#if rounds.length === 0}
		<DropdownSkeleton />
	{:else}
		<Dropdown
			bind:selectedIndex
			style="border-bottom: 1px solid #393939;"
			label="Player Kill Log"
			on:select={(e) => (selectedIndex = e.detail.selectedId)}
			items={[
				{ id: 0, text: 'Player Kill Log' },
				{ id: 2, text: 'Leaderboard' },
				{ id: 1, text: 'Heatmap' }
			]}
		/>
	{/if}

	{#if selectedIndex == 2}
		<Grid fullWidth style="border-bottom: 1px solid #393939; margin: 10px 0 0 0; padding: 15px;">
			<div style="color: white; font-weight: bold; margin-bottom: 10px;">Options</div>
			<Checkbox bind:checked={separateByInteraction} labelText="Separate by exchange" />
		</Grid>
	{/if}

	<Grid fullWidth style="margin: 10px 0 0 0; padding: 0;">
		<Row>
			<Column style="margin: 10px 0 0 15px; text-align: left; vertical-align: middle;" sm={1}>
				<span style="color: white; font-weight: bold;">Rounds</span>
			</Column>
			<Column style="margin-top: 2px;">
				<Checkbox bind:checked labelText="Show Inactive" />
			</Column>
		</Row>
	</Grid>

	{#if rounds.length === 0}
		<InlineLoading style="padding: 15px;" description="Loading..." />
	{:else}
		<TreeView
			bind:activeId
			children={[
				{ id: 0, text: 'Cumulative' },
				...roundsIndex.filter((item) => {
					if (checked) return true;
					return !!kills.find((x) => x.round == item.ref);
				})
			]}
		/>

		<!--bx--tree bx--tree--default-->
	{/if}
</SideNav>

<Content style="background: transparent; padding: 0;">
	{#if selectedIndex == 0}
		<DataTable
			title="Player Kill Log"
			description="A list of all player kills that have occurred on this server based on the scope."
			style="padding: 0; background-color: transparent;"
			headers={[
				{ key: 'killer', value: 'Attacker' },
				{ key: 'victim', value: 'Killed' },
				{ key: 'timestamp', value: 'Timestamp' },
				{ key: 'details', value: 'Weapon' },
				{ key: 'reason', value: 'Reason' }
			]}
			rows={filterByRound(kills, activeId)}
		>
			<span slot="cell" let:row let:cell>
				{#if cell.key === 'killer'}
					{#if row.killer.regiment}
						<span style="color: #f1c21b">[{row.killer.regiment}]</span>
					{/if}
					{row.killer.username}
				{:else if cell.key === 'victim'}
					{#if row.victim.regiment}
						<span style="color: #f1c21b">[{row.victim.regiment}]</span>
					{/if}
					{row.victim.username}
				{:else if cell.key === 'timestamp'}
					{new Date(row.timestamp).toLocaleTimeString()}
				{:else if cell.key === 'details'}
					{row.details}
				{:else if cell.key === 'reason'}
					{getEnum('EntityHealthChangedReason')[row.reason]}
				{/if}
			</span>
		</DataTable>
	{:else if selectedIndex == 1}
		<Heatmap rows={filterByRound(kills, activeId)} />
	{:else if selectedIndex == 2}
		{#if separateByInteraction}<DataTable
				title="Leaderboard"
				description="A sortable list of all players on this server based on the scope, separated by exchange."
				style="padding: 0; background-color: transparent;"
				headers={[
					{ key: 'player2', value: 'Player One' },
					{ key: 'player2-kills', value: 'Kills' },
					{ key: 'vs', value: 'VS' },
					{ key: 'player1', value: 'Player Two' },
					{ key: 'player1-kills', value: 'Kills' }
				]}
				rows={separateByPlayerVsTarget(filterByRound(kills, activeId))}
			>
				<span slot="cell" let:row let:cell>
					{#if cell.key === 'player1'}
						{#if row.data[0].regiment}
							<span style="color: #f1c21b">[{row.data[0].regiment}]</span>
						{/if}
						{row.data[0].username}
					{:else if cell.key === 'player2'}
						{#if row.data[1].regiment}
							<span style="color: #f1c21b">[{row.data[1].regiment}]</span>
						{/if}
						{row.data[1].username}
					{:else if cell.key === 'player1-kills'}
						<span
							style={`color: ${row.data[0].kills > row.data[0].deaths ? '#42be65' : '#fa4d56'}`}
						>
							{row.data[0].kills}
						</span>
					{:else if cell.key === 'player2-kills'}
						<span
							style={`color: ${row.data[1].kills > row.data[1].deaths ? '#42be65' : '#fa4d56'}`}
						>
							{row.data[1].kills}
						</span>
					{:else if cell.key === 'vs'}
						<span style="font-weight: bold;">VS</span>
					{/if}
				</span>
			</DataTable>
		{:else}
			<DataTable
				title="Leaderboard"
				description="A sortable list of all players on this server based on the scope."
				style="padding: 0; background-color: transparent;"
				headers={[
					{ key: 'username', value: 'Username' },
					{ key: 'kills', value: 'Kills' },
					{ key: 'deaths', value: 'Deaths' },
					{ key: 'kd', value: 'K/D' },
					{ key: 'rounds', value: 'Rounds Played' }
				]}
				rows={combineByPlayer(filterByRound(kills, activeId))}
			>
				<span slot="cell" let:row let:cell>
					{#if cell.key === 'username'}
						{#if row.regiment}
							<span style="color: #f1c21b">[{row.regiment}]</span>
						{/if}
						{row.username}
					{:else if cell.key === 'kills'}
						{row.kills}
					{:else if cell.key === 'deaths'}
						{row.deaths}
					{:else if cell.key === 'kd'}
						{row.kd}
					{:else if cell.key === 'rounds'}
						{row.rounds}
					{/if}
				</span>
			</DataTable>{/if}
	{/if}
</Content>
