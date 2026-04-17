export function BtnGameStarter({ onClick }: { onClick: () => void }) {
  return (
    <div className="w-22 h-22  fixed top-1/2 left-1/2 translate-x-[calc(-50%-0px)] translate-y-[calc(-50%-0px)]   z-10 ">
      <button
        type="button"
        className="tracking-wide w-22 h-22 rounded-full text-green-600 border-4 border-green-400 bg-green-100/90  animate-pulse  cursor-pointer"
        onClick={() => {
          onClick();
        }}
      >
        Start
      </button>
    </div>
  );
}
