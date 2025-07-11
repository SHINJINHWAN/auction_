import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

const OAuth2Success = () => {
  const [params] = useSearchParams();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("jwt", token);
      axios.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUser(res.data);
          navigate("/");
        });
    }
  }, [params, setUser, navigate]);

  return <div>로그인 중...</div>;
};

export default OAuth2Success; 