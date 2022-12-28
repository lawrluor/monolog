export const getRoutesInStack = async (navigation: any) => {
	return await navigation.getState().routes;
}

// By default, will check the top route on the stack,
// but accepts an optional parameter to specify which route from the top to check
export const getLastRoute = async (navigation: any, number=1) => {
	number += 1;  // number includes the current screen; going one screen means 2
	let routes = await getRoutesInStack(navigation);

	if (routes && routes.length - number > 0) {
		return routes[routes.length - number];
	} else {
		return routes[0];
	}
}