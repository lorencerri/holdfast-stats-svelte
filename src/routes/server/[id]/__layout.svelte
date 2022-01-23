<script>
	import { Content, SideNav } from 'carbon-components-svelte';
</script>

<SideNav isOpen>
	<span style="padding: 15px; border-bottom: 1px solid #393939;">Global Options</span>
	<slot />
</SideNav>

<Content style="background: transparent;">
	<slot />
</Content>
