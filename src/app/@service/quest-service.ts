import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  questData!: any;
  questStatus!: string;
}
