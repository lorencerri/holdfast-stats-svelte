<script context="module">
	import { supabase } from '$lib/client';
	import { user } from '$lib/user';

	export async function load(ctx) {
		const { id } = ctx.params;

		let { data } = await supabase.from('servers').select('*').eq('id', id);
		data = data[0];

		return { props: { data } };
	}
</script>

<script>
	import AdminSettings from '$lib/AdminSettings.svelte';

	export let data;

	let settingsState = false;

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
				<h1 class="mb-5 text-4xl font-bold">{data.name}</h1>
				{#if $user && data.owner_id === user.getId()}
					<button class="btn btn-sm" on:click={() => (settingsState = true)}>Admin Settings</button>
					<div class={`modal ${settingsState && 'modal-open'}`}>
						<div class="modal-box">
							<AdminSettings {data} />
							<div class="modal-action">
								<button on:click={() => (settingsState = false)} class="btn">Close</button>
							</div>
						</div>
					</div>
				{/if}
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
