import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tier, setTier] = useState("Free");
  const [organizationName, setOrganizationName] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [organizationNameError, setOrganizationNameError] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setOrganizationNameError(null);

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    if (tier === "Enterprise" && !organizationName.trim()) {
      setOrganizationNameError(
        "Organization name is required for Enterprise tier.",
      );
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            tier: tier,
            organization_name: tier === "Enterprise" ? organizationName : null,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Registration Successful",
          description: "Please check your email to confirm your account.",
        });
        navigate("/auth/login"); // Redirect to login after successful registration
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null); // Clear error on change
                }}
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null); // Clear error on change
                }}
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError(null); // Clear error on change
                }}
              />
              {confirmPasswordError && (
                <p className="text-sm text-red-500">{confirmPasswordError}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Select Tier</Label>
              <RadioGroup
                defaultValue="Free"
                value={tier}
                onValueChange={(value) => {
                  setTier(value);
                  setOrganizationNameError(null); // Clear error on tier change
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Free" id="r1" />
                  <Label htmlFor="r1">Free</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Enterprise" id="r2" />
                  <Label htmlFor="r2">Enterprise</Label>
                </div>
              </RadioGroup>
            </div>
            {tier === "Enterprise" && (
              <div className="grid gap-2">
                <Label htmlFor="organization-name">Organization Name</Label>
                <Input
                  id="organization-name"
                  type="text"
                  placeholder="Your Organization"
                  required={tier === "Enterprise"}
                  value={organizationName}
                  onChange={(e) => {
                    setOrganizationName(e.target.value);
                    setOrganizationNameError(null); // Clear error on change
                  }}
                />
                {organizationNameError && (
                  <p className="text-sm text-red-500">
                    {organizationNameError}
                  </p>
                )}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/auth/login" className="underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
