var dev, osc;

var simpleSong = [ {
  freq : 440, // A4
  dur : 1 / 4
}, {
  freq : 329.63, // E4
  dur : 1 / 4
}, {
  freq : 440, // A4
  dur : 1 / 4
}, {
  freq : 440, // A4
  dur : 1 / 4
} ];
var theme = simpleSong, noteCount = 0, noteTotal = theme.length, leadNoteLength = 0, tempo = 120, notesPerBeat = 4, dev, sampleRate, lead;

function loadNote() {
  var note = theme[noteCount];

  // Reset oscillator
  lead.frequency = 0;
  lead.reset();

  // Set oscillator frequency
  lead.frequency = note.freq;

  // Calculate note length in samples
  leadNoteLength = Math
      .floor(note.dur * sampleRate * 60 * notesPerBeat / tempo);

  noteCount += 1;

  // Restart song when end is reached
  if (noteCount >= theme.length)
    noteCount = 0;
};

function audioCallback(buffer, channelCount) {
  var l = buffer.length, sample, note, n, current;

  // loop through each sample in the buffer 
  for (current = 0; current < l; current += channelCount) {

    if (leadNoteLength == 0)
      loadNote();

    sample = 0;

    // Generate oscillator
    lead.generate();

    // Get oscillator mix and multiply by .5 to reduce amplitude
    sample = lead.getMix() * 0.5;

    // Fill buffer for each channel
    for (n = 0; n < channelCount; n++) {
      buffer[current + n] = sample;
    }

    leadNoteLength -= 1;
  }
};

function playTone() {
  // Create an instance of the AudioDevice class
  dev = audioLib
      .AudioDevice(audioCallback /* callback for the buffer fills */, 2 /* channelCount */);

  sampleRate = dev.sampleRate;

  // Create an instance of the Oscillator class
  lead = audioLib.Oscillator(sampleRate, 440);
}