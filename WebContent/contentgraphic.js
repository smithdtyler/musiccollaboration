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

/**
 * <p>
 * ContentGraphic stores properties common to graphics displaying song content.
 * </p>
 * <p>
 * ContentGraphic should not be called directly.
 * </p> 
 * @param x
 * @param y
 * @param content
 * @returns {ContentGraphic}
 */

var DEFAULT_STEM_HEIGHT = 35;

function ContentGraphic(x,y,content){
  this.x = x;
  this.y = y;
  this.drawMode = indexedContentConstants.NORMAL;
  
  this.annotations = [];
  this.annotationGraphics = [];
  
  if(content){
    this.content = content;
  }
}

/**
 * At the moment this is a shared method for all graphics.
 * This probably will need to be adapted, since eventually they won't all be the same size.
 * @param mx
 * @param my
 * @returns {Boolean}
 */
ContentGraphic.prototype.contains = function(mx,my){
  if(this.x -mx > -6 && this.x -mx < 6 && this.y - my > -6 && this.y - my < 6){
    return true;
  }
  return false;
};

/**
 * Add an annotation to this graphic, ignoring it if has already been added
 * @param annotation
 */
ContentGraphic.prototype.addAnnotation = function(annotation){
  for(var i = 0;i<this.annotations.length;i++){
    // If we already have this annotation, just return
    if(this.annotations[i] == annotation){
     return; 
    }
  }
  // If we got to here, we're adding a new annotation!
  // Note: The location of the annotation isn't set here, it's set during the layout
  this.annotations[this.annotations.length] = annotation;
  this.annotationGraphics[this.annotationGraphics.length] = annotationGraphicFactory(0, 0, annotation);
};

/*********************** Whole Note ContentGraphic **************************/
//Whole note display class
function WholeNoteGraphic(x,y, note){
  ContentGraphic.call(this,x,y,note);

  this.preSpacingScalar = 1;
  this.postSpacingScalar = 3;
  this.type=durConstants.WHOLE_DUR;
}

// Connect WholeNoteGraphic with its parent type
extend(WholeNoteGraphic, ContentGraphic);

WholeNoteGraphic.prototype.draw = function(ctx, staff) {
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';

  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0,2*Math.PI, false);
  ctx.stroke();
  ctx.stroke();

  drawAnnotations(this,ctx);

  // If necessary, draw bar line(s) below the staff
  drawExtendedStaffBelow(this, ctx, staff);
  
  // If we're highlighted, draw the highlight box
  drawHighlight(this, ctx);
};

/********************** Whole Rest Graphic **********************/
function WholeRestGraphic(x,y, rest){
  ContentGraphic.call(this,x,y,rest);

  this.type=durConstants.WHOLE_DUR;
  this.preSpacingScalar = 2;
  this.postSpacingScalar = 2;
}

//Connect WholeRestGraphic with its parent type
extend(WholeRestGraphic, ContentGraphic);

WholeRestGraphic.prototype.draw = function(ctx){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.fillRect(this.x - 4, this.y, 8, 4);
};

/********************** Half Rest Graphic **********************/
function HalfRestGraphic(x,y, rest){
  ContentGraphic.call(this,x,y,rest);
  
  this.type=durConstants.HALF_DUR;
  this.preSpacingScalar = 1;
  this.postSpacingScalar = 1;
}

//Connect HalfRestGraphic with its parent type
extend(HalfRestGraphic, ContentGraphic);

HalfRestGraphic.prototype.draw = function(ctx){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.fillRect(this.x - 4, this.y - 4, 8, 4);
};

/********************** Half Note Graphic **********************/
function HalfNoteGraphic(x,y, note){
  ContentGraphic.call(this,x,y,note);

  this.type=durConstants.HALF_DUR;
  this.preSpacingScalar = 1;
  this.postSpacingScalar = 1;
}

//Connect HalfNoteGraphic with its parent type
extend(HalfNoteGraphic, ContentGraphic);

HalfNoteGraphic.prototype.draw = function(ctx, staff) {
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  // Draw circle
  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0,2*Math.PI, false);
  ctx.stroke();
  ctx.stroke();

  // Draw Line
  ctx.beginPath();
  ctx.moveTo(this.x+4,this.y);
  ctx.lineTo(this.x+4,this.y-DEFAULT_STEM_HEIGHT);
  ctx.stroke();
  ctx.stroke();

  drawAnnotations(this,ctx);

  // If necessary, draw bar line(s) below the staff
  drawExtendedStaffBelow(this, ctx, staff);
  
  // If we're highlighted, draw the highlight box
  drawHighlight(this, ctx);
};

/********************** Quarter Note Graphic **********************/
function QuarterNoteGraphic(x,y, note){
  ContentGraphic.call(this,x,y,note);

  this.type=durConstants.QUARTER_DUR;
  this.preSpacingScalar = 1;
  this.postSpacingScalar = 1;
}

//Connect QuarterNoteGraphic with its parent type
extend(QuarterNoteGraphic, ContentGraphic);

QuarterNoteGraphic.prototype.draw = function(ctx, staff){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';

  // Draw circle
  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0,2*Math.PI, false);
  ctx.fill();
  // Draw Line
  ctx.beginPath();
  ctx.moveTo(this.x+4,this.y);
  ctx.lineTo(this.x+4,this.y-DEFAULT_STEM_HEIGHT);
  ctx.stroke();
  ctx.stroke();
  
  drawAnnotations(this, ctx);

  // If necessary, draw bar line(s) below the staff
  drawExtendedStaffBelow(this, ctx, staff);
  
  // If we're highlighted, draw the highlight box
  drawHighlight(this, ctx);
};

/********************** Quarter Rest Graphic **********************/
function QuarterRestGraphic(x,y, rest){
  ContentGraphic.call(this,x,y,rest);
  
  this.type=durConstants.QUARTER_DUR;
  this.preSpacingScalar = 1;
  this.postSpacingScalar = 1;
}

//Connect QuarterRestGraphic with its parent type
extend(QuarterRestGraphic, ContentGraphic);

QuarterRestGraphic.prototype.draw = function(ctx){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  // context.arc(centerX, centerY, radius, startingAngle, endingAngle, counterclockwise);
  // Circle goes clockwise, with 0 at right hand edge.
  ctx.arc(this.x + (1.5 * staffConstants.LINEGAP), this.y, (staffConstants.LINEGAP), (.75*Math.PI), (1.25*Math.PI), false);
  ctx.arc(this.x - (.75*staffConstants.LINEGAP), this.y - (.75 * staffConstants.LINEGAP), (staffConstants.LINEGAP), (1.75*Math.PI), Math.PI/4, false);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(this.x + (.3 * staffConstants.LINEGAP), this.y + (.8*staffConstants.LINEGAP), (.4* staffConstants.LINEGAP), (.6*Math.PI), (1.7*Math.PI), false);
  ctx.arc(this.x + (.5 * staffConstants.LINEGAP), this.y + (staffConstants.LINEGAP), (.4* staffConstants.LINEGAP), (1.7*Math.PI),(.6*Math.PI), true);
  ctx.closePath();
  ctx.fill();
};

/********************** Eighth Note Graphic **********************/
function EighthNoteGraphic(x,y, note){
  ContentGraphic.call(this,x,y,note);

  this.type=durConstants.EIGHTH_DUR;
  this.preSpacingScalar = 1;
  this.postSpacingScalar = 1;
  this.inBeamAssociationGraphic = false;
}

//Connect EighthNoteGraphic with its parent type
extend(EighthNoteGraphic, ContentGraphic);

EighthNoteGraphic.prototype.draw = function(ctx, staff){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  // Draw circle
  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0,2*Math.PI, false);
  ctx.fill();

  drawAnnotations(this,ctx);

  // If necessary, draw bar line(s) below the staff
  drawExtendedStaffBelow(this, ctx, staff);
  
  // If we're highlighted, draw the highlight box
  drawHighlight(this, ctx);
  
  if(!this.inBeamAssociationGraphic){
    this.drawStem(ctx, DEFAULT_STEM_HEIGHT);
    this.drawFlags(ctx, DEFAULT_STEM_HEIGHT);
  }
};

EighthNoteGraphic.prototype.drawStem = function(ctx, height){
  ctx.beginPath();
  ctx.moveTo(this.x+4,this.y);
  ctx.lineTo(this.x+4,this.y-height);
  ctx.stroke();
  ctx.stroke();
};

EighthNoteGraphic.prototype.drawFlags = function(ctx, height){
  ctx.beginPath();
  ctx.moveTo(this.x+4, this.y-height);
  ctx.lineTo(this.x+9, this.y-height);
  ctx.lineTo(this.x+9, this.y-(height -2));
  ctx.lineTo(this.x+4, this.y-(height -2));
  ctx.closePath();
  ctx.fill();
};

/********************** Eighth Rest Graphic **********************/
function EighthRestGraphic(x,y, rest){
  ContentGraphic.call(this,x,y,rest);
  
  this.type=durConstants.EIGHTH_DUR;
  this.preSpacingScalar = 1;
  this.postSpacingScalar = 1;
}

//Connect EighthRestGraphic with its parent type
extend(EighthRestGraphic, ContentGraphic);

EighthRestGraphic.prototype.draw = function(ctx){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(this.x - (.5*staffConstants.LINEGAP), this.y + (.5*staffConstants.LINEGAP));
  ctx.lineTo(this.x + (.5*staffConstants.LINEGAP), this.y - (.5*staffConstants.LINEGAP));
  ctx.arc(this.x, this.y - (1.5*staffConstants.LINEGAP), staffConstants.LINEGAP, (.25*Math.PI), (.75*Math.PI), false);
  ctx.stroke();
};

/********************** Sixteenth Note Graphic **********************/
function SixteenthNoteGraphic(x,y, note){
  ContentGraphic.call(this,x,y,note);

  this.type=durConstants.SIXTEENTH_DUR;
  this.preSpacingScalar = 1;
  this.postSpacingScalar = 1;
  this.inBeamAssociationGraphic = false;
}

//Connect SixteenthNoteGraphic with its parent type
extend(SixteenthNoteGraphic, ContentGraphic);

SixteenthNoteGraphic.prototype.draw = function(ctx, staff){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  // Draw circle
  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0,2*Math.PI, false);
  ctx.fill();

  drawAnnotations(this,ctx);

  // If necessary, draw bar line(s) below the staff
  drawExtendedStaffBelow(this, ctx, staff);
  
  // If we're highlighted, draw the highlight box
  drawHighlight(this, ctx);
  
  if(!this.inBeamAssociationGraphic){
    this.drawStem(ctx, DEFAULT_STEM_HEIGHT);
    this.drawFlags(ctx, DEFAULT_STEM_HEIGHT);
  }
};

SixteenthNoteGraphic.prototype.drawStem = function(ctx, height){
  ctx.beginPath();
  ctx.moveTo(this.x+4,this.y);
  ctx.lineTo(this.x+4,this.y-height);
  ctx.stroke();
  ctx.stroke();
};

SixteenthNoteGraphic.prototype.drawFlags = function(ctx, height){
  // Draw two black bars to indicate sixteenth notes
  ctx.beginPath();
  ctx.moveTo(this.x+4, this.y-height);
  ctx.lineTo(this.x+9, this.y-height);
  ctx.lineTo(this.x+9, this.y-(height -2));
  ctx.lineTo(this.x+4, this.y-(height -2));
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(this.x+4, this.y-(height -4));
  ctx.lineTo(this.x+9, this.y-(height -4));
  ctx.lineTo(this.x+9, this.y-(height -6));
  ctx.lineTo(this.x+4, this.y-(height -6));
  ctx.closePath();
  ctx.fill(); 
};

/********************** Sixteenth Rest Graphic **********************/
function SixteenthRestGraphic(x,y, rest){
  ContentGraphic.call(this,x,y,rest);
  
  this.type=durConstants.SIXTEENTH_DUR;
  this.preSpacingScalar = 1;
  this.postSpacingScalar = 1;
}

//Connect SixteenthRestGraphic with its parent type
extend(SixteenthRestGraphic, ContentGraphic);

SixteenthRestGraphic.prototype.draw = function(ctx){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(this.x - (.5*staffConstants.LINEGAP), this.y + (.5*staffConstants.LINEGAP));
  ctx.lineTo(this.x + (.5*staffConstants.LINEGAP), this.y - (.5*staffConstants.LINEGAP));
  ctx.arc(this.x, this.y - (1.5*staffConstants.LINEGAP), staffConstants.LINEGAP, (.25*Math.PI), (.75*Math.PI), false);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(this.x + (.5*staffConstants.LINEGAP), this.y - (.5*staffConstants.LINEGAP));
  ctx.lineTo(this.x + (staffConstants.LINEGAP), this.y - (staffConstants.LINEGAP));
  ctx.arc(this.x, this.y - (2*staffConstants.LINEGAP), staffConstants.LINEGAP, (.25*Math.PI), (.75*Math.PI), false);
  ctx.stroke();
};

/********************** ThirtySecond Note Graphic **********************/
function ThirtySecondNoteGraphic(x,y, note){
  ContentGraphic.call(this,x,y,note);

  this.type=durConstants.THIRTYSECOND_DUR;
  this.preSpacingScalar = 1;
  this.postSpacingScalar = 1;
  this.inBeamAssociationGraphic = false;
}

//Connect ThirtySecondNoteGraphic with its parent type
extend(ThirtySecondNoteGraphic, ContentGraphic);

ThirtySecondNoteGraphic.prototype.draw = function(ctx, staff){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  // Draw circle
  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0,2*Math.PI, false);
  ctx.fill();

  drawAnnotations(this,ctx);

  // If necessary, draw bar line(s) below the staff
  drawExtendedStaffBelow(this, ctx, staff);
  
  // If we're highlighted, draw the highlight box
  drawHighlight(this, ctx);
  
  if(!this.inBeamAssociationGraphic){
    this.drawStem(ctx, DEFAULT_STEM_HEIGHT);
    this.drawFlags(ctx, DEFAULT_STEM_HEIGHT);
  }
};

ThirtySecondNoteGraphic.prototype.drawStem = function(ctx, height){
  ctx.beginPath();
  ctx.moveTo(this.x+4,this.y);
  ctx.lineTo(this.x+4,this.y-height);
  ctx.stroke();
  ctx.stroke();
};

ThirtySecondNoteGraphic.prototype.drawFlags = function(ctx, height){
  // Draw two black bars to indicate sixteenth notes
  ctx.beginPath();
  ctx.moveTo(this.x+4, this.y-height);
  ctx.lineTo(this.x+9, this.y-height);
  ctx.lineTo(this.x+9, this.y-(height -2));
  ctx.lineTo(this.x+4, this.y-(height -2));
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(this.x+4, this.y-(height -4));
  ctx.lineTo(this.x+9, this.y-(height -4));
  ctx.lineTo(this.x+9, this.y-(height -6));
  ctx.lineTo(this.x+4, this.y-(height -6));
  ctx.closePath();
  ctx.fill(); 

  ctx.beginPath();
  ctx.moveTo(this.x+4, this.y-(height -8));
  ctx.lineTo(this.x+9, this.y-(height -8));
  ctx.lineTo(this.x+9, this.y-(height -10));
  ctx.lineTo(this.x+4, this.y-(height -10));
  ctx.closePath();
  ctx.fill();
};

/********************** ThirtySecond Rest Graphic **********************/
function ThirtySecondRestGraphic(x,y, rest){
  ContentGraphic.call(this,x,y,rest);
  
  this.type=durConstants.THIRTYSECOND_DUR;
  this.preSpacingScalar = 1;
  this.postSpacingScalar = 1;
}

//Connect ThirtySecondNoteGraphic with its parent type
extend(ThirtySecondRestGraphic, ContentGraphic);

ThirtySecondRestGraphic.prototype.draw = function(ctx){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(this.x - (.5*staffConstants.LINEGAP), this.y + (.5*staffConstants.LINEGAP));
  ctx.lineTo(this.x + (.5*staffConstants.LINEGAP), this.y - (.5*staffConstants.LINEGAP));
  ctx.arc(this.x, this.y - (1.5*staffConstants.LINEGAP), staffConstants.LINEGAP, (.25*Math.PI), (.75*Math.PI), false);

  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(this.x + (.5*staffConstants.LINEGAP), this.y - (.5*staffConstants.LINEGAP));
  ctx.lineTo(this.x + (staffConstants.LINEGAP), this.y - (staffConstants.LINEGAP));
  ctx.arc(this.x + (.3*staffConstants.LINEGAP), this.y - (2*staffConstants.LINEGAP), staffConstants.LINEGAP, (.25*Math.PI), (.75*Math.PI), false);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(this.x + (staffConstants.LINEGAP), this.y - (staffConstants.LINEGAP));
  ctx.lineTo(this.x + (1.5*staffConstants.LINEGAP), this.y - (1.5*staffConstants.LINEGAP));
  ctx.arc(this.x + (.5*staffConstants.LINEGAP), this.y - (2.5*staffConstants.LINEGAP), staffConstants.LINEGAP, (.25*Math.PI), (.75*Math.PI), false);
  ctx.stroke();
};

/********************** Sharp Accidental Graphic **********************/
function SharpAccidentalGraphic(x,y){
  ContentGraphic.call(this,x,y);
  this.type=annotationConstants.SHARP;
}

//Connect SharpAccidentalGraphic with its parent type
extend(SharpAccidentalGraphic, ContentGraphic);

SharpAccidentalGraphic.prototype.draw = function(ctx){
  ctx.font = "10pt Arial";
  ctx.fillText("#", this.x, this.y + 5);
};

/********************** Flat Accidental Graphic **********************/
function FlatAccidentalGraphic(x,y){
  ContentGraphic.call(this,this.x,this.y);
  this.type=annotationConstants.FLAT;
}

//Connect FlatAccidentalGraphic with its parent type
extend(FlatAccidentalGraphic, ContentGraphic);

FlatAccidentalGraphic.prototype.draw = function(ctx){
  ctx.font = "10pt Arial";
  ctx.fillText("b", this.x, this.y + 5);
};

/********************** Natural Accidental Graphic **********************/
function NaturalAccidentalGraphic(x,y){
  ContentGraphic.call(this,this.x,this.y);
  this.type=annotationConstants.NATURAL;
}

//Connect NaturalAccidentalGraphic with its parent type
extend(NaturalAccidentalGraphic, ContentGraphic);

NaturalAccidentalGraphic.prototype.draw = function(ctx){
  ctx.font = "10pt Arial";
  ctx.beginPath();
  ctx.moveTo(this.x, this.y - 8);
  ctx.lineTo(this.x, this.y + 4);
  ctx.lineTo(this.x + 4, this.y);
  ctx.lineTo(this.x + 4, this.y + 6);
  ctx.lineTo(this.x + 4, this.y - 6);
  ctx.lineTo(this.x, this.y - 2);
  ctx.stroke();
};

/////////////////////////////////////////////////
/////////////// Factories ///////////////////////
// Often we'll have a duration and want to make a graphic
// for it without a big switch statement to decide which graphic.
// Use these factories to get graphics without
// having to select which kind you need.
////////////////////////////////////////////////

/**
 * Get a note graphic for the provided note.
 * If stafftopy is >=0, the note will be scaled to the correct
 * position on the staff for its pitch.
 * 
 * @param x Horizontal location of the note
 * @param y Vertical location of the note. If stafftopy is >= 0, y will be overriden.
 * @param note The note to display. Note that if it is being added to a staff, the note's song must be defined.
 * @param stafftopy The top y value for the parent staff. To ignore pitch translation (i.e. place the note at x,y), use -1 for stafftopy.
 * @returns A NoteGraphic
 */
function noteGraphicFactory(x,y,note, stafftopy){
  graphic = {};
  switch(note.duration){
  case durConstants.WHOLE_DUR:
    graphic = new WholeNoteGraphic(x,y,note);
    break;
  case durConstants.HALF_DUR:
    graphic = new HalfNoteGraphic(x,y, note);
    break;
  case durConstants.QUARTER_DUR:
    graphic = new QuarterNoteGraphic(x,y,note);
    break;
  case durConstants.EIGHTH_DUR:
    graphic = new EighthNoteGraphic(x,y,note);
    break;
  case durConstants.SIXTEENTH_DUR:
    graphic = new SixteenthNoteGraphic(x,y,note);
    break;
  case durConstants.THIRTYSECOND_DUR:
    graphic = new ThirtySecondNoteGraphic(x,y,note);
    break;
  }

  // If we're adding the note to a staff
  if(stafftopy >= 0){
    // Scale the note for display on the correct line
    noteBasePitch = scaleToKey(note.pitch, note.song.key);
    // TODO this actually sets the accidental on the graphic,
    // make this clearer
    noteLineOffset = getLineOffset(noteBasePitch, note.song.key, graphic);
    y = staffConstants.MIDDLE_C_OFFSET - (staffConstants.SCALAR * noteLineOffset);
    graphic.y = stafftopy + y;    
  }
  
  return graphic;
}

/**
 * Create a RestGraphic at the provided location
 * @param x
 * @param y
 * @param rest
 * @returns
 */
function restGraphicFactory(x,y,rest){
  switch(rest.duration){
  case durConstants.WHOLE_DUR:
    return new WholeRestGraphic(x,y,rest);
  case durConstants.HALF_DUR:
    return new HalfRestGraphic(x,y, rest);
  case durConstants.QUARTER_DUR:
    return new QuarterRestGraphic(x,y,rest);
  case durConstants.EIGHTH_DUR:
    return new EighthRestGraphic(x,y,rest);
  case durConstants.SIXTEENTH_DUR:
    return new SixteenthRestGraphic(x,y,rest);
  case durConstants.THIRTYSECOND_DUR:
    return new ThirtySecondRestGraphic(x,y,rest);
  } 
}

/**
 * Create an annotation graphic at the provided location
 * @param x
 * @param y
 * @param annotation
 */
function annotationGraphicFactory(x,y,type){
  switch(type){
  case annotationConstants.SHARP:
    return new SharpAccidentalGraphic(x,y);
  case annotationConstants.FLAT:
    return new FlatAccidentalGraphic(x,y);
  case annotationConstants.NATURAL:
    return new NaturalAccidentalGraphic(x,y);
  }
}

//////////////////////////////////////////////////////
/////////////// Drawing Helper Functions /////////////
//Functions which are frequently used in drawing content
//should go here as to not be repeated.
//////////////////////////////////////////////////////
function drawAnnotations(graphic, ctx){
  for(var i = 0;i<graphic.annotationGraphics.length;i++){
    graphic.annotationGraphics[i].draw(ctx);
  }
}

function drawHighlight(graphic, ctx){
  if(graphic.drawMode == indexedContentConstants.HIGHLIGHT){
    ctx.strokeStyle = '#0000FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(graphic.x - 5, graphic.y - 5, 10, 10);
  }
}

function drawExtendedStaffBelow(note, ctx, staff){
// If necessary, draw bar line(s) below the staff
  if(staff){
    drawHeight=75 + staff.ytop;
    while(drawHeight <= note.y){
      ctx.beginPath();
      ctx.moveTo(note.x-6,drawHeight);
      ctx.lineTo(note.x+6,drawHeight);
      ctx.stroke();
      ctx.stroke();
      drawHeight += 10;
    }
  }
}