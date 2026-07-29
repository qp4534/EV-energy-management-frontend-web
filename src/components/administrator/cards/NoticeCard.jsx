import CardShell from "../CardShell";
import NoticeList from "../NoticeList";

export default function NoticeCard({
  title = "공지 사항",
  notices = [],
  limit = 5,
  importantOnly = true,
}) {
  return (
    <CardShell title={title}>
      <NoticeList
        notices={notices}
        limit={limit}
        importantOnly={importantOnly}
      />
    </CardShell>
  );
}