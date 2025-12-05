import { useQuery } from "@tanstack/react-query";
import { BookOpen, Volume2 } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { getWordOfTheDay } from "../lib/api";
import { capitalize } from "../lib/utils";

const WordOfTheDay = () => {
  const { authUser } = useAuthUser();
  
  const { data: wordData, isLoading } = useQuery({
    queryKey: ['wordOfTheDay', authUser?.learningLanguage],
    queryFn: () => getWordOfTheDay(authUser?.learningLanguage),
    enabled: !!authUser?.learningLanguage,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
  });

  const handleSpeak = () => {
    if ('speechSynthesis' in window && wordData?.word) {
      const utterance = new SpeechSynthesisUtterance(wordData.word);
      // Try to set language
      utterance.lang = authUser?.learningLanguage === 'spanish' ? 'es-ES' : 
                      authUser?.learningLanguage === 'french' ? 'fr-FR' :
                      authUser?.learningLanguage === 'german' ? 'de-DE' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-accent/20 to-info/20 shadow-xl p-6">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }

  if (!wordData) return null;

  const translation = wordData.translation?.english || wordData.translation?.['english'] || '';
  const example = wordData.example || '';
  const exampleTranslation = wordData.exampleTranslation?.english || wordData.exampleTranslation?.['english'] || '';

  return (
    <div className="card bg-gradient-to-br from-accent/20 to-info/20 shadow-xl hover:shadow-2xl transition-shadow p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-accent/30 p-3">
          <BookOpen className="size-6 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-3">📚 Word of the Day</h3>
          
          <div className="space-y-3">
            {/* Word */}
            <div className="flex items-center gap-3">
              <div>
                <p className="text-2xl font-bold text-primary">{wordData.word}</p>
                {wordData.pronunciation && (
                  <p className="text-sm opacity-70 italic">{wordData.pronunciation}</p>
                )}
              </div>
              {typeof window !== 'undefined' && 'speechSynthesis' in window && (
                <button
                  onClick={handleSpeak}
                  className="btn btn-sm btn-circle btn-ghost"
                  title="Pronounce word"
                >
                  <Volume2 className="size-4" />
                </button>
              )}
            </div>

            {/* Translation */}
            {translation && (
              <p className="text-base-content opacity-80">
                <strong>Translation:</strong> {translation}
              </p>
            )}

            {/* Example */}
            {example && (
              <div className="bg-base-200 p-3 rounded-lg mt-2">
                <p className="text-sm italic">"{example}"</p>
                {exampleTranslation && (
                  <p className="text-xs opacity-70 mt-1">{exampleTranslation}</p>
                )}
              </div>
            )}

            {/* Badge */}
            <div className="flex gap-2 mt-3">
              <span className="badge badge-sm capitalize">
                {capitalize(wordData.language)}
              </span>
              <span className="badge badge-sm badge-outline capitalize">
                {wordData.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordOfTheDay;
