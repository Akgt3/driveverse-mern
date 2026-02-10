import { useState, useEffect } from "react";
import {
  FiUser,
  FiBriefcase,
  FiCheckCircle,
  FiUpload,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditAd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]); // Existing images (URLs from DB)
  const [newImages, setNewImages] = useState([]); // New uploaded files
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    km: "",
    location: "",
    fuel: "",
    transmission: "",
    owners: "",
    body: "",
    engine: "",
    description: "",
    sellerType: "individual",
  });

  /* ================= FETCH EXISTING AD ================= */
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error();

        setForm({
          brand: data.brand || "",
          model: data.model || "",
          year: data.year || "",
          price: data.price || "",
          km: data.km || "",
          location: data.location || "",
          fuel: data.fuel || "",
          transmission: data.transmission || "",
          owners: data.owners || "",
          body: data.body || "",
          engine: data.engine || "",
          description: data.description || "",
          sellerType: data.sellerType || "individual",
        });

        setImages(data.images || []); // Existing images from DB
      } catch {
        toast.error("Failed to load ad");
        navigate("/my-ads");
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id, navigate]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= REMOVE EXISTING IMAGE ================= */
  const removeExistingImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= REMOVE NEW IMAGE ================= */
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= ADD NEW IMAGES ================= */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  /* ================= UPDATE LISTING ================= */
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      // Add text fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // ✅ Send existing images as JSON array
      formData.append("existingImages", JSON.stringify(images));

      // ✅ Add new image files
      newImages.forEach((img) => {
        formData.append("images", img);
      });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Listing updated successfully");
      navigate("/my-ads");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="pt-24 text-center text-black dark:text-white">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors pt-18">
      <div className="max-w-[900px] mx-auto px-6 py-16">
        {/* HEADER */}
        <h1 className="text-[36px] font-semibold text-black dark:text-white">
          Edit Your Car
        </h1>
        <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 max-w-[620px]">
          Update your listing details and save changes
        </p>

        {/* SELLER TYPE */}
        <div className="mt-12">
          <h2 className="text-[18px] font-medium text-black dark:text-white mb-4">
            You are selling as
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SellerCard
              active={form.sellerType === "individual"}
              icon={<FiUser size={20} />}
              title="Individual Seller"
              desc="Sell your personal car directly"
              onClick={() => handleChange("sellerType", "individual")}
            />

            <SellerCard
              active={form.sellerType === "dealer"}
              icon={<FiBriefcase size={20} />}
              title="Dealer / Business"
              desc="List vehicles as a showroom"
              onClick={() => handleChange("sellerType", "dealer")}
            />
          </div>
        </div>

        {/* VEHICLE FORM */}
        <div className="mt-16 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-lg p-6 space-y-6 shadow-sm">
          <h3 className="text-[18px] font-semibold text-black dark:text-white">
            Vehicle Details
          </h3>

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Brand"
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            />
            <Input
              placeholder="Model"
              value={form.model}
              onChange={(e) => handleChange("model", e.target.value)}
            />
            <Input
              placeholder="Year"
              value={form.year}
              onChange={(e) => handleChange("year", e.target.value)}
            />
            <Input
              placeholder="Price"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
            <Input
              placeholder="Kilometers Driven"
              value={form.km}
              onChange={(e) => handleChange("km", e.target.value)}
            />
            <Input
              placeholder="Location"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />

            {/* MAP PREVIEW */}
            {form.location && (
              <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-[#333333]">
                <iframe
                  title="map"
                  className="w-full h-[260px]"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    form.location
                  )}&z=13&output=embed`}
                />
              </div>
            )}
          </div>

          {/* EXTRA DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Transmission"
              value={form.transmission}
              onChange={(v) => handleChange("transmission", v)}
              options={["Manual", "Automatic", "CVT", "AMT"]}
            />

            <Select
              label="Number of Owners"
              value={form.owners}
              onChange={(v) => handleChange("owners", v)}
              options={["First", "Second", "Third"]}
            />

            <Select
              label="Fuel Type"
              value={form.fuel}
              onChange={(v) => handleChange("fuel", v)}
              options={["Petrol", "Diesel", "Electric", "Hybrid"]}
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#121212] text-black dark:text-white"
          />

          {/* ✅ IMAGE MANAGEMENT - FIXED */}
          <div>
            <p className="text-sm font-medium text-black dark:text-white mb-2">
              Manage Photos
            </p>

            {/* EXISTING IMAGES */}
            {images.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-neutral-400 mb-2">
                  Current Images ({images.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative group rounded-md overflow-hidden border border-gray-200 dark:border-[#333333]"
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}${img}`}
                        className="h-[100px] w-full object-cover"
                        alt="Existing"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        title="Remove image"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEW IMAGES */}
            {newImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-neutral-400 mb-2">
                  New Images ({newImages.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {newImages.map((img, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative group rounded-md overflow-hidden border border-green-500"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        className="h-[100px] w-full object-cover"
                        alt="New"
                      />
                      <span className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded">
                        NEW
                      </span>
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        title="Remove image"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UPLOAD NEW IMAGES */}
            <label className="flex items-center justify-center gap-2 w-full h-[120px] border border-dashed border-gray-300 dark:border-[#333333] rounded-lg cursor-pointer text-gray-600 dark:text-neutral-400 bg-white dark:bg-[#121212] hover:border-black dark:hover:border-white transition">
              <FiUpload />
              Add More Images
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </label>

            <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">
              Total Images: {images.length + newImages.length}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleUpdate}
            className="w-full sm:w-auto mt-4 px-8 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
          >
            <FiCheckCircle />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SellerCard({ icon, title, desc, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-4 p-5 rounded-lg border text-left ${active
        ? "border-black dark:border-white"
        : "border-gray-300 dark:border-[#333333]"
        } bg-white dark:bg-[#0F0F0F]`}
    >
      <div className="text-black dark:text-white">{icon}</div>
      <div>
        <p className="font-medium text-black dark:text-white">{title}</p>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
          {desc}
        </p>
      </div>
    </button>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#121212] text-black dark:text-white"
    />
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500 dark:text-neutral-400">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[44px] px-3 pr-10 text-sm rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#121212] text-black dark:text-white appearance-none"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>

        <FiChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}