<script>
	import '../app.css';
	import Header from '$lib/Header.svelte';
	import 'carbon-components-svelte/css/g90.css';
</script>

<head>
	<title>Holdfast Player Stats</title>
</head>

<Header />

<slot />

<style>
	:global(.bx--side-nav__navigation > button),
	:global(.bx--side-nav__navigation .bx--dropdown__wrapper *),
	:global(.bx--side-nav__navigation .bx--tree-node),
	:global(.bx--side-nav__navigation .bx--tree-node *),
	:global(.bx--side-nav__navigation) {
		background: #161616 !important;
	}
</style>
