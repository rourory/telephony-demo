import { SoundTypeEnum } from '../../../@types/enums';

// Audio playing
const bufferLatency = 0.3;
const audioContext = new AudioContext();
const audioGainNode = audioContext.createGain();
const speechGainNode = audioContext.createGain();
let nextAudioStartTime = 0;
let nextSpeechStartTime = 0;

export const playAudio = async (
  arrayBuffer: ArrayBuffer,
  soundType: number,
) => {
  if (soundType == Number.parseInt(SoundTypeEnum.SILENCE)) {
    restoreAudioStartTime();
  } else {
    if (arrayBuffer.byteLength > 0)
      audioContext.decodeAudioData(
        arrayBuffer,
        (decoded) => {
          if (soundType == Number.parseInt(SoundTypeEnum.AUDIO_TYPE)) {
            addChunkToAudioDataQueue(decoded);
          } else if (soundType == Number.parseInt(SoundTypeEnum.SPEECH_TYPE)) {
            addChunkToSpeechDataQueue(decoded);
          }
        },

        (err) => console.log(err),
      );
  }
};

// Sound from sound card
const addChunkToAudioDataQueue = (buffer: AudioBuffer) => {
  if (nextAudioStartTime == 0) {
    //before playing first chunk we should define "bufferedLatency" because of network latency
    nextAudioStartTime = audioContext.currentTime + bufferLatency;
  }
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  audioGainNode.gain.setValueAtTime(1, nextAudioStartTime);
  source.connect(audioGainNode);
  audioGainNode.connect(audioContext.destination);
  source.start(nextAudioStartTime);
  // Ensure the next chunk will start at the right time
  nextAudioStartTime += buffer.duration;
};

export const restoreAudioStartTime = () => {
  nextAudioStartTime = 0;
};

// Sound from microphone
const addChunkToSpeechDataQueue = (buffer: AudioBuffer) => {
  if (nextSpeechStartTime == 0) {
    //before playing first chunk we should define "bufferedLatency" because of network latency
    nextSpeechStartTime = audioContext.currentTime + bufferLatency;
  }
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  speechGainNode.gain.setValueAtTime(2, nextSpeechStartTime);
  source.connect(speechGainNode);
  speechGainNode.connect(audioContext.destination);
  source.start(nextSpeechStartTime);
  // Ensure the next chunk will start at the right time
  nextSpeechStartTime += buffer.duration;
};

export const restoreSpeechStartTime = () => {
  nextSpeechStartTime = 0;
};

// Microphone recording
export const recMic = (ipAddress: string) => {
  window.electron.ipcRenderer.sendMessage('audio.recording', {
    ipAddress: ipAddress,
    rec: true,
  });
};

export const stopRec = (ipAddress: string) => {
  window.electron.ipcRenderer.sendMessage('audio.recording', {
    ipAddress: ipAddress,
    rec: false,
  });
};
