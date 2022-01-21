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
		ContentSwitcher,
		Switch,
		SideNav,
		TreeView,
		InlineLoading
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
	let selectedIndex = 0;

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

	supabase
		.from('kills')
		.on('*', async () => {
			console.log('kills updated');
			fetchKills();
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
	<ContentSwitcher size="sm" bind:selectedIndex>
		<Switch style="border-radius: 0;" text="Player Kill Log" />
		<Switch style="border-radius: 0;" text="Heatmap" />
	</ContentSwitcher>
	<span style="padding: 20px 15px 6px; color: white; font-weight: bold;">Rounds</span>
	{#if rounds.length === 0}
		<InlineLoading style="padding: 15px;" description="Loading..." />
	{:else}
		<TreeView bind:activeId children={[{ id: 0, text: 'Cumulative' }, ...roundsIndex]} />
	{/if}
</SideNav>

<Content style="background: transparent; padding: 0;">
	{#if selectedIndex === 0}
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
	{:else if selectedIndex === 1}
		<Heatmap rows={filterByRound(kills, activeId)} />
	{/if}
</Content>
