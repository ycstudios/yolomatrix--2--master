"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import Logo from "@/components/logo"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [agreeToMarketing, setAgreeToMarketing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { t } = useLanguage()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user starts typing again
    if (error) setError("")
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form first
    if (formData.password !== formData.confirmPassword) {
      setError(t("signup.passwordsDoNotMatch"))
      return
    }
    
    if (!agreeToTerms) {
      setError(t("signup.mustAgreeToTerms"))
      return
    }
    
    try {
      setIsLoading(true)
      setError("")
      
      // Prepare data for API - match the backend expected format
      const apiData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        agreeTerm: agreeToTerms,
        agreeMarketing: agreeToMarketing
      }

      // Send data to your API endpoint
      const response = await fetch("https://yolo-matrix.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }
      
      // Successful registration
      console.log("Registration successful:", data)
      
      // Redirect to login page or dashboard depending on your flow
      // You might also want to store the token if the API returns one
      if (data.token) {
        localStorage.setItem("authToken", data.token)
        router.push("/dashboard") // Redirect to dashboard if token is provided
      } else {
        router.push("/login") // Redirect to login if no token
      }
      
    } catch (err) {
      setError(err.message || "An error occurred during registration")
      console.error("Registration error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength checker (basic example)
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "" }
    
    let strength = 0
    // Add points based on criteria
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    let text = ""
    if (strength === 1) text = t("signup.passwordWeak")
    else if (strength === 2) text = t("signup.passwordMedium")
    else if (strength === 3) text = t("signup.passwordGood")
    else if (strength === 4) text = t("signup.passwordStrong")
    
    return { strength, text }
  }
  
  const passwordStrength = getPasswordStrength(formData.password)
  const passwordsMatch = formData.password && formData.confirmPassword && 
    formData.password === formData.confirmPassword

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-950">
      
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo className="w-[150px] h-auto" />
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              {t("signup.createAccount")}
            </h1>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields - Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("signup.firstName")}
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("signup.lastName")}
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("signup.email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("signup.password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-200 dark:bg-gray-700 w-full h-1 rounded-full">
                        <div 
                          className={cn(
                            "h-1 rounded-full transition-all",
                            passwordStrength.strength === 1 && "w-1/4 bg-red-500",
                            passwordStrength.strength === 2 && "w-2/4 bg-yellow-500",
                            passwordStrength.strength === 3 && "w-3/4 bg-green-400",
                            passwordStrength.strength === 4 && "w-full bg-green-500"
                          )}
                        />
                      </div>
                      <span className="text-xs font-medium">{passwordStrength.text}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("signup.confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500 pr-10",
                      formData.confirmPassword && (
                        passwordsMatch 
                          ? "border-green-500 dark:border-green-500" 
                          : "border-red-500 dark:border-red-500"
                      )
                    )}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {formData.confirmPassword && (
                      passwordsMatch ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-red-500 text-sm">
                          {t("signup.passwordsDoNotMatch")}
                        </span>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Terms and Conditions Checkbox */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms}
                    onCheckedChange={setAgreeToTerms}
                    className="mt-1 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                    required
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    {t("signup.agreeToTermsPrefix")}{" "}
                    <Link 
                      href="/terms" 
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {t("signup.termsOfService")}
                    </Link>
                    {" "}{t("signup.and")}{" "}
                    <Link 
                      href="/privacy" 
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {t("signup.privacyPolicy")}
                    </Link>
                  </Label>
                </div>
                
                {/* Marketing Checkbox */}
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="marketing" 
                    checked={agreeToMarketing}
                    onCheckedChange={setAgreeToMarketing}
                    className="mt-1 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <Label 
                    htmlFor="marketing" 
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    {t("signup.agreeToMarketing")}
                  </Label>
                </div>
              </div>
              
              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                disabled={!agreeToTerms || !passwordsMatch || isLoading}
              >
                {isLoading ? t("signup.creatingAccount") : t("signup.createAccount")}
              </Button>
              
              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("signup.alreadyHaveAccount")}{" "}
                  <Link 
                    href="/login" 
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {t("signup.login")}
                  </Link>
                </p>
              </div>
            </form>
          </div>
          
          {/* Alternative Signup Methods */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400">
                  {t("signup.orContinueWith")}
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="py-5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  // Handle Google OAuth - redirect to backend OAuth route
                  window.location.href = "https://yolo-matrix.onrender.com/auth/google";
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="py-5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  // Handle Twitter OAuth - redirect to backend OAuth route
                  window.location.href = "https://yolo-matrix.onrender.com/auth/twitter";
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
                Twitter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}