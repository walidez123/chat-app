"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, login, isSigningUp, isLoggingIn, authUser, checkAuth } =
    useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (authUser) {
    redirect("/");
  }
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" }); // Reset form data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login({ email: formData.email, password: formData.password });
    } else {
      await signup(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="card w-96 bg-base-200 shadow-xl animate-fade-in">
        <div className="card-body">
          <h2 className="card-title text-base-content">
            {isLogin ? "Login" : "Register"}
          </h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="input input-bordered bg-base-300 text-base-content"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered bg-base-300 text-base-content"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered bg-base-300 text-base-content"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${
                  isLogin
                    ? isLoggingIn
                      ? "loading"
                      : ""
                    : isSigningUp
                    ? "loading"
                    : ""
                }`}
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </div>
          </form>
          <div className=" mt-4">
            <button
              onClick={toggleForm}
              className="link text-base-content hover:text-primary flex flex-col gap-1"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"} 
            </button>
            <Link href={'/'} className="text-base-content underline hover:text-primary">Go home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
