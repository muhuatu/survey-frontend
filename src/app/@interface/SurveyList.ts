export interface SurveyList {
  checkbox: boolean;
  id: number;
  name: string;
  //status: string;
  statusCode: keyof typeof StatusCode;
  startDate: string;
  endDate: string;
  url: string;
}

export enum StatusCode {
  NOT_PUBLISHED = "未發布",
  NOT_STARTED = "尚未開始",
  IN_PROGRESS = "進行中",
  END = "已結束",
}

export interface Survey {
  published: boolean; // 是否發布
  //statusCode: keyof typeof StatusCode; // 問卷的狀態
  startDate: string; // 開始日期 (格式：yyyy-MM-dd)
  endDate: string; // 結束日期 (格式：yyyy-MM-dd)
}


