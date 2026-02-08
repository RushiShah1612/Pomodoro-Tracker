export function playBeep() {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  // Settings for a pleasant beep sound
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // 800 Hz
  
  // Fade out to prevent clicking
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.5);
}
