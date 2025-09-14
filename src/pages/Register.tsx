import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import Input from "@/components/core/Input/Input";
import Button from "@/components/core/Button/Button";
import { ToastService } from "@/utils/toastr.service";

const defaultValue: RegisterInput = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultValue,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await registerUser({
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setCredentials(res));
      ToastService.success("Registered successfully!");
      navigate("/app/todos", { replace: true });
    } catch (e: any) {
      ToastService.error(e?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Register</h1>
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
          <Input
            label="Confirm Password"
            placeholder="Enter confirm password"
            registerProperty={register("confirmPassword")}
            errorText={errors?.confirmPassword?.message}
            type="password"
            isRequired
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            {isLoading ? "Creating..." : "Register"}
          </Button>
        </form>
        <p className="text-sm mt-4 text-center">
          Have an account?{" "}
          <Link className="text-blue-600" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
