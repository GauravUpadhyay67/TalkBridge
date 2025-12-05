import { Flame, Play, User } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";

const DashboardHero = () => {
  const { authUser } = useAuthUser();

  if (!authUser) {
     return <div className="h-64 rounded-3xl bg-base-200 animate-pulse mb-10" />;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary shadow-lg text-primary-content mb-10">
      {/* Background Patterns */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-48 w-48 rounded-full bg-black/10 blur-3xl opacity-30" />

      <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-accent border-0 text-white font-medium px-3 py-1 rounded-full text-xs uppercase tracking-wider">
              {authUser.proficiencyLevel || "Beginner"} Learner
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
            Welcome back, {authUser.fullName?.split(" ")[0] || "Friend"}! 👋
          </h1>
          <p className="text-white/80 max-w-lg text-lg">
            Ready to break some language barriers today? You're on a roll!
          </p>
          
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/friends" className="btn btn-secondary border-none shadow-lg group">
               <Play className="size-5 group-hover:fill-current transition-colors" />
               Start Practice
            </Link>
            <Link to="/profile" className="btn btn-ghost text-white hover:bg-white/20 border border-white/30">
               <User className="size-5" />
               View Profile
            </Link>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-w-[200px] shadow-xl transform md:rotate-2 hover:rotate-0 transition-transform duration-300">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                 <Flame className="size-6 text-orange-400 fill-orange-400" />
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">5</div>
                 <div className="text-xs text-white/60 font-medium uppercase tracking-wide">Day Streak</div>
              </div>
           </div>
           
           <div className="space-y-3">
              <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                 <div className="h-full bg-orange-400 w-3/4 rounded-full" />
              </div>
              <p className="text-xs text-white/70 text-center">
                 Keep it up! 2 more days to reach a week.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
