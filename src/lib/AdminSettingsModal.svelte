<script>
	import { Button, TextInput, OutboundLink, PasswordInput, Modal } from 'carbon-components-svelte';
	import SettingsAdjust20 from 'carbon-icons-svelte/lib/SettingsAdjust20';

	import { getSession } from '$lib/client';
	export let server;

	let key = 'Loading...';

	const fetchToken = async () => {
		let response = await fetch(`https://holdfast-api.plexidev.org/servers/${server.id}/token`, {
			headers: {
				'Content-Type': 'application/json',
				authorization: 'access_token ' + getSession()?.access_token
			}
		});
		let json = await response.json();

		if (json.code === 200) {
			key = json.token;
		}
	};

	fetchToken();

	let open = false;
</script>

<Modal passiveModal bind:open modalHeading="Admin Settings" on:open on:close>
	<div style="padding: 10px;">
		<TextInput
			readonly
			inline
			labelText="Public URL"
			value={`https://holdfast.plexidev.org/server/${server.id}`}
		/>
		<br />
		<TextInput labelText="Server Name" inline value={server.name} />
		<br />
		<PasswordInput
			readonly
			labelText="Key"
			hidePasswordLabel="Hide Key"
			showPasswordLabel="Show Key"
			helperText="Do not share this key, it is used to authenticate server events."
			tooltipPosition="left"
			value={key}
		/>
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

<Button
	kind="secondary"
	style="border-bottom: 1px solid #393939;"
	icon={SettingsAdjust20}
	on:click={() => (open = true)}
>
	Admin Settings
</Button>

<style>
	:global(.bx--modal-content) {
		margin-bottom: 10px;
	}
</style>
