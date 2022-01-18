<!-- svelte-ignore a11y-label-has-associated-control -->
<script>
	import { v4 as uuidv4 } from 'uuid';

	let token = uuidv4();
</script>

<div class="hero">
	<div class="text-center hero-content">
		<div class="max-w-md">
			<h1 class="mb-5 text-5xl font-bold">Create New</h1>
			<p class="mb-5">
				Stats are linked to unique tokens and can be used on multiple servers.
				<span class="text-error">Your token will not appear after this,</span>
			</p>
			<br />
			<div class="form-control">
				<label class="label">
					<span class="label-text">Server Name</span>
				</label>
				<input type="text" placeholder="Server Name" class="input" />
				<label class="label">
					<span class="label-text">Token</span>
				</label>
				<div class="flex space-x-2">
					<input
						type="text"
						placeholder="Loading..."
						value={token}
						disabled
						class="w-full input input-primary input-bordered "
					/>
					<button class="btn btn-primary">Save</button>
				</div>
			</div>
		</div>
	</div>
</div>
