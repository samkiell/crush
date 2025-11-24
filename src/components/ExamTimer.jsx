import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTimer, endExam } from '../store/slices/examsSlice';

const ExamTimer = () => {
  const { timer, isExamActive } = useSelector((state) => state.exams);
  const dispatch = useDispatch();

  useEffect(() => {
    let interval;
    if (isExamActive && timer > 0) {
      interval = setInterval(() => {
        dispatch(updateTimer());
      }, 1000);
    } else if (timer === 0 && isExamActive) {
      dispatch(endExam());
      alert('Time is up! Your exam has been submitted.');
    }

    return () => clearInterval(interval);
  }, [isExamActive, timer, dispatch]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timer <= 300) return 'text-error'; // Last 5 minutes
    if (timer <= 600) return 'text-warning'; // Last 10 minutes
    return 'text-success';
  };

  if (!isExamActive) return null;

  return (
    <div className="fixed top-4 right-4 bg-base-300 rounded-xl px-4 py-2 shadow">
      <div className="text-center">
        <div className="text-sm text-base-content/70 mb-1">Time Remaining</div>
        <div className={`text-2xl font-bold ${getTimerColor()}`}>
          {formatTime(timer)}
        </div>
      </div>
    </div>
  );
};

export default ExamTimer;
