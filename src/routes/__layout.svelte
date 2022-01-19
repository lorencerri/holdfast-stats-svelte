<script>
	import { browser } from '$app/env';
	import '../app.css';
	import Header from '$lib/Header/Header.svelte';
</script>

<head>
	<title>Holdfast User Stats</title>
</head>

{#if browser}
	<Header />
{/if}
<slot />
