"use client";
import { useState } from "react";
import { MediaUploadPage } from "~/app/_components/media-upload-page";

const page = () => {
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaFile: null as File | null,
    thumbnailFile: null as File | null,
    visibility: "public" as "public" | "private",
    accessType: "free" as "free" | "paid",
    price: "",
    isDownloadable: false,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
      if (field === "mediaFile") {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // For checkbox specifically
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.mediaFile) {
      alert("Please upload a file!");
      return;
    }

    const payload = new FormData();
    payload.append("file", formData.mediaFile);
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("visibility", formData.visibility);
    payload.append("accessType", formData.accessType);
    payload.append("isDownloadable", String(formData.isDownloadable));

    if (formData.accessType === "paid") {
      payload.append("price", formData.price);
    }

    // tags as array (optional)
    payload.append("tags", JSON.stringify(formData.tags)); // ✅ new line

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      alert("Media uploaded successfully!");

      // Reset form after success
      setFormData({
        title: "",
        description: "",
        mediaFile: null,
        thumbnailFile: null,
        visibility: "public",
        accessType: "free",
        price: "",
        isDownloadable: false,
        tags: [],
      });

      setPreviewUrl(null);
      setUploadType("image");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while uploading.");
    }
  };

  const handleCancelUpload = () => {
    setFormData({
      title: "",
      description: "",
      mediaFile: null,
      thumbnailFile: null,
      visibility: "public",
      accessType: "free",
      price: "",
      isDownloadable: false,
      tags: [],
    });
    setPreviewUrl(null);
    setUploadType("image");
  };
  return (
    <div className="w-full h-full overflow-y-auto mb-20">
      <MediaUploadPage
        formData={formData}
        setFormData={setFormData}
        uploadType={uploadType}
        setUploadType={setUploadType}
        tagInput={tagInput}
        setTagInput={setTagInput}
        previewUrl={previewUrl}
        handleFileChange={handleFileChange}
        handleInputChange={handleInputChange}
        addTag={addTag}
        removeTag={removeTag}
        handleSubmit={handleSubmit}
        onCancel={handleCancelUpload}
      />
    </div>
  );
};

export default page;
