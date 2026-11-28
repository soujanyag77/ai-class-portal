export const CT_CHAPTERS = [
  {
    id: 'ct-ch1',
    number: 1,
    title: 'A Square and a Cube',
    skill: 'Pattern Recognition & Growth',
    icon: '⬛',
    concept: 'Recognise square (n²) and cube (n³) growth patterns in tiled grids and number sequences.',
    puzzle: {
      prompt: 'Tile Grid Pattern: 1×1 (1), 2×2 (4), 3×3 (9), 4×4 (16), ___?',
      options: ['25 (5×5)', '20 (4×5)', '24 (4×6)', '36 (6×6)'],
      answer: '25 (5×5)',
      explanation: 'Each stage forms a square of side n, so the 5th term is 5² = 25 tiles.'
    }
  },
  {
    id: 'ct-ch2',
    number: 2,
    title: 'Power Play',
    skill: 'Exponential & Binary Patterns',
    icon: '⚡',
    concept: 'Understand repeated multiplication (powers of 2) that drives computer memory and AI data growth.',
    puzzle: {
      prompt: 'An AI sensor doubles its stored samples every hour: 2, 4, 8, 16, ___?',
      options: ['32', '24', '18', '64'],
      answer: '32',
      explanation: 'Powers of 2: 2¹=2, 2²=4, 2³=8, 2⁴=16, so 2⁵ = 32.'
    }
  },
  {
    id: 'ct-ch3',
    number: 3,
    title: 'A Story of Numbers',
    skill: 'Number Systems & Binary',
    icon: '🔢',
    concept: 'Computers represent every number, pixel, and word using binary (0 and 1) place values: 8, 4, 2, 1.',
    puzzle: {
      prompt: 'In binary place values (8, 4, 2, 1), what decimal number is 1010?',
      options: ['10', '12', '8', '5'],
      answer: '10',
      explanation: '1010 = (1×8) + (0×4) + (1×2) + (0×1) = 8 + 2 = 10!'
    }
  },
  {
    id: 'ct-ch4',
    number: 4,
    title: 'Quadrilaterals',
    skill: 'Geometric Classification',
    icon: '🔷',
    concept: 'Classify 4-sided shapes by equal sides, parallel edges, and 90° angles—just like Computer Vision feature classifiers.',
    puzzle: {
      prompt: 'Which quadrilateral ALWAYS has 4 equal sides AND four 90° angles?',
      options: ['Square', 'Rhombus', 'Trapezium', 'Kite'],
      answer: 'Square',
      explanation: 'A rhombus has 4 equal sides, but a Square requires both 4 equal sides and four 90° right angles.'
    }
  },
  {
    id: 'ct-ch5',
    number: 5,
    title: 'Number Play',
    skill: 'Divisibility & Logical Reasoning',
    icon: '🎲',
    concept: 'Use divisibility rules and parity checks to filter data fast without brute-force division.',
    puzzle: {
      prompt: 'Which student ID number is divisible by BOTH 3 and 5?',
      options: ['135', '125', '142', '154'],
      answer: '135',
      explanation: '135 ends in 5 (divisible by 5) and digit sum 1+3+5 = 9 (divisible by 3)!'
    }
  },
  {
    id: 'ct-ch6',
    number: 6,
    title: 'We Distribute Yet Things Multiply',
    skill: 'Decomposition & Distributive Thinking',
    icon: '🧩',
    concept: 'Break large multiplications into simpler parts: a×(b+c) = (a×b) + (a×c), mirroring CT decomposition.',
    puzzle: {
      prompt: 'Using decomposition: 12 × 25 = (12 × 20) + (12 × 5) equals:',
      options: ['300', '260', '280', '320'],
      answer: '300',
      explanation: '240 + 60 = 300! Breaking big tasks into smaller parts makes calculation fast and error-free.'
    }
  },
  {
    id: 'ct-ch7',
    number: 7,
    title: 'Proportional Reasoning',
    skill: 'Scaling & Ratios for AI',
    icon: '⚖️',
    concept: 'Scale training samples, fairness ratios, and sensor predictions accurately across different group sizes.',
    puzzle: {
      prompt: 'If 4 solar sensors monitor 12 classrooms equally, how many sensors are needed for 30 classrooms?',
      options: ['10 sensors', '8 sensors', '12 sensors', '15 sensors'],
      answer: '10 sensors',
      explanation: 'Ratio is 1 sensor per 3 classrooms (12 ÷ 4 = 3). For 30 classrooms: 30 ÷ 3 = 10 sensors.'
    }
  }
];
