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
      // 無資料的話會使用以下方法紀錄答案
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

  // 以下「資料傳遞」參考老師，先翻成中文，再寫程式碼

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
      alert('✍️ 請填寫個人資訊');
      return false;
    }

    if (!phoneRge.test(this.userPhone)) {
      alert('⚠️ 手機格式不正確，須為 09 開頭且總共 10 碼');
      return false;
    }

    if (this.userEmail && !emailReg.test(this.userEmail)) {
      alert('⚠️ 信箱格式不正確');
      return false;
    }

    // 2. 問題選項 (用迴圈遍歷每個問題)
    for (let survey of this.newQuestionArray) {
      // 3. 如果是必填
      if (survey.necessary) {
        // 3-1. 簡答 (answer)
        if (survey.type === 'T' && !survey.answer) {
          alert('✍️ 請確認簡答題必填皆有填寫');
          return false;
        }
        // 3-2. 單選 (radioAnswer)
        if (survey.type === 'S' && !survey.radioAnswer) {
          alert('✍️ 請確認單選題必填皆有填寫');
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
            alert('✍️ 請確認多選題必填皆有填寫');
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
    name: '《三體》書籍讀者問卷調查',
    description:
      '您好！非常感謝您抽出寶貴的時間來參與這份專門針對《三體》這本書的讀者問卷調查。我們希望能夠通過這份問卷，深入了解您對書中內容及科學概念的見解與看法，無論是對情節設計、角色刻畫，還是對其中探討的科學理論和哲學思考。我們珍視您的每一個意見，這將有助於我們更好地理解讀者的需求和期望。請您花幾分鐘時間完成問卷，再次感謝您的熱心參與與支持！希望您在回答問卷的過程中也能回顧起閱讀《三體》時的美好經歷和深刻思索。',
    startDate: '2024/11/19',
    endDate: '2025/01/19',
    questionArray: [
      {
        questionId: 1,
        title: '《三體》中的「面壁計劃」是什麼？',
        type: 'S', // 單選
        necessary: true, // 必填
        options: [
          { optionName: '一個保護地球免受外星入侵的計劃', code: 'A' },
          { optionName: '一個探索外太空的新計劃', code: 'B' },
          { optionName: '一個解決地球能源危機的計劃', code: 'C' },
          { optionName: '一個與外星文明進行外交的計劃', code: 'D' },
        ],
      },
      {
        questionId: 2,
        title: '您認為《三體》中最能體現人性弱點的情節有哪些？',
        type: 'M', // 多選
        necessary: false,
        options: [
          { optionName: '紅岸工程的秘密', code: 'A' },
          { optionName: '「歌者」對地球的攻擊', code: 'B' },
          { optionName: '面壁者的背叛', code: 'C' },
          { optionName: '黑暗森林法則的應用', code: 'D' },
        ],
      },
      {
        questionId: 3,
        title: '請簡述您對黑暗森林理論的理解。',
        type: 'T', // 簡答
        necessary: false,
        options: [],
      },
      {
        questionId: 4,
        title: '本問卷將會作為圖書館研究調查使用',
        type: 'S',
        necessary: true,
        options: [{ optionName: '我同意', code: 'A' }],
      },
    ],
  };
}
