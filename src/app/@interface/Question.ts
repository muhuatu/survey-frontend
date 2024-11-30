// 問題
export interface Question {
  checkbox?: boolean;
  questionId: number;
  title: string;
  type: string; // 類型：單選S 多選M 簡答T
  necessary: boolean; // 必填
  options: Array<any>;
}

// 選項
export interface Option {
  option: string;
  optionNumber: number;
}

// 回饋表
export interface Response {
  replyID: number;
  replyName: string;
  date: any;
  url: string;
}
