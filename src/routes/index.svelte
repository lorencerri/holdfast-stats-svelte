<script context="module">
	import { supabase } from '$lib/client';

	export async function load(ctx) {
		let { data: servers } = await supabase.from('servers').select('*');

		return { props: { servers } };
	}
</script>

<script>
	export let servers = [];
	console.log(servers);
</script>

<div class="hero">
	<div class="text-center hero-content">
		<div class="max-w-lg">
			<h1 class="mb-5 text-5xl font-bold">Holdfast Player Stats</h1>
			<p class="mb-5">
				<i class="text-info"
					>Personal project by <a
						href="https://steamcommunity.com/id/TrueXPixels/"
						target="_blank"
						rel="noopener noreferrer"
						class="link link-accent no-underline">TrueXPixels</a
					>, not affiliated with Holdfast.</i
				>
			</p>
			<div class="divider m-10">Servers</div>
			{#each servers as server}
				<a href={`/server/${server.id}`}><button class="btn glass mx-2">{server.name}</button></a>
			{/each}
			<div class="divider m-10">Information</div>
			<a
				href="https://steamcommunity.com/sharedfiles/filedetails/?id=2715432949"
				target="_blank"
				rel="noopener noreferrer"
			>
				<button class="btn glass mx-2">Steam Workshop Page & Setup Guide</button>
			</a>
		</div>
	</div>
</div>
