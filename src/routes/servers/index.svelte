<script>
	import { getSession } from '$lib/client';
	import { goto } from '$app/navigation';
	import { user } from '$lib/user';

	let serverName = '';
	let error = '';
	let loading = false;

	const postServer = () => {
		new Promise(async (resolve, reject) => {
			if (!serverName) {
				error = 'Server name is required';
				return reject();
			}

			loading = true;

			let response = await fetch('https://holdfast-api.plexidev.org/servers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ access_token: getSession()?.access_token, name: serverName })
			});

			let data = await response.json();

			// Error
			if (!data || data.code !== 200) {
				error = data?.message || 'An unknown error occurred';
				loading = false;
				return reject();
			}

			// Success
			if (data.code === 200) {
				goto(`/server/${data.id}`);
			}

			loading = false;
			console.log(data);
		});
	};
</script>

{#if error}
	<div class="alert alert-error mb-2">
		<div class="flex-1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="w-6 h-6 mx-2 stroke-current"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
				/>
			</svg>
			{error}
		</div>
	</div>
{/if}
<div class="hero">
	<div class="text-center hero-content">
		{#if $user}
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">Servers</h1>
				<p class="mb-5">Manage the stats for your Holdfast: Nations At War servers</p>
				<br />

				<div class="form-control">
					<div class="flex space-x-2">
						<input
							bind:value={serverName}
							disabled={loading}
							type="text"
							placeholder="Server Name"
							class={`w-full input ${error && 'input-error'}`}
						/>
						<button
							class={`btn btn-success ${loading ? 'loading disabled' : ''}`}
							on:click={postServer}>New</button
						>
					</div>
				</div>
			</div>
		{:else}
			<h1 class="mb-5 text-xl text-error">
				Sorry, you need to be logged in to access and create servers.
			</h1>
		{/if}
	</div>
</div>
