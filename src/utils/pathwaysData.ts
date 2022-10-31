// import { parse } from "csv-parse";

export const pathwaysData = [
  {
    name: "Procrastination",
    short_desc: "Procrastination often follows a cycle. By identifying and understanding the steps within we can break out from this cycle.",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
    image: "procrastination_header",
    progress: [0,3]
  },
  {
    name: "Depression",
    short_desc: "Depression hurts",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
    image: "procrastination_header",
    progress: [0,2]
  }
]

type PathwayObj = {
  name: string,
  short_desc: string,
  long_desc: string,
  image: string,
  progress: [],
}

let fs = require("react-native-fs");

const createJSON = () => {
  const headers = ['name', 'short_desc', 'long_desc', 'image', 'progress']
  fs.readDir('../assets/PathwaysList.csv').then((csvData: any) => {
    console.log("csvData", csvData);
  //   parse(csvData, {
  //   delimiter: ',',
  //   columns: headers,
  // }, (error, result: PathwayObj[]) => {
  //   if (error) {
  //     console.error(error);
  //   }

  //   console.log("Result", result);
  // });
  })
  
}

// Run to create 
export default createJSON;
