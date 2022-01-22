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
	:global(.bx--side-nav__navigation),
	:global(.bx--pagination) {
		background: #161616 !important;
	}
	:global(.bx--pagination),
	:global(.bx--pagination__button) {
		border: none;
		border-left: none !important;
	}
	:global(.bx--tree) {
		overflow-y: scroll;
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* Internet Explorer 10+ */
	}
	:global(.bx--tree)::-webkit-scrollbar {
		display: none !important; /* Safari and Chrome */
	}
</style>
