<script>
	import { HeaderPanelLink, OutboundLink, Modal, TextInput } from 'carbon-components-svelte';

	import { getSession } from '$lib/client';
	import { goto } from '$app/navigation';
	import { user } from '$lib/user';

	let value = '';
	let open = false;
	let loading = false;

	const postServer = async () => {
		if (!value) return;
		loading = true;

		let response = await fetch('https://holdfast-api.plexidev.org/servers', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ access_token: getSession()?.access_token, name: value })
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
			open = false;
		} else loading = false;
	};
</script>

<Modal
	bind:open
	size="sm"
	modalHeading="Add Server"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	primaryButtonDisabled={loading || value.length === 0}
	on:click:button--secondary={() => (open = false)}
	on:open
	on:close
	on:submit={postServer}
>
	<div style="padding: 10px;">
		<TextInput labelText="Server Name" placeholder="Enter desired server name..." bind:value />
		<br />
		<p>
			A full setup guide is available on the
			<OutboundLink
				href="https://steamcommunity.com/sharedfiles/filedetails/?id=2582178794"
				target="_blank"
			>
				Steam Workshop
			</OutboundLink>
		</p>
	</div>
</Modal>

<HeaderPanelLink on:click={() => (open = true)}>Add Server</HeaderPanelLink>

<style>
	:global(.bx--modal-content) {
		margin-bottom: 10px;
	}
</style>
