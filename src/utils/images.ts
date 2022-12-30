import { dimensions } from "../styles";

import { home1, home2, home3, pathways, recording, rating} from "../../assets/img/tutorials/6.5";
import { home1Small, home2Small, home3Small, pathwaysSmall, recordingSmall, ratingSmall} from "../../assets/img/tutorials/5.5";

export const getImagesByDeviceSize = () => {
	if (dimensions.height >= 896) {
		return {'home1': home1, 'home2': home2, 'home3': home3, 'pathways': pathways, 'recording': recording, 'rating': rating};
	} else {
		return {'home1': home1Small, 'home2': home2Small, 'home3': home3Small, 'pathways': pathwaysSmall, 'recording': recordingSmall, 'rating': ratingSmall};
	}
}

// Doesn't actually work as require() must use a literal string
// See: https://stackoverflow.com/a/30868078
export const getImagePathByDeviceSize = (baseFilename: string) => {
	let path: string = "";
	if (dimensions.height < 896) {
		path = `../../assets/img/tutorials/5.5/${baseFilename}`;
	} else {
		path = `../../assets/img/tutorials/6.5/${baseFilename}`;
	}
	console.log(path);
	return path;
}