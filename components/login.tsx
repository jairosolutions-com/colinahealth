
import Image from "next/image";
import AuthForm from "./authForm";

export const Login = () => {

  return (
    <div className="w-full h-full flex ">
      <section className="w-full h-full">
        <AuthForm />
      </section>
    </div>
  );
};
export default Login;
