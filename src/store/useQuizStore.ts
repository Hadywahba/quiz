import { create } from 'zustand';
import Cookies from 'js-cookie';
interface QuizState {
  current: number;
  score: number;
  selectedAnswer: string | null;
  setCurrent: (updater: (prev: number) => number) => void;
  setscore: (updater: (prev: number) => number) => void;
  setSelectedAnswer: (val: string | null) => void;
}

const useAuthStore = create<QuizState>((set) => ({
  current: Number(Cookies.get('Current') || 0),
  score: Number(Cookies.get('score') || 0),
  selectedAnswer: Cookies.get('SelectedAnswer') || null,
  setCurrent: (updater) => {
    set((state) => {
      const newValue = updater(state.current);
      Cookies.set('Current', String(newValue)); // حفظ القيمة كـ string
      return { current: newValue };
    });
  },
  setscore: (updater) => {
    set((state) => {
      const newValue = updater(state.score);
      Cookies.set('score', String(newValue));
      return { score: newValue };
    });
  },
  setSelectedAnswer: (ans) => {
    if (ans === null) {
      Cookies.remove('SelectedAnswer');
    } else {
      Cookies.set('SelectedAnswer', ans);
    }
    set({ selectedAnswer: ans });
  },
}));

export default useAuthStore;
