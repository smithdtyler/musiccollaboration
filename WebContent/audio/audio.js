var dev;
var osc;
var segmentCount = 0;
var leadNoteLength = 0;
var tempo = 120;
var notesPerBeat = 4;
var sampleRate;
var lead;

function playSong(){
  // Reassign state variables
  segmentCount = 0;
  leadNoteLength = 0;
  tempo = 120;
  notesPerBeat = 4;
  
  // Only create a new Device and Oscillator if
  // they haven't already been created.
  // Having two at once causes havok
  if(dev == null){
    var channelCount = 2;
    // Create an instance of the AudioDevice class
    dev = audioLib.AudioDevice(audioCallback, channelCount);
  }

  if(lead == null){
    sampleRate = dev.sampleRate;
    // Create an instance of the Oscillator class
    lead = audioLib.Oscillator(sampleRate, 440);  
  }

}

/**
 * Callback for buffer fills
 */
function audioCallback(buffer, channelCount) {
  var l = buffer.length, sample, note, n, current;

  // loop through each sample in the buffer 
  for (current = 0; current < l; current += channelCount) {

    if (leadNoteLength == 0){
      loadSegment();
    }

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

function loadSegment() {
  // Reset oscillator
  lead.frequency = 0;
  lead.reset();

  console.log("Loading segment " + segmentCount);
  if(segmentCount >= song.playbackSegmentArray.length){
    return;
  }
  var segment = song.playbackSegmentArray[segmentCount];


  // Set oscillator frequency
  // TODO scale according to the key
  lead.frequency = segment.frequency;

  // Calculate note length in samples
  leadNoteLength = Math
      .floor((segment.duration/durConstants.WHOLE_DUR) * sampleRate * 60 * notesPerBeat / tempo);

  segmentCount += 1;

  // Restart song when end is reached
//  if (segmentCount >= song.indexedContent.length){
//    segmentCount = 0;
//  }
};
