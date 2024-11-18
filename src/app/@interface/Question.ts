// 問題
export interface Question {
  checkbox?: boolean;
  questionId: number;
  title: string;
  type: string; // 類型：單選S 多選M 簡答T
  necessary: boolean; // 必填
  options: Array<any>;
}

// 問卷(目前沒用到)
export interface Survey {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

// 回饋表
export interface Response {
  replyID: number;
  name: string;
  date: any;
  url: string;
}
