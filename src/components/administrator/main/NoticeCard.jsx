import CardShell from "../common/CardShell";
import NoticeList from "../notice/NoticeList";

export default function NoticeCard({
  title = "공지 사항",
  notices = [],
  limit = 5,
  importantOnly = true,
  expandTo,
}) {
  return (
    <CardShell title={title} expandTo={expandTo}>
      <NoticeList
        notices={notices}
        limit={limit}
        importantOnly={importantOnly}
      />
    </CardShell>
  );
}