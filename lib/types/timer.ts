export interface TimerState {
  isRunning: boolean
  timeRemaining: number // in seconds
  totalDuration: number // in seconds
  label: string
  soundEnabled: boolean
  vibrationEnabled: boolean
}

export interface TimerConfig {
  breakDuration: number // in seconds
  soundEnabled: boolean
  vibrationEnabled: boolean
  autoStart: boolean
}
