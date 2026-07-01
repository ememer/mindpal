import clsx from "clsx";
import { CheckCheckIcon } from "lucide-react";

import { markAsRead } from "../../actions/notifications/markAsRead";
import type { NotificationHookSetters } from "./NotificationBox";

const buttonClassName =
  "rounded-full text-xs h-8 px-2 flex-1 text-nowrap transition-all duration-300 ease-in-out ";

type Props = {
  currentTab: "all" | "unread";
  setTab: React.Dispatch<React.SetStateAction<"all" | "unread">>;
  unReadMessages: string[];
} & NotificationHookSetters;

const ActionBox = ({ currentTab, setTab, unReadMessages, setResult, setError }: Props) => {
  const hasUnread = unReadMessages?.length ?? 0;

  function handleSetAllTab() {
    if (currentTab === "all") return;
    setTab("all");
  }

  function handleSetUnreadTab() {
    if (currentTab === "unread") return;
    setTab("unread");
  }

  async function handleMarkAllAsRead(unreadedId: string[]) {
    const promieses = unreadedId.map((id) => markAsRead([id]));

    const results = await Promise.allSettled(promieses);

    const rejected = [];

    results.map((result, index) => {
      if (!(result as { value: boolean }).value) {
        rejected.push(unreadedId[index]);
      }
    });

    if (rejected.length) {
      setError({ markAsRead: "One or more notifications couldn't be marked as read" });

      if (rejected.length === unreadedId.length) {
        setError({ markAsRead: "Notifications couldn't be marked as read" });
        return;
      }
    }

    setResult((prevState) => {
      const newValue = prevState.map((n) => {
        if (rejected.includes(n.id)) {
          return n;
        }

        return { ...n, isUnread: false };
      });
      return newValue;
    });
  }

  return (
    <div className="my-3 flex w-full flex-wrap gap-2 gap-y-5 p-1">
      <button
        disabled={currentTab === "all"}
        onClick={handleSetAllTab}
        className={clsx(buttonClassName, {
          "text-primary-muted cursor-pointer hover:-translate-y-1 hover:bg-blue-400/30":
            currentTab !== "all",
          "bg-blue-400/15": currentTab === "all",
        })}
      >
        All Notifications
      </button>
      <button
        disabled={currentTab === "unread" || !hasUnread}
        onClick={handleSetUnreadTab}
        className={clsx(buttonClassName, {
          "text-gray-400/90": currentTab !== "unread" && !hasUnread,
          "text-primary-muted cursor-pointer hover:-translate-y-1 hover:bg-blue-400/30":
            currentTab !== "unread" && hasUnread,
          "bg-blue-400/15": currentTab === "unread",
        })}
      >
        Unread Notifications
      </button>
      <button
        disabled={!hasUnread}
        onClick={() => handleMarkAllAsRead(unReadMessages)}
        className={clsx(
          "ms-auto inline-flex items-center justify-center text-center text-xs text-blue-400 transition-all duration-300 ease-in",
          {
            "cursor-pointer hover:-translate-y-1": hasUnread,
            "text-primary-muted": !hasUnread,
          }
        )}
      >
        <CheckCheckIcon className="me-0.5 size-3.5" />
        Mark all as read
      </button>
    </div>
  );
};

export default ActionBox;
