"use client";

import { useState } from "react";
import Image from "next/image";
import { supabaseService } from "@/lib/supabase/service";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await supabaseService.signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange/5 to-orange/10 pattern-grid">
      <div className="w-full max-w-lg p-8">
        <div className="bg-white rounded-16 shadow-lg p-8 space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="w-42 h-42 bg-white mx-auto mb-4 flex items-center justify-center">
              <Image
                src="/images/toy.png"
                alt="Cheeko Toy"
                width={200}
                height={200}
              />
            </div>
            <h1 className="text-2xl font-bold text-black">Welcome to CheekoAI</h1>
            <p className="text-md text-grey mt-2">Sign in to manage your smart toys</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red/10 border border-red text-red rounded-8 p-4 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-black px-4 py-3 rounded-xl font-semibold text-base transition-all hover:border-orange hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-orange border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* Info text */}
          <p className="text-center text-sm text-grey">
            By signing in, you agree to our{" "}
            <a
              href="https://www.cheekoai.in/#privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange font-semibold hover:underline"
            >
              Privacy Policies
            </a>
          </p>
        </div>

        {/* Purchase link */}
        <div className="text-center mt-6">
          <p className="text-grey">
            Don't have a Cheeko yet?{" "}
            <a
              href="https://cheekoai.myshopify.com/products/cheeko-ai-toy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange font-semibold hover:underline"
            >
              Purchase one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
