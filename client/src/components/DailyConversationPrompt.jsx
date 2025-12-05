import { useQuery } from "@tanstack/react-query";
import { MessageCircle, RefreshCw } from "lucide-react";
import { getDailyPrompt } from "../lib/api";

const DailyConversationPrompt = () => {
  const { data: prompt, isLoading, refetch } = useQuery({
    queryKey: ['dailyPrompt'],
    queryFn: getDailyPrompt,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-primary/20 to-secondary/20 shadow-xl p-6">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <div className="card bg-gradient-to-br from-primary/20 to-secondary/20 shadow-xl hover:shadow-2xl transition-shadow p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="rounded-full bg-primary/30 p-3">
            <MessageCircle className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">💬 Daily Conversation Starter</h3>
            <p className="text-base-content opacity-90 mb-1">
              {prompt.promptEnglish}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="badge badge-sm badge-outline">
                Topic: {prompt.topic}
              </span>
              <span className="badge badge-sm badge-outline capitalize">
                Level: {prompt.difficulty}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="btn btn-sm btn-ghost btn-circle"
          title="Get new prompt"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default DailyConversationPrompt;
