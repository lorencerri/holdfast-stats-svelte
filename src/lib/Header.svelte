<script>
	import { signInWithDiscord, signOut } from '$lib/client';
	import { user } from '$lib/user';

	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SkipToContent
	} from 'carbon-components-svelte';

	import User20 from 'carbon-icons-svelte/lib/User20';

	import AddServerModal from './AddServerModal.svelte';

	let isOpen = false;
</script>

<Header href="/" platformName="My Application">
	<div slot="skip-to-content">
		<SkipToContent />
	</div>
	<HeaderUtilities>
		<HeaderAction icon={User20} bind:isOpen>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Hello, {user.getUsername() || 'User'}</HeaderPanelDivider>
				{#if $user}
					<AddServerModal />
					<HeaderPanelLink on:click={signOut}>
						<span style="color: #da1e28;">Logout</span>
					</HeaderPanelLink>
				{:else}
					<HeaderPanelLink on:click={signInWithDiscord}>Login with Discord</HeaderPanelLink>
				{/if}
				<HeaderPanelDivider>External Links</HeaderPanelDivider>
				<HeaderPanelLink
					target="_blank"
					rel="noopener noreferrer"
					href="https://steamcommunity.com/sharedfiles/filedetails/?id=2715432949"
				>
					Workshop
				</HeaderPanelLink>
				<HeaderPanelLink
					target="_blank"
					rel="noopener noreferrer"
					href="https://github.com/lorencerri"
				>
					GitHub
				</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>
