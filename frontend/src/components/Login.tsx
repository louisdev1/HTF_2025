"use client";

import { useState } from "react";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Accept any email and password - just needs to be filled in
    if (email && password) {
      localStorage.setItem("fishyDexAuthenticated", "true");
      onLoginSuccess();
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Account creation email sent! (Demo mode - check would be sent to: " + createEmail + ")");
    setTimeout(() => {
      setShowCreateAccount(false);
      setShowOptions(false);
      setMessage("");
    }, 3000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Password reset email sent! (Demo mode - check would be sent to: " + resetEmail + ")");
    setTimeout(() => {
      setShowResetPassword(false);
      setShowOptions(false);
      setMessage("");
    }, 3000);
  };

  if (showCreateAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sonar-dark via-blue-950 to-sonar-dark flex items-center justify-center p-4">
        <div className="bg-sonar-medium border-2 border-sonar-green shadow-2xl shadow-sonar-green/20 rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-sonar-green mb-2">🐠 CREATE ACCOUNT</h1>
            <p className="text-gray-300">Join Fishy Dex</p>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded text-green-300 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-sonar-green font-bold mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                className="w-full px-4 py-3 bg-sonar-dark border-2 border-sonar-green text-white rounded focus:outline-none focus:ring-2 focus:ring-sonar-green"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sonar-green font-bold mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                className="w-full px-4 py-3 bg-sonar-dark border-2 border-sonar-green text-white rounded focus:outline-none focus:ring-2 focus:ring-sonar-green"
                placeholder="Create a password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sonar-green text-sonar-dark font-bold py-3 px-4 rounded hover:bg-green-400 transition-colors duration-200"
            >
              CREATE ACCOUNT
            </button>

            <button
              type="button"
              onClick={() => {
                setShowCreateAccount(false);
                setShowOptions(false);
              }}
              className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded hover:bg-gray-600 transition-colors duration-200"
            >
              BACK TO LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sonar-dark via-blue-950 to-sonar-dark flex items-center justify-center p-4">
        <div className="bg-sonar-medium border-2 border-sonar-green shadow-2xl shadow-sonar-green/20 rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-sonar-green mb-2">🔒 RESET PASSWORD</h1>
            <p className="text-gray-300">We'll send you a reset link</p>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded text-green-300 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sonar-green font-bold mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 bg-sonar-dark border-2 border-sonar-green text-white rounded focus:outline-none focus:ring-2 focus:ring-sonar-green"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sonar-green text-sonar-dark font-bold py-3 px-4 rounded hover:bg-green-400 transition-colors duration-200"
            >
              SEND RESET LINK
            </button>

            <button
              type="button"
              onClick={() => {
                setShowResetPassword(false);
                setShowOptions(false);
              }}
              className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded hover:bg-gray-600 transition-colors duration-200"
            >
              BACK TO LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showOptions) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sonar-dark via-blue-950 to-sonar-dark flex items-center justify-center p-4">
        <div className="bg-sonar-medium border-2 border-red-500 shadow-2xl shadow-red-500/20 rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-red-400 mb-2">LOGIN FAILED</h1>
            <p className="text-gray-300">Invalid email or password</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setShowCreateAccount(true);
                setShowOptions(false);
              }}
              className="w-full bg-sonar-green text-sonar-dark font-bold py-3 px-4 rounded hover:bg-green-400 transition-colors duration-200"
            >
              CREATE ACCOUNT
            </button>

            <button
              onClick={() => {
                setShowResetPassword(true);
                setShowOptions(false);
              }}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-500 transition-colors duration-200"
            >
              RESET PASSWORD
            </button>

            <button
              onClick={() => {
                setShowOptions(false);
                setEmail("");
                setPassword("");
              }}
              className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded hover:bg-gray-600 transition-colors duration-200"
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sonar-dark via-blue-950 to-sonar-dark flex items-center justify-center p-4">
      <div className="bg-sonar-medium border-2 border-sonar-green shadow-2xl shadow-sonar-green/20 rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-sonar-green mb-2">🐠 FISHY DEX</h1>
          <p className="text-gray-300 text-lg">Marine Biology Tracker</p>
          <div className="mt-4 h-1 w-20 bg-sonar-green mx-auto rounded"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sonar-green font-bold mb-2">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-sonar-dark border-2 border-sonar-green text-white rounded focus:outline-none focus:ring-2 focus:ring-sonar-green"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sonar-green font-bold mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-sonar-dark border-2 border-sonar-green text-white rounded focus:outline-none focus:ring-2 focus:ring-sonar-green"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sonar-green text-sonar-dark font-bold py-3 px-4 rounded hover:bg-green-400 transition-colors duration-200 text-lg"
          >
            LOGIN
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>🌊 Dive into the ocean database</p>
        </div>
      </div>
    </div>
  );
}
