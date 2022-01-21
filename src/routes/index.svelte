<script context="module">
	import { supabase } from '$lib/client';
	export async function load(ctx) {
		const { data: servers } = await supabase.from('servers').select('*');
		const { count: kills } = await supabase
			.from('kills')
			.select('*', { count: 'exact', head: true });
		return { props: { servers, kills } };
	}
</script>

<script>
	import {
		InlineLoading,
		Link,
		DataTable,
		Content,
		SideNav,
		TreeView
	} from 'carbon-components-svelte';
	import BareMetalServer20 from 'carbon-icons-svelte/lib/BareMetalServer20';

	export let servers = [];
	export let kills = 0;

	const getServerRowCount = async (serverId, row) => {
		if (!row) return null;
		const { count } = await supabase
			.from(row)
			.select('*', { count: 'exact', head: true })
			.eq('server', serverId);
		return count;
	};
</script>

<SideNav isOpen>
	<TreeView children={[{ id: 0, text: 'No Server Selected', icon: BareMetalServer20 }]} />
</SideNav>

<Content style="background: transparent; padding: 0;">
	<DataTable
		title="Servers"
		style="padding: 0; background-color: transparent;"
		description={`Currently tracking ${kills} kills in ${servers.length} servers.`}
		headers={[
			{ key: 'name', value: 'Name' },
			{ key: 'kills', value: 'Kills' },
			{ key: 'rounds', value: 'Rounds' }
		]}
		rows={servers}
	>
		<span slot="cell" let:row let:cell>
			{#if cell.key === 'name'}
				<Link href={`/server/${row.id}`}>
					{cell.value}
				</Link>
			{:else if cell.key === 'kills'}
				{#await getServerRowCount(row.id, 'kills')}
					<InlineLoading />
				{:then kills}
					{kills}
				{/await}
			{:else if cell.key === 'rounds'}
				{#await getServerRowCount(row.id, 'rounds')}
					<InlineLoading />
				{:then kills}
					{kills}
				{/await}
			{/if}
		</span>
	</DataTable>
</Content>
