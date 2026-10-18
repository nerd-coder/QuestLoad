interface Navigator {
  readonly usb: USB
}

interface USB {
  addEventListener(type: 'disconnect', listener: (event: Event) => void): void
  removeEventListener(
    type: 'disconnect',
    listener: (event: Event) => void
  ): void
}
