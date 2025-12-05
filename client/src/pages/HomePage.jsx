import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    CheckCircle,
    MapPin,
    UserPlus
} from "lucide-react";
import { useEffect, useState } from "react";
import DailyConversationPrompt from "../components/DailyConversationPrompt";
import DashboardHero from "../components/DashboardHero";
import { getLanguageFlag } from "../components/FriendCard";
import WordOfTheDay from "../components/WordOfTheDay";
import useAuthUser from "../hooks/useAuthUser";
import {
    getOutgoingFriendReqs,
    getRecomendedUsers,
    sendFriendRequest
} from "../lib/api";
import { capitalize } from "../lib/utils";

const HomePage = () => {
    const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [sendingToUserId, setSendingToUserId] = useState(null);

  const {
    data: recomendedUsers = [],
    isLoading: loadingUsers
  } = useQuery({
    queryKey: ["users"],
    queryFn: getRecomendedUsers
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs
  });

  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: (userId) => {
      setSendingToUserId(userId);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
    onSettled: () => {
      setSendingToUserId(null);
    }
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs?.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
    }
    setOutgoingRequestsIds(outgoingIds);
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-base-100">
      <div className="container mx-auto space-y-10">
        
        {/* New Hero Section */}
        <DashboardHero />

        {/* Content Row: Challenges & Learning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Conversation Prompt */}
            <div className="card bg-base-200 shadow-xl border border-base-content/5 overflow-hidden group hover:border-primary/30 transition-all duration-300">
                <div className="card-body p-6">
                   <div className="flex items-center gap-3 mb-2 opacity-60 text-sm font-bold uppercase tracking-widest text-secondary">
                        <span className="p-1.5 rounded bg-secondary/10">💬</span>
                        Today's Challenge
                   </div>
                   <DailyConversationPrompt />
                </div>
            </div>

            {/* Word of the Day */}
            <div className="card bg-base-200 shadow-xl border border-base-content/5 overflow-hidden group hover:border-accent/30 transition-all duration-300">
                <div className="card-body p-6">
                     <div className="flex items-center gap-3 mb-2 opacity-60 text-sm font-bold uppercase tracking-widest text-accent">
                        <span className="p-1.5 rounded bg-accent/10">📚</span>
                        Vocabulary Builder
                   </div>
                   <WordOfTheDay />
                </div>
            </div>
        </div>

        {/* Recommended Users */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Discover Learners
              </h2>
              <p className="opacity-70 max-w-2xl">
                We found these people who match your language goals.
              </p>
            </div>
            {/* Filter Buttons UI (Visual Only for now) */}
             <div className="hidden sm:flex gap-2">
                <button className="btn btn-sm btn-active">All</button>
                <button className="btn btn-sm btn-ghost">Online</button>
                <button className="btn btn-sm btn-ghost">New</button>
             </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : recomendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center border-dashed border-2 border-base-content/20">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recomendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                const isSending = sendingToUserId === user._id;

                return (
                  <div
                    key={user._id}
                    className="card bg-base-100 hover:bg-base-200 transition-all duration-300 shadow-md hover:shadow-2xl border border-base-content/5 group flex flex-col h-full"
                  >
                    <figure className="relative h-32 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                         <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-base-100 to-transparent" />
                    </figure>
                    
                    <div className="card-body p-5 -mt-12 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                           <div className="avatar ring-4 ring-base-100 rounded-full bg-base-100">
                            <div className="w-20 h-20 rounded-full">
                                <img 
                                src={user.profilePic} 
                                alt={user.fullName}
                                className="object-cover"
                                />
                            </div>
                           </div>
                           <div className="flex flex-col items-end gap-1 mt-12">
                                <div className="badge badge-primary badge-sm gap-1 shadow-sm">
                                    {getLanguageFlag(user.nativeLanguage)} {capitalize(user.nativeLanguage)}
                                </div>
                                <div className="badge badge-ghost badge-sm gap-1 opacity-80">
                                    to {getLanguageFlag(user.learningLanguage)} {capitalize(user.learningLanguage)}
                                </div>
                           </div>
                      </div>

                      <div className="mb-4">
                           <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{user.fullName}</h3>
                           {user.location && (
                            <div className="flex items-center text-xs opacity-60 mt-1">
                              <MapPin className="size-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70 line-clamp-2 mb-6 flex-1 italic">
                            "{user.bio}"
                        </p>
                      )}

                      <div className="mt-auto pt-4 border-t border-base-content/5">
                          <button
                            className={`btn btn-block ${
                              hasRequestBeenSent || isSending
                                ? "btn-disabled bg-base-300"
                                : "btn-primary shadow-lg shadow-primary/20"
                            }`}
                            onClick={() => sendRequestMutation(user._id)}
                            disabled={hasRequestBeenSent || isSending}
                          >
                            {isSending ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : hasRequestBeenSent ? (
                              <>
                                <CheckCircle className="size-4" />
                                Request Sent
                              </>
                            ) : (
                              <>
                                <UserPlus className="size-4" />
                                Connect
                              </>
                            )}
                          </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
