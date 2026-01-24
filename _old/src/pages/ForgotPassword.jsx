import { useState } from "react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword({ email });
      setMsg("OTP / link sent to email");
    } catch {
      setError("Email not found");
    }
  };

  return <> {/* UI same */} </>;
}
