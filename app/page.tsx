// ABOUTME: Main page for Gemini image generation webapp
// ABOUTME: Clean white design with warm gold/orange accents

'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editImage, setEditImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          apiKey,
          editImage: editMode ? editImage : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.image);
      if (editMode) {
        setEditImage(data.image);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditImage(result);
        setEditMode(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetEditMode = () => {
    setEditMode(false);
    setEditImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <div className="container mx-auto px-6 py-12 max-w-7xl">

        {/* Header */}
        <header className="text-center mb-16 animate-fade-in-up">
          <h1
            className="text-7xl md:text-8xl font-bold mb-6 tracking-tight text-gradient-warm"
            style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.03em' }}
          >
            Gemini
            <br />
            Image Studio
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed text-gray-600">
            Transform your imagination into visual reality with AI-powered image generation
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start">

          {/* Left Panel - Controls */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

            {/* Control Panel */}
            <div className="glass-panel rounded-3xl p-8 shadow-xl hover-lift">

              {/* API Key */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-amber-600" style={{ fontFamily: 'var(--font-syne)' }}>
                  API Authentication
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-amber-200 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                />
                <p className="text-xs mt-2 text-gray-500">
                  Get your key from{' '}
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline hover:text-amber-700">
                    Google AI Studio
                  </a>
                </p>
              </div>

              {/* Edit Mode Toggle */}
              <div className="mb-6 flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-amber-100">
                <span className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>
                  Edit Mode
                </span>
                <button
                  onClick={() => editMode ? resetEditMode() : setEditMode(true)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    editMode ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    editMode ? 'translate-x-7' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Image Upload */}
              {editMode && (
                <div className="mb-6 animate-fade-in-up">
                  <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-orange-600" style={{ fontFamily: 'var(--font-syne)' }}>
                    Upload Source Image
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-5 py-4 rounded-xl bg-white border-2 border-orange-200 text-gray-900 file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-amber-400 file:to-orange-500 file:text-white file:font-semibold file:cursor-pointer hover:file:shadow-lg transition-all"
                  />
                  {editImage && (
                    <button onClick={resetEditMode} className="mt-3 text-sm text-amber-600 hover:text-amber-700 hover:underline">
                      Clear and start fresh
                    </button>
                  )}
                </div>
              )}

              {/* Prompt */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-rose-500" style={{ fontFamily: 'var(--font-syne)' }}>
                  {editMode ? 'Transformation Prompt' : 'Creation Prompt'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={editMode ? "Describe how to modify the image..." : "Describe your vision in vivid detail..."}
                  rows={6}
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-rose-200 text-gray-900 placeholder-gray-400 resize-none transition-all duration-300 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                  style={{ fontFamily: 'var(--font-instrument)' }}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="relative w-full py-5 rounded-xl font-bold text-lg text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg overflow-hidden group"
                style={{
                  fontFamily: 'var(--font-syne)',
                  background: 'linear-gradient(135deg, #fbbf24, #fb923c)'
                }}
              >
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    editMode ? 'Transform Image' : 'Generate Image'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 animate-shimmer" />
              </button>

              {/* Error */}
              {error && (
                <div className="mt-4 p-4 rounded-xl text-sm animate-fade-in-up bg-red-50 border-2 border-red-200 text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="glass-panel rounded-3xl p-6 animate-float hover-lift">
              <h3 className="text-lg font-bold mb-4 text-amber-600" style={{ fontFamily: 'var(--font-syne)' }}>
                Pro Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-amber-500 text-xl leading-none">•</span>
                  <span>Be highly specific: mention lighting, mood, camera angles, and artistic style</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl leading-none">•</span>
                  <span>For photorealistic results, reference camera equipment and lens specifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 text-xl leading-none">•</span>
                  <span>Use Edit Mode to iteratively refine and perfect your creations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Image Display */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>

            {/* Original Image (Edit Mode) */}
            {editImage && editMode && (
              <div className="glass-panel rounded-3xl p-6 shadow-xl hover-lift">
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-orange-600" style={{ fontFamily: 'var(--font-syne)' }}>
                  Source Material
                </h3>
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-orange-200">
                  <Image src={editImage} alt="Original image" fill className="object-contain" />
                </div>
              </div>
            )}

            {/* Generated Image */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl animate-pulse-glow">
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-amber-600" style={{ fontFamily: 'var(--font-syne)' }}>
                {editMode ? 'Transformed Output' : 'Generated Creation'}
              </h3>

              {generatedImage ? (
                <div className="space-y-5">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-amber-200 group hover-lift">
                    <Image src={generatedImage} alt="Generated image" fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={generatedImage}
                      download="gemini-creation.png"
                      className="py-3 px-4 rounded-xl font-semibold text-center transition-all bg-amber-100 border-2 border-amber-300 text-amber-700 hover:bg-amber-200 hover:shadow-lg"
                      style={{ fontFamily: 'var(--font-syne)' }}
                    >
                      Download
                    </a>
                    {!editMode && (
                      <button
                        onClick={() => {
                          setEditImage(generatedImage);
                          setEditMode(true);
                          setPrompt('');
                        }}
                        className="py-3 px-4 rounded-xl font-semibold transition-all bg-orange-100 border-2 border-orange-300 text-orange-700 hover:bg-orange-200 hover:shadow-lg"
                        style={{ fontFamily: 'var(--font-syne)' }}
                      >
                        Refine This
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-square rounded-2xl flex items-center justify-center border-2 border-dashed border-amber-200 bg-amber-50">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border-2 border-amber-200">
                      <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold mb-2 text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>
                      Awaiting Creation
                    </p>
                    <p className="text-sm text-gray-500">
                      Enter your prompt and let AI bring your vision to life
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
