const addLocationNoise = (lat, lng, minOffset = 10, maxOffset = 50) => {
	const getOffset = () => {
		const meters = Math.random() * (maxOffset - minOffset) + minOffset;
		//convert the meters to degrees
		const metersToDegrees = (meters) => meters / 111111;
		return (Math.random() < 0.5 ? -1 : 1) * metersToDegrees(meters);
	};

	return {
		lat: lat + getOffset(),
		lng: lng + getOffset(),
	};
};

module.exports = { addLocationNoise };
