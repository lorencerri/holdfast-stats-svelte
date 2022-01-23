<script>
	import { SideNav, Content, Link } from 'carbon-components-svelte';
</script>

<SideNav isOpen>
	<span style="padding: 15px;">Side navigation was not properly loaded.</span>
</SideNav>

<Content style="background: transparent;">
	Hey there! It looks like you didn't specify a server ID. You can return <Link href="/">home</Link>
	and select a server.
</Content>
