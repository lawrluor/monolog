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
    short_desc: "A prompt today, keeps the procrastination away.",
    long_desc: "Procrastination often follows a cycle. By identifying and understanding the steps within this cycle, you can learn how to better manage your emotions around procrastination and improve on your habits for the future.",
  },
  {
    name: "General Anxiety",
    short_desc: "You are not your thoughts",
    long_desc: "Learn more about chronic worrying and generalised anxiety disorder as well as suggested strategies for how you can manage your worrying and anxiety through this pathway.",
  },
  {
    name: "Depression",
    short_desc: "Blues begone",
    long_desc: "With this pathway, you'll learn about some suggested strategies for how you can manage your mood and keep feelings of depression at bay.",
  },
  {
    name: "Social Anxiety",
    short_desc: "Connect to yourself to better connect with others",
    long_desc: "Find out if you have symptoms of social anxiety and understand more about social anxiety - what it is, what causes it, and what keeps it going. By the end of this pathway, learn how to better manage or overcome social anxiety.",
  },
]

export const pathwaysMap = new Map();
  // progress => [# times completed, current prompt #, total prompts]
pathwaysMap.set('Procrastination', {
  name: "Procrastination",
  short_desc: "A prompt today, keeps the procrastination away",
  long_desc: `Procrastination often follows a cycle. By identifying and understanding the steps within this cycle, you can learn how to better manage your emotions around procrastination and improve on your habits for the future.`,
  image: procrastination_header,
})
pathwaysMap.set('General Anxiety', {
  name: "General Anxiety",
  short_desc: "You are not your thoughts",
  long_desc: "Learn more about chronic worrying and generalised anxiety disorder as well as suggested strategies for how you can manage your worrying and anxiety through this pathway",
  image: anxiety_header,
})
pathwaysMap.set('Depression', {
  name: "Depression",
  short_desc: "Blues begone",
  long_desc: "With this pathway, you'll learn about some suggested strategies for how you can manage your mood and keep feelings of depression at bay.",
  image: sleep_header,
})
pathwaysMap.set('Social Anxiety', {
  name: "Social Anxiety",
  short_desc: "Connect to yourself to better connect with others",
  long_desc: "Find out if you have symptoms of social anxiety and understand more about social anxiety - what it is, what causes it, and what keeps it going. By the end of this pathway, learn how to better manage or overcome social anxiety.",
  image: self_esteem_header,
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
    "Don't engage with your worries or try to control them, just observe them with interest and describe your experience to yourself. What can you tell yourself to help you let go of your need for certainty?",
    "What can you tell yourself to help when your mind wanders back to needing certainty?  What can you tell yourself to help you be more present-focused?",
    "Let's practice with a specific scenario. What is something that is worrying you or has worried you recently?",
    "With this specific scenario, what do you notice yourself thinking, feeling, and doing when you are worrying?",
    "With this specific scenario, what can you tell yourself to help when your mind wanders back to needing certainty?  What can you tell yourself to help you be more present-focused?",
  ],
  "Social Anxiety": [
    "Why does being in social situations make you feel anxious?",
    "What thoughts/emotions come up when you're socially anxious?",
    "What physical sensations/symptoms come up when you're socially anxious?",
    "How do you typically cope when you feel socially anxious?",
    "Describe a common situation that makes you socially anxious. You could talk about where you were, who you were with, and what was happening. How did it make you feel?",
    "What unhelpful thoughts (e.g., thoughts that do not benefit you) tend to come up when you feel socially anxious?",
    "Reflect on the unhelpful thoughts you mentioned in the previous prompt. Is there a different way of thinking about the situation? Are there patterns that you notice?",
    "Reflect back on the common situation that makes you soxially anxious from prompt 5. What are some ways you can challenge yourself to step out of your comfort zone? Commit to attempting one of these challenges before your next Log.",
    "Reflect on the challenge you set for yourself in the last prompt. How did it feel to attempt one of these challenges?",
    "Look out for other situations that you avoid due to social anxiety, and try to reduce your avoidance more and more. How can you continue to manage your social anxiety?",
  ],
  "Depression": [
    "What circumstances/situations are currently affecting your mood?",
    "What thoughts/emotions come up when you reflect upon your current mood?",
    "What physical senstations/symptoms do you feel when you are in a lower mood?",
    "What are activities/actions that can help improve your mood state?",
    "Let's practice with a specific scenario. What is a situation and/or event that has triggered feelings of depression?",
    "What can you control about the situation (Your behavior/Your feelings/Your approach)?",
    "What can you influence about the situation (How you respond /Your response to others/Knowing who to turn to for help or advice)?",
    "What can you accept about the situation (Other people's responses or decisions/The ever-changing world around you)?",
    "After completing this exercise, how do you feel about the situation?",
    "Is there anything in the “accept” field that you wish you could control or influence? If so, think about why you feel this way and write it below.",
  ]
}
