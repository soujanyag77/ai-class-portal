export const AI_CHAPTERS = [
  {
    id: 'ai-ch1',
    number: 1,
    title: 'Introduction to AI & Smart Automation',
    icon: '🤖',
    color: 'from-cyan-500 to-blue-600',
    missionIds: [1],
    summary: 'Distinguish Artificial Intelligence (learning from data and adapting) from ordinary rule-based automation (fixed timers and simple switches).',
    keyConcepts: [
      { term: 'Artificial Intelligence (AI)', desc: 'Machines that perceive inputs, learn patterns from data, reason, and make adaptive decisions.' },
      { term: 'Conventional Automation', desc: 'Follows fixed human-written rules or timers without learning or improving over time.' },
      { term: 'Human vs Machine Intelligence', desc: 'Humans excel at empathy, creativity, and common sense; AI excels at fast pattern detection in huge data.' }
    ],
    sampleOutcome: 'Classify everyday devices into Uses AI vs Does Not Necessarily Use AI with clear reasoning.'
  },
  {
    id: 'ai-ch2',
    number: 2,
    title: 'AI Project Lifecycle & Clean Data',
    icon: '🔄',
    color: 'from-violet-500 to-purple-600',
    missionIds: [3],
    summary: 'Follow a structured 4-stage AI Project Lifecycle: Problem Definition, Data Collection, Testing AI Tools, and Reflection & Improvement.',
    keyConcepts: [
      { term: 'Problem Definition', desc: 'Clearly define what needs solving, who is affected, and how success will be measured.' },
      { term: 'Data Collection & Cleaning', desc: 'Gather accurate, relevant data and fix missing values, duplicates, and entry errors.' },
      { term: 'Testing AI Tools', desc: 'Try suitable AI models/tools on real examples and check their predictions.' },
      { term: 'Reflection & Improvement', desc: 'Review mistakes, ask what could be fairer or cleaner, and refine the solution.' }
    ],
    sampleOutcome: 'Apply the 4-stage lifecycle to solve school electricity wastage and clean flawed records.'
  },
  {
    id: 'ai-ch3',
    number: 3,
    title: 'AI Domains & Everyday Applications',
    icon: '🏙️',
    color: 'from-emerald-500 to-teal-600',
    missionIds: [4],
    summary: 'Explore the 3 core domains of AI—Data Science, Computer Vision, and Natural Language Processing—alongside Classification, Prediction, and Clustering.',
    keyConcepts: [
      { term: 'Data Science', desc: 'Finds patterns in tables, weather numbers, and sensor readings to predict outcomes.' },
      { term: 'Computer Vision (CV)', desc: 'Enables AI to see and classify objects in photos and live camera feeds.' },
      { term: 'Natural Language Processing (NLP)', desc: 'Helps machines understand human sentences, sentiment, and intent.' },
      { term: 'Classification vs Prediction vs Clustering', desc: 'Classification picks categories, Prediction estimates future values, and Clustering groups similar items without labels.' }
    ],
    sampleOutcome: 'Unlock Smart City locations by solving Data Science, CV, NLP, and Clustering puzzles.'
  },
  {
    id: 'ai-ch4',
    number: 4,
    title: 'Data Fairness, Bias & AI Ethics',
    icon: '⚖️',
    color: 'from-amber-500 to-orange-600',
    missionIds: [5, 6, 7],
    summary: 'Investigate data imbalance, representation bias, privacy, transparency, accountability, and human oversight in real-world AI.',
    keyConcepts: [
      { term: 'Data Bias & Imbalance', desc: 'If training data leaves out groups or regions, the AI treats them unfairly.' },
      { term: 'Privacy & Consent', desc: 'Personal data must never be shared or tracked without clear consent and safeguards.' },
      { term: 'Transparency & Accountability', desc: 'People affected by AI decisions deserve to know AI is used and who is responsible.' },
      { term: 'Human Oversight & Verification', desc: 'Always verify AI answers for hallucinations or misinformation; humans remain in charge.' }
    ],
    sampleOutcome: 'Audit a biased sports selection dataset, repair representation, and rule on 5 Ethics Courtroom cases.'
  }
];
