'use client';

import { useState, useRef } from 'react';
import { identifyFish, FishIdentification } from '@/api/fish';
import Image from 'next/image';

interface FishIdentifierProps {
  onClose: () => void;
  onIdentified?: (result: FishIdentification) => void;
}

export default function FishIdentifier({ onClose, onIdentified }: FishIdentifierProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [result, setResult] = useState<FishIdentification | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!selectedFile) return;

    setIsIdentifying(true);
    try {
      // Add 3 second delay to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const identification = await identifyFish(selectedFile);
      setResult(identification);

      if (onIdentified) {
        onIdentified(identification);
      }
    } catch (error) {
      console.error('Identification error:', error);
      alert('Failed to identify fish. Please try again.');
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'HIGH';
    if (confidence >= 0.6) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-navy border-2 border-sonar-green shadow-[0_0_30px_rgba(20,255,236,0.3)] max-w-4xl w-full max-h-[90vh] overflow-y-auto font-mono">
        {/* Header */}
        <div className="bg-[color-mix(in_srgb,var(--color-sonar-green)_10%,transparent)] border-b border-sonar-green p-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-sonar-green text-lg font-bold">🔍 AI FISH IDENTIFIER</h2>
            <p className="text-text-secondary text-xs">Upload a photo to identify the species</p>
          </div>
          <button
            onClick={onClose}
            className="text-sonar-green hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Section */}
          {!previewUrl && (
            <div className="border-2 border-dashed border-panel-border hover:border-sonar-green transition-colors rounded p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="fish-photo-upload"
              />
              <label
                htmlFor="fish-photo-upload"
                className="cursor-pointer block"
              >
                <div className="text-sonar-green text-6xl mb-4">📸</div>
                <h3 className="text-sonar-green text-lg font-bold mb-2">
                  UPLOAD FISH PHOTO
                </h3>
                <p className="text-text-secondary text-sm">
                  Click to select or drag and drop an image
                </p>
                <p className="text-text-secondary text-xs mt-2">
                  Supports: JPEG, PNG, WebP (max 10MB)
                </p>
              </label>
            </div>
          )}

          {/* Preview and Results */}
          {previewUrl && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="space-y-4">
                <h3 className="text-sonar-green font-bold">UPLOADED IMAGE</h3>
                <div className="relative aspect-video bg-nautical-blue border border-panel-border rounded overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Fish to identify"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleIdentify}
                    disabled={isIdentifying}
                    className="flex-1 px-4 py-2 bg-sonar-green text-dark-navy font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isIdentifying ? 'IDENTIFYING...' : '🔍 IDENTIFY FISH'}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isIdentifying}
                    className="px-4 py-2 border border-panel-border text-text-secondary hover:border-sonar-green hover:text-sonar-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    RESET
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4">
                <h3 className="text-sonar-green font-bold">IDENTIFICATION RESULTS</h3>

                {isIdentifying && (
                  <div className="bg-nautical-blue border border-panel-border p-6 text-center">
                    <div className="text-sonar-green text-4xl mb-4 animate-pulse">🤖</div>
                    <p className="text-sonar-green animate-pulse">
                      Analyzing image with AI...
                    </p>
                  </div>
                )}

                {!isIdentifying && !result && (
                  <div className="bg-nautical-blue border border-panel-border p-6 text-center">
                    <p className="text-text-secondary">
                      Click &quot;IDENTIFY FISH&quot; to analyze
                    </p>
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    {/* Matched Fish Card */}
                    {result.matchedCatalog && result.catalogFish && (
                      <div className="bg-[color-mix(in_srgb,var(--color-sonar-green)_5%,transparent)] border-2 border-sonar-green p-4 rounded">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">✅</span>
                          <div>
                            <h4 className="text-sonar-green font-bold text-lg">
                              MATCH FOUND!
                            </h4>
                            <p className="text-xs text-text-secondary">
                              Found in catalog
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-text-secondary">Name: </span>
                            <span className="text-white font-bold">
                              {result.catalogFish.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-secondary">Scientific: </span>
                            <span className="text-white italic">
                              {result.catalogFish.scientificName}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-secondary">Rarity: </span>
                            <span
                              className={`font-bold ${
                                result.catalogFish.rarity === 'Epic'
                                  ? 'text-purple-400'
                                  : result.catalogFish.rarity === 'Rare'
                                  ? 'text-blue-400'
                                  : 'text-green-400'
                              }`}
                            >
                              {result.catalogFish.rarity}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-secondary">Habitat: </span>
                            <span className="text-white">
                              {result.catalogFish.habitat}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Confidence Score */}
                    <div className="bg-nautical-blue border border-panel-border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-text-secondary text-sm">
                          Confidence Score
                        </span>
                        <span
                          className={`font-bold ${getConfidenceColor(
                            result.confidence
                          )}`}
                        >
                          {getConfidenceLabel(result.confidence)}
                        </span>
                      </div>
                      <div className="w-full bg-dark-navy h-2 rounded overflow-hidden">
                        <div
                          className={`h-full ${
                            result.confidence >= 0.8
                              ? 'bg-green-400'
                              : result.confidence >= 0.6
                              ? 'bg-yellow-400'
                              : 'bg-red-400'
                          }`}
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-white font-mono">
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* AI Reasoning */}
                    <div className="bg-nautical-blue border border-panel-border p-4">
                      <h5 className="text-sonar-green font-bold text-sm mb-2">
                        AI ANALYSIS
                      </h5>
                      <p className="text-text-primary text-sm">
                        {result.reasoning}
                      </p>
                    </div>

                    {/* Characteristics */}
                    {result.characteristics && result.characteristics.length > 0 && (
                      <div className="bg-nautical-blue border border-panel-border p-4">
                        <h5 className="text-sonar-green font-bold text-sm mb-2">
                          DETECTED FEATURES
                        </h5>
                        <ul className="space-y-1">
                          {result.characteristics.map((char, idx) => (
                            <li
                              key={idx}
                              className="text-text-primary text-sm flex items-start gap-2"
                            >
                              <span className="text-sonar-green">•</span>
                              <span>{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Not in Catalog */}
                    {!result.matchedCatalog && (
                      <div className="bg-yellow-900 bg-opacity-20 border border-yellow-600 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-400">⚠️</span>
                          <h5 className="text-yellow-400 font-bold">
                            NOT IN CATALOG
                          </h5>
                        </div>
                        <p className="text-sm text-yellow-200">
                          AI identified this as: <strong>{result.fishName}</strong>
                          {result.scientificName && (
                            <> (<em>{result.scientificName}</em>)</>
                          )}
                          , but it&apos;s not in our database yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          {!previewUrl && (
            <div className="border border-panel-border p-4 space-y-2">
              <h4 className="text-sonar-green font-bold text-sm">
                💡 TIPS FOR BEST RESULTS
              </h4>
              <ul className="text-text-secondary text-xs space-y-1">
                <li>• Use clear, well-lit photos</li>
                <li>• Ensure the fish is the main subject</li>
                <li>• Avoid blurry or dark images</li>
                <li>• Side profile shots work best</li>
                <li>• Include distinctive features like fins, patterns, or colors</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
