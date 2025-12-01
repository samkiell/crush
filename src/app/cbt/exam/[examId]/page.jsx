'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CBTLayout, QuestionGrid, QuestionCard, ExamControls } from '@/components/cbt';
import { motion } from 'framer-motion';

// Mock Data for JAMB Math 1978
const MOCK_EXAM_DATA = {
    id: 'jamb-mth-1978',
    subject: 'Mathematics 1978',
    duration: 7200, // 2 hours
    questions: Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        text: i % 5 === 0
            ? "If log₁₀2 = 0.3010 and log₁₀3 = 0.4771, evaluate log₁₀6."
            : i % 5 === 1
                ? "Solve for x: 2x² - 5x + 3 = 0"
                : i % 5 === 2
                    ? "The gradient of the curve y = 2x³ - 5x² + 2 at the point x = 2 is:"
                    : i % 5 === 3
                        ? "If sin θ = 3/5 and θ is acute, find tan θ."
                        : "Find the sum of the first 20 terms of the A.P. 3, 7, 11, ...",
        optionA: i % 5 === 0 ? "0.7781" : "1, 3/2",
        optionB: i % 5 === 0 ? "0.7000" : "1, -3/2",
        optionC: i % 5 === 0 ? "0.3010" : "-1, 3/2",
        optionD: i % 5 === 0 ? "0.4771" : "-1, -3/2",
        image: null
    }))
};

export default function ExamPage() {
    const params = useParams();
    const router = useRouter();
    const { examId } = params;

    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState([]);
    const [timeLeft, setTimeLeft] = useState(MOCK_EXAM_DATA.duration);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Save progress to localStorage for Dashboard Resume Card
    useEffect(() => {
        const progress = Math.round((currentQuestion / MOCK_EXAM_DATA.questions.length) * 100);
        const sessionData = {
            title: MOCK_EXAM_DATA.subject,
            type: 'Exam Session',
            progress,
            href: `/cbt/exam/${examId}`,
            timestamp: Date.now()
        };
        localStorage.setItem('last_active_session', JSON.stringify(sessionData));
    }, [currentQuestion, examId]);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleOptionSelect = (optionId) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: optionId
        }));
    };

    const handleNext = () => {
        if (currentQuestion < MOCK_EXAM_DATA.questions.length) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleFlag = () => {
        setFlagged(prev => {
            if (prev.includes(currentQuestion)) {
                return prev.filter(q => q !== currentQuestion);
            } else {
                return [...prev, currentQuestion];
            }
        });
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate submission
        setTimeout(() => {
            alert(`Exam Submitted!\nScore: ${Object.keys(answers).length}/${MOCK_EXAM_DATA.questions.length} answered.`);
            router.push('/cbt/result');
        }, 1500);
    };

    const question = MOCK_EXAM_DATA.questions[currentQuestion - 1];

    return (
        <CBTLayout
            subjectName={MOCK_EXAM_DATA.subject}
            timeLeft={timeLeft}
            sidebar={
                <QuestionGrid
                    totalQuestions={MOCK_EXAM_DATA.questions.length}
                    currentQuestion={currentQuestion}
                    answers={answers}
                    flagged={flagged}
                    onQuestionSelect={setCurrentQuestion}
                />
            }
            footer={
                <ExamControls
                    currentQuestion={currentQuestion}
                    totalQuestions={MOCK_EXAM_DATA.questions.length}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onSubmit={handleSubmit}
                    onFlag={handleFlag}
                    isFlagged={flagged.includes(currentQuestion)}
                />
            }
        >
            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                <QuestionCard
                    questionNumber={currentQuestion}
                    totalQuestions={MOCK_EXAM_DATA.questions.length}
                    question={question}
                    selectedOption={answers[currentQuestion]}
                    onOptionSelect={handleOptionSelect}
                />
            </motion.div>
        </CBTLayout>
    );
}
