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
    const phoneRge = /^09[0-9]{8}$/;
    // 若要剛好是 10 位數，要加開頭（^）和結尾（$）限制，不然輸入 11 位數也給過= =

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
    name: '下午茶蛋糕團購登記',
    description:
      '本次團購品項有櫻桃派、楓糖麥片、提拉米蘇。團購時間至 2090/01/31 23:59 截止，請把握機會！' +
      '訂單總金額未滿 $490 需另加 $60 運費。送出訂單後，如需更改內容，請以電話聯繫。',
    startDate: '2090/01/01',
    endDate: '2090/01/31',
    questionArray: [
      {
        questionId: 1,
        title: '櫻桃派',
        type: 'S', // 單選
        necessary: false, // 非必填
        options: [
          { optionName: '1 份 280 元', code: 'A' },
          { optionName: '2 份 560 元', code: 'B' },
          { optionName: '3 份 840 元', code: 'C' },
          { optionName: '4 份 1,120 元', code: 'D' },
        ],
      },
      {
        questionId: 2,
        title: '楓糖麥片',
        type: 'S', // 單選
        necessary: false, // 非必填
        options: [
          { optionName: '1 份 200 元', code: 'A' },
          { optionName: '2 份 400 元', code: 'B' },
          { optionName: '3 份 600 元', code: 'C' },
          { optionName: '4 份 800 元', code: 'D' },
        ],
      },
      {
        questionId: 3,
        title: '提拉米蘇',
        type: 'S', // 單選
        necessary: false, // 非必填
        options: [
          { optionName: '1 吋 40 元', code: 'A' },
          { optionName: '2 吋 80 元', code: 'B' },
          { optionName: '3 吋 120 元', code: 'C' },
          { optionName: '4 吋 160 元', code: 'D' },
        ],
      },
      {
        questionId: 4,
        title:
          '您希望以後新增哪些零食品項？',
        type: 'M',
        necessary: false,
        options: [
          { optionName: '巧克力餅乾', code: 'A' },
          { optionName: '蔓越莓乾', code: 'B' },
          { optionName: '布丁', code: 'C' },
          { optionName: '洋芋片', code: 'D' },
        ],
      },
      {
        questionId: 5,
        title: '是否同意提交後不可修改？',
        type: 'S', // 單選
        necessary: true, // 非必填
        options: [{ optionName: '同意', code: 'A' }],
      },
    ],
  };

  // survey = {
  //   name: '《三體》書籍讀者問卷調查',
  //   description:
  //     '您好！這是一份針對《三體》已讀讀者的問卷，旨在了解讀者對書中內容及科學概念的深入看法。請花幾分鐘時間填寫問卷，感謝您的參與！',
  //   startDate: '2024/11/19',
  //   endDate: '2025/01/19',
  //   questionArray: [
  //     {
  //       questionId: 1,
  //       title: '《三體》中的「面壁計劃」是什麼？',
  //       type: 'S', // 單選
  //       necessary: true, // 必填
  //       options: [
  //         { optionName: '一個保護地球免受外星入侵的計劃', code: 'A' },
  //         { optionName: '一個探索外太空的新計劃', code: 'B' },
  //         { optionName: '一個解決地球能源危機的計劃', code: 'C' },
  //         { optionName: '一個與外星文明進行外交的計劃', code: 'D' },
  //       ],
  //     },
  //     {
  //       questionId: 2,
  //       title: '您認為《三體》中最能體現人性弱點的情節有哪些？',
  //       type: 'M', // 多選
  //       necessary: false, // 非必填
  //       options: [
  //         { optionName: '紅岸工程的秘密', code: 'A' },
  //         { optionName: '「歌者」對地球的攻擊', code: 'B' },
  //         { optionName: '面壁者的背叛', code: 'C' },
  //         { optionName: '黑暗森林法則的應用', code: 'D' },
  //       ],
  //     },
  //     {
  //       questionId: 3,
  //       title: '請簡述您對黑暗森林理論的理解。',
  //       type: 'T', // 簡答
  //       necessary: true, // 必填
  //       options: [],
  //     },
  //     {
  //       questionId: 4,
  //       title: '在《三體》中，您認為哪個角色最具代表性，為什麼？',
  //       type: 'M', // 多選
  //       necessary: false, // 非必填
  //       options: [
  //         { optionName: '羅輯', code: 'A' },
  //         { optionName: '葉文潔', code: 'B' },
  //         { optionName: '汪淼', code: 'C' },
  //         { optionName: '章北海', code: 'D' },
  //       ],
  //     },
  //     {
  //       questionId: 5,
  //       title: '您對《三體》中的三體文明有什麼看法或建議？請簡述。',
  //       type: 'T', // 簡答
  //       necessary: false, // 非必填
  //       options: [],
  //     },
  //   ],
  // };
}
