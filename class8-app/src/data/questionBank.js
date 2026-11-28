// Comprehensive Class 8 CBSE/KVS Question & Activity Bank
// Includes: 20 AI concept Qs, 15 CT puzzles, 10 Lifecycle challenges,
// 16 AI application classifications, 10 fairness & bias challenges,
// 10 ethics scenarios, plus 5 Before & 5 After Assessment questions.

export const MISSION1_DEVICES = [
  {
    id: 'm1-1',
    name: 'Smart Voice Assistant',
    icon: '🎙️',
    bucket: 'ai',
    concept: 'Natural Language Processing (NLP)',
    learningOutcome: 'Recognise speech understanding and adaptive responses as AI.',
    instructions: 'Drag to Uses AI or Does Not Necessarily Use AI.',
    correctAnswer: 'Uses AI',
    explanation: 'A Smart Voice Assistant uses AI (speech recognition + NLP) to understand human commands and learn user preferences.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'm1-2',
    name: 'Basic Pocket Calculator',
    icon: '🧮',
    bucket: 'non-ai',
    concept: 'Rule-Based Arithmetic',
    learningOutcome: 'Distinguish fixed mathematical rules from AI learning.',
    instructions: 'Drag to the correct bucket.',
    correctAnswer: 'Does not necessarily use AI',
    explanation: 'A calculator follows fixed mathematical rules programmed by humans. It never learns from experience.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'm1-3',
    name: 'Automatic Sliding Door',
    icon: '🚪',
    bucket: 'non-ai',
    concept: 'Sensor Automation vs AI (Tricky!)',
    learningOutcome: 'Distinguish simple sensor triggers from intelligent perception.',
    instructions: 'Tricky! Does a basic motion door use AI?',
    correctAnswer: 'Does not necessarily use AI',
    explanation: 'Tricky one! A basic automatic door uses a simple rule: IF infrared sensor detects motion → open door. No learning or reasoning is involved.',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'm1-4',
    name: 'Face Recognition System',
    icon: '🪪',
    bucket: 'ai',
    concept: 'Computer Vision',
    learningOutcome: 'Identify facial pattern learning as Computer Vision AI.',
    instructions: 'Drag to the correct bucket.',
    correctAnswer: 'Uses AI',
    explanation: 'Face recognition extracts unique facial landmarks and learns patterns across lighting and angles using Computer Vision.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'm1-5',
    name: 'Traditional Alarm Clock',
    icon: '⏰',
    bucket: 'non-ai',
    concept: 'Time-Triggered Rule',
    learningOutcome: 'Differentiate timer automation from AI.',
    instructions: 'Drag to the correct bucket.',
    correctAnswer: 'Does not necessarily use AI',
    explanation: 'A traditional alarm clock simply checks if current time equals your set time—pure rule-based automation.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'm1-6',
    name: 'Video / Book Recommendation System',
    icon: '🎬',
    bucket: 'ai',
    concept: 'Pattern Learning & Personalisation',
    learningOutcome: 'Recognise predictive recommendations from past behaviour as AI.',
    instructions: 'Drag to the correct bucket.',
    correctAnswer: 'Uses AI',
    explanation: 'Recommendation engines analyse millions of watch histories and interests to predict what you might enjoy next.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'm1-7',
    name: 'Standard Washing Machine (Fixed Timer)',
    icon: '🧺',
    bucket: 'non-ai',
    concept: 'Pre-Programmed Cycles (Tricky!)',
    learningOutcome: 'Identify ordinary appliance timers vs AI load sensing.',
    instructions: 'Tricky! Think about a standard washing machine.',
    correctAnswer: 'Does not necessarily use AI',
    explanation: 'An ordinary washing machine runs fixed time/spin cycles chosen by your dial. (Only advanced AI washers that learn fabric patterns use AI.)',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'm1-8',
    name: 'Self-Driving Vehicle',
    icon: '🚗',
    bucket: 'ai',
    concept: 'Autonomous Perception & Decision',
    learningOutcome: 'Recognise real-time road detection and decision-making as AI.',
    instructions: 'Drag to the correct bucket.',
    correctAnswer: 'Uses AI',
    explanation: 'Self-driving cars combine Computer Vision, sensor fusion, and predictive models to spot lanes, pedestrians, and traffic signs in real time.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'm1-9',
    name: 'AI Chatbot Tutor',
    icon: '💬',
    bucket: 'ai',
    concept: 'Natural Language & Generative AI',
    learningOutcome: 'Understand how AI chatbots interpret intent and generate helpful replies.',
    instructions: 'Drag to the correct bucket.',
    correctAnswer: 'Uses AI',
    explanation: 'An AI chatbot uses Natural Language Processing and trained language models to understand varied questions and reply conversationally.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'm1-10',
    name: 'Ordinary TV Remote Control',
    icon: '📺',
    bucket: 'non-ai',
    concept: 'Infrared Signal Mapping',
    learningOutcome: 'Recognise direct button-to-signal mapping as non-AI.',
    instructions: 'Drag to the correct bucket.',
    correctAnswer: 'Does not necessarily use AI',
    explanation: 'An ordinary remote sends a fixed infrared code for each button press—no data learning or decision-making.',
    difficulty: 'Easy',
    points: 100
  }
];

// Minimum 20 AI Concept Questions
export const AI_CONCEPT_QUESTIONS = [
  ...MISSION1_DEVICES.map((d, i) => ({
    id: `ai-q-${i + 1}`,
    concept: d.concept,
    learningOutcome: d.learningOutcome,
    instructions: `Classify "${d.name}": Does it use AI or not necessarily?`,
    options: ['Uses AI', 'Does not necessarily use AI'],
    correctAnswer: d.correctAnswer,
    explanation: d.explanation,
    difficulty: d.difficulty,
    points: d.points
  })),
  {
    id: 'ai-q-11',
    concept: 'Learning vs Fixed Programming',
    learningOutcome: 'Explain the core difference between traditional software and AI.',
    instructions: 'What makes an AI system different from an ordinary computer program?',
    options: ['It learns patterns from data and improves decisions', 'It needs electricity to run', 'It uses a keyboard and monitor', 'It never makes any errors'],
    correctAnswer: 'It learns patterns from data and improves decisions',
    explanation: 'Traditional programs follow rigid step-by-step rules; AI learns patterns from training data.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'ai-q-12',
    concept: 'Training Data Quality',
    learningOutcome: 'Understand why clean, accurate data is essential for AI.',
    instructions: 'What happens when an AI model is trained on messy or wrong data?',
    options: ['Garbage In, Garbage Out – predictions become unreliable', 'The computer automatically fixes all errors', 'The AI runs twice as fast', 'Nothing changes at all'],
    correctAnswer: 'Garbage In, Garbage Out – predictions become unreliable',
    explanation: 'AI learns directly from its data; inaccurate or incomplete data leads to poor decisions.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'ai-q-13',
    concept: 'Data Science Domain',
    learningOutcome: 'Identify tabular & numerical prediction as Data Science.',
    instructions: 'Predicting crop yield from rainfall, temperature, and soil data belongs to which AI domain?',
    options: ['Data Science', 'Computer Vision', 'Natural Language Processing', 'Robotics Hardware'],
    correctAnswer: 'Data Science',
    explanation: 'Data Science analyses structured numerical records and tables to spot trends and predict outcomes.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'ai-q-14',
    concept: 'Computer Vision Domain',
    learningOutcome: 'Identify visual image understanding as Computer Vision.',
    instructions: 'A Smart Hospital AI scans chest X-ray images to detect signs of pneumonia. Which domain is this?',
    options: ['Computer Vision', 'Natural Language Processing', 'Spreadsheet Formatting', 'Audio Mixing'],
    correctAnswer: 'Computer Vision',
    explanation: 'Computer Vision interprets digital images and video frames.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'ai-q-15',
    concept: 'NLP Domain',
    learningOutcome: 'Identify text sentiment and translation as NLP.',
    instructions: 'Sorting 500 student feedback comments into Positive, Negative, and Neutral uses:',
    options: ['Natural Language Processing (NLP)', 'Computer Vision', 'Circuit Soldering', 'Binary Sorting'],
    correctAnswer: 'Natural Language Processing (NLP)',
    explanation: 'NLP allows AI to read, analyse sentiment, and understand human language.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'ai-q-16',
    concept: 'Classification vs Prediction',
    learningOutcome: 'Distinguish category labelling from continuous value estimation.',
    instructions: 'Sorting fruit photos into Apple, Mango, or Banana is an example of:',
    options: ['Classification', 'Regression Prediction', 'Clustering without labels', 'Data Deletion'],
    correctAnswer: 'Classification',
    explanation: 'Classification assigns items to predefined discrete categories.',
    difficulty: 'Medium',
    points: 100
  },
  {
    id: 'ai-q-17',
    concept: 'Unsupervised Clustering',
    learningOutcome: 'Explain clustering as grouping similar items without labels.',
    instructions: 'Grouping library books by similarity WITHOUT any existing category labels is called:',
    options: ['Clustering', 'Supervised Classification', 'Data Cleaning', 'Password Hashing'],
    correctAnswer: 'Clustering',
    explanation: 'Clustering discovers natural groups in unlabelled data based on shared features.',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'ai-q-18',
    concept: 'Human Oversight',
    learningOutcome: 'Recognise why humans must stay in control of important AI decisions.',
    instructions: 'Why should doctors still review a Smart Hospital AI diagnosis?',
    options: ['AI can make mistakes and lacks human empathy & accountability', 'AI cannot read numbers', 'Doctors need to turn off the Wi-Fi', 'AI only works at night'],
    correctAnswer: 'AI can make mistakes and lacks human empathy & accountability',
    explanation: 'Human oversight keeps critical healthcare decisions safe, empathetic, and accountable.',
    difficulty: 'Medium',
    points: 100
  },
  {
    id: 'ai-q-19',
    concept: 'AI Limitations',
    learningOutcome: 'Identify common limitations of AI systems.',
    instructions: 'Which statement about AI is TRUE?',
    options: ['AI lacks real human emotions and can reflect bias from data', 'AI always understands common sense like a human', 'AI never needs updating', 'AI works without any data'],
    correctAnswer: 'AI lacks real human emotions and can reflect bias from data',
    explanation: 'AI simulates patterns from data; it does not feel emotions and can inherit human biases.',
    difficulty: 'Medium',
    points: 100
  },
  {
    id: 'ai-q-20',
    concept: 'Reflection & Improvement',
    learningOutcome: 'Understand why AI projects iterate after testing.',
    instructions: 'After testing an AI school electricity saver, why is the Reflection stage important?',
    options: ['To spot errors, improve fairness/accuracy, and refine the system', 'To delete all collected data forever', 'To skip testing', 'To avoid measuring results'],
    correctAnswer: 'To spot errors, improve fairness/accuracy, and refine the system',
    explanation: 'AI projects improve through testing, reflection, and updating data or models.',
    difficulty: 'Easy',
    points: 100
  }
];

// Minimum 15 Computational Thinking Puzzles (Games A, B, C, D + 7 Class 8 CT Chapters)
export const CT_PUZZLES = [
  {
    id: 'ct-1',
    game: 'A',
    chapter: 'A Square and a Cube',
    concept: 'Pattern Recognition (Square Numbers)',
    learningOutcome: 'Recognise geometric square growth patterns.',
    instructions: 'Drag the missing square tile count into the pattern: 1, 4, 9, 16, ___',
    prompt: '🟦 1  →  🟦 4  →  🟦 9  →  🟦 16  →  ?',
    options: ['25', '20', '24', '32'],
    correctAnswer: '25',
    explanation: '1², 2², 3², 4², 5² = 25! Each square grows by adding the next odd number (+3, +5, +7, +9).',
    difficulty: 'Easy',
    points: 150
  },
  {
    id: 'ct-2',
    game: 'A',
    chapter: 'Power Play',
    concept: 'Exponential Pattern Generalisation',
    learningOutcome: 'Generalise doubling patterns (powers of 2).',
    instructions: 'Drag the next value in this robot memory sequence: 2, 4, 8, 16, ___',
    prompt: '⚡ 2  →  ⚡ 4  →  ⚡ 8  →  ⚡ 16  →  ?',
    options: ['32', '24', '30', '64'],
    correctAnswer: '32',
    explanation: 'Each step multiplies by 2 (powers of 2: 2¹, 2², 2³, 2⁴, 2⁵ = 32).',
    difficulty: 'Easy',
    points: 150
  },
  {
    id: 'ct-3',
    game: 'A',
    chapter: 'Number Play',
    concept: 'Visual Shape & Colour Pattern',
    learningOutcome: 'Detect multi-attribute repeating cycles.',
    instructions: 'Drag the missing symbol: 🔵🔺🟨 · 🔵🔺🟨 · 🔵 ___ 🟨',
    prompt: '🔵  🔺  🟨   |   🔵  🔺  🟨   |   🔵  [ ? ]  🟨',
    options: ['🔺', '🔵', '🟨', '🟩'],
    correctAnswer: '🔺',
    explanation: 'The repeating cycle has length 3: Blue Circle → Red Triangle → Yellow Square.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'ct-4',
    game: 'A',
    chapter: 'A Square and a Cube',
    concept: 'Cube Numbers Pattern',
    learningOutcome: 'Recognise 3D cube growth (n³).',
    instructions: 'Complete the 3D Data Cube sequence: 1, 8, 27, ___',
    prompt: '🧊 1 (1³)  →  🧊 8 (2³)  →  🧊 27 (3³)  →  ?',
    options: ['64 (4³)', '36 (6²)', '48', '81'],
    correctAnswer: '64 (4³)',
    explanation: '4 × 4 × 4 = 64! Cube patterns model 3D grids and pixel volumes.',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'ct-5',
    game: 'A',
    chapter: 'A Story of Numbers',
    concept: 'Binary Number Decoding',
    learningOutcome: 'Convert 4-bit binary codes to decimal.',
    instructions: 'Using binary place values (8, 4, 2, 1), decode 1011:',
    prompt: 'Binary Code: 1  0  1  1  =  ?',
    options: ['11', '9', '13', '7'],
    correctAnswer: '11',
    explanation: '(1×8) + (0×4) + (1×2) + (1×1) = 8 + 0 + 2 + 1 = 11.',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'ct-6',
    game: 'B',
    chapter: 'We Distribute Yet Things Multiply',
    concept: 'Decomposition – School Science Exhibition',
    learningOutcome: 'Break a large event into ordered sub-tasks.',
    instructions: 'Drag the 5 tasks to organise the School Science Exhibition in logical order.',
    steps: [
      'Select venue',
      'Prepare exhibits',
      'Arrange tables',
      'Invite visitors',
      'Display projects'
    ],
    correctAnswer: 'Select venue → Prepare exhibits → Arrange tables → Invite visitors → Display projects',
    explanation: 'Decomposition splits a big goal into manageable steps that happen in sensible order.',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'ct-7',
    game: 'C',
    chapter: 'Algorithm Design',
    concept: 'Algorithm Sequence & Debugging (Make a Cup of Tea)',
    learningOutcome: 'Order instructions precisely and debug faulty steps.',
    instructions: 'Arrange the scrambled steps so BYTE makes tea safely without spilling!',
    steps: [
      'Boil water in a kettle',
      'Put tea leaves and sugar in a cup',
      'Pour hot water into the cup',
      'Add milk and stir gently',
      'Strain and serve warm tea'
    ],
    correctAnswer: 'Boil water → Add tea/sugar → Pour hot water → Add milk & stir → Strain & serve',
    explanation: 'If you pour water before boiling or strain before adding leaves, the algorithm fails! Order matters.',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'ct-8',
    game: 'D',
    chapter: 'Proportional Reasoning',
    concept: 'Abstraction – School Bus Allocation',
    learningOutcome: 'Filter out irrelevant details and keep only essential clues.',
    instructions: 'Tap ONLY the essential facts needed to decide how many school buses are required.',
    clues: [
      { id: 'c1', text: '120 students need bus transport', essential: true },
      { id: 'c2', text: 'Each bus has 40 seats', essential: true },
      { id: 'c3', text: 'The school gate is painted yellow', essential: false },
      { id: 'c4', text: 'All buses start at 7:30 AM from KV campus', essential: true },
      { id: 'c5', text: 'The principal likes mango juice', essential: false },
      { id: 'c6', text: 'Route A has 3 stops and Route B has 4 stops', essential: true }
    ],
    correctAnswer: 'Student count (120), seat capacity (40), start time, and route stops (120 ÷ 40 = 3 buses)',
    explanation: 'Abstraction removes distracting details (gate colour, favourite juice) so we solve 120 ÷ 40 = 3 buses cleanly!',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'ct-9',
    game: 'CT-Bank',
    chapter: 'Quadrilaterals',
    concept: 'Geometric Feature Classification',
    learningOutcome: 'Classify shapes by angle & side properties.',
    instructions: 'Which quadrilateral has 4 equal sides, opposite sides parallel, and four 90° angles?',
    options: ['Square', 'Parallelogram', 'Kite', 'Trapezium'],
    correctAnswer: 'Square',
    explanation: 'A Square satisfies all conditions: 4 equal sides + 4 right angles.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'ct-10',
    game: 'CT-Bank',
    chapter: 'Number Play',
    concept: 'Divisibility Rules',
    learningOutcome: 'Apply divisibility tests by 3 and 5.',
    instructions: 'Which token ID is divisible by BOTH 3 and 5?',
    options: ['135', '125', '142', '154'],
    correctAnswer: '135',
    explanation: '135 ends in 5 (divisible by 5) and 1+3+5 = 9 (divisible by 3).',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'ct-11',
    game: 'CT-Bank',
    chapter: 'We Distribute Yet Things Multiply',
    concept: 'Distributive Decomposition',
    learningOutcome: 'Decompose multiplication using the distributive property.',
    instructions: 'Using decomposition: 14 × 25 = (14 × 20) + (14 × 5) =',
    options: ['350', '300', '280', '340'],
    correctAnswer: '350',
    explanation: '280 + 70 = 350! Decomposition turns hard arithmetic into two easy mental steps.',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'ct-12',
    game: 'CT-Bank',
    chapter: 'Proportional Reasoning',
    concept: 'Ratio & Sensor Scaling',
    learningOutcome: 'Scale sensor counts proportionally.',
    instructions: '4 smart sensors monitor 12 classrooms equally. How many sensors monitor 30 classrooms?',
    options: ['10 sensors', '8 sensors', '12 sensors', '15 sensors'],
    correctAnswer: '10 sensors',
    explanation: 'Each sensor monitors 12 ÷ 4 = 3 classrooms. For 30 classrooms: 30 ÷ 3 = 10 sensors.',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'ct-13',
    game: 'CT-Bank',
    chapter: 'A Story of Numbers',
    concept: 'Binary Place Values',
    learningOutcome: 'Convert decimal to 4-bit binary.',
    instructions: 'How is the decimal number 9 written in 4-bit binary (8, 4, 2, 1)?',
    options: ['1001', '1010', '1100', '0111'],
    correctAnswer: '1001',
    explanation: '8 + 1 = 9 → 1001 in binary.',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'ct-14',
    game: 'CT-Bank',
    chapter: 'Power Play',
    concept: 'Powers of 10 Scaling',
    learningOutcome: 'Compare orders of magnitude.',
    instructions: 'An AI dataset grows from 10² images to 10⁴ images. By how many times did it grow?',
    options: ['100 times (10²)', '2 times', '20 times', '10 times'],
    correctAnswer: '100 times (10²)',
    explanation: '10⁴ ÷ 10² = 10,000 ÷ 100 = 100 times!',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'ct-15',
    game: 'CT-Bank',
    chapter: 'Quadrilaterals',
    concept: 'Angle Sum Property',
    learningOutcome: 'Compute missing angle in a quadrilateral.',
    instructions: 'Three angles of a quadrilateral are 90°, 90°, and 80°. What is the fourth angle?',
    options: ['100°', '90°', '110°', '80°'],
    correctAnswer: '100°',
    explanation: 'Sum of interior angles of any quadrilateral = 360°. 360 − (90+90+80) = 100°.',
    difficulty: 'Easy',
    points: 100
  }
];

// Minimum 10 AI Project Lifecycle Challenges
export const LIFECYCLE_STAGES = [
  { id: 'define', order: 1, title: '1. Problem Definition', icon: '🎯', color: 'border-cyan-400 bg-cyan-500/15', desc: 'Understand the real goal & who is affected.' },
  { id: 'collect', order: 2, title: '2. Data Collection', icon: '📥', color: 'border-violet-400 bg-violet-500/15', desc: 'Gather clean, relevant, representative data.' },
  { id: 'test', order: 3, title: '3. Testing AI Tools', icon: '🧪', color: 'border-emerald-400 bg-emerald-500/15', desc: 'Try AI tools/models and observe outputs.' },
  { id: 'reflect', order: 4, title: '4. Reflection & Improvement', icon: '🔁', color: 'border-amber-400 bg-amber-500/15', desc: 'Evaluate mistakes, fairness & refine solution.' }
];

export const SCHOOL_ELECTRICITY_CARDS = [
  { id: 'elec-1', text: 'Identify the electricity wastage problem in empty classrooms', stage: 'define', concept: 'Problem Definition', explanation: 'Scoping the exact issue (fans & lights left ON in empty rooms) comes first.' },
  { id: 'elec-2', text: 'Collect hourly electricity usage & occupancy data across rooms', stage: 'collect', concept: 'Data Collection', explanation: 'Gathering accurate meter and timetable data fuels the AI tool.' },
  { id: 'elec-3', text: 'Explore & test AI tools that predict idle rooms and alert monitors', stage: 'test', concept: 'Testing AI Tools', explanation: 'Testing candidate AI models checks how well they spot wasted energy.' },
  { id: 'elec-4', text: 'Evaluate weekly savings and improve missed alert rules', stage: 'reflect', concept: 'Reflection & Improvement', explanation: 'Reflecting on false alerts helps make the school solution better next week.' }
];

export const DATA_CLEANING_ROWS = [
  { id: 'R1', room: 'Class 8A', day: 'Mon', kwh: '14.2', status: 'Clean', badField: null, issue: null },
  { id: 'R2', room: 'Class 8B', day: 'Mon', kwh: 'MISSING', status: 'Active', badField: 'kwh', issue: 'Missing value! Blank/missing energy reading must be measured or fixed.' },
  { id: 'R3', room: 'Class 8A', day: 'Mon', kwh: '14.2', status: 'DUPLICATE', badField: 'status', issue: 'Duplicate record! Class 8A Monday was entered twice and would double-count usage.' },
  { id: 'R4', room: 'Class 8C', day: 'Tue', kwh: '-95.0', status: 'Active', badField: 'kwh', issue: 'Incorrect entry! Negative electricity usage (-95.0 kWh) is physically impossible.' },
  { id: 'R5', room: 'Lab 1', day: 'Tue', kwh: '99999', status: 'Active', badField: 'kwh', issue: 'Outlier / typo error! 99,999 kWh in one classroom is an unrealistic sensor glitch.' },
  { id: 'R6', room: 'Class 8D', day: 'Wed', kwh: '11.8', status: 'Clean', badField: null, issue: null }
];

export const LIFECYCLE_CHALLENGES = [
  { id: 'lc-1', concept: 'Lifecycle Order', learningOutcome: 'Order the 4 stages of the AI Project Lifecycle.', instructions: 'Drag stages 1→4 into circular order.', correctAnswer: 'Problem Definition → Data Collection → Testing AI Tools → Reflection & Improvement', explanation: 'Every AI project starts by defining the problem, then collecting clean data, testing AI tools, and reflecting.', difficulty: 'Easy', points: 150 },
  ...SCHOOL_ELECTRICITY_CARDS.map((c, i) => ({
    id: `lc-${i + 2}`,
    concept: c.concept,
    learningOutcome: 'Map school electricity tasks to lifecycle stages.',
    instructions: `Place "${c.text}" into its lifecycle stage.`,
    correctAnswer: c.stage,
    explanation: c.explanation,
    difficulty: 'Easy',
    points: 100
  })),
  { id: 'lc-6', concept: 'Missing Values', learningOutcome: 'Identify missing values during data cleaning.', instructions: 'Tap the missing kWh cell in Class 8B.', correctAnswer: 'R2: MISSING', explanation: 'Missing values break calculations unless handled properly.', difficulty: 'Easy', points: 100 },
  { id: 'lc-7', concept: 'Duplicate Records', learningOutcome: 'Spot duplicate rows that distort totals.', instructions: 'Tap the duplicate row for Class 8A.', correctAnswer: 'R3: DUPLICATE', explanation: 'Duplicates bias counts and exaggerate averages.', difficulty: 'Easy', points: 100 },
  { id: 'lc-8', concept: 'Impossible Negative Values', learningOutcome: 'Detect invalid negative measurements.', instructions: 'Tap the impossible kWh reading in Class 8C.', correctAnswer: 'R4: -95.0', explanation: 'Sensor bugs or typos like -95 kWh corrupt AI predictions.', difficulty: 'Medium', points: 100 },
  { id: 'lc-9', concept: 'Sensor Outlier Error', learningOutcome: 'Spot extreme unrealistic typos in datasets.', instructions: 'Tap the extreme outlier reading in Lab 1.', correctAnswer: 'R5: 99999', explanation: 'Extreme outliers skew averages and model training.', difficulty: 'Medium', points: 100 },
  { id: 'lc-10', concept: 'Why Clean Data Matters', learningOutcome: 'Explain the impact of clean data on AI accuracy.', instructions: 'Why do we clean messy data before Testing AI Tools?', correctAnswer: 'Clean, accurate data prevents wrong AI predictions and builds trust', explanation: 'Even the smartest AI algorithm fails if trained on dirty or duplicated data.', difficulty: 'Easy', points: 100 }
];

// Minimum 15 AI Application Classification Examples (Mission 4 AI City)
export const AI_CITY_LOCATIONS = [
  { id: 'hospital', name: 'Smart Hospital', icon: '🏥', domain: 'Computer Vision & Oversight', color: 'from-rose-500 to-red-600', summary: 'AI assists doctors by spotting anomalies in scans and organising triage—with doctors in final control.' },
  { id: 'farm', name: 'Smart Farm', icon: '🌾', domain: 'Data Science (Prediction)', color: 'from-emerald-500 to-green-600', summary: 'Soil, rainfall, and temperature sensors predict exactly which crops need watering today.' },
  { id: 'school', name: 'Smart School', icon: '🏫', domain: 'Creative AI & Clustering', color: 'from-violet-500 to-indigo-600', summary: 'Group unlabelled objects using Clustering and design AI robots in the Colouring Studio!' },
  { id: 'transport', name: 'Smart Transport', icon: '🚦', domain: 'Computer Vision (Classification)', color: 'from-amber-500 to-orange-600', summary: 'Traffic cameras classify vehicles, cyclists, and pedestrians to keep crossings safe.' },
  { id: 'comms', name: 'Smart Communication Centre', icon: '📡', domain: 'Natural Language Processing (NLP)', color: 'from-cyan-500 to-blue-600', summary: 'AI reads feedback messages and classifies tone as Positive, Negative, or Neutral.' }
];

export const FARM_DATASET = [
  { plot: 'Plot A (Tomato)', temp: 36, rainfall: 2, moisture: 18, needsWater: 'Yes – Water Now', reason: 'High heat (36°C) + low rain (2mm) + dry soil (18%)' },
  { plot: 'Plot B (Spinach)', temp: 24, rainfall: 18, moisture: 72, needsWater: 'No – Soil Moist', reason: 'Good rainfall (18mm) and healthy moisture (72%)' },
  { plot: 'Plot C (Millet)', temp: 33, rainfall: 4, moisture: 24, needsWater: 'Yes – Water Now', reason: 'Warm temperature (33°C) and low moisture (24%)' }
];

export const CV_IMAGE_ITEMS = [
  { id: 'cv1', label: 'Tabby Cat', icon: '🐱', category: 'Animals' },
  { id: 'cv2', label: 'Golden Dog', icon: '🐶', category: 'Animals' },
  { id: 'cv3', label: 'Blue Bird', icon: '🐦', category: 'Animals' },
  { id: 'cv4', label: 'Red Apple', icon: '🍎', category: 'Fruits' },
  { id: 'cv5', label: 'Sweet Mango', icon: '🥭', category: 'Fruits' },
  { id: 'cv6', label: 'School Bus', icon: '🚌', category: 'Vehicles' },
  { id: 'cv7', label: 'Electric Train', icon: '🚆', category: 'Vehicles' },
  { id: 'cv8', label: 'Bicycle', icon: '🚲', category: 'Vehicles' }
];

export const NLP_SENTENCES = [
  { id: 'nlp1', text: 'I love learning new things in AI class!', sentiment: 'Positive', explanation: 'Words like "love" express clear positive emotion.' },
  { id: 'nlp2', text: 'This broken microphone makes the lesson boring.', sentiment: 'Negative', explanation: 'Words like "broken" and "boring" indicate negative sentiment.' },
  { id: 'nlp3', text: 'The classroom has 30 students and 15 desks.', sentiment: 'Neutral', explanation: 'A plain factual statement with no positive or negative opinion.' },
  { id: 'nlp4', text: 'Our team solved the puzzle together—awesome!', sentiment: 'Positive', explanation: '"Awesome" expresses excitement and positive satisfaction.' },
  { id: 'nlp5', text: 'The bus arrived 40 minutes late in heavy rain.', sentiment: 'Negative', explanation: 'Late arrival expresses frustration/negative experience.' },
  { id: 'nlp6', text: 'The science exhibition begins at 10:00 AM.', sentiment: 'Neutral', explanation: 'Pure schedule information—neutral tone.' }
];

export const AI_APPLICATION_EXAMPLES = [
  ...CV_IMAGE_ITEMS.map((c) => ({
    id: `app-${c.id}`,
    concept: 'Computer Vision Classification',
    learningOutcome: 'Label images into visual categories.',
    instructions: `Classify ${c.label} into Animals, Fruits, or Vehicles.`,
    correctAnswer: c.category,
    explanation: `Computer Vision detects visual features (ears, wheels, shape) to place ${c.label} in ${c.category}.`,
    difficulty: 'Easy',
    points: 100
  })),
  ...NLP_SENTENCES.map((n) => ({
    id: `app-${n.id}`,
    concept: 'NLP Sentiment Analysis',
    learningOutcome: 'Classify sentence tone into Positive, Negative, or Neutral.',
    instructions: `Classify: "${n.text}"`,
    correctAnswer: n.sentiment,
    explanation: n.explanation,
    difficulty: 'Easy',
    points: 100
  })),
  ...FARM_DATASET.map((f, i) => ({
    id: `app-farm-${i}`,
    concept: 'Data Science Prediction',
    learningOutcome: 'Predict crop watering needs from numerical weather patterns.',
    instructions: `Predict watering need for ${f.plot} (Temp ${f.temp}°C, Rain ${f.rainfall}mm, Moisture ${f.moisture}%).`,
    correctAnswer: f.needsWater,
    explanation: f.reason,
    difficulty: 'Medium',
    points: 150
  }))
];

// Minimum 10 Fairness & Bias Challenges (Mission 5 Data Detectives)
export const SPORTS_BIASED_DATASET = [
  { id: 'ST-101', attendance: '92%', pastScore: 84, category: 'Cricket (Urban Club)', selected: 'Selected' },
  { id: 'ST-102', attendance: '90%', pastScore: 81, category: 'Cricket (Urban Club)', selected: 'Selected' },
  { id: 'ST-103', attendance: '94%', pastScore: 87, category: 'Athletics (Girls)', selected: 'Not Selected (Missing Data)' },
  { id: 'ST-104', attendance: '91%', pastScore: 85, category: 'Kabaddi (Rural Zone)', selected: 'Not Selected (No Records)' },
  { id: 'ST-105', attendance: '89%', pastScore: 82, category: 'Para-Sports / Inclusive', selected: 'Excluded by System' }
];

export const FAIRNESS_SCENARIOS = [
  { id: 'f1', text: 'A facial recognition system works accurately on lighter faces but fails often for darker faces.', label: 'Needs Improvement', concept: 'Representation Bias', explanation: 'Training images lacked diverse skin tones, causing unfair accuracy gaps.', difficulty: 'Easy', points: 100 },
  { id: 'f2', text: 'A school online assignment AI ignores students who have limited home internet access.', label: 'Needs Improvement', concept: 'Digital Inclusion', explanation: 'Students without high-speed internet are unfairly penalised unless offline options exist.', difficulty: 'Easy', points: 100 },
  { id: 'f3', text: 'A national sports dataset contains only urban city club examples and zero rural schools.', label: 'Needs Improvement', concept: 'Data Imbalance', explanation: 'Geographic imbalance hides talented students outside big cities.', difficulty: 'Easy', points: 100 },
  { id: 'f4', text: 'Every student from all sports categories, genders, and regions gets an equal chance to submit trial data.', label: 'Fair', concept: 'Equal Opportunity & Inclusion', explanation: 'Balanced, inclusive data collection ensures every eligible student is fairly evaluated.', difficulty: 'Easy', points: 100 },
  { id: 'f5', text: 'Historical sports data only tracked boys’ cricket for 10 years, so the AI predicts zero girls will qualify.', label: 'Needs Improvement', concept: 'Historical Bias', explanation: 'Old unfair records teach AI to repeat past exclusions unless repaired.', difficulty: 'Medium', points: 150 },
  { id: 'f6', text: 'A school library recommender tests suggestions across Grade 6, 7, and 8 reading levels before launch.', label: 'Fair', concept: 'Fairness Auditing', explanation: 'Testing across all student groups prevents excluding younger or quieter readers.', difficulty: 'Easy', points: 100 },
  { id: 'f7', text: 'Voice assistant understands only one regional accent and rejects other students’ spoken answers.', label: 'Needs Improvement', concept: 'Accent & Language Bias', explanation: 'Diverse voice samples from all regions must be included in training.', difficulty: 'Medium', points: 100 },
  { id: 'f8', text: 'A scholarship AI checks verified academic & attendance effort plus human teacher review.', label: 'Fair', concept: 'Fairness + Human Oversight', explanation: 'Combining transparent criteria with human teacher review ensures fair decisions.', difficulty: 'Medium', points: 100 },
  { id: 'f9', text: 'Repairing data by adding Athletics (Girls), Rural Kabaddi, and Para-Sports trials.', label: 'Fair', concept: 'Dataset Repair', explanation: 'Collecting missing category data directly fixes representation bias.', difficulty: 'Easy', points: 150 },
  { id: 'f10', text: 'Removing biased proxy labels like home pin-code when picking school team captains.', label: 'Fair', concept: 'Removing Proxy Bias', explanation: 'Home location should never unfairly disadvantage deserving students.', difficulty: 'Medium', points: 150 }
];

// Minimum 10 Ethics Scenarios (Mission 6 Courtroom + Bank)
export const ETHICS_CASES = [
  {
    id: 'e1',
    title: 'Case 1: Chatbot Leaks Private Info',
    scenario: 'A school helpdesk chatbot shares a student’s home address and phone number in a public chat.',
    verdict: 'Irresponsible',
    principle: 'Privacy & Data Protection',
    actions: [
      'Immediately mask personal data, add strict privacy shields, and notify affected families',
      'Leave it online because nobody asked for privacy',
      'Blame the student for typing their name'
    ],
    bestAction: 'Immediately mask personal data, add strict privacy shields, and notify affected families',
    explanation: 'Private personal data must never be exposed. Strong privacy controls and consent are mandatory.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'e2',
    title: 'Case 2: Unacknowledged AI Homework',
    scenario: 'A student submits an entire essay generated by AI as 100% their own writing without acknowledging AI assistance.',
    verdict: 'Irresponsible',
    principle: 'Transparency & Academic Honesty',
    actions: [
      'Use AI ethically as a brainstorming helper, verify facts, write in own words, and acknowledge AI help',
      'Copy-paste even faster so nobody notices',
      'Ban computers from the school forever'
    ],
    bestAction: 'Use AI ethically as a brainstorming helper, verify facts, write in own words, and acknowledge AI help',
    explanation: 'Transparency and honesty matter: AI can assist learning, not replace your own thinking or hide credit.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'e3',
    title: 'Case 3: Viral AI Misinformation',
    scenario: 'An AI-generated fake audio clip claiming school exams are cancelled spreads rapidly across group chats.',
    verdict: 'Irresponsible',
    principle: 'Misinformation Awareness & Verification',
    actions: [
      'Verify with official school notice/teacher first, report the fake clip, and do not forward it',
      'Forward it to 10 more friends just in case',
      'Believe anything with realistic audio'
    ],
    bestAction: 'Verify with official school notice/teacher first, report the fake clip, and do not forward it',
    explanation: 'Deepfakes and AI misinformation can look very real—always verify sources before sharing!',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'e4',
    title: 'Case 4: Biased Scholarship Rejections',
    scenario: 'An automated AI system rejects deserving students from rural branches because training data favoured city clubs.',
    verdict: 'Irresponsible',
    principle: 'Fairness & Accountability',
    actions: [
      'Audit the dataset for bias, retrain with balanced rural & urban records, and add human review',
      'Keep the rules secret so students cannot complain',
      'Delete rural applications automatically'
    ],
    bestAction: 'Audit the dataset for bias, retrain with balanced rural & urban records, and add human review',
    explanation: 'Fairness and accountability require fixing biased training data and allowing human appeals.',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'e5',
    title: 'Case 5: Hidden Camera Surveillance',
    scenario: 'A school installs AI emotion-tracking cameras in corridors without informing students, parents, or stating how data is stored.',
    verdict: 'Needs More Information',
    principle: 'Transparency, Consent & Human Oversight',
    actions: [
      'Require clear policy, parent/student notice, minimal data retention, and open ethical review before use',
      'Hide the cameras inside ceiling tiles',
      'Sell emotion logs to third-party apps'
    ],
    bestAction: 'Require clear policy, parent/student notice, minimal data retention, and open ethical review before use',
    explanation: 'Even if meant for safety, surveillance without transparency, clear limits, and oversight lacks crucial ethical safeguards!',
    difficulty: 'Medium',
    points: 150
  },
  {
    id: 'e6',
    title: 'Case 6: Accessible Sign-Language Translator',
    scenario: 'Students build an AI sign-language translator with volunteers’ consent, tested for fairness and clear human fallback.',
    verdict: 'Responsible',
    principle: 'Inclusion & Responsible AI',
    actions: [
      'Keep testing across diverse signers, display a confidence note, and maintain human interpreter support',
      'Remove the consent form',
      'Stop letting users report mistakes'
    ],
    bestAction: 'Keep testing across diverse signers, display a confidence note, and maintain human interpreter support',
    explanation: 'Consent + inclusion + human oversight makes this a strong Responsible AI solution!',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'e7',
    title: 'Case 7: Mystery Medical Advice Bot',
    scenario: 'A free app prescribes antibiotics via AI without doctor review or telling users where its medical facts came from.',
    verdict: 'Irresponsible',
    principle: 'Human Oversight & Safety',
    actions: [
      'Require licensed doctor verification and clearly warn users not to self-medicate from AI alone',
      'Increase font size of the prescription',
      'Hide all safety disclaimers'
    ],
    bestAction: 'Require licensed doctor verification and clearly warn users not to self-medicate from AI alone',
    explanation: 'High-stakes medical decisions must always remain under qualified human oversight.',
    difficulty: 'Medium',
    points: 100
  },
  {
    id: 'e8',
    title: 'Case 8: Unlabelled AI Art Contest Entry',
    scenario: 'An art competition poster rules are unclear on AI tools, and a student enters an AI-generated painting without saying so.',
    verdict: 'Needs More Information',
    principle: 'Transparency & Clear Rules',
    actions: [
      'Clarify contest rules (Human Art vs AI-Assisted category) and require clear disclosure of AI tools used',
      'Award double prizes secretly',
      'Delete all digital art entries'
    ],
    bestAction: 'Clarify contest rules (Human Art vs AI-Assisted category) and require clear disclosure of AI tools used',
    explanation: 'Clear rules and transparent disclosure ensure fairness to both traditional artists and AI creators.',
    difficulty: 'Medium',
    points: 100
  },
  {
    id: 'e9',
    title: 'Case 9: Open Flood Early-Warning Alert',
    scenario: 'A local disaster team uses verified river-sensor data + AI predictions to send free SMS flood alerts reviewed by engineers.',
    verdict: 'Responsible',
    principle: 'Accountability & Social Good',
    actions: [
      'Continue regular sensor calibration, engineer verification, and accessible multi-language alerts',
      'Turn off alerts for smaller villages',
      'Charge a fee per SMS during floods'
    ],
    bestAction: 'Continue regular sensor calibration, engineer verification, and accessible multi-language alerts',
    explanation: 'Verified data, human engineer review, and inclusive access embody Responsible AI for public good.',
    difficulty: 'Easy',
    points: 100
  },
  {
    id: 'e10',
    title: 'Case 10: Who is Responsible When AI Errs?',
    scenario: 'A company claims "The AI algorithm did it, not us!" after its hiring software unfairly blocks qualified candidates.',
    verdict: 'Irresponsible',
    principle: 'Accountability',
    actions: [
      'Hold the organisation and builders accountable to audit, fix, and redress unfair outcomes',
      'Accept that code has a mind of its own',
      'Shut down human HR teams completely'
    ],
    bestAction: 'Hold the organisation and builders accountable to audit, fix, and redress unfair outcomes',
    explanation: 'Algorithms are built and deployed by humans—Accountability always rests with the people and organisations using AI.',
    difficulty: 'Medium',
    points: 150
  }
];

// Mission 7: Final Boss Battle vs THE BUG MASTER (5 Mixed Co-op Challenges)
export const BOSS_CHALLENGES = [
  {
    id: 'boss-1',
    format: 'classify',
    title: 'Round 1 · AI vs Automation Trap!',
    concept: 'AI vs Rule-Based Systems',
    prompt: 'THE BUG MASTER says: "A regular microwave timer that heats food for 2 minutes is Artificial Intelligence!" Defeat this bug:',
    options: [
      'False! It follows a fixed timer rule without learning from data',
      'True! Any machine with buttons is AI',
      'True! Heating food requires Computer Vision'
    ],
    correctAnswer: 'False! It follows a fixed timer rule without learning from data',
    explanation: 'Conventional timers follow fixed human-set rules; AI learns patterns and adapts.',
    points: 150
  },
  {
    id: 'boss-2',
    format: 'pattern',
    title: 'Round 2 · Crack the Boss Cipher!',
    concept: 'Computational Thinking (Powers & Binary)',
    prompt: 'THE BUG MASTER locked the firewall with binary 1101 (place values 8, 4, 2, 1) and pattern 3, 6, 12, 24, ___. Pick the exact pair:',
    options: [
      'Decimal 13 & Next 48',
      'Decimal 11 & Next 36',
      'Decimal 14 & Next 48'
    ],
    correctAnswer: 'Decimal 13 & Next 48',
    explanation: '1101 = 8 + 4 + 0 + 1 = 13, and 24 × 2 = 48!',
    points: 150
  },
  {
    id: 'boss-3',
    format: 'algorithm',
    title: 'Round 3 · Debug the Clean-Data Algorithm!',
    concept: 'AI Project Lifecycle & Clean Data',
    prompt: 'Which sequence properly fixes a school AI project after finding missing & duplicate rows?',
    options: [
      'Define Problem → Collect & Clean Data → Test AI Tool → Reflect & Improve',
      'Test AI Tool → Delete Labels → Ignore Missing Data → Guess Result',
      'Reflect First → Skip Data Collection → Launch Unchecked'
    ],
    correctAnswer: 'Define Problem → Collect & Clean Data → Test AI Tool → Reflect & Improve',
    explanation: 'Clean data before testing and continuous reflection stop bugs from spreading.',
    points: 150
  },
  {
    id: 'boss-4',
    format: 'domain',
    title: 'Round 4 · Match All 3 AI Domains!',
    concept: 'Data Science, Computer Vision, NLP',
    prompt: 'Match: (1) Predicting rain from numbers, (2) Detecting dogs in photos, (3) Reading review sentiment:',
    options: [
      '(1) Data Science · (2) Computer Vision · (3) NLP',
      '(1) NLP · (2) Data Science · (3) Computer Vision',
      '(1) Computer Vision · (2) NLP · (3) Data Science'
    ],
    correctAnswer: '(1) Data Science · (2) Computer Vision · (3) NLP',
    explanation: 'Tables/numbers = Data Science, Images = Computer Vision, Language = NLP!',
    points: 150
  },
  {
    id: 'boss-5',
    format: 'ethics',
    title: 'Round 5 · Final Ethics Strike!',
    concept: 'Fairness, Privacy & Human Oversight',
    prompt: 'THE BUG MASTER tries to deploy an untested, biased, secret surveillance AI. Both teams unite—what is the winning ethical shield?',
    options: [
      'Balanced Representative Data + Clear Consent/Privacy + Transparency + Human Oversight',
      'Hide the code + Collect private student chats + Remove human review',
      'Use only 5 urban samples + Never check errors'
    ],
    correctAnswer: 'Balanced Representative Data + Clear Consent/Privacy + Transparency + Human Oversight',
    explanation: 'Responsible AI Explorers protect fairness, privacy, transparency, and human accountability!',
    points: 200
  }
];

// Before & After Learning Assessments (5 Questions Each)
export const BEFORE_ASSESSMENT = [
  {
    id: 'pre-1',
    concept: 'AI vs Rule-Based Automation',
    prompt: '1. Which device uses Artificial Intelligence rather than just a fixed timer?',
    options: ['Voice assistant that understands speech', 'Ordinary wall clock', 'Basic 4-function calculator', 'Light switch'],
    answerIndex: 0
  },
  {
    id: 'pre-2',
    concept: 'Computational Thinking (Decomposition)',
    prompt: '2. Breaking a big school event into smaller manageable steps is called:',
    options: ['Decomposition', 'Guessing', 'Duplication', 'Encryption'],
    answerIndex: 0
  },
  {
    id: 'pre-3',
    concept: 'AI Project Lifecycle & Data',
    prompt: '3. Why do we clean missing and duplicate records before training an AI tool?',
    options: ['Clean data helps AI make accurate decisions', 'Dirty data makes computers faster', 'Duplicates are always required', 'Data cleaning is optional'],
    answerIndex: 0
  },
  {
    id: 'pre-4',
    concept: 'Data Fairness & Bias',
    prompt: '4. If an AI sports selector is trained ONLY on city boys’ cricket data, what happens?',
    options: ['It becomes biased and unfair to girls and rural athletes', 'It automatically invents rural data', 'It treats everyone identically', 'It turns into Computer Vision'],
    answerIndex: 0
  },
  {
    id: 'pre-5',
    concept: 'AI Ethics & Oversight',
    prompt: '5. Who remains responsible when an AI tool makes an unfair or unsafe mistake?',
    options: ['The humans and organisations who built and deployed it', 'Nobody—the code is alive', 'Only the students', 'The internet router'],
    answerIndex: 0
  }
];

export const AFTER_ASSESSMENT = [
  {
    id: 'post-1',
    concept: 'AI vs Rule-Based Automation',
    prompt: '1. Why does an ordinary automatic sliding door NOT necessarily use AI?',
    options: ['It follows a fixed sensor rule (motion → open) without learning', 'It uses Generative AI', 'It speaks 10 languages', 'It predicts weather'],
    answerIndex: 0
  },
  {
    id: 'post-2',
    concept: 'Abstraction & CT',
    prompt: '2. Ignoring the colour of a school bus to focus on student count (120) and seats (40) demonstrates:',
    options: ['Abstraction', 'Overfitting', 'Plagiarism', 'Deepfakes'],
    answerIndex: 0
  },
  {
    id: 'post-3',
    concept: 'AI Domains',
    prompt: '3. Grouping unlabelled objects by similarity without predefined tags is called:',
    options: ['Clustering', 'Data Deletion', 'Fixed Timing', 'Hallucination'],
    answerIndex: 0
  },
  {
    id: 'post-4',
    concept: 'Data Fairness & Repair',
    prompt: '4. What is the best way to repair an imbalanced dataset that excludes rural athletes?',
    options: ['Collect representative trial data from missing categories & regions', 'Delete all rows', 'Hide the selection criteria', 'Add duplicate city records'],
    answerIndex: 0
  },
  {
    id: 'post-5',
    concept: 'Responsible AI Ethics',
    prompt: '5. When you see an AI-generated rumour clip about exams, what is the responsible action?',
    options: ['Verify with official school sources, report it, and do not spread misinformation', 'Forward it immediately', 'Trust it because the voice sounds real', 'Ignore privacy rules'],
    answerIndex: 0
  }
];
