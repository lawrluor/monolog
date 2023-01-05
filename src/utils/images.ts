import { dimensions } from "../styles";

import { home1large, home2large, home3large, pathwayslarge, recordinglarge, ratinglarge } from "../../assets/img/tutorials/6.7";
import { home1, home2, home3, pathways, recording, rating} from "../../assets/img/tutorials/6.5";
import { home1Small, home2Small, home3Small, pathwaysSmall, recordingSmall, ratingSmall} from "../../assets/img/tutorials/5.5";


export const getImagesByDeviceSize = (fileBasename: string) => {
	// TODO: Large size: iphone12-14 pro max/plus
	if (dimensions.height >= 926) {
		switch(fileBasename) {
			case 'home1':
				return home1large;
			case 'home2':
				return home2large;
			case 'home3':
				return home3large;
			case 'pathways':
				return pathwayslarge;
			case 'recording':
				return recordinglarge;
			case 'rating':
				return ratinglarge;
			default:
				return ratinglarge;
		}
	}
	// Medium size
	if (dimensions.height > 896 && dimensions.height < 926) {
		switch(fileBasename) {
			case 'home1':
				return home1;
			case 'home2':
				return home2;
			case 'home3':
				return home3;
			case 'pathways':
				return pathways;
			case 'recording':
				return recording;
			case 'rating':
				return rating;
			default:
				return rating;
		}
	} else {
		switch(fileBasename) {
			case 'home1':
				return home1Small;
			case 'home2':
				return home2Small;
			case 'home3':
				return home3Small;
			case 'pathways':
				return pathwaysSmall;
			case 'recording':
				return recordingSmall;
			case 'rating':
				return ratingSmall;
			default:
				return ratingSmall;
		}
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