import clsx from "clsx";
import { GitPullRequestClosed, MailOpen, Summary, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import { markAsRead } from "../../actions/notifications/markAsRead";
import ActionBox from "./ActionBox";
import type { NotificationData } from "./Header";
import NotificationQuantity from "./NotificationQuantity";

export type NotificationHookSetters = {
  setResult: React.Dispatch<React.SetStateAction<NotificationData[]>>;
  setError: React.Dispatch<React.SetStateAction<{ [key: string]: string } | null>>;
};

interface Props {
  data: {
    result: NotificationData[];
    error: { [key: string]: string };
  } & NotificationHookSetters;
  unreadMessages: string[];
}

const NotificationBox = ({ data, unreadMessages }: Props) => {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { result, error, setError } = data;

  const notyficationItems = result.filter((n) => {
    if (filter === "all") return true;
    return n.isUnread;
  });

  useEffect(() => {
    if (error && !("fetch" in error)) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error]);

  return (
    <div
      id="notifications"
      popover="auto"
      className="position-anchor-notification-button position-area-bottom-end mx-t-2 text-foreground animate-slide-in mx-auto w-full rounded-lg border border-slate-200 bg-white px-2 pt-4 shadow-lg md:mx-2 md:w-md md:max-w-11/12"
    >
      <h1 className="relative mb-0.5 inline-block text-lg font-semibold">
        Notifications
        <NotificationQuantity qty={unreadMessages.length} />
      </h1>
      <hr className="text-muted-foreground/50 mb-2" />

      <ActionBox currentTab={filter} setTab={setFilter} unReadMessages={unreadMessages} {...data} />

      {error?.markAsRead && (
        <div role="alert" className="alert-item rounded-md">
          {error.markAsRead}
        </div>
      )}

      <div className={clsx(!error?.fetch && "h-100 overflow-y-auto")}>
        {!error?.fetch && notyficationItems.length ? (
          notyficationItems.map((n) => <NotificationItem key={n.id} {...n} {...data} />)
        ) : (
          <EmptyBox />
        )}
        {error?.fetch && <NotificationErrorItem />}
      </div>
    </div>
  );
};

export default NotificationBox;

const MESSAGES_TYPE = {
  join_team: () => ({
    message: "joined your team",
    icon: UserRound,
    bgIcon: "bg-blue-400",
  }),
  review_request: (company: string) => ({
    message: (
      <>
        from <span className="text-primary text-sm font-medium">{company}</span> has requested a
        review.
      </>
    ),
    icon: Summary,
    bgIcon: "bg-yellow-400",
  }),
  review_cancelled: (company: string) => ({
    message: (
      <>
        from <span className="text-primary text-sm font-medium">{company}</span> has cancelled their
        review request.
      </>
    ),
    icon: GitPullRequestClosed,
    bgIcon: "bg-red-400",
  }),
};

type ItemProps = NotificationData & NotificationHookSetters;

const NotificationItem = ({
  id,
  type,
  userName,
  company,
  timestamp,
  isUnread,
  setError,
  setResult,
}: ItemProps) => {
  const { message, icon: Icon, bgIcon } = MESSAGES_TYPE[type](company);

  return (
    <div
      role={isUnread ? "button" : "div"}
      onClick={async () => {
        if (isUnread) {
          const result = await markAsRead([id]);

          if (!result) {
            setError({ markAsRead: "Can't mark as read" });
            return;
          }
          setError(null);
          setResult((prevState) =>
            prevState.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
          );
        }
      }}
      className={clsx("notification-item", {
        "cursor-pointer bg-blue-300/50 hover:bg-blue-300/60": isUnread,
      })}
    >
      <div className="inline-flex basis-16">
        <span
          className={clsx(
            "m-auto flex size-10 items-center justify-center rounded-full border border-white/50 font-bold text-white shadow-md",
            bgIcon
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <div className="flex-1 p-1">
        <p className="text-primary text-sm">
          <span className="font-medium">{userName} </span>
          {message}
        </p>
        <span className="text-xs text-gray-500/90">{timestamp}</span>
      </div>
      <div className="inline-flex basis-auto p-2">{isUnread && <UnreadDot />}</div>
    </div>
  );
};

const UnreadDot = () => (
  <span className="mx-auto block size-2.5 animate-pulse rounded-full bg-red-400" />
);

const NotificationErrorItem = () => (
  <div role="alert" className={clsx("notification-item", "alert-item")}>
    Unable to load notifications
  </div>
);

const EmptyBox = () => (
  <div role="status" className="flex min-h-16 flex-col items-center justify-center">
    <MailOpen /> Nothing to display.
  </div>
);
