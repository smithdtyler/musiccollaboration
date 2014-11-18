/**
   Music Collaboration
   Copyright (C) 2014  Tyler Smith
 
   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

//Define constants which pertain to the data model and its serialization.
//XML Constants
var xmlConstants = {};

//Song XML constants
xmlConstants.SONG_XML = "song";
xmlConstants.SONG_ID_XML = "id";
xmlConstants.SONG_NAME_XML = "name";
xmlConstants.SONG_KEY_XML = "key";
xmlConstants.SONG_TEMPO_XML = "tempo";

//Time Signature XML constants
xmlConstants.TIME_SIGNATURE_XML = "time_signature";
xmlConstants.TIME_SIGNATURE_ID_XML = "id";
xmlConstants.TIME_SIGNATURE_NUMERATOR_XML = "numerator";
xmlConstants.TIME_SIGNATURE_DENOMINATOR_XML = "denominator";

//Note XML constants
xmlConstants.NOTE_XML = "note";
xmlConstants.NOTE_ID_XML = "id";
xmlConstants.NOTE_PITCH_XML = "pitch";
xmlConstants.NOTE_INDEX_XML = "index";
xmlConstants.NOTE_DURATION_XML = "duration";

//Key Constants
var keyConstants = {};
keyConstants.A_FLAT_KEY = "A_FLAT";
keyConstants.A_KEY = "A";
keyConstants.B_FLAT_KEY = "B_FLAT";
keyConstants.B_KEY = "B";
keyConstants.C_KEY = "C";
keyConstants.C_SHARP_KEY = "C_SHARP";
keyConstants.D_FLAT_KEY = "D_FLAT";
keyConstants.D_KEY = "D";
keyConstants.E_FLAT_KEY = "E_FLAT";
keyConstants.E_KEY = "E";
keyConstants.F_KEY = "F";
keyConstants.F_SHARP_KEY = "F_SHARP";
keyConstants.G_FLAT_KEY = "G_FLAT";
keyConstants.G_KEY = "G";

var keys = [];
//Sharp Keys
keys[keys.length] = keyConstants.C_KEY;
keys[keys.length] = keyConstants.G_KEY;
keys[keys.length] = keyConstants.D_KEY;
keys[keys.length] = keyConstants.A_KEY;
keys[keys.length] = keyConstants.E_KEY;
keys[keys.length] = keyConstants.B_KEY;
//keys[keys.length] = keyConstants.F_SHARP_KEY; // Consider implementing later
//keys[keys.length] = keyConstants.C_SHARP_KEY; // Consider implementing later
//Flat keys
keys[keys.length] = keyConstants.F_KEY;
keys[keys.length] = keyConstants.B_FLAT_KEY;
keys[keys.length] = keyConstants.E_FLAT_KEY;
keys[keys.length] = keyConstants.A_FLAT_KEY;
keys[keys.length] = keyConstants.D_FLAT_KEY;
//keys[keys.length] = keyConstants.G_FLAT_KEY; // Consider implementing later

var tempos = [];
tempos[0] = 80;
tempos[1] = 90;
tempos[2] = 100;
tempos[3] = 110;
tempos[4] = 120;
tempos[5] = 130;
tempos[6] = 140;
tempos[7] = 150;

//Duration Constants
var durConstants = {};
durConstants.WHOLE_DUR = 64;
durConstants.HALF_DUR = 32;
durConstants.QUARTER_DUR = 16;
durConstants.EIGHTH_DUR = 8;
durConstants.SIXTEENTH_DUR = 4;
durConstants.THIRTYSECOND_DUR = 2;

//Duration list to allow iterating through durations
var durations = [];
durations[0] = durConstants.WHOLE_DUR;
durations[1] = durConstants.HALF_DUR;
durations[2] = durConstants.QUARTER_DUR;
durations[3] = durConstants.EIGHTH_DUR;
durations[4] = durConstants.SIXTEENTH_DUR;
durations[5] = durConstants.THIRTYSECOND_DUR;

//The frequency of the middle C pitch
var MIDDLE_C_FREQUENCY = 261.626;

/**
 * Get the frequency of a given pitch using the twelve tone equal temperament interval scheme.
 * http://en.wikipedia.org/wiki/Equal_temperament
 * @param pitch
 * @returns {Number}
 */
function pitchToFrequency(pitch){
  // renaming this for clarity only
  // pitch already represents the number of steps from middle c
  var steps = pitch;
  return MIDDLE_C_FREQUENCY * (Math.pow(2, steps / 12));
}

/**
 * Returns true if <code>key</code> is a key where accidentals are displayed as sharps.
 * @param key
 * @returns {Boolean}
 */
function isSharpKey(key){
  if(key == keyConstants.C_KEY ||
      key == keyConstants.G_KEY ||
      key == keyConstants.D_KEY ||
      key == keyConstants.A_KEY || 
      key == keyConstants.E_KEY ||
      key == keyConstants.B_KEY ||
      key == keyConstants.F_SHARP_KEY ||
      key == keyConstants.C_SHARP_KEY){
    return true;
  }
  return false;
}

/**
 * A time signature handles the value of a beat (the denominator) and the number
 * of beats in a measure (the numerator).
 * 
 * @returns {TimeSignature}
 */
function TimeSignature() {
  this.id = -1;
  this.numerator = -1;
  this.denominator = -1;
}

TimeSignature.prototype.parseXML = function(xmlSong) {
  xmlTS = xmlSong.getElementsByTagName(xmlConstants.TIME_SIGNATURE_XML)[0];
  this.id = parseInt(xmlTS.getAttribute(xmlConstants.TIME_SIGNATURE_ID_XML));
  this.numerator = parseInt(xmlTS
      .getAttribute(xmlConstants.TIME_SIGNATURE_NUMERATOR_XML));
  this.denominator = parseInt(xmlTS
      .getAttribute(xmlConstants.TIME_SIGNATURE_DENOMINATOR_XML));
};

TimeSignature.prototype.toXMLElement = function(xmlDoc) {
  var elm = xmlDoc.createElement(xmlConstants.TIME_SIGNATURE_XML);
  if (this.id != -1) {
    elm.setAttribute(xmlConstants.TIME_SIGNATURE_ID_XML, this.id);
  }
  elm.setAttribute(xmlConstants.TIME_SIGNATURE_NUMERATOR_XML, this.numerator);
  elm.setAttribute(xmlConstants.TIME_SIGNATURE_DENOMINATOR_XML,
      this.denominator);
  return elm;
};

/**
 * A note handles its location within the song, its duration (in 16ths of a
 * beat), and its pitch (an arbitrary enumeration).
 * 
 * @returns {Note}
 */
function Note() {
  this.id = -1;
  this.index = -1;
  this.duration = durConstants.WHOLE_DUR; // just setting a default
  this.pitch = -1;
  this.isNote = true;
}
Note.prototype.parseXML = function(xmlNote) {
  this.id = parseInt(xmlNote.getAttribute(xmlConstants.NOTE_ID_XML));
  this.index = parseInt(xmlNote.getAttribute(xmlConstants.NOTE_INDEX_XML));
  this.duration = parseInt(xmlNote.getAttribute(xmlConstants.NOTE_DURATION_XML));
  this.pitch = parseInt(xmlNote
      .getAttribute(xmlConstants.NOTE_PITCH_XML));
};

Note.prototype.toXMLElement = function(xmlDoc) {
  var elm = xmlDoc.createElement(xmlConstants.NOTE_XML);
  if (this.id != -1) {
    elm.setAttribute(xmlConstants.NOTE_ID_XML, this.id);
  }
  elm.setAttribute(xmlConstants.NOTE_DURATION_XML, this.duration);
  elm.setAttribute(xmlConstants.NOTE_PITCH_XML, this.pitch);
  elm.setAttribute(xmlConstants.NOTE_INDEX_XML, this.index);
  return elm;
};

Note.prototype.indexMeasure = function(){
  return Math.floor(this.index / durConstants.WHOLE_DUR);
};

Note.prototype.indexBeat = function(){
  return Math.floor(this.index / durConstants.QUARTER_DUR);
};

/**
 * @returns {Rest}
 */
function Rest(){
  this.index = -1;
  this.duration = durConstants.WHOLE_DUR;
  this.isRest = true;
}

/**
 * This marker indicates where the end of the song lies.
 * @returns {EndOfSong}
 */
function EndOfSong(){
  this.index = -1;
  this.isEndOfSong = true;
}

// TODO expand this to allow multiple voices
function PlaybackSegment(frequency, amplitude, duration){
  this.frequency = frequency;
  this.amplitude = amplitude;
  this.duration = duration;
}

/**
 * A Stores a collection of indexedContent, as well as a tempo, time signature, and other
 * information.
 * 
 * @returns {Song}
 */
function Song() {
  this.id = -1;
  this.name = 'Song Name';
  this.key = keyConstants.C_KEY;
  this.tempo = 100;
  this.timesignature = new TimeSignature();
  this.indexedContent = new Array();
}

Song.prototype.parseXML = function(xmlDoc) {
  var xmlSong = xmlDoc.getElementsByTagName(xmlConstants.SONG_XML)[0];
  this.id = xmlSong.getAttribute(xmlConstants.SONG_ID_XML);
  this.key = xmlSong.getAttribute(xmlConstants.SONG_KEY_XML);
  this.tempo = parseInt(xmlSong.getAttribute(xmlConstants.SONG_TEMPO_XML));
  this.name = xmlSong.getAttribute(xmlConstants.SONG_NAME_XML);
  this.timesignature.parseXML(xmlSong);
  var xmlNotes = xmlSong.getElementsByTagName(xmlConstants.NOTE_XML);
  for (var i = 0; i < xmlNotes.length; i++) {
    note = new Note();
    note.parseXML(xmlNotes[i]);
    note.song = this;
    this.indexedContent[i] = note;
  }
};

Song.prototype.toXMLElement = function(xmlDoc) {
  var elm = xmlDoc.createElement(xmlConstants.SONG_XML);
  if (this.id != -1) {
    elm.setAttribute(xmlConstants.SONG_ID_XML, this.id);
  }
  elm.setAttribute(xmlConstants.SONG_NAME_XML, this.name);
  elm.setAttribute(xmlConstants.SONG_TEMPO_XML, this.tempo);
  elm.setAttribute(xmlConstants.SONG_KEY_XML, this.key);
  var timeSignatureElm = this.timesignature.toXMLElement(xmlDoc);
  elm.appendChild(timeSignatureElm);
  for ( var i = 0; i < this.indexedContent.length; i++) {
    if(this.indexedContent[i].isNote){
      var noteElm = this.indexedContent[i].toXMLElement(xmlDoc);
      elm.appendChild(noteElm);
    }
  }
  return elm;
};

//Make an XML string from this song
Song.prototype.toXMLString = function() {
  if (document.implementation.createDocument
      && document.implementation.createDocumentType) {
    // TODO understand this better - this is a hack.
    // The xmlDoc has an extra wrapper around everything, which breaks the
    // consistency between the client and server implementations.
    var xmlDoc = document.implementation.createDocument();
    var songNode = this.toXMLElement(xmlDoc);
    xmlDoc.documentElement.appendChild(songNode);

    var serializer = new XMLSerializer();
    // To avoid sending the annoying xml wrapper bit, just send the node we
    // care about.
    return serializer.serializeToString(songNode);
  }
};

//Using a simple insertion sort
Song.prototype.sortIndexedContent = function(){
  for(var i = 1;i<this.indexedContent.length;i++){
    var value = this.indexedContent[i];
    var j = i-1;
    var done = false;
    while(!done){
      if(this.indexedContent[j].index > value.index){
        this.indexedContent[j+1] = this.indexedContent[j];
        j = j-1;
        if(j < 0){
          done = true;
        }
      } else {
        done = true;
      }
    }
    this.indexedContent[j + 1] = value;
  }
};

/**
 * This only supports one note at a time
 */
Song.prototype.prepPlaybackArray = function(){
  this.playbackSegmentArray = [];
  var currentIndex = 0;
  for(var i = 0;i<this.indexedContent.length; i++){
    if(this.indexedContent[i].isNote){
      var note = this.indexedContent[i];
      if(note.index < 0){
        continue;
      }
      if(note.index > currentIndex){
        // Add silence (frequency of zero is implicitly silent)
        this.playbackSegmentArray[this.playbackSegmentArray.length] = new PlaybackSegment(0, 0, note.index - currentIndex);
      }
      this.playbackSegmentArray[this.playbackSegmentArray.length] = new PlaybackSegment(pitchToFrequency(scaleToKey(note.pitch, this.key)), 1, note.duration);
      currentIndex = note.index + note.duration;
    }
  }
  
};

function createXMLDocument() {

}

/**
 * Adds or subtracts a value based on the key to render the song properly.
 * </br></br>
 * When stored on the server, all frequencies are relative to middle C.
 * When the key is not C, the frequencies must be translated to a value
 * relative to the key.
 * 
 * @param pitch relative to C
 * @param key
 * @returns
 */
function scaleToKey(pitch, key) {
  if (key == keyConstants.C_KEY) {
    return pitch;
  } else if (key == keyConstants.C_SHARP_KEY || key == keyConstants.D_FLAT_KEY) {
    return pitch + 1;
  } else if (key == keyConstants.D_KEY) {
    return pitch + 2;
  } else if (key == keyConstants.D_SHARP_KEY || key == keyConstants.E_FLAT_KEY) {
    return pitch + 3;
  } else if (key == keyConstants.E_KEY) {
    return pitch + 4;
  } else if (key == keyConstants.F_KEY) {
    return pitch + 5;
  } else if (key == keyConstants.F_SHARP_KEY || key == keyConstants.G_FLAT_KEY) {
    return pitch + 6;
  } else if (key == keyConstants.G_KEY) {
    return pitch - 5;
  } else if (key == keyConstants.G_SHARP_KEY || key == keyConstants.A_FLAT_KEY) {
    return pitch - 4;
  } else if (key == keyConstants.A_KEY) {
    return pitch - 3;
  } else if (key == keyConstants.A_SHARP_KEY || key == keyConstants.B_FLAT_KEY) {
    return pitch - 2;
  } else if (key == keyConstants.B_KEY) {
    return pitch - 1;
  } else {
    // error case, should never happen
    alert('invalid pitch found');
    return 0;
  }
}

/**
 * Adds or subtracts a value based on the key to return the pitch in the key of C.
 * </br></br>
 * Notes are stored on the server with a pitch relative to C. Before a note can be saved,
 * it must be translated back to its C relative value.
 * 
 * @param pitch relative to key
 * @param key the key
 * @returns the pitch shifted to C
 */
function scaleFromKey(pitch, key) {
  if (key == keyConstants.C_KEY) {
    return pitch;
  } else if (key == keyConstants.C_SHARP_KEY || key == keyConstants.D_FLAT_KEY) {
    return pitch - 1;
  } else if (key == keyConstants.D_KEY) {
    return pitch - 2;
  } else if (key == keyConstants.D_SHARP_KEY || key == keyConstants.E_FLAT_KEY) {
    return pitch - 3;
  } else if (key == keyConstants.E_KEY) {
    return pitch - 4;
  } else if (key == keyConstants.F_KEY) {
    return pitch - 5;
  } else if (key == keyConstants.F_SHARP_KEY || key == keyConstants.G_FLAT_KEY) {
    return pitch - 6;
  } else if (key == keyConstants.G_KEY) {
    return pitch + 5;
  } else if (key == keyConstants.G_SHARP_KEY || key == keyConstants.A_FLAT_KEY) {
    return pitch + 4;
  } else if (key == keyConstants.A_KEY) {
    return pitch + 3;
  } else if (key == keyConstants.A_SHARP_KEY || key == keyConstants.B_FLAT_KEY) {
    return pitch + 2;
  } else if (key == keyConstants.B_KEY) {
    return pitch + 1;
  } else {
    // error case, should never happen
    alert('invalid pitch found');
    return 0;
  }
}