import moment from "moment";

export default function Reports() {
  const startOfCurrentMonth = moment().startOf("month");
  const endOfCurrentMonth = moment().endOf("month");
  const daysInCurrentMonth =
    endOfCurrentMonth.diff(startOfCurrentMonth, "days") + 1;

  const parseWeekday = (weekday: number) => {
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    return weekdays[weekday];
  };

  const data = [];
  for (let i = 0; i < daysInCurrentMonth; i++) {
    data.push({
      date: startOfCurrentMonth.clone().add(i, "days").format("D"),
      weekday: parseWeekday(
        startOfCurrentMonth.clone().add(i, "days").weekday()
      ),
    });
  }

  return (
    <div>
      <h1>Reports</h1>
      <div>
        <table className="w-full">
          <thead>
            <tr className="text-center text-sm">
              <th>曜日</th>
              <th>日付</th>
              <th>勤務種別</th>
              <th>勤務開始</th>
              <th>勤務終了</th>
              <th>休憩時間</th>
              <th className="w-1/2">作業内容</th>
              <th>作業時間</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center text-xs">
                <td>{item.weekday}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
