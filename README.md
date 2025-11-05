# Quiz App - Interactive Quiz Application

Aplikasi kuis interaktif yang dibangun dengan React untuk memenuhi challenge requirements. Aplikasi ini mengambil soal dari OpenTDB API dengan fitur lengkap seperti login, timer, auto-advance, dan mekanisme resume quiz menggunakan localStorage.

## Challenge Requirements

### Completed Requirements

1. **✓ Fitur Login**
   - Login dengan username
   - Autentikasi tersimpan di localStorage
   - Setiap user memiliki data terpisah

2. **✓ OpenTDB API Integration**
   - Soal-soal diambil dari https://opentdb.com/
   - Support multiple categories
   - 3 tingkat kesulitan: Easy, Medium, Hard

3. **✓ Display Soal & Progress**
   - Total soal ditampilkan di header
   - Progress bar real-time
   - Jumlah soal yang dikerjakan di overview

4. **✓ Timer System**
   - Countdown timer di pojok kanan atas
   - 1 menit per soal (customizable)
   - Auto-finish ketika waktu habis

5. **✓ One Question Per Page**
   - Satu halaman = satu soal
   - **Auto-advance setelah pilih jawaban** (sesuai requirement!)
   - Smooth transition antar soal

6. **✓ Results Display**
   - Jumlah benar ditampilkan
   - Jumlah salah ditampilkan  
   - Jumlah tidak dijawab ditampilkan
   - Review semua jawaban dengan detail

7. **✓ Resume Quiz Mechanism (NILAI PLUS)**
   - Ketika browser ditutup, data tersimpan di localStorage
   - Saat login kembali, muncul modal untuk melanjutkan quiz
   - User bisa pilih "Lanjutkan Quiz" atau "Mulai Baru"
   - Data quiz per user (tidak tercampur)

## Tech Stack

- **React 19.1.1** - Frontend framework
- **React Router DOM 7.9.4** - Navigation & routing
- **Tailwind CSS 3.4.18** - Styling
- **SweetAlert2** - Beautiful alerts & modals
- **Lucide React** - Icon library
- **Vite** - Build tool & dev server
- **OpenTDB API** - Quiz questions source
- **localStorage** - Data persistence

## Project Structure

```
src/
├── components/
│   ├── Login.jsx              # Login page dengan username
│   ├── QuizStart.jsx           # Dashboard & quiz configuration
│   ├── Quiz.jsx                # Main quiz interface
│   ├── QuizResult.jsx          # Results & review answers
│   ├── ResumeQuizModal.jsx     # Resume quiz modal
│   └── Timer.jsx               # Countdown timer component
├── context/
│   ├── AuthContext.jsx         # User authentication state
│   ├── QuizContext.jsx         # Quiz session management
│   └── UserStatsContext.jsx    # User statistics & history
├── hooks/
│   ├── useAuth.js              # Auth hook
│   ├── useQuiz.js              # Quiz hook
│   └── useUserStats.js         # User stats hook
├── lib/
│   ├── storage.js              # localStorage utilities (user-specific)
│   ├── sweetalert.js           # SweetAlert configurations
│   └── utils.js                # Helper functions
└── App.jsx                     # Main app with routing
```

## How to Use

### 1. **Login**
```
- Masukkan username (min 3 karakter)
- Klik "Start Quiz Adventure"
- Data user tersimpan di localStorage
```

### 2. **Start Quiz**
```
- Pilih Difficulty: Easy / Medium / Hard
- Pilih Jumlah Soal: 5 / 10 / 15 / 20
- Klik "Start Quiz"
```

### 3. **Taking Quiz**
```
- Baca pertanyaan di halaman
- Klik jawaban yang dipilih
- OTOMATIS pindah ke soal berikutnya (auto-advance)
- Timer countdown di pojok kanan atas
- Progress bar di atas
```

### 4. **Resume Quiz (Browser Ditutup)**
```
Scenario 1: Quiz sedang berjalan
→ Tutup browser
→ Buka browser lagi & login
→ Modal muncul: "Quiz Belum Selesai"
→ Pilih "Lanjutkan Quiz" atau "Mulai Baru"

Scenario 2: Quiz selesai normal
→ Tidak ada modal resume
→ Data cleared dari localStorage
```

### 5. **Results**
```
- Lihat score percentage
- Lihat jumlah benar/salah/tidak dijawab
- Review semua jawaban
- Cek mana yang benar dan salah
- Retake quiz atau back to home
```

## Data Storage

### User-Specific Storage
Setiap user memiliki data terpisah menggunakan username sebagai key:

```javascript
// Storage structure
quiz_session_username       // Active quiz session
quiz_user_stats_username    // Quiz history & statistics
quiz_user                   // Current logged in user
```

### Storage Functions
```javascript
// Quiz session management
saveQuizSession(session, username)
getQuizSession(username)
removeQuizSession(username)

// User statistics
saveUserStats(stats, username)
getUserStats(username)

// Check for saved quiz
hasSavedQuiz(username)
```

## Key Features

### Auto-Advance (Requirement f)
```jsx
// Setelah user pilih jawaban, langsung pindah soal
const handleAnswerSelect = (answer) => {
  submitAnswer(answer);
  
  // Auto-advance after 1 second
  setTimeout(() => {
    if (currentQuestionIndex < questions.length - 1) {
      goToNextQuestion();
    }
  }, 1000);
};
```

### Resume Quiz Modal
```jsx
// Check for saved quiz on login
useEffect(() => {
  if (user?.username) {
    const savedQuiz = getQuizSession(user.username);
    if (savedQuiz && savedQuiz.isQuizActive) {
      showResumeModal(savedQuiz); // Modal muncul
    }
  }
}, [user]);
```

### Timer Auto-Finish
```jsx
// Timer habis = otomatis finish quiz
useEffect(() => {
  if (timeRemaining === 0 && isQuizActive) {
    finishQuiz();
    navigate('/result');
  }
}, [timeRemaining]);
```

## 🔧 Installation & Development

### Prerequisites
```bash
Node.js 18+ 
npm atau yarn
```

### Setup
```bash
# Clone repository
git clone https://github.com/onyourjie/dot_quizapp.git
cd dot_quizapp

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
# Build
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables
**Tidak diperlukan!** Aplikasi ini hanya menggunakan:
- OpenTDB API (public, no auth)
- localStorage (browser storage)
- No backend/database

**Filzah Mufidah**
- Challenge: Quiz App with Resume Mechanism
- Tech: React + OpenTDB API + localStorage

---