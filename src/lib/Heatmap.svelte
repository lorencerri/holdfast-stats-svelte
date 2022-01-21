<script>
	import '@carbon/charts/styles.min.css';
	import { ScatterChart } from '@carbon/charts-svelte';

	export let rows = [];

	const manipulate = (rows) => {
		let data = [];
		for (let i = 0; i < rows.length; i++) {
			if (rows[i].killerPosition) {
				const coords = rows[i].killerPosition.replace(/[\(\)]/g, '').split(',');
				data.push({
					group: 'Killer Positions',
					x: coords[0],
					y: coords[2]
				});
			}
			if (rows[i].victimPosition) {
				const coords = rows[i].victimPosition.replace(/[\(\)]/g, '').split(',');
				data.push({
					group: 'Victim Positions',
					x: coords[0],
					y: coords[2]
				});
			}
		}
		return data;
	};
</script>

<div style="padding: 25px">
	<h2>Map Heatmap of Events</h2>
	<ScatterChart
		data={manipulate(rows)}
		options={{
			axes: {
				bottom: {
					title: 'x',
					mapsTo: 'x',
					scaleType: 'linear',
					includeZero: false
				},
				left: {
					title: 'y',
					mapsTo: 'y',
					scaleType: 'linear',
					includeZero: false
				}
			},
			grid: {
				x: {
					alignWithAxisTicks: true
				},
				y: {
					alignWithAxisTicks: true
				}
			},
			height: '800px',
			width: '800px',
			animations: true
		}}
	/>
</div>
