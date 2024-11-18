import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../@service/quest-service';

@Component({
  selector: 'app-fill-in',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
  templateUrl: './fill-in.component.html',
  styleUrl: './fill-in.component.scss',
})
export class FillInComponent {
  constructor(private router: Router, private questService: QuestService) {}

  ngOnInit(): void {
    if (!this.questService.questData) {
      // 無資料的話會使用方法紀錄答案
      this.setupPreviewFields();
    } else {
      // 有資料的話會帶入原本的填寫框
      this.userName = this.questService.questData.userName;
      this.userPhone = this.questService.questData.userPhone;
      this.userEmail = this.questService.questData.userEmail;
      this.userAge = this.questService.questData.userAge;
      this.newQuestionArray = this.questService.questData.surveyArray;
    }
  }

  // 宣告變數
  // 1. 新增空陣列接收問題們，以便傳到下個頁面
  newQuestionArray: Array<any> = [];
  // 2. 判斷必填項
  radioData!: string;
  ngClassBoolean = false;
  userName!: string;
  userPhone!: string;
  userEmail!: string;
  userAge!: string;

  // 為了讓預覽畫面有資料，必須新增兩個"欄位"放它們：文字輸入(answer)、單選(radioAnswer)
  // 在問題的選擇中加入 boxBoolean 讓 checkbox(多選) 去進行資料綁定
  setupPreviewFields() {
    // 1. 新增 answer 和 radioAnswer
    this.newQuestionArray = this.survey.questionArray.map((question) => ({
      ...question,
      answer: '',
      radioAnswer: '',
    }));

    // 2. 新增一個空陣列接收包含新屬性的 boxBoolean 的資料
    for (let questions of this.newQuestionArray) {
      let options = [];
      // 2-1. 將 boxBoolean 放入選項陣列中
      for (let option of questions.options) {
        options.push({ ...option, boxBoolean: false });
      }
      // 2-2. 此時將 含有新屬性的選項 賦值給 新陣列問題的選項
      questions.options = options;
    }
  }

  // 必填判斷
  checkNecessary(): boolean {
    const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRge = /09[0-9]{8}/;

    // 1. 基本資料
    if (!(this.userName && this.userPhone)) {
      alert('請填寫個人資訊');
      return false;
    }

    if (!phoneRge.test(this.userPhone)) {
      alert('手機格式不正確，須為 09 開頭且總共 10 碼');
      return false;
    }

    if (this.userEmail && !emailReg.test(this.userEmail)) {
      alert('信箱格式不正確');
      return false;
    }

    // 2. 問題選項 (用迴圈遍歷每個問題)
    for (let survey of this.newQuestionArray) {
      // 3. 如果是必填
      if (survey.necessary) {
        // 3-1. 簡答 (answer)
        if (survey.type === 'T' && !survey.answer) {
          alert('請確認簡答題必填皆有填寫');
          return false;
        }
        // 3-2. 單選 (radioAnswer)
        if (survey.type === 'S' && !survey.radioAnswer) {
          alert('請確認單選題必填皆有填寫');
          return false;
        }
        // 3-3. 多選 (checkbox)
        if (survey.type === 'M') {
          let check = false; // 先預設多選框皆未填
          for (let option of survey.options) {
            if (option.boxBoolean) {
              check = true;
            }
          }
          if (!check) {
            alert('請確認多選題必填皆有填寫');
            return false;
          }
        }
      }
    }
    return true;
  }

  // 將資料打包到下一頁預覽唯讀頁
  submitToPreview() {
    if (this.checkNecessary()) {
      this.questService.questData = {
        // 個人資訊
        userName: this.userName,
        userPhone: this.userPhone,
        userEmail: this.userEmail,
        userAge: this.userAge,
        // 問卷
        name: this.survey.name,
        startDate: this.survey.startDate,
        endDate: this.survey.endDate,
        description: this.survey.description,
        // 問題
        surveyArray: this.newQuestionArray, // 這裡定義了新的surveyArray
      };
      this.router.navigate(['/preview']);
    } else {
      return;
    }
  }
  //--------------- 問卷內容 ---------------
  survey = {
    // 問卷
    name: '進擊的巨人角色偏好調查',
    description:
      '您好！這是一份針對《進擊的巨人》角色偏好的調查問卷，旨在了解粉絲對角色的喜愛程度與劇情相關的看法。無論您是艾倫的支持者，還是調查兵團的忠實粉絲，這份問卷將幫助我們了解您最喜歡的角色、最喜愛的劇情片段以及對結局的看法。請花幾分鐘時間填寫問卷，讓我們共同探索巨人世界的精彩！',
    startDate: '2026/08/05',
    endDate: '2026/10/05',
    // 問題
    questionArray: [
      {
        questionId: 1,
        title: '您最喜歡的《進擊的巨人》角色是誰？', // 標題
        type: 'S', // 類型：單選
        necessary: true, // 必填
        options: [
          { optionName: '艾倫·耶格爾', code: 'A' },
          { optionName: '三笠·阿克曼', code: 'B' },
          { optionName: '阿爾敏·阿諾德', code: 'C' },
          { optionName: '里維·阿克曼', code: 'D' },
        ],
      },
      {
        questionId: 2,
        title: '您最喜愛的劇情片段是？',
        type: 'M', // 多選
        necessary: false,
        options: [
          { optionName: '牆內世界揭露的真相', code: 'A' },
          { optionName: '艾倫首次化身巨人', code: 'B' },
          { optionName: '調查兵團的最終戰役', code: 'C' },
          { optionName: '艾倫與調查兵團的對立', code: 'D' },
        ],
      },
      {
        questionId: 3,
        title: '您認為結局是否符合您的期待？',
        type: 'S', // 單選
        necessary: true,
        options: [
          { optionName: '非常滿意', code: 'A' },
          { optionName: '還可以接受', code: 'B' },
          { optionName: '不太滿意', code: 'C' },
          { optionName: '完全不滿意', code: 'D' },
        ],
      },
      {
        questionId: 4,
        title: '您最希望看到哪位角色的外傳故事？',
        type: 'T', // 簡答
        necessary: false,
        options: [],
      },
      {
        questionId: 5,
        title: '您對《進擊的巨人》有什麼其他想法或建議？',
        type: 'T', // 簡答
        necessary: false,
        options: [],
      },
    ],
  };
}
