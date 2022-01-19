<script>
	import { getSession } from '$lib/client';
	export let server;

	let key = '';
	let hidden = true;

	const fetchToken = async () => {
		let response = await fetch(`https://holdfast-api.plexidev.org/servers/${server.id}/token`, {
			headers: {
				'Content-Type': 'application/json',
				authorization: 'access_token ' + getSession()?.access_token
			}
		});
		let json = await response.json();

		// Success
		if (json.code === 200) {
			key = json.token;
		}
	};

	fetchToken();
</script>

<h2 class="text-xl font-bold text-left mb-5">Administrator Settings</h2>

<div class="mx-5">
	<div class="form-control">
		<span class="label mt-2 text-left">Public Stats URL</span>
		<span class="label-text text-left" />
		<input
			type="text"
			placeholder="Server Name"
			disabled="disabled"
			value={`https://holdfast.plexidev.org/server/${server.id}`}
			class="input input-bordered text-gray-100"
		/>
	</div>

	<div class="divider" />

	<div class="form-control">
		<span class="label mt-2 text-left">Server Name</span>
		<span class="label-text text-left" />
		<input type="text" placeholder="Server Name" value={server.name} class="input  bg-neutral" />
	</div>

	<div class="form-control">
		<span class="label mt-2 text-left">
			Private Key <span class="text-error label-text-alt">Do not share, treat it as a password</span
			>
		</span>
		<span class="label-text text-left" />
		<input
			type="text"
			placeholder="Loading..."
			disabled="disabled"
			value={hidden ? 'Hover to reveal' : key}
			class="input input-bordered loading text-gray-100"
			on:pointerenter={() => {
				hidden = false;
			}}
			on:pointerleave={() => {
				hidden = true;
			}}
		/>
		<span class="label">
			<a
				href="https://steamcommunity.com/sharedfiles/filedetails/?id=2715432949"
				target="_blank"
				rel="noopener noreferrer"
				class="label-text-alt link link-accent">Setup Guide</a
			>
		</span>
	</div>
</div>
