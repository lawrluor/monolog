import {
  procrastination_header,
  anxiety_header,
  sleep_header,
  trauma_ptsd_header,
  self_esteem_header,
  anger_header,
} from '../../assets/img/pathway-headers'

export const pathwaysData = [
  {
    name: "Procrastination",
    short_desc: "Procrastination often follows a cycle. By identifying and understanding the steps within we can break out from this cycle.",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
    progress: [0,3]
  },
  {
    name: "Anxiety",
    short_desc: "Anxiety hurts",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
    progress: [0,2]
  },
  {
    name: "trauma_ptsd",
    short_desc: "Anxiety hurts",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
  }, 
  {
    name: "Anger",
    short_desc: "Anxiety hurts",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
  },
  {
    name: "Self-Esteem",
    short_desc: "Anxiety hurts",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
  },
  {
    name: "Sleep",
    short_desc: "Anxiety hurts",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
  }
]

export const pathwaysMap = new Map();
  // progress => [# times completed, current prompt #, total prompts]
pathwaysMap.set('Procrastination', {
  name: "Procrastination",
  short_desc: "Anxiety hurts",
  long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
  image: procrastination_header,
  progress: [0, 3, 10],
  })
pathwaysMap.set('Anxiety', {
  name: "Anxiety",
  short_desc: "Anxiety hurts",
  long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
  image: anxiety_header,
  progress: [0, 3, 10],
  })
  pathwaysMap.set('trauma_ptsd', { 
    name: "Trauma & PTSD",
    short_desc: "Anxiety hurts",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
    image: trauma_ptsd_header,
    progress: [0, 3, 10],
  })
  pathwaysMap.set('Anger', { 
    name: "Anger",
    short_desc: "Anxiety hurts",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
    image: anger_header,
    progress: [0, 3, 10],
  })
  pathwaysMap.set('Self-Esteem', { 
    name: "Self-Esteem",
    short_desc: "Anxiety hurts",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
    image: self_esteem_header,
    progress: [0, 3, 10],
  })
  pathwaysMap.set('Sleep', { 
    name: "Sleep",
    short_desc: "Anxiety hurts",
    long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
    image: sleep_header,
    progress: [0, 3, 10],
  })

export const pathwaysPrompts = {
  "Procrastination": {
    1: "Why do you procrastinate?",
    2: "Just do it already",
    3: "You're useless",
    4: "Bruh",
  },
  "Depression": {
    1: "Did you try going on a walk?",
    2: "You just need to drink some water"
  },
}
