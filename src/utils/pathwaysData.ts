import {
  procrastination_header,
  anxiety_header,
} from '../../assets/img/pathway-headers'

export const pathwaysData = [
  {
    name: "Procrastination",
    short_desc: "A prompt today, keeps the procrastination away.",
    long_desc: `Procrastination often follows a cycle. By identifying and understanding the steps within this cycle, you can learn how to better manage your emotions around procrastination and improve on your habits for the future.`,
    progress: [0,3]
  },
  {
    name: "General Anxiety",
    short_desc: "You are not your thoughts",
    long_desc: "Learn more about chronic worrying and generalised anxiety disorder as well as suggested strategies for how you can manage your worrying and anxiety through this pathway",
    progress: [0,2]
  },
]

export const pathwaysMap = new Map();
  // progress => [# times completed, current prompt #, total prompts]
pathwaysMap.set('Procrastination', {
  name: "Procrastination",
  short_desc: "A prompt today, keeps the procrastination away",
  long_desc: `Procrastination often follows a cycle. By identifying and understanding the steps within this cycle, you can learn how to better manage your emotions around procrastination and improve on your habits for the future.`,
  image: procrastination_header,
  progress: [0, 3, 10],
  })
pathwaysMap.set('General Anxiety', {
  name: "General Anxiety",
  short_desc: "You are not your thoughts",
  long_desc: "Learn more about chronic worrying and generalised anxiety disorder as well as suggested strategies for how you can manage your worrying and anxiety through this pathway",
  image: anxiety_header,
  progress: [0, 3, 10],
  })

export const pathwaysPrompts = {
  "Procrastination": [
    "What is a goal or task that you have been procrastinating on completing?",
    "Describe the discomfort that might come up when attempting to approach a task/goal",
    "Why do you think you might procrastinate? Share some emotions or thoughts that commonly arise",
    "What sort of justifications or reasons do you use to avoid approaching a goal or task?",
    "What are some procrastination activities you engage in to distract yourself from the goal or task that you need to be completing?",
    "What negative consequences do you see from procrastinating? How do they enable you to continue procrastinating in the future?",
    "Reflecting back on your procrastination cycle, how can you adjust the unhelpful emotions or thoughts that come along with the initial discomfort when approaching a task or goal? What can you tell yourself instead?",
    "How can you dismiss the justifications or reasons you might typically use when procrastinating? What are encouraging messages you can tell yourself instead?",
    "What are positive results we can see from not procrastinating? How do they enable you to avoid procrastinating in the future?",
    "How can we continue to avoid procrastinating through practical strategies? How can we change this habit?",
  ],
  "General Anxiety": [
    "Can you be absolutely certain about everything in life? Share more about how you feel about this.",
    "What are the advantages of requiring certainty in life? How has needing certainty in life been helpful to you?",
    "What are the advantages of requiring certainty in life? How has needing certainty in life been helpful to you?",
    "What are the disadvantages of requiring certainty in life? How has needing certainty in life been unhelpful to you or detrimental to your life?",
    "Acknowledge the presence of worries about being uncertain. What do you notice yourself thinking, feeling and doing when you are needing certainty?",
    "Don’t engage with your worries or try to control them, just observe them with interest and describe your experience to yourself. What can you tell yourself to help you let go of your need for certainty?",
    "What can you tell yourself to help when your mind wanders back to needing certainty?  What can you tell yourself to help you be more present-focused?",
    "Let's practice with a specific scenario. What is something that is worrying you or has worried you recently?",
    "With this specific scenario, what do you notice yourself thinking, feeling, and doing when you are worrying?",
    "With this specific scenario, what can you tell yourself to help when your mind wanders back to needing certainty?  What can you tell yourself to help you be more present-focused?",
  ],
}
