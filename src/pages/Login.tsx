import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Input from "@/components/core/Input/Input";
import Button from "@/components/core/Button/Button";
import { ToastService } from "@/utils/toastr.service";

const defaultValue: LoginInput = {
  email: "",
  password: "",
};

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultValue,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/app/todos";

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res));
      ToastService.success("Login successful!");
      navigate(from, { replace: true });
    } catch (e: any) {
      toast.error(e?.data?.message || "Login failed. Please try again.");
      setError("password", {
        message: e?.data?.message || "Invalid credentials",
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">
      <Toaster />
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input
            label="Email"
            placeholder="Enter your email"
            registerProperty={register("email")}
            errorText={errors?.email?.message}
            isRequired
            leftHelpText={"checkbox"}
            type="text"
          />
          <Input
            label="Password"
            placeholder="Enter password"
            registerProperty={register("password")}
            errorText={errors?.password?.message}
            type="password"
            isRequired
          />

          <Button
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 text-white rounded"
            type="submit"
          >
            {isLoading ? "Submitting..." : "Login"}
          </Button>
        </form>
        <p className="text-sm mt-4 text-center">
          No account?{" "}
          <Link className="text-blue-600" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
