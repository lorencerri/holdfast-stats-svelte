<script>
	import { Content, SideNav, Dropdown } from 'carbon-components-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const { id } = $page.params;
</script>

<SideNav isOpen>
	<span style="padding: 15px 0 0 15px; color: font-weight: bold;"> Data View</span>
	<Dropdown
		style="border-bottom: 1px solid #393939;"
		label="Player Kill Log"
		on:select={(e) => {
			goto(e.detail.selectedItem.path);
		}}
		items={[
			{ id: 0, text: 'Player Kill Log', path: `/server/${id}` },
			{ id: 2, text: 'Leaderboard', path: `/server/${id}/leaderboard` },
			{ id: 1, text: 'Heatmap', path: `/server/${id}/heatmap` }
		]}
	/>

	<span style="padding: 15px; border-bottom: 1px solid #393939;">Global Options</span>
</SideNav>

<Content style="background: transparent;">
	<slot />
</Content>
