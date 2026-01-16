import {
  ElMessage,
  ElMessageBox,
  ElMessageBoxOptions,
  ElNotification,
  MessageOptions,
  NotificationOptions,
} from "element-plus";


/** MessageBox */
export function messageBox(opt: ElMessageBoxOptions) {
  opt.type = opt.type ?? "success";
  opt.closeOnClickModal = opt.closeOnClickModal ?? false;
  opt.showCancelButton = opt.showCancelButton ?? false;
  opt.cancelButtonText = opt.cancelButtonText ?? "取消";
  opt.confirmButtonText = opt.confirmButtonText ?? "确认";
  opt.center = opt.center ?? true;
  opt.autofocus = true;
  ElMessageBox(opt);
}

/** Message */
export function toast(opt: MessageOptions) {
  opt.type = opt.type ?? "success";
  opt.duration = opt.duration ?? 5000;
  ElMessage(opt);
}

export function msgerror(text: string) {
  const opt:MessageOptions = {}
  opt.type = "error";
  opt.message = text;
  opt.duration = 5000;
  ElMessage(opt);
}

/** Notification 默认显示5s */
export function notify(
  opt: Partial<NotificationOptions> & {
    title: string;
    message: string;
    time: number;
  }
) {
  // TODO: time是通知时间
  ElNotification({
    ...opt,
    type: opt.type ?? "success",
    duration: opt.duration ?? 15000,
  });
}
