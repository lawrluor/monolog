import {
  procrastination_header,
  anxiety_header,
  depression_header,
  grief_loss_header,
} from '../../assets/img/pathway-headers'

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

export const pathwaysMap = new Map();
  // progress => [# times completed, current prompt #, total prompts]
  pathwaysMap.set('Procrastination', { name: "Procrastination",
      long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
      image: procrastination_header,
    progress: [0, 3, 10],
  })
  pathwaysMap.set('Depression', { name: "Depression",
      long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
      image: depression_header,
    progress: [0, 3, 10],
  })
