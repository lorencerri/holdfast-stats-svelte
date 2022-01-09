<script>
	import { browser } from '$app/env';
	import '../app.css';
	import Header from '$lib/Header/Header.svelte';
</script>

{#if browser}
	<Header />
{/if}

<slot />
