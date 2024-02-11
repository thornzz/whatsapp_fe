import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/userSlice";
import WBLogo from "../../images/logo.png";
import SocketContext from "../../context/SocketContext";
function LoginForm({ socket }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });
  const onSubmit = async (values) => {
    let res = await dispatch(loginUser({ ...values }));

    if (res?.payload?.user) {
      socket.connect();
      // socket.emit("join", res?.payload?.user._id);
      navigate("/");
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/*Heading*/}
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center justify-center">
          <div className="mt-4">
            <img src={WBLogo} alt="WB Logo" className="w-20 h-20" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight dark:text-dark_text_1">
            K2M Business Whatsapp
          </h2>
        </div>
        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <AuthInput
            name="email"
            type="text"
            placeholder="E-mail adresi"
            register={register}
            error={errors?.email?.message}
          />
          <AuthInput
            name="password"
            type="password"
            placeholder="Şifre"
            register={register}
            error={errors?.password?.message}
          />

          {/*if we have an error*/}
          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}
          {/*Submit button*/}
          <button
            className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide
          font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300
          "
            type="submit"
          >
            {status === "loading" ? (
              <PulseLoader color="#fff" size={16} />
            ) : (
              "GİRİŞ"
            )}
          </button>
          {/* Sign in link */}
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
            <span>Hesabınız yok mu?</span>
            <Link
              to="/register"
              className=" hover:underline cursor-pointer transition ease-in duration-300"
            >
              KAYIT OL
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
const LoginFormWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <LoginForm {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default LoginFormWithContext;
