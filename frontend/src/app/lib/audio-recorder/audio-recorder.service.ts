import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Copied from https://github.com/killroywashere/ng-audio-recorder due to installation incompatibilities. Some improvements were made.

@Injectable()
export class AudioRecorderService {

  private chunks: Array<any> = [];
  protected recorderEnded = new EventEmitter<Blob>();
  public recorderError = new EventEmitter<ErrorCase>();
  private _recorderState = RecorderState.STOPPED;
  private recorderState$ = new BehaviorSubject<RecorderState>(this._recorderState);
  private recorder: MediaRecorder | null = null

  constructor() {
  }

  private static guc(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({audio: true});
  }

  public getUserConsent(): Promise<MediaStream> {
    return AudioRecorderService.guc();
  }

  public async start(): Promise<void> {
    if (this._recorderState === RecorderState.RECORDING) {
      this.recorderError.emit(ErrorCase.ALREADY_RECORDING);
    }
    if (this._recorderState === RecorderState.PAUSED) {
      this.resume();
      return;
    }
    this.setRecorderState(RecorderState.WAITING_FOR_USER_CONSENT)
    const mediaStream = await AudioRecorderService.guc().catch(error => {
      this.recorderError.emit(ErrorCase.USER_CONSENT_FAILED);
      this.setRecorderState(RecorderState.STOPPED);
      throw error
    });
    this.setRecorderState(RecorderState.INITIALIZING)
    this.recorder = new MediaRecorder(mediaStream);
    this.setRecorderState(RecorderState.INITIALIZED)
    this.addListeners();
    this.recorder.start();
    this.setRecorderState(RecorderState.RECORDING);
  }

  public pause(): void {
    if (this._recorderState === RecorderState.RECORDING) {
      this.recorder?.pause();
      this.setRecorderState(RecorderState.PAUSED);
    }
  }

  public resume() {
    if (this._recorderState === RecorderState.PAUSED) {
      this.setRecorderState(RecorderState.RECORDING);
      this.recorder?.resume();
    }
  }

  public stop(outputFormat: OutputFormat): Promise<string | void | Blob> {
    this.setRecorderState(RecorderState.STOPPING);
    return new Promise<Blob | string>((resolve, reject) => {
      this.recorderEnded.subscribe((blob) => {
        if (outputFormat === OutputFormat.WEBM_BLOB) {
          resolve(blob);
        } else if (outputFormat === OutputFormat.WEBM_BLOB_URL) {
          const audioURL = URL.createObjectURL(blob);
          resolve(audioURL);
        } else {
          reject(ErrorCase.INVALID_OUTPUT_FORMAT)
        }
        this.setRecorderState(RecorderState.STOPPED);
      }, _ => {
        this.recorderError.emit(ErrorCase.RECORDER_TIMEOUT);
        reject(ErrorCase.RECORDER_TIMEOUT);
      });
      this.recorder?.stop();
    }).catch(() => {
      this.recorderError.emit(ErrorCase.USER_CONSENT_FAILED);
    });
  }

  public cancel(): Promise<void> {
    this.setRecorderState(RecorderState.STOPPING);
    return new Promise<void>((resolve, reject) => {
      this.recorderEnded.subscribe(() => {
        resolve()
        this.setRecorderState(RecorderState.STOPPED);
      }, _ => {
        this.recorderError.emit(ErrorCase.RECORDER_TIMEOUT);
        reject(ErrorCase.RECORDER_TIMEOUT);
      });
      this.recorder?.stop();
    }).catch(() => {
      this.recorderError.emit(ErrorCase.USER_CONSENT_FAILED);
    });
  }

  public getRecorderState(): Observable<RecorderState> {
    return this.recorderState$.asObservable();
  }

  private setRecorderState(state: RecorderState): void {
    this._recorderState = state;
    this.recorderState$.next(state);
  }

  private addListeners(): void {
    this.recorder!.ondataavailable = this.appendToChunks;
    this.recorder!.onstop = this.recordingStopped;
  }

  private appendToChunks = (event: any): void => {
    this.chunks.push(event.data);
  };

  private recordingStopped = (event: any): void => {
    const blob = new Blob(this.chunks, {type: 'audio/webm'});
    this.chunks = [];
    this.recorderEnded.emit(blob);
    this.clear();
  };

  private clear(): void {
    this.recorder = null;
    this.chunks = [];
  }
}


export enum OutputFormat {
  WEBM_BLOB_URL,
  WEBM_BLOB,
}

export enum ErrorCase {
  USER_CONSENT_FAILED,
  RECORDER_TIMEOUT,
  ALREADY_RECORDING,
  INVALID_OUTPUT_FORMAT
}

export enum RecorderState {
  INITIALIZING = 'initizaling',
  INITIALIZED = 'initialized',
  RECORDING = 'recording',
  PAUSED = 'paused',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  WAITING_FOR_USER_CONSENT = 'waitingForUserConsent',
}