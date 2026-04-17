export function BtnGameStarter({ onClick }: { onClick: () => void }) {
  return (
    <div className="w-22 h-22  fixed top-1/2 left-1/2 translate-x-[calc(-50%-0px)] translate-y-[calc(-50%-0px)]   z-10  ">
      <button
        type="button"
        className="tracking-wide w-22 h-22 rounded-full   border-3 border-purple-400 bg-[radial-gradient(circle,_#56bb00_40%,_#ffba79_100%)]  shadow-lg cursor-pointer animate-[wiggle_1s_ease-in-out_1]"
        onClick={() => {
          onClick();
        }}
      >
        <p className="animate-pulse text-xl text-green-100">Start</p>
      </button>
    </div>
  );
}
