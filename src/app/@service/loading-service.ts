import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  // 第一行表示 _loading$ 是可訂閱的(自定義false)
  // _ 的意思 : 通用的命名寫法，僅在此類別內部使用
  // $ 的意思 : 標記為 Observable
  private _loading$ = new BehaviorSubject<boolean>(false);

  // 第二行 宣告新變數 loading$
  // 目的：抓取 _loading$ 的內容，並且讓使用者去抓去內容 ( loading$ 不能修改值)
  loading$ = this._loading$.asObservable();

  constructor(){}

  // 將 _loading$ 中的值去做修改(注意自己宣告的內容屬性)
  // 當我們需要修改值時，就要去觸發 LoadingService 中的這兩個方法之一
  show(){
    this._loading$.next(true);
  }
  // this._loading$.next(true);：這行程式碼將 _loading$ 的值更新為 true，表示開始載入。
  // 當 loading$ 被訂閱時，所有訂閱這個 Observable 的元件或服務都會收到載入狀態的變更通知。
  // 當載入狀態設為 true 時，可以讓畫面顯示載入指示器，讓使用者知道系統正在處理。

  hide(){
    this._loading$.next(false);
  }
  // 這行程式碼將 _loading$ 的值更新為 false，表示載入完成或不在進行載入。
  // 同樣地，這會通知所有訂閱 loading$ 的元件或服務，使它們可以隱藏載入指示器。

}
