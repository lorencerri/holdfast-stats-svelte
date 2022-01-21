<script context="module">
	import { supabase } from '$lib/client';
	import { user } from '$lib/user';

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
	import { DataTable, Loading, Content, SideNav, TreeView } from 'carbon-components-svelte';
	import AdminSettingsModal from '$lib/AdminSettingsModal.svelte';
	import ago from 's-ago';
	import getEnum from '$lib/enums.js';

	export let server;

	let kills = [];
	let rounds = [];
	let roundsIndex = [];
	let loading = false;

	const fetchKills = async () => {
		loading = true;
		const { data } = await supabase
			.from('kills')
			.select('*, killer(steam_id, *), victim(steam_id, *)')
			.eq('server', server.id)
			.order('timestamp', { ascending: false });

		loading = false;
		kills = data;
	};

	const fetchRounds = async () => {
		const { data } = await supabase
			.from('rounds')
			.select('*')
			.eq('server', server.id)
			.order('timestamp', { ascending: false });

		rounds = data;
		roundsIndex = rounds.map((v, i) => ({ id: i + 2, text: ago(new Date(v.timestamp)) }));
	};

	supabase
		.from('kills')
		.on('*', async () => {
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

	<span style="padding: 20px 15px 6px; color: white; font-weight: bold;">Rounds</span>
	<TreeView
		activeId={0}
		children={[{ id: 0, text: 'Cumulative' }, { id: 1, text: 'Current' }, ...roundsIndex]}
	/>
</SideNav>

<Content style="background: transparent; padding: 0;">
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
		rows={kills}
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
</Content>
