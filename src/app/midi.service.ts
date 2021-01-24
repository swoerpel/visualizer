import { Injectable } from '@angular/core';
import { Midi } from '@tonejs/midi';
import { from, Observable } from 'rxjs';
import { share, shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MidiService {

  constructor() {
  }

  public loadMidi(): Observable<any>{
    return from(Midi.fromUrl("../assets/001.mid")).pipe(share())
  }

  // public async loadMidi(){
  //   // load a midi file in the browser
  //   const midi = await Midi.fromUrl("../assets/001.mid")
  //   //the file name decoded from the first track
  //   const name = midi.name
  //   //get the tracks
  //   midi.tracks.forEach(track => {
  //     console.log("track",track)
  //     //tracks have notes and controlChanges

  //     //notes are an array
  //     const notes = track.notes
  //     notes.forEach(note => {
  //       //note.midi, note.time, note.duration, note.name
  //     })

  //     //the control changes are an object
  //     //the keys are the CC number
  //     // track.controlChanges[64]
  //     //they are also aliased to the CC number's common name (if it has one)
  //     // track.controlChanges.sustain.forEach(cc => {
  //       // cc.ticks, cc.value, cc.time
  //     // })

  //     //the track also has a channel and instrument
  //     //track.instrument.name
  //   })
  // }
}
