import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Camera,
    Loader,
    MapPin,
    ShipWheel,
    Shuffle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import LanguageSelector from "../components/LanguageSelector";
import { DEFAULT_AVATAR_URL } from "../constants";
import useAuthUser from "../hooks/useAuthUser";
import { completeOnboarding, logout } from "../lib/api";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
      await logout();
      queryClient.setQueryData(["authUser"], null);
      window.location.href = "/";
  };

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || DEFAULT_AVATAR_URL,
    interests: authUser?.interests || [],
    learningGoals: authUser?.learningGoals || [],
    proficiencyLevel: authUser?.proficiencyLevel || "beginner",
    timezone: authUser?.timezone || "",
  });

  const [interestInput, setInterestInput] = useState("");

  // Auto-detect timezone
  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setFormState(prev => ({ ...prev, timezone: detectedTimezone }));
  }, []);

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

  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleLocationSearch = (query) => {
    setFormState({ ...formState, location: query });
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error searching location:", error);
      }
    }, 500); // 500ms debounce
  };

  const handleSelectSuggestion = (suggestion) => {
    const city = suggestion.address.city || suggestion.address.town || suggestion.address.village || "";
    const state = suggestion.address.state || "";
    const country = suggestion.address.country || "";
    
    const locationString = [city, state, country].filter(Boolean).join(", ");
    
    setFormState((prev) => ({ ...prev, location: locationString }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleGetLocation = () => {
    setIsLocationLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const city = data.city || data.locality || "";
          const state = data.principalSubdivision || "";
          const country = data.countryName || "";
          
          const locationString = [city, state, country].filter(Boolean).join(", ");
          
          setFormState((prev) => ({ ...prev, location: locationString }));
          toast.success("Location fetched successfully");
        } catch (error) {
          console.error("Error fetching location:", error);
          toast.error("Failed to fetch location details");
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to retrieve your location");
        setIsLocationLoading(false);
      }
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-base-100"
      data-theme="forest"
    >
      <div className="relative w-full max-w-3xl">
        <button 
            onClick={handleLogout}
            className="absolute -top-12 right-0 btn btn-ghost text-white/70 hover:text-white"
        >
            Logout to Landing Page
        </button>
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
                      <Camera className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-sm text-white border border-[#3B82F6] bg-[#1E293B] hover:bg-[#1E40AF] hover:border-[#60A5FA]"
                >
                  <Shuffle className="size-4 mr-2" />
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
                <LanguageSelector
                  label="Native Language"
                  value={formState.nativeLanguage}
                  onChange={(value) =>
                    setFormState({ ...formState, nativeLanguage: value })
                  }
                  placeholder="Select your native language"
                />

                <LanguageSelector
                  label="Learning Language"
                  value={formState.learningLanguage}
                  onChange={(value) =>
                    setFormState({ ...formState, learningLanguage: value })
                  }
                  placeholder="Select your learning language"
                />
              </div>

              {/* Location */}
              <div className="form-control space-y-2">
                <label className="label">
                  <span className="label-text text-white">Location</span>
                </label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content opacity-60 size-5" />
                    <input
                      type="text"
                      className="input input-bordered pl-10 w-full focus:outline-none focus:ring-2 focus:ring-[#312e81] focus:border-white"
                      placeholder="City, Country"
                      value={formState.location}
                      onChange={(e) => handleLocationSearch(e.target.value)}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                      onBlur={() => {
                        // Delay hiding to allow click event on suggestion
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full mt-1 w-full rounded-lg border border-base-content/10 bg-base-200 p-1 shadow-xl max-h-60 overflow-y-auto z-50">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.place_id}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input blur
                                handleSelectSuggestion(suggestion);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left text-base-content transition-colors hover:bg-base-300"
                          >
                            <MapPin className="size-4 opacity-50 shrink-0" />
                            <span className="truncate">{suggestion.display_name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocationLoading}
                    className="btn btn-square btn-outline border-white/20 text-white hover:bg-white/10"
                    title="Get current location"
                  >
                    {isLocationLoading ? (
                      <LoaderIcon className="size-5 animate-spin" />
                    ) : (
                      <MapPin className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Interests */}
              <div className="form-control space-y-2">
                <label className="label">
                  <span className="label-text text-white">Interests (Optional)</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formState.interests.map((interest, index) => (
                    <div key={index} className="badge badge-primary gap-2">
                      {interest}
                      <button
                        type="button"
                        onClick={() => {
                          setFormState({
                            ...formState,
                            interests: formState.interests.filter((_, i) => i !== index)
                          });
                        }}
                        className="btn btn-ghost btn-xs p-0 h-4 w-4 min-h-0"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#312e81] focus:border-white"
                    placeholder="Add interests (Travel, Sports, Music, etc.)"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && interestInput.trim()) {
                        e.preventDefault();
                        if (!formState.interests.includes(interestInput.trim())) {
                          setFormState({
                            ...formState,
                            interests: [...formState.interests, interestInput.trim()]
                          });
                        }
                        setInterestInput('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (interestInput.trim() && !formState.interests.includes(interestInput.trim())) {
                        setFormState({
                          ...formState,
                          interests: [...formState.interests, interestInput.trim()]
                        });
                        setInterestInput('');
                      }
                    }}
                    className="btn text-white border border-[#3B82F6] bg-[#1E293B] hover:bg-[#1E40AF] hover:border-[#60A5FA]"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs opacity-70">Press Enter or click Add to add an interest</p>
              </div>

              {/* Learning Goals */}
              <div className="form-control space-y-2">
                <label className="label">
                  <span className="label-text text-white">Learning Goals (Optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Conversation Practice', 'Grammar Improvement', 'Vocabulary Building', 'Pronunciation', 'Writing', 'Reading'].map((goal) => (
                    <label key={goal} className="cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={formState.learningGoals.includes(goal)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormState({
                              ...formState,
                              learningGoals: [...formState.learningGoals, goal]
                            });
                          } else {
                            setFormState({
                              ...formState,
                              learningGoals: formState.learningGoals.filter(g => g !== goal)
                            });
                          }
                        }}
                      />
                      <span className="label-text text-white text-sm">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Proficiency Level */}
              <div className="form-control space-y-2">
                <label className="label">
                  <span className="label-text text-white">Proficiency Level</span>
                </label>
                <div className="flex gap-4">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <label key={level} className="cursor-pointer flex items-center gap-2">
                      <input
                        type="radio"
                        name="proficiency"
                        className="radio radio-sm"
                        checked={formState.proficiencyLevel === level}
                        onChange={() => setFormState({ ...formState, proficiencyLevel: level })}
                      />
                      <span className="label-text text-white capitalize">{level}</span>
                    </label>
                  ))}
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
                    <ShipWheel className="size-5 mr-2" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    <Loader className="animate-spin size-5 mr-2" />
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
