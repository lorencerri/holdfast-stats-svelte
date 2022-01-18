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
<main class="container pl-5 pr-5 mx-auto max-w-2xl">
	<slot />
</main>
