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

function mouseDown(e, myState){
  // Not sure if we actually want to do anything here.
}

function mouseMove(e, myState){
  var mouse = myState.getMouse(e);
  var x = mouse.x - myState.dragoffx;
  var y = mouse.y - myState.dragoffy;
  if (myState.dragging) {
    myState.selection.x = x;
    myState.selection.y = y;
    // If the cursor is dragged over the pallet and a we have an active selected note, change the pallet
    // draw method to indicate that the note will be cleared when dropped on the pallet.
    if(myState.notePallet.contains(x, y)){
      myState.notePallet.drawMode = palletConstants.DROP;
    } else {
      myState.notePallet.drawMode = palletConstants.NORMAL;
    }

    if(myState.annotationPallet.contains(x, y)){
      myState.annotationPallet.drawMode = palletConstants.DROP;
    } else {
      myState.annotationPallet.drawMode = palletConstants.NORMAL;
    }
    myState.valid = false;
  }

  var changed = false;
  var staff = null;

  // If the mouse is over a note, highlight that note to show what note will be picked up,
  // or if we're dropping an annotation, which note the annotation will be applied to.
  for(var i = 0;i<myState.staffs.length;i++){
    var curStaff = myState.staffs[i];
    if(curStaff.contains(x, y)){
      staff = curStaff;
      break;
    }
  }

  if(staff != null){
    for(var i = 0;i<staff.displayedIndexedContent.length;i++){
      var curIndexedContent = staff.displayedIndexedContent[i];
      if(curIndexedContent.contains(x, y) && curIndexedContent.content.isNote){
        if(curIndexedContent.drawMode == indexedContentConstants.NORMAL){
          curIndexedContent.drawMode = indexedContentConstants.HIGHLIGHT;
          changed = true;
        }
      } else if(curIndexedContent.drawMode == indexedContentConstants.HIGHLIGHT){
        curIndexedContent.drawMode = indexedContentConstants.NORMAL;
        changed = true;
      }
    }
  }
  if(changed){
    myState.valid = false;    
  }
}

function mouseUp(e, myState){
  var mouse = myState.getMouse(e);
  mousex = mouse.x - myState.dragoffx;
  mousey = mouse.y - myState.dragoffy;

  // Are we currently dropping notes?
  if(myState.selection != null){
    var staff = null;
    // Figure out which staff we were dropped on
    for(var i = 0;i<myState.staffs.length;i++){
      if(myState.staffs[i].contains(mousex, mousey)){
        staff = myState.staffs[i];
        break;
      }// end if contains
    }// end staff loop

    // snap to staff lines
    while (mousey % 5 < 3 && mousey % 5 != 0) {
      mousey--;
    }
    while (mousey % 5 >= 3 && mousey % 5 != 0) {
      mousey++;
    }

    // snap to horizontal alignment
    if(staff != null){
      while ((mousex - staff.startx) % staff.unitWidth < Math.floor(staff.unitWidth/2) && (mousex - staff.startx) % staff.unitWidth != 0) {
        mousex--;
      }
      while ((mousex - staff.startx) % staff.unitWidth >= Math.floor(staff.unitWidth/2) && (mousex - staff.startx) % staff.unitWidth != 0) {
        mousex++;
      }
    }

    // TODO need a better way to check what kind of thing we're dropping
    if (myState.selection) {
      console.log("Dropping a item...");
      myState.selection.y = mousey;
      myState.selection.x = mousex;

      // Was this dropped on the note pallet to be deleted?
      if(myState.notePallet.contains(mousex, mousey)){
        myState.notePallet.drawMode = palletConstants.NORMAL;        
        if(myState.selection.content){
          myState.selection.content.index = -1;          
        }
        myState.selection = null;
        myState.dragging = false;
        // Was this dropped on the annotation pallet to be deleted?
      } else if(myState.annotationPallet.contains(mousex, mousey)){
        myState.annotationPallet.drawMode = palletConstants.NORMAL;        
        if(myState.selection.content){
          myState.selection.content.index = -1;          
        }
        myState.selection = null;
        myState.dragging = false;
        // Is this a note?
      } else if(staff != null){
        // Are we dropping a note?
        if(myState.selection.content){
          // Get the displayed line
          lineOffset = ((-1 * (mousey - staff.ytop)) + 75) / 5;
          // Translate the line to a pitch
          noteBasePitch = getPitch(lineOffset, note.song.key);
          // Scale to C for storage
          storedPitch = scaleFromKey(noteBasePitch, note.song.key);
          myState.selection.content.pitch = storedPitch;

          // Figure out where to put the note in the song
          myState.selection.content.index = staff.startIndex; // Default to the first item in the staff
          for (var i = 0; i < staff.displayedIndexedContent.length; i++) {
            referenceIndexedContent = staff.displayedIndexedContent[i];
            if(mousex == referenceIndexedContent.x){
              myState.selection.content.index = referenceIndexedContent.content.index;
            } else if(mousex > referenceIndexedContent.x && myState.selection.content.index < referenceIndexedContent.content.index + referenceIndexedContent.content.duration){
              if(referenceIndexedContent.content.isNote){
                // Make sure this note won't take us into the next measure - if it will, bump up the index
                var currentMeasure = Math.floor((referenceIndexedContent.content.index + referenceIndexedContent.content.duration)/ durConstants.WHOLE_DUR);
                var placementMeasure = Math.floor((referenceIndexedContent.content.index + referenceIndexedContent.content.duration + myState.selection.content.duration -1)/ durConstants.WHOLE_DUR);
                if(currentMeasure < placementMeasure){
                  myState.selection.content.index = placementMeasure * durConstants.WHOLE_DUR;
                } else {
                  myState.selection.content.index = referenceIndexedContent.content.index + referenceIndexedContent.content.duration;
                }
              } else {
                // It's a rest
                // TODO if we're placed after the rest and we're smaller than the rest, cut down the rest by our size and put us after it
                // If we're in the same region as this rest, replace the rest with this note
                if(mousex > referenceIndexedContent.x - (referenceIndexedContent.preSpacingScalar * staff.unitWidth) && mousex < referenceIndexedContent.x + (referenceIndexedContent.postSpacingScalar * staff.unitWidth)){
                  myState.selection.content.index = referenceIndexedContent.content.index;
                } else {
                  // We're not in the same region, put us after this rest
                  myState.selection.content.index = referenceIndexedContent.content.index + referenceIndexedContent.content.duration;
                }
              }
            }
          }
          var newNote = new Note();
          newNote.duration = myState.selection.content.duration;
          newNote.song = song;
          myState.selection = noteGraphicFactory(mousex, mousey, newNote, -1); // Make the selection null so it's not drawn again after setting it down
          song.indexedContent[song.indexedContent.length] = myState.selection.content;
        } else if(myState.selection.type == annotationConstants.SHARP || myState.selection.type == annotationConstants.FLAT || myState.selection.type == annotationConstants.NATURAL){
          // See if we dropped it on something
          for(var i = 0;i<myState.staffs.length;i++){
            var staff = myState.staffs[i];
            if(staff.contains(mousex,mousey)){
              for(var j = 0;j < staff.displayedIndexedContent.length;j++){
                if (staff.displayedIndexedContent[j].content.isNote && staff.displayedIndexedContent[j].contains(mousex, mousey)) {
                  if(myState.selection.type == annotationConstants.SHARP){
                    staff.displayedIndexedContent[j].content.pitch = staff.displayedIndexedContent[j].content.pitch + 1;                    
                  } else if(myState.selection.type == annotationConstants.FLAT){
                    staff.displayedIndexedContent[j].content.pitch = staff.displayedIndexedContent[j].content.pitch - 1;                    
                  }
                  layoutNotes(song.indexedContent, myState);
                  myState.valid = false;
                  return;
                }
              }
            }
          }
        }
      }
      if(song){
        song.sortIndexedContent();
        layoutNotes(song.indexedContent, myState);        
      }
    }
    myState.valid = false;
  } else {
    // Check if we are selecting something
    // did we pick one of the notes in the song?
    console.log("Checking to see if we've picked something up...");
    for(var i = 0;i<myState.staffs.length;i++){
      var staff = myState.staffs[i];
      if(staff.contains(mousex,mousey)){
        for(var j = 0;j < staff.displayedIndexedContent.length;j++){
          if (staff.displayedIndexedContent[j].content.isNote && staff.displayedIndexedContent[j].contains(mousex, mousey)) {
            var mySel = staff.displayedIndexedContent[j];
            // Make the selected note as "deleted" until it is placed back in the song
            // This allows us to re-layout the song without the note to allow clean drag and drop
            mySel.content.index = -1;
            // keep track of where in the object we clicked
            // so that we can move it slowly
            myState.dragoffx = mousex - mySel.x;
            myState.dragoffy = mousey - mySel.y;
            myState.dragging = true;
            myState.selection = mySel;

            // Re-layout the song so that if the note is dropped back where it came from, we can
            // detect the drop properly
            song.sortIndexedContent();
            layoutNotes(song.indexedContent, myState);
            myState.valid = false;
            return;
          }
        }
      }
    }

    // did we pick one of the notes in the note pallet?
    for (var j = myState.notePallet.displayedContent.length - 1; j >= 0; j--) {
      if (myState.notePallet.displayedContent[j].contains(mousex, mousey)) {
        var mySel = myState.notePallet.displayedContent[j];
        // keep track of where in the object we clicked
        // so that we can move it slowly
        myState.dragoffx = mousex - mySel.x;
        myState.dragoffy = mousey - mySel.y;
        myState.dragging = true;
        note = new Note();
        note.duration = mySel.type;
        note.song = song;
        myState.selection = noteGraphicFactory(mySel.x, mySel.y, note, -1);
        if (myState.selection.content && song) {
          // Add the note to the indexed content so that it's displayed
          // TODO add a non-indexed content display list
          song.indexedContent[song.indexedContent.length] = myState.selection.content;
        }
        myState.valid = false;
        return;
      }
    }

    // did we pick one of the notes in the note pallet?
    for ( var j = myState.annotationPallet.displayedContent.length - 1; j >= 0; j--) {
      if (myState.annotationPallet.displayedContent[j].contains(mousex, mousey)) {
        var mySel = myState.annotationPallet.displayedContent[j];
        // keep track of where in the object we clicked
        // so that we can move it slowly
        myState.dragoffx = mousex - mySel.x;
        myState.dragoffy = mousey - mySel.y;
        myState.dragging = true;

        myState.selection = annotationGraphicFactory(mySel.x, mySel.y, mySel.type);
        myState.valid = false;
        return;
      }
    }

    if (myState.selection) {
      myState.selection = null;
      myState.valid = false;
    }
  }


}

/**
 * For the time being, this function assumes that the notes in the list are in order. Several things need to happen:
 * <ol>
 * <li> We need to trigger this function whenever a new note is added to a song.
 * <li> We need to adapt it to detect invalid circumstances and adjust the song accordingly.
 * <li> We need to automatically re-sort the notes when necessary, based on insertions or deletions.
 * </ol>http://localhost:8080/MusicCollaboration/
 * @param indexedContent
 * @param key
 */
function layoutNotes(indexedContent, myState){
  console.log("Laying out song...");
  myState.staffs = [];
  myState.staffs[myState.staffs.length] = new Staff(0,50,staffConstants.WIDTH,staffConstants.HEIGHT,150,staffConstants.WIDTH, myState.key);

  var currentIndex = 0; // Starting time of one or more indexedContent
  var currentPlayhead = 0; // As we're going through the list, this represents the max index+duration of a note or rest
  var currentMeasure = 0; // As we go through the list, this represents the measure we're currently drawing
  var currentStaff = 0; // As we go through the list, this represents the staff we're drawing on

  for (var i = 0; i < indexedContent.length; i++) {
    // Skip deleted indexedContent
    if(indexedContent[i].index < 0){
      continue;
    }
    // Check if we need to add rests here before adding this note
    difference = indexedContent[i].index - currentPlayhead;
    restsToAdd = [];
    while(difference > 0){
      var restDuration = 0;
      for(var j=0;j<durations.length;j++){
        restDuration = durations[j];
        // For each kind of rest, check if that rest fits in the gap
        if(Math.floor(difference/restDuration) >= 1){
          difference -= restDuration;
          rest = new Rest();
          rest.duration = restDuration;
          restsToAdd[restsToAdd.length] = rest;
          break; // Need to start the loop over after assigning each rest.
        } // end if
      }
    }
    
    // Put the rests in in opposite order, since we want the smallest rests first
    for(var j=restsToAdd.length -1;j>=0;j--){
      var rest = restsToAdd[j];
      rest.index = currentPlayhead;
      currentIndex = currentPlayhead;
      currentPlayhead = rest.index + rest.duration;
      currentMeasure = Math.floor(currentIndex / durConstants.WHOLE_DUR);
      currentStaff = Math.floor(currentMeasure / MEASURES_PER_LINE);
      if(!myState.staffs[currentStaff]){
        myState.staffs[currentStaff] = new Staff(0,myState.staffs[currentStaff-1].ytop + staffConstants.HEIGHT,staffConstants.WIDTH,myState.staffs[currentStaff-1].ybottom + staffConstants.HEIGHT,60,staffConstants.WIDTH, myState.key);
      }
      myState.staffs[currentStaff].addIndexedContent(rest);
    }

    // Skip the end of song marker
    if(indexedContent[i].isEndOfSong){
      break;
    }

    // Update the current index, only change the x position if we're on a new time index.
    if(indexedContent[i].index !== currentIndex){
      currentIndex = indexedContent[i].index;
    }

    // Update the current playhead
    if(indexedContent[i].index + indexedContent[i].duration > currentPlayhead){
      currentPlayhead = indexedContent[i].index + indexedContent[i].duration;
    }

    // Have we walked past the end of the staff?
    currentMeasure = Math.floor(indexedContent[i].index / durConstants.WHOLE_DUR);
    currentStaff = Math.floor(currentMeasure / MEASURES_PER_LINE);
    if(!myState.staffs[currentStaff]){
      myState.staffs[currentStaff] = new Staff(0,myState.staffs[currentStaff-1].ytop + staffConstants.HEIGHT,staffConstants.WIDTH,myState.staffs[currentStaff-1].ybottom + staffConstants.HEIGHT,60,staffConstants.WIDTH, myState.key);
    }

    // Add the note display object
    myState.staffs[currentStaff].addIndexedContent(indexedContent[i]);
  }
  for(var i = 0;i< myState.staffs.length;i++){
    myState.staffs[i].layoutIndexedContent();
  }
  myState.valid = false;
}

/**
 * Manages information about the HTML5 canvas. It maintains a list of items
 * which need to be drawn with every refresh. It also defines the draw()
 * function.
 * 
 * @param canvas
 * @returns {CanvasManager}
 */
function CanvasManager(canvas) {
  console.log("Initializing canvas manager");
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.valid = false;
  // Right now I'm keeping the displayed notes and stored notes separate.
  // Stored notes are kept in a 'song' and displayed notes are stored in this
  // list.
  this.staffs = [];
  this.dragging = false;
  this.selection = null;
  this.dragoffx = 0;
  this.dragoffy = 0;
  // just creating a default time signature
  this.timesignature = new TimeSignature();
  this.key = keyConstants.C_KEY;

  this.notePallet = new Pallet(700, 60, 800, 115);
  this.notePallet.addDisplayedContent(new WholeNoteGraphic());
  this.notePallet.addDisplayedContent(new HalfNoteGraphic());
  this.notePallet.addDisplayedContent(new QuarterNoteGraphic());
  this.notePallet.addDisplayedContent(new EighthNoteGraphic());
  this.notePallet.addDisplayedContent(new SixteenthNoteGraphic());
  this.notePallet.addDisplayedContent(new ThirtySecondNoteGraphic());
  this.notePallet.layoutDisplayedContent();

  this.annotationPallet = new Pallet(700, 135, 800, 155);
  this.annotationPallet.addDisplayedContent(new SharpAccidentalGraphic());
  this.annotationPallet.addDisplayedContent(new FlatAccidentalGraphic());
  this.annotationPallet.layoutDisplayedContent(145);

  var myState = this;
  canvas.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
  }, false);

  // TODO add logic for handling invalid drops (e.g. can't have a half note and whole note in the same measure in 4/4)
  canvas.addEventListener('mousedown', function(e) {
    mouseDown(e, myState);
  }, true);

  canvas.addEventListener('mousemove', function(e) {
    mouseMove(e, myState);
  }, true);

  canvas.addEventListener('mouseup',function(e) {
    mouseUp(e, myState);
  }, true);

  // TODO the tutorial I followed warned about some bug with a mouse double
  // click. It has a way to avoid the bug, we should probably do it.
  // canvas.addEventListener('dblclick', function(e){
  // var mouse = myState.getMouse(e);
  // myState.add
  // })
  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;

  this.layoutNotes = function(notes) {
    layoutNotes(notes, myState);
  };

  this.interval = 30;
  // this must be a global method to force regular events?
  setInterval(function() {
    myState.draw();
  }, myState.interval);
}

CanvasManager.prototype.draw = function() {
  if (!this.valid) {
    var ctx = this.ctx;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the notePallet
    this.notePallet.draw(ctx);
    // Draw the annotationPallet
    this.annotationPallet.draw(ctx);

    // Draw the staffs and notes
    for(var i = 0; i< this.staffs.length;i++){
      this.staffs[i].draw(ctx);
    }

    ctx.font = "15pt Arial";
//  ctx.fillText(this.timesignature.numerator, 35, 43); // TODO fill in correctly
//  ctx.fillText(this.timesignature.denominator, 35, 63); // TODO fill in correctly.
    ctx.fillText("4", 85, 93);
    ctx.fillText("4", 85, 113);

    // draw selection
    if (this.selection != null) {
      this.selection.draw(ctx);
    }

    this.valid = true;
  }
};

function Cell(x, y) {
  this.x = x;
  this.y = y;
}

CanvasManager.prototype.getMouse = function(e) {
  var canvas = document.getElementById("canvas");
  if (!canvas.getContext) {
    return;
  }

  var x;
  var y;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft
    + document.documentElement.scrollLeft;
    y = e.clientY = document.body.scrollTop
    + document.documentElement.scrollTop;
  }
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  var cell = new Cell(x, y);
  return cell;
};