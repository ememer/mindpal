import clsx from "clsx";
import { BellRing, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

import useNotifications from "../../hook/useNotifications";
import { sleep } from "../../utils/sleep";
import NotificationBox from "./NotificationBox";
import NotificationQuantity from "./NotificationQuantity";

export interface NotificationData {
  id: string;
  type: "join_team" | "review_request" | "review_cancelled";
  userName: string;
  company: string | null;
  timestamp: string;
  isUnread: boolean;
}

const Header = () => {
  const notifications = useNotifications<NotificationData>(
    "http://localhost:3009/api/notifications"
  );
  const unreadMessages = notifications?.result?.filter((n) => n.isUnread)?.map((n) => n.id) ?? [];

  const [isInitialRender, setIsInitialRender] = useState(true);

  async function disableInitialBellAnimation() {
    await sleep(250);
    setIsInitialRender(false);
  }

  useEffect(() => {
    disableInitialBellAnimation();
  }, []);
  return (
    <header className="h-16 bg-white p-1 shadow-xs">
      <nav className="text-foreground flex h-full w-full justify-end gap-10 p-2 py-4">
        <button
          popoverTarget="notifications"
          className="anchor-notification-button relative ms-auto inline-flex aspect-square h-full cursor-pointer rounded-full"
        >
          <BellRing
            className={clsx(
              "m-auto size-6 w-auto",
              isInitialRender ? "animate-wiggle" : "hover:animate-wiggle-infinite"
            )}
          />
          <NotificationQuantity enableAnimate qty={unreadMessages.length} />
        </button>

        <div className="inline-flex font-semibold">
          JOHN DOE
          <ChevronLeft className="-rotate-90" />
        </div>

        <NotificationBox unreadMessages={unreadMessages} data={notifications} />
      </nav>
    </header>
  );
};

export default Header;
