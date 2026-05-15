interface SnapCallbacks {
  onSuccess?: (result: object) => void;
  onPending?: (result: object) => void;
  onError?: (result: object) => void;
  onClose?: () => void;
}

interface MidtransSnap {
  pay: (snapToken: string, callbacks?: SnapCallbacks) => void;
  hide: () => void;
  show: () => void;
}

interface Window {
  snap: MidtransSnap;
}
