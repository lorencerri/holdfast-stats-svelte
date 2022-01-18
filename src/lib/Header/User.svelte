<script>
	import { signInWithDiscord, signOut } from '$lib/client';
	import { user } from '$lib/user';
</script>

{#if $user}
	<div class="flex-none lg:flex">
		<div class="flex items-stretch">
			<button class="btn btn-ghost btn-sm rounded-btn">
				Hello, {user.getUsername()}
			</button>
		</div>
		<div class="flex items-stretch">
			<a href="/servers" class="btn btn-ghost btn-sm rounded-btn">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="inline-block w-5 mr-2 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
					/>
				</svg>
				Servers
			</a>
		</div>
		<button class="btn btn-square btn-ghost" on:click={signOut}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="inline-block w-6 h-6 stroke-current text-error"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
				/>
			</svg>
		</button>
	</div>
{:else}
	<button class="btn btn-sm btn-ghost" on:click={signInWithDiscord}>Login with Discord</button>
{/if}
