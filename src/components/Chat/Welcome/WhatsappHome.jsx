import { Logo } from "../../../svg";

export default function WhatsappHome() {
  return (
    <div className="h-full w-full dark:bg-dark_bg_4 select-none border-l dark:border-l-dark_border_2 border-b-[6px] border-b-green_2">
      {/* Container */}
      <div className="-mt-1.5 w-full h-full flex flex-col gap-y-8 items-center justify-center">
        <div className="w-60 sm:w-68 md:w-72 lg:w-80 flex justify-center">
          <Logo />
        </div>
        {/* Infos */}
        <div className="mt-1 text-center space-y-[12px]">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl dark:text-dark_text_4 font-extralight">
            K2M WABA Entegrasyonu
          </h1>
        </div>
      </div>
    </div>
  );
}
