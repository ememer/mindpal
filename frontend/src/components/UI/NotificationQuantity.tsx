import clsx from "clsx";

const NotificationQuantity = ({
  qty,
  enableAnimate = false,
}: {
  qty: number;
  enableAnimate?: boolean;
}) => {
  return (
    <span
      className={clsx(
        "absolute -top-1/3 right-0 aspect-square min-h-4 translate-x-1/2 items-center justify-center rounded-full bg-red-400 p-[0.2rem] text-[0.6rem] font-medium text-white",
        qty > 0 ? "flex" : "hidden",
        enableAnimate && "animate-grow-up"
      )}
    >
      {qty > 9 ? "9+" : qty}
    </span>
  );
};

export default NotificationQuantity;
