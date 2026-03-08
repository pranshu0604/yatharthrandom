"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, type ListingInput } from "@/lib/validations";
import { formatCurrency, getDiscount } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ImagePlus,
  Eye,
  IndianRupee,
  MapPin,
  Tag,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const INDIAN_STATES: SelectOption[] = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
  { value: "Delhi", label: "Delhi" },
  { value: "Chandigarh", label: "Chandigarh" },
];

const MEMBERSHIP_TYPES: SelectOption[] = [
  { value: "Club Membership", label: "Club Membership" },
  { value: "Gym Membership", label: "Gym Membership" },
  { value: "Resort Membership", label: "Resort Membership" },
  { value: "Holiday Membership", label: "Holiday Membership" },
  { value: "Golf Membership", label: "Golf Membership" },
  { value: "Timeshare", label: "Timeshare" },
  { value: "Other", label: "Other" },
];

const DURATION_OPTIONS: SelectOption[] = [
  { value: "Lifetime", label: "Lifetime" },
  { value: "1 Year", label: "1 Year" },
  { value: "2 Years", label: "2 Years" },
  { value: "3 Years", label: "3 Years" },
  { value: "5 Years", label: "5 Years" },
  { value: "10 Years", label: "10 Years" },
  { value: "Custom", label: "Custom" },
];

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
interface EditListingFormProps {
  listing: {
    id: string;
    title: string;
    description: string;
    originalPrice: number;
    askingPrice: number;
    categoryId: string;
    city: string;
    state: string;
    membershipType: string;
    duration: string;
    expiryDate: string;
    images: string[];
    status: string;
  };
  categories: SelectOption[];
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
function EditListingForm({ listing, categories }: EditListingFormProps) {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>(listing.images);
  const [imageInput, setImageInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      originalPrice: listing.originalPrice,
      askingPrice: listing.askingPrice,
      categoryId: listing.categoryId,
      city: listing.city,
      state: listing.state,
      membershipType: listing.membershipType,
      duration: listing.duration,
      expiryDate: listing.expiryDate,
      images: listing.images,
    },
  });

  /* Watch form values for preview */
  const watchedTitle = watch("title");
  const watchedOriginal = watch("originalPrice");
  const watchedAsking = watch("askingPrice");
  const watchedCity = watch("city");
  const watchedState = watch("state");
  const watchedMembershipType = watch("membershipType");
  const watchedCategoryId = watch("categoryId");
  const selectedCategory = categories.find(
    (c) => c.value === watchedCategoryId,
  );

  /* Add image URL */
  const addImage = () => {
    const trimmed = imageInput.trim();
    if (trimmed && !imageUrls.includes(trimmed)) {
      const updated = [...imageUrls, trimmed];
      setImageUrls(updated);
      setValue("images", updated);
      setImageInput("");
    }
  };

  /* Remove image URL */
  const removeImage = (index: number) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updated);
    setValue("images", updated);
  };

  /* Submit handler */
  const onSubmit = async (data: ListingInput) => {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images: imageUrls,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error ?? "Failed to update listing");
        return;
      }

      router.push("/dashboard/seller/listings");
      router.refresh();
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const discount =
    watchedOriginal && watchedAsking && watchedOriginal > 0
      ? getDiscount(watchedOriginal, watchedAsking)
      : null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/seller/listings"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-300 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Listing</h1>
        <p className="text-neutral-500 mt-1">
          Update the details of your listing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic info */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">
                  Basic Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Listing Title"
                  placeholder="e.g. Premium Golf Club Membership - Mumbai"
                  error={errors.title?.message}
                  {...register("title")}
                />

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-neutral-300 mb-1.5"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    placeholder="Describe your membership in detail..."
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent resize-y"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="mt-1.5 text-sm text-error" role="alert">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    placeholder="Select category"
                    options={categories}
                    error={errors.categoryId?.message}
                    {...register("categoryId")}
                  />
                  <Select
                    label="Membership Type"
                    placeholder="Select type"
                    options={MEMBERSHIP_TYPES}
                    error={errors.membershipType?.message}
                    {...register("membershipType")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Duration"
                    placeholder="Select duration"
                    options={DURATION_OPTIONS}
                    {...register("duration")}
                  />
                  <Input
                    label="Expiry Date"
                    type="date"
                    error={errors.expiryDate?.message}
                    {...register("expiryDate")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">
                  Pricing
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Original Price"
                    type="number"
                    placeholder="0"
                    leftIcon={<IndianRupee className="h-4 w-4" />}
                    error={errors.originalPrice?.message}
                    {...register("originalPrice", { valueAsNumber: true })}
                  />
                  <Input
                    label="Asking Price"
                    type="number"
                    placeholder="0"
                    leftIcon={<IndianRupee className="h-4 w-4" />}
                    error={errors.askingPrice?.message}
                    {...register("askingPrice", { valueAsNumber: true })}
                  />
                </div>
                {discount !== null && discount > 0 && (
                  <p className="text-sm text-success font-medium">
                    {discount}% discount from original price
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">
                  Location
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="e.g. Mumbai"
                    leftIcon={<MapPin className="h-4 w-4" />}
                    error={errors.city?.message}
                    {...register("city")}
                  />
                  <Select
                    label="State"
                    placeholder="Select state"
                    options={INDIAN_STATES}
                    error={errors.state?.message}
                    {...register("state")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">
                  Images
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste image URL..."
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                    leftIcon={<ImagePlus className="h-4 w-4" />}
                    wrapperClassName="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addImage}
                    className="shrink-0"
                  >
                    Add
                  </Button>
                </div>
                <p className="text-xs text-neutral-400">
                  Add image URLs one at a time. The first image will be used as
                  the thumbnail.
                </p>

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border border-neutral-800"
                      >
                        <Image
                          src={url}
                          alt={`Listing image ${index + 1}`}
                          width={200}
                          height={96}
                          className="w-full h-24 object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-neutral-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          aria-label="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 text-[10px] font-medium bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                            Thumbnail
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Server error */}
            {serverError && (
              <div className="rounded-lg border border-error/30 bg-error/5 p-4">
                <p className="text-sm text-error">{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-end gap-3">
              <Link
                href="/dashboard/seller/listings"
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </Link>
              <Button type="submit" loading={submitting} size="lg">
                Update Listing
              </Button>
            </div>
          </form>
        </div>

        {/* Preview sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-neutral-500" />
                  <h3 className="text-sm font-semibold text-neutral-300">
                    Preview
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-neutral-800 overflow-hidden">
                  {/* Image area */}
                  <div className="h-40 bg-neutral-800 relative">
                    {imageUrls[0] ? (
                      <Image
                        src={imageUrls[0]}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImagePlus className="h-8 w-8 text-neutral-300" />
                      </div>
                    )}
                    {discount !== null && discount > 0 && (
                      <Badge
                        variant="error"
                        className="absolute top-2 left-2"
                      >
                        {discount}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <p className="text-sm font-semibold text-white line-clamp-2">
                      {watchedTitle || "Your Listing Title"}
                    </p>

                    {(watchedCity || watchedState) && (
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {[watchedCity, watchedState].filter(Boolean).join(", ")}
                      </p>
                    )}

                    {selectedCategory && (
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {selectedCategory.label}
                      </p>
                    )}

                    {watchedMembershipType && (
                      <Badge variant="outline" className="text-xs">
                        {watchedMembershipType}
                      </Badge>
                    )}

                    <div className="pt-2 border-t border-neutral-800">
                      {watchedOriginal ? (
                        <p className="text-xs text-neutral-400 line-through">
                          {formatCurrency(watchedOriginal)}
                        </p>
                      ) : null}
                      <p className="text-lg font-bold text-neutral-100">
                        {watchedAsking
                          ? formatCurrency(watchedAsking)
                          : "Price"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

EditListingForm.displayName = "EditListingForm";

export { EditListingForm };
