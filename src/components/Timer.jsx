import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { Clock, AlertCircle } from 'lucide-react';

const Timer = () => {
  const { timeRemaining, setTimeRemaining, finishQuiz, isQuizActive } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't run timer if quiz is not active
    if (!isQuizActive) {
      return;
    }

    if (timeRemaining <= 0) {
      console.log('⏰ Timer finished - auto finishing quiz');
      finishQuiz();
      navigate('/result');
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          console.log('⏰ Timer reached 0 - auto finishing quiz');
          finishQuiz();
          navigate('/result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, setTimeRemaining, finishQuiz, navigate, isQuizActive]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining < 60;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
        isLowTime
          ? 'bg-red-100 text-red-700 animate-pulse'
          : 'bg-indigo-100 text-indigo-700'
      }`}
    >
      {isLowTime ? (
        <AlertCircle className="h-5 w-5" />
      ) : (
        <Clock className="h-5 w-5" />
      )}
      <span className="text-lg">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
