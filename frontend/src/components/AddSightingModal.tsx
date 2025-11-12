"use client";

import { useState, useRef } from "react";
import { Fish } from "@/types/fish";
import { createSighting } from "@/api/fish";

interface AddSightingModalProps {
  fishes: Fish[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSightingModal({
  fishes,
  isOpen,
  onClose,
  onSuccess,
}: AddSightingModalProps) {
  const [selectedFishId, setSelectedFishId] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    confidence: number;
    photoUrl?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Please upload a JPEG, PNG, or WebP image');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setPhoto(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVerificationResult(null);

    // Validation
    if (!selectedFishId) {
      setError("Please select a fish species");
      return;
    }

    if (!latitude || !longitude) {
      setError("Please enter latitude and longitude");
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setError("Invalid coordinates");
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError("Coordinates out of range");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createSighting(
        parseInt(selectedFishId),
        lat,
        lon,
        location || "Unknown Location",
        photo || undefined
      );

      setVerificationResult({
        verified: result.verified || false,
        confidence: result.aiConfidence || 0,
        photoUrl: result.photoUrl,
      });

      // Show success message briefly before closing
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create sighting");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFishId("");
    setLatitude("");
    setLongitude("");
    setLocation("");
    setPhoto(null);
    setPhotoPreview(null);
    setError(null);
    setVerificationResult(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          setError(null);
        },
        (error) => {
          setError("Failed to get current location: " + error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div
        className="bg-deep-ocean border-2 border-sonar-green w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 0 30px var(--color-sonar-green)" }}
      >
        {/* Header */}
        <div className="bg-[color-mix(in_srgb,var(--color-sonar-green)_20%,transparent)] border-b-2 border-sonar-green px-6 py-4">
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-bold text-sonar-green font-mono"
              style={{ textShadow: "var(--shadow-glow-text)" }}
            >
              ADD NEW SIGHTING
            </h2>
            <button
              onClick={handleClose}
              className="text-danger-red hover:text-white font-mono text-xl font-bold"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fish Selection */}
          <div>
            <label className="block text-sonar-green font-mono text-sm font-bold mb-2">
              FISH SPECIES *
            </label>
            <select
              value={selectedFishId}
              onChange={(e) => setSelectedFishId(e.target.value)}
              className="w-full bg-nautical-blue border border-panel-border text-text-primary px-4 py-2 font-mono text-sm focus:outline-none focus:border-sonar-green"
              disabled={isSubmitting}
              required
            >
              <option value="">Select a fish...</option>
              {fishes
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((fish) => (
                  <option key={fish.id} value={fish.id}>
                    {fish.name} ({fish.scientificName})
                  </option>
                ))}
            </select>
          </div>

          {/* Location Input */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sonar-green font-mono text-sm font-bold mb-2">
                LATITUDE *
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-90 to 90"
                className="w-full bg-nautical-blue border border-panel-border text-text-primary px-4 py-2 font-mono text-sm focus:outline-none focus:border-sonar-green"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <label className="block text-sonar-green font-mono text-sm font-bold mb-2">
                LONGITUDE *
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-180 to 180"
                className="w-full bg-nautical-blue border border-panel-border text-text-primary px-4 py-2 font-mono text-sm focus:outline-none focus:border-sonar-green"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="text-warning-amber hover:text-sonar-green font-mono text-xs underline"
            disabled={isSubmitting}
          >
            USE CURRENT LOCATION
          </button>

          {/* Location Name */}
          <div>
            <label className="block text-sonar-green font-mono text-sm font-bold mb-2">
              LOCATION NAME
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Great Barrier Reef"
              className="w-full bg-nautical-blue border border-panel-border text-text-primary px-4 py-2 font-mono text-sm focus:outline-none focus:border-sonar-green"
              disabled={isSubmitting}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sonar-green font-mono text-sm font-bold mb-2">
              PHOTOGRAPHIC EVIDENCE
            </label>
            <div className="text-text-secondary font-mono text-xs mb-2">
              Upload photo for AI verification (JPEG, PNG, WebP - Max 10MB)
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-nautical-blue border border-panel-border text-text-primary font-mono text-sm hover:border-sonar-green transition-all"
              disabled={isSubmitting}
            >
              CHOOSE FILE
            </button>
            {photo && (
              <div className="mt-3 text-text-secondary font-mono text-xs">
                Selected: {photo.name}
              </div>
            )}
            {photoPreview && (
              <div className="mt-3">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="max-h-48 border border-panel-border"
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[color-mix(in_srgb,var(--color-danger-red)_20%,transparent)] border border-danger-red px-4 py-3 text-danger-red font-mono text-sm">
              {error}
            </div>
          )}

          {/* Verification Result */}
          {verificationResult && (
            <div
              className={`border px-4 py-3 font-mono text-sm ${
                verificationResult.verified
                  ? "bg-[color-mix(in_srgb,var(--color-sonar-green)_20%,transparent)] border-sonar-green text-sonar-green"
                  : "bg-[color-mix(in_srgb,var(--color-warning-amber)_20%,transparent)] border-warning-amber text-warning-amber"
              }`}
            >
              <div className="font-bold mb-1">
                {verificationResult.verified
                  ? "✓ VERIFIED"
                  : "⚠ VERIFICATION WARNING"}
              </div>
              <div className="text-xs">
                AI Confidence:{" "}
                {(verificationResult.confidence * 100).toFixed(1)}%
                {!verificationResult.verified &&
                  " (Below 60% threshold - sighting recorded but not verified)"}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-sonar-green text-deep-ocean font-mono font-bold text-sm hover:bg-opacity-90 transition-all disabled:opacity-50"
              style={{
                boxShadow: "0 0 15px var(--color-sonar-green)",
              }}
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT SIGHTING"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-transparent border border-panel-border text-text-secondary font-mono font-bold text-sm hover:border-danger-red hover:text-danger-red transition-all disabled:opacity-50"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
