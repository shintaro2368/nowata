import { atom } from "jotai";
import { WideTask } from "./lib/definitions";

// 出勤しているかの状態
export const attendanceAtom = atom(false);

// タスク情報一覧
export const taskInfosAtom = atom<WideTask[]>([]);

// タスクの入力画面を表示しているか（させるか）の状態
export const displayTaskFormAtom = atom(false);

// 編集するタスクの初期値の状態
export const editTaskAtom = atom<WideTask | null>(null);
