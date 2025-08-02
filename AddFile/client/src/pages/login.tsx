"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import "./auth.css";
import api from "@/lib/axios";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Client-side cookie access to check if user is already authenticated
    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth="));
    if (authCookie) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // Add login logic here

    const result = await api.post("/api/v1/auth/login", {
      name: username,
      password: password,
    });

    if (!result.data.token) {
      alert("존재하지 않은 User 입니다.");
      return;
    }

    document.cookie = `auth=${result.data.token}; path=/`;

    localStorage.setItem("userId", result.data.userId);
    localStorage.setItem("userName", result.data.name);

    router.push("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="auth-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div>
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
