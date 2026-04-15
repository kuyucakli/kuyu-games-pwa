export function BtnGameStarter({ onClick }: { onClick: () => void }) {
  return (
    <div className="w-22 h-22  fixed top-1/2 left-1/2 translate-x-[calc(-50%-0px)] translate-y-[calc(-50%-0px)]   z-10 ">
      <button
        type="button"
        className="w-22 h-22 rounded-full border-4 border-green-400 bg-green-400/30 blur-[0.5px] animate-ping cursor-pointer"
        onClick={() => {
          onClick();
        }}
      ></button>
    </div>
  );
}
