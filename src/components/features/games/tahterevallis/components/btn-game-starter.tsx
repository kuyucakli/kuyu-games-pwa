export function BtnGameStarter({ onClick }: { onClick: () => void }) {
  return (
    <div className="w-22 h-22  fixed top-1/2 left-1/2 translate-x-[calc(-50%-0px)] translate-y-[calc(-50%-0px)]   z-10  ">
      <button
        type="button"
        className=" w-22 h-22 rounded-full   border-3 border-yellow-200 bg-[radial-gradient(circle,_#daa900_40%,_yellow_100%)]  shadow-lg cursor-pointer animate-[wiggle_1s_ease-in-out_1]"
        onClick={() => {
          onClick();
        }}
      >
        <p className="tracking-wider animate-pulse text-lg text-yellow-100 font-bold">
          start
        </p>
      </button>
    </div>
  );
}
