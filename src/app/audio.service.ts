import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private _audioElement!: HTMLAudioElement;

  private _isPlaying$ = new BehaviorSubject<boolean>(false);
  readonly isPlaying$ = this._isPlaying$.asObservable();
  public isActYt: boolean = false;

  private _isEnabled = false; // 🔹 indica si la música de fondo está activada
  constructor(private ngZone: NgZone) { }

  registerAudioElement(audio: HTMLAudioElement) {
    this._audioElement = audio;
    this._audioElement.onended = () => {
      this._isPlaying$.next(false);
    };
  }

  // El usuario activa o desactiva la música de fondo
  setUserEnabled(enabled: boolean) {
    this._isEnabled = enabled;
    if (!enabled) {
      this.pause(); // si desactiva, pausa
      this._audioElement.pause();
      this._audioElement.removeEventListener('ended', this.onAudioEnded);
      this._audioElement = undefined!;
      this._isPlaying$.next(false);
    }
  }

  private onAudioEnded = () => {
    this._isPlaying$.next(false);
  };

  play() {
    if (!this._audioElement && !this._isEnabled) return; // solo si está activo
    this._audioElement.play();
    this._isPlaying$.next(true);
    this.ngZone.run(() => this._isPlaying$.next(true));

  }



  ytisActi() {
    this.isActYt = !this.isActYt;
  }

  pause() {
    if (!this._audioElement && !this._isEnabled) return;
    this._audioElement.pause();
    this.ngZone.run(() => this._isPlaying$.next(false));
  }

  // audio.service.ts
  setVolume(level: number) {
    if (this._audioElement) {
      this._audioElement.volume = Math.min(1, Math.max(0, level));
    }
  }


  toggle() {
    if (!this._audioElement) return;
    if (this._audioElement.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
}