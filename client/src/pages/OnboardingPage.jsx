import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { completeOnboarding } from "../lib/api";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const randomSeed = Math.floor(Math.random() * 1000);
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;
    setFormState((prev) => ({ ...prev, profilePic: avatarUrl }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-base-100"
      data-theme="forest"
    >
      <div className="relative w-full max-w-3xl">
        {/* Glowing Background */}
        <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-blue-700/40 via-indigo-700/40 to-purple-700/30 blur-3xl opacity-80" />

        <div className="card shadow-2xl bg-base-200/90 backdrop-blur-md border border-white/10 rounded-2xl">
          <div className="card-body p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-center mb-8 text-white">
              Complete Your Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden shadow-inner">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-sm text-white border border-[#3B82F6] bg-[#1E293B] hover:bg-[#1E40AF] hover:border-[#60A5FA]"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>

              {/* Full Name */}
              <div className="form-control space-y-2">
                <label className="label">
                  <span className="label-text text-white">Full Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#312e81] focus:border-white"
                  placeholder="Your full name"
                  value={formState.fullName}
                  onChange={(e) =>
                    setFormState({ ...formState, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Bio */}
              <div className="form-control space-y-2">
                <label className="label">
                  <span className="label-text text-white">Bio</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24 focus:outline-none focus:ring-2 focus:ring-[#312e81] focus:border-white resize-none"
                  placeholder="Tell others about yourself"
                  value={formState.bio}
                  onChange={(e) =>
                    setFormState({ ...formState, bio: e.target.value })
                  }
                />
              </div>

              {/* Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control space-y-2">
                  <label className="label">
                    <span className="label-text text-white">
                      Native Language
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#312e81] focus:border-white"
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        nativeLanguage: e.target.value,
                      })
                    }
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control space-y-2">
                  <label className="label">
                    <span className="label-text text-white">
                      Learning Language
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#312e81] focus:border-white"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                  >
                    <option value="">Select your learning language</option>
                    {LANGUAGES.map((lang) => (
                      <option
                        key={`learning-${lang}`}
                        value={lang.toLowerCase()}
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="form-control space-y-2">
                <label className="label">
                  <span className="label-text text-white">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content opacity-60 size-5" />
                  <input
                    type="text"
                    className="input input-bordered pl-10 w-full focus:outline-none focus:ring-2 focus:ring-[#312e81] focus:border-white"
                    placeholder="City, Country"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({ ...formState, location: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                className="btn btn-primary w-full flex items-center justify-center"
                disabled={isPending}
                type="submit"
              >
                {!isPending ? (
                  <>
                    <ShipWheelIcon className="size-5 mr-2" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Onboarding...
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
