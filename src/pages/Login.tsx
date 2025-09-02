import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import api, { type AuthResponse } from "../api/client";
import { userAuthStore } from "../hooks/useAuthStore";

type Mode = "login" | "register";

const schema = yup.object({
  email: yup.string().email("Correo inválido").required("Requerido"),
  password: yup.string().min(6, "Minimo 6 caracteres").required("Requerido"),
});

type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const [mode, setMode] = useState<Mode>("login");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const setAccessToken = userAuthStore((state) => state.setAccessToken);
  const user = userAuthStore((state) => state.user);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const onSubmit = async (dataform: FormData) => {
    setMessage("");

    try {
      if (mode === "register") {
        // Frontend que recibirá el token por query (?token=&user_id=)
        const redirectUrl = `${window.location.origin}${
          import.meta.env.BASE_URL
        }#/verify`;
        await api.post("/auth/register", {
          email: dataform.email,
          password: dataform.password,
          redirect_url: redirectUrl,
        });
        setMessage("✔ Revisa tu correo para verificar la cuenta.");
      } else {
        const { data } = await api.post<AuthResponse>("/auth/login", {
          email: dataform.email,
          password: dataform.password,
        });

        setAccessToken(data.access_token);

        setMessage("✔ Sesión iniciada. Access token recibido.");
        navigate("/dashboard");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? "Error inesperado";
      console.log(detail);
      setMessage(`✖ ${detail}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          {mode === "register" ? "Crear Cuenta" : "Iniciar Sesión"}
        </h1>

        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            type="email"
            {...register("email")}
            placeholder="Email"
          />
          <p>{errors.email?.message}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Contraseña</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            type="password"
            {...register("password")}
            placeholder="Contraseña"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
          <p>{errors.password?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {mode === "register" ? "Registrarse" : "Entrar"}
        </button>

        <div className="text-center mt-4">
          {mode === "register" ? (
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => setMode("login")}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          ) : (
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => setMode("register")}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          )}
        </div>

        {message && <div className="mt-4 text-sm text-center">{message}</div>}
      </form>
      <div className="mt-5 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-150">
        Las peticiones a la API puede tardarse unos minutos debido a las condiciones del servicio gratuito
        de{" "}
        <a href="https://render.com/pricing" target="_blank" className="underline hover:text-yellow-400">
          render
        </a>.
      </div>
    </div>
  );
}
