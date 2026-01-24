import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await resetPassword(token, { password });
      navigate("/login");
    } catch {
      alert("Invalid link");
    }
  };

  return <> {/* UI same */} </>;
}
