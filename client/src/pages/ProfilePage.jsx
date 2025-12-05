import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Loader2, Mail, MapPin, Shuffle, User } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { axiosInstance } from "../lib/axios";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    proficiencyLevel: authUser?.proficiencyLevel || "",
    interests: authUser?.interests || [],
    learningGoals: authUser?.learningGoals || [],
    profilePic: authUser?.profilePic || "",
  });

  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put("/users/profile", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleRandomAvatar = () => {
    const randomSeed = Math.floor(Math.random() * 1000);
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;
    setFormData((prev) => ({ ...prev, profilePic: avatarUrl }));
  };

  const handleLocationSearch = (query) => {
    setFormData({ ...formData, location: query });
    
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
    
    setFormData((prev) => ({ ...prev, location: locationString }));
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
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();

          const city = data.city || data.locality || "";
          const state = data.principalSubdivision || "";
          const country = data.countryName || "";

          const locationString = [city, state, country]
            .filter(Boolean)
            .join(", ");

          setFormData((prev) => ({ ...prev, location: locationString }));
          toast.success("Location detected successfully");
        } catch (error) {
          console.error("Error getting location details:", error);
          toast.error("Failed to get location details");
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get your location. Please enter manually.");
        setIsLocationLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-6 text-center">Profile Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={formData.profilePic || authUser?.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-32 rounded-full object-cover border-4 border-base-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-sm btn-outline gap-2"
                >
                  <Shuffle className="size-4" />
                  Generate Random Avatar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10"
                      value={authUser?.email}
                      disabled
                    />
                  </div>
                </div>

                {/* Location with Autocomplete */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Location</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="size-5 text-base-content/40" />
                      </div>
                      <input
                        type="text"
                        className="input input-bordered w-full pl-10"
                        value={formData.location}
                        onChange={(e) => handleLocationSearch(e.target.value)}
                        placeholder="City, Country"
                      />
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSelectSuggestion(suggestion)}
                              className="w-full text-left px-4 py-2 hover:bg-base-200 transition-colors"
                            >
                              {suggestion.display_name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isLocationLoading}
                      className="btn btn-square btn-outline"
                      title="Get current location"
                    >
                      {isLocationLoading ? (
                        <Loader className="size-5 animate-spin" />
                      ) : (
                        <MapPin className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Native Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Native Language</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.nativeLanguage}
                    onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                  >
                    <option value="" disabled>Select Language</option>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="italian">Italian</option>
                    <option value="portuguese">Portuguese</option>
                    <option value="russian">Russian</option>
                    <option value="japanese">Japanese</option>
                    <option value="chinese">Chinese</option>
                    <option value="korean">Korean</option>
                    <option value="hindi">Hindi</option>
                    <option value="arabic">Arabic</option>
                  </select>
                </div>

                {/* Learning Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Learning Language</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.learningLanguage}
                    onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                  >
                    <option value="" disabled>Select Language</option>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="italian">Italian</option>
                    <option value="portuguese">Portuguese</option>
                    <option value="russian">Russian</option>
                    <option value="japanese">Japanese</option>
                    <option value="chinese">Chinese</option>
                    <option value="korean">Korean</option>
                    <option value="hindi">Hindi</option>
                    <option value="arabic">Arabic</option>
                  </select>
                </div>

                {/* Proficiency Level */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Proficiency Level</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.proficiencyLevel}
                    onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value })}
                  >
                    <option value="" disabled>Select Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Bio</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us a little about yourself..."
                ></textarea>
              </div>

              <div className="flex justify-end mt-6">
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
