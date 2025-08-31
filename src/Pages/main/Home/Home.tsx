import axios from 'axios';
interface Question {
  id: number;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers: string[];
}

import { useEffect, useState } from 'react';
import useAuthStore from '../../../store/useQuizStore';
import useCountdown from '../../../Hooks/useCountdown';

export default function Home() {
  const [dataque, setDataque] = useState<Question[]>([]);
  const [finish, setfinish] = useState<boolean>(false);
  const [stopNext, setstopNext] = useState<boolean>(false);
  const [stopprevious, setstopprevious] = useState<boolean>(false);
  const [timeend, setTimeend] = useState<boolean>(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[][]>([]);
  const {
    current,
    score,
    selectedAnswer,
    setCurrent,
    setSelectedAnswer,
    setscore,
  } = useAuthStore();

  const { handleTime, pause, reset, start } = useCountdown({
    duration: 20,
  });

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/questions.json');
        console.log('Raw response:', response);
        console.log('Data results:', response.data.results);
        setDataque(response.data.results);
      } catch (err) {
        console.error('Error fetching questions:', err);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (dataque.length) {
      const shuffled = dataque.map((q) => {
        // نسخ المصفوفة عشان ما نغيرش الأصلية
        const answers = [...q.answers];
        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        return answers;
      });
      setShuffledAnswers(shuffled);
    }
  }, [dataque]);

  //question handilation
  const handelAnswer = (answer: string) => {
    setSelectedAnswer(answer); // تعيين الاختيار مهما كان
    pause();
    if (answer === dataque?.[current]?.correct_answer) {
      setscore((prev) => prev + 1);
    }

    if (current + 1 >= dataque.length) {
      setfinish(true);
      setstopNext(true);
    }
  };

  //Next handilation
  const handleNextButton = () => {
    if (current + 1 >= dataque.length) {
      setfinish(true);
    } else {
      setSelectedAnswer(null);
      setCurrent((current) => current + 1);
      reset();
      start();
      setTimeend(false);
    }
  };
  //previous handilation
  const handlepreviousButton = () => {
    if (current < 1) {
      setstopprevious(true);
    } else {
      setSelectedAnswer(null);
      setCurrent((current) => current - 1);
      setscore((prev) => prev - 1);
      reset();
      start();
    }
    if (current == 0) {
      setscore(() => 0);
    }
  };

  const resetExam = () => {
    setCurrent(() => 0);
    setscore(() => 0);
    setfinish(false);
    setSelectedAnswer(null);
    setstopNext(false);
    setstopprevious(false);
    reset();
    start();
  };

  useEffect(() => {
    const [minutesStr, secondsStr] = handleTime.split(' : ');
    const totalSeconds = parseInt(minutesStr) * 60 + parseInt(secondsStr);

    if (totalSeconds < 10) {
      setTimeend(true);
    }

    if (totalSeconds <= 0 && dataque.length) {
      handleNextButton();
      reset();
      start();
    }
  }, [handleTime, dataque]);

  return (
    <div className="container mx-auto pt-8 text-center">
      {!finish ? (
        <>
          <p className="mb-16 flex items-center justify-center text-2xl">
            question{' '}
            <span className="mx-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 shadow-xs shadow-black">
              {current + 1}
            </span>{' '}
            from{' '}
            <span className="mx-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 shadow-xs shadow-black">
              {' '}
              {dataque?.length}
            </span>
          </p>
          {/* question section */}
          <h3 className="border-b-2 border-b-gray-500 pb-6 text-xl font-bold">
            {dataque?.[current]?.question}
          </h3>
          {/* answers section */}
          <section className="relative mx-auto flex-col items-center justify-center space-y-5 px-4 pt-6 text-xl md:w-lg xl:w-lg">
            {shuffledAnswers[current]?.map((ans: string, i: number) => (
              <button
                onClick={() => handelAnswer(ans)}
                key={i}
                className={`group mx-auto flex w-full cursor-pointer items-center justify-start rounded-lg py-2 transition-colors duration-300 ease-in-out sm:w-md md:w-lg ${
                  selectedAnswer
                    ? ans === dataque[current].correct_answer
                      ? 'bg-green-500 text-white'
                      : ans === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-red-500'
                    : 'bg-white hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <span
                  className={` ${selectedAnswer ? '' : 'group-hover:bg-amber-50 group-hover:text-emerald-900'} mx-2 mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900 text-amber-50 shadow-xs shadow-black`}
                >
                  {i + 1}
                </span>
                {ans}
              </button>
            ))}

            <div
              className={`absolute top-8 -right-60 font-bold ${timeend ? 'text-red-600' : 'text-black'}`}
            >
              {handleTime}
            </div>

            {/* buttons section */}
            <section className="flex items-center justify-between pt-14">
              <button
                onClick={handlepreviousButton}
                disabled={stopprevious}
                className="cursor-pointer bg-white px-8 py-2 text-emerald-900 shadow-xs shadow-black"
              >
                Previous
              </button>
              <button
                onClick={handleNextButton}
                disabled={stopNext || !selectedAnswer}
                className="cursor-pointer bg-emerald-900 px-8 py-2 text-white shadow-xs shadow-black"
              >
                Next
              </button>
            </section>
          </section>
        </>
      ) : (
        <>
          <div className="w-[350px] rounded-2xl bg-white p-6 text-center shadow-lg">
            <h2 className="mb-4 text-xl font-bold">result</h2>
            <p>
              {score} from {dataque?.length}
            </p>

            <button
              onClick={resetExam}
              className="cursor-pointer bg-white px-8 py-2 text-emerald-900 shadow-xs shadow-black"
            >
              reset exam{' '}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
