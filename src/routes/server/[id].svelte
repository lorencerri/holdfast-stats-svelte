<script context="module">
	import { supabase } from '$lib/client';

	export async function load(ctx) {
		const { id } = ctx.params;

		let { data } = await supabase.from('servers').select('*').eq('id', id);
		data = data[0];

		return { props: { data } };
	}
</script>

<script>
	export let data;

	console.log(data);
</script>

<svelte:head>
	{#if data}
		<title>{data.name}</title>
	{/if}
</svelte:head>

<div class="hero">
	<div class="text-center hero-content">
		<div class="max-w-md">
			{#if data}
				<h1 class="mb-5 text-5xl font-bold">{data.name}</h1>
				<p class="mb-5">
					Stats are linked to unique tokens and can be used on multiple servers.
					<span class="text-error">Your token will not appear after this,</span>
				</p>
			{:else}
				<h1 class="mb-5 text-5xl font-bold">Unknown Server</h1>
				<p class="mb-5">
					A server with the specified ID does not exist. You can create a server by logging in and
					clicking on <a class="link link-accent" href="/servers">servers</a> in the top right.
				</p>
			{/if}
		</div>
	</div>
</div>
