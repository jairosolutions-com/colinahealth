import Image from "next/image";
const LoadingGif = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Image
        src="/imgs/colina-logo-animation.gif"
        alt="logo"
        height={100}
        width={100}
      />
    </div>
  );
};

export default LoadingGif;
