# THE ULTIMATE AI CHAMPIONSHIP · Class 8 CBSE / KVS

*Think Smart. Play Smart. Become AI Smart!*

An interactive, touchscreen-first smart classroom web application built for **Class 8 Artificial Intelligence & Computational Thinking** in a **PM SHRI Kendriya Vidyalaya** classroom (30-minute two-team session: **TEAM BLUE – CYBER TITANS** vs **TEAM ORANGE – DATA DRAGONS**).

## Tech Stack
- **React 19 + Vite 6 + Tailwind CSS v4 + Lucide Icons + Web Audio SFX + LocalStorage**
- Zero external API dependencies, zero student login, works offline after initial build/load.

## Project Structure
```text
class8-app/
  package.json
  vite.config.js          # Outputs production build to ../class8 for direct portal/offline hosting
  index.html
  src/
    main.jsx
    index.css
    App.jsx
    components/
      WelcomeScreen.jsx
      ByteGuide.jsx
      TeamScoreboard.jsx
      GameTimer.jsx
      MissionNavigator.jsx
      DragDropGame.jsx    # Mission 1 (Human or Machine?) & Mission 3 (AI Project Lifecycle)
      PatternGame.jsx     # Mission 2 (Games A, B, D + 7 CT Chapters Bank)
      AlgorithmBuilder.jsx# Mission 2 (Game C: Tea Algorithm + Robot Debugging)
      ColouringCanvas.jsx # Touchscreen Drawing & Colouring Studio
      AIClassification.jsx# Mission 4 (Interactive AI City: Data Science, CV, NLP, Clustering)
      DataDetective.jsx   # Mission 5 (Spot Bias, Fair vs Unfair, Repair Dataset)
      EthicsCourtroom.jsx # Mission 6 (5 Ethics Cases + Safeguards)
      BossBattle.jsx      # Mission 7 (Co-op Boss Battle vs THE BUG MASTER)
      TeacherDashboard.jsx# PIN-protected Teacher Control Center (Default PIN: 4178)
      LearningReport.jsx  # Before/After 5-Q Assessments + Printable PDF / CSV Report
    data/
      aiCurriculum.js     # 4 Class 8 AI Chapters
      ctCurriculum.js     # 7 Class 8 CT Chapters
      questionBank.js     # 20+ AI Qs, 15+ CT Puzzles, 10+ Lifecycle, 16+ Apps, 10+ Fairness, 10+ Ethics
      activityBank.js     # 7 Timed Missions
    pages/
      Home.jsx
      Championship.jsx
      Teacher.jsx
      CurriculumExplorer.jsx
      Reports.jsx
    utils/
      scoring.js
      timer.js
      storage.js
      assessment.js
      sfx.js
```

## Run Locally
```bash
cd class8-app
npm install
npm run dev
```

## Build for Offline Classroom Use
```bash
cd class8-app
npm run build
```
This outputs a self-contained static bundle to `../class8/` (`d:\classes\class8\`), which can be served locally with any static server (`npx vite preview` or `python -m http.server`) or hosted directly on GitHub Pages.

## Sample 30-Minute Classroom Demonstration Session
1. **00:00–02:00 (Start & Baseline):** Open `Home`, set Class/Section & Teacher Name, optionally run the 5-question **Before Quiz** in `Report`, and click **START CHAMPIONSHIP**.
2. **02:00–05:00 (Mission 1 – AI Warm-Up):** Teams drag 10 everyday devices into *Uses AI* vs *Does Not Necessarily Use AI* (spot tricky rules like sliding doors & fixed washing machines).
3. **05:00–10:00 (Mission 2 – Computational Thinking):** Play Pattern Detectives, Break It Down! (Science Exhibition), Algorithm Builder (help BYTE make tea), and Abstraction (School Bus clues).
4. **10:00–15:00 (Mission 3 – AI Project Lifecycle):** Order the 4 circular stages, map School Electricity Wastage cards, and tap dirty cells in Data Cleaning.
5. **15:00–20:00 (Mission 4 – AI City & Creative Studio):** Tap Smart Hospital, Smart Farm (Data Science), Smart Transport (CV), Smart Comms (NLP), and Smart School (Clustering + Colouring Canvas).
6. **20:00–25:00 (Mission 5 – Data Detectives):** Spot bias in the fictional Sports Selection table, sort Fair vs Needs Improvement scenarios, and repair representation to 100%.
7. **25:00–28:00 (Mission 6 – Ethics Guardians):** Judge courtroom cases on Privacy, Transparency, Misinformation, Fairness, and Surveillance.
8. **28:00–30:00 (Mission 7 – Boss Battle & Report):** Both teams collaborate to defeat **THE BUG MASTER**, complete the 5-question **After Quiz**, and print/export the Learning Report!
