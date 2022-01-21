const enums = {
	EntityHealthChangedReason: [
		"None",
		"ShotByFirearm",
		"HitByMeleeWeapon",
		"FellInOcean",
		"FallDamage",
		"HitByCannonball",
		"ExplosionRadius",
		"Desertering",
		"DirectCannonballHit",
		"KilledByAdmin",
		"RespawningForNextRound",
		"RocketExplosionRadius",
		"EnvironmentalDamage",
		"HitByMeleeSecondaryAttack",
		"DiedViaTimeout",
		"VehicleHitByMeleeWeapon",
		"VehicleShotByFirearm",
		"DeadHorse",
		"VehicleHitByArtillery",
		"TrampledPlayer"
	]
}

const getEnum = (enumName) => {
	return enums[enumName]
}

export default getEnum;