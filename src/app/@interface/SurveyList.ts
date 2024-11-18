export interface SurveyList {
  checkbox: boolean;
  id: number;
  name: string;
  status: string;
  statusCode: string;
  startDate: string;
  endDate: string;
  url: string;
}

enum StatusCode {
  NOT_PUBLISHED = "未發布",
  NOT_STARTED = "尚未開始",
  IN_PROGRESS = "進行中",
  END = "已結束"
}
