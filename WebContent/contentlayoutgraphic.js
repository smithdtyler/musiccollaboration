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


var annotationConstants = {};
annotationConstants.FLAT = 1000;
annotationConstants.NATURAL = 1001;
annotationConstants.SHARP = 1002;
annotationConstants.NONE = 1003;

var palletConstants = {};
palletConstants.NORMAL = 0;
palletConstants.DROP = 1;

var indexedContentConstants = {};
indexedContentConstants.NORMAL = 0;
indexedContentConstants.HIGHLIGHT = 1;

var staffConstants = {};
staffConstants.HEIGHT = 120;
staffConstants.WIDTH = 680;
staffConstants.F_LINE_OFFSET = 25; // Top of the staff
staffConstants.E_LINE_OFFSET = 65; // Bottom of the staff
staffConstants.MIDDLE_C_OFFSET = 75; // Location of Middle C
staffConstants.LINEGAP = 10; // distance between lines
staffConstants.SCALAR = staffConstants.LINEGAP/2;

//////////////////////////////////////////////////////
/////////////// Drawing Helper Functions /////////////
// Functions which are frequently used in drawing content
// should go here as to not be repeated.
//////////////////////////////////////////////////////

function drawClef(ctx, staff){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(staff.xleft + 45, staff.ytop + 55, staffConstants.LINEGAP, Math.PI, 0.5*Math.PI, false);
  ctx.arc(staff.xleft + 45, staff.ytop + 50, staffConstants.LINEGAP * 1.5, 0.5*Math.PI, 1.5*Math.PI, false);
  ctx.arc(staff.xleft + 45, staff.ytop + 25, staffConstants.LINEGAP, 1.5*Math.PI, 0.5*Math.PI, false);
  ctx.moveTo(staff.xleft + 45, staff.ytop + 75);
  ctx.lineTo(staff.xleft + 45, staff.ytop + 15);
  ctx.stroke();
}

//////////////////////////////////////////////////////
///////////////// Display classes ////////////////////
// Objects created by the functions below all have a draw()
// function which allows them to be displayed 
// on a canvas.
//////////////////////////////////////////////////////

/********************* Rectangle *******************/
/**
 * <p>
 * Create a Rectangle with the provided bounds.
 * </p>
 * <p>
 * Rectangle should not be created directly, but rather
 * used to share inherited functionality among similar
 * objects.
 * </p>
 */
function Rectangle(xleft, ytop, xright, ybottom){
  this.xleft = xleft;
  this.ytop = ytop;
  this.xright = xright;
  this.ybottom = ybottom;
}

Rectangle.prototype.contains = function(mx,my){
  if(this.xleft < mx  && this.xright > mx && this.ytop < my && this.ybottom > my){
    return true;
  }
  return false;
};

/******************* Pallet *************************/
/**
 * The pallet is where content that can be added to the song is stored.
 * This content is NOT indexed content. The notes may have indexes assigned when dropped
 * on the song, other symbols will be associated with indexed content when dropped.
 * 
 * @param xleft Left boundary of the pallet
 * @param ytop Top boundary of the pallet
 * @param xright Right boundary of the pallet
 * @param ybottom Bottom boundary of the pallet
 * @returns {Pallet}
 */
function Pallet(xleft, ytop, xright, ybottom){
  Rectangle.call(this, xleft, ytop, xright, ybottom);

  this.displayedContent = [];
  this.associations = [];
  this.drawMode = palletConstants.NORMAL;
}

//Connect Pallet with its parent type
extend(Pallet, Rectangle);

/**
 * Add content to the pallet for display.
 * @param contentGraphic
 */
Pallet.prototype.addDisplayedContent = function(contentGraphic){
  this.displayedContent[this.displayedContent.length] = contentGraphic;
};

/**
 * Compute proper spacing for all of the displayed content
 * in the pallet.
 */
Pallet.prototype.layoutDisplayedContent = function(ydefault){
  var width = this.xright - (this.xleft + 10);
  var unitsNeeded = 0;
  for(var i = 0;i<this.displayedContent.length; i++){
    unitsNeeded ++;
  }
  this.unitWidth = Math.floor(width / unitsNeeded);
  
  var currentx = this.xleft + 10;
  // TODO this isn't the greatest design, since it requires the 
  // caller to figure out where to put the pieces...
  if(ydefault){
    currenty= ydefault;
  } else {
    currenty = Math.floor((this.ybottom + this.ytop)/2) + 10;    
  }
  
  for(var i = 0;i < this.displayedContent.length; i++){
    this.displayedContent[i].x = currentx;
    this.displayedContent[i].y = currenty;
    currentx += this.unitWidth;
  }
};

Pallet.prototype.draw = function(ctx){
  if(this.drawMode == palletConstants.DROP){
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.xleft, this.ytop, this.xright - this.xleft, this.ybottom - this.ytop);
  }
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(this.xleft, this.ytop);
  ctx.lineTo(this.xright, this.ytop);
  ctx.lineTo(this.xright, this.ybottom);
  ctx.lineTo(this.xleft, this.ybottom);
  ctx.closePath();
  ctx.stroke();
  ctx.stroke();
  for(var i = 0;i<this.displayedContent.length;i++){
    this.displayedContent[i].draw(ctx);
  }
};

/******************** Staff ************************/
/**
 * <p>
 * The staff is the set of horizontal lines on which notes are drawn.
 * </p>
 * <p>
 * IndexedContent can be added to a Staff via <code>addIndexedContent()</code>.
 * After adding content, <code>layoutIndexedContent()</code> should be called.
 * </p> 
 * @param xleft
 * @param ytop
 * @param xright
 * @param ybottom
 * @param startx
 * @param endx
 * @param key
 * @returns {Staff}
 */
function Staff(xleft,ytop, xright, ybottom, startx, endx, key){
  Rectangle.call(this, xleft, ytop, xright, ybottom);
  
  this.startx = startx;
  this.endx = endx;
  this.displayedIndexedContent = [];
  this.displayedNonIndexedContent = [];
  this.associations = [];
  this.currentx = startx;
  this.key = key;
  this.currentIndex = 0;
  this.unitWidth = 10;
  this.startIndex = 0;
}

//Connect Staff with its parent type
extend(Staff, Rectangle);

/**
 * Add new indexed content to this Staff
 * @param indexedContent content to be added to the staff
 */
Staff.prototype.addIndexedContent = function(indexedContent){
  var indexedContentGraphic = null;
  if(indexedContent.isRest){
    indexedContentGraphic = restGraphicFactory(this.currentx, this.ytop + 45, indexedContent);
  } else if(indexedContent.isNote){
    indexedContentGraphic = noteGraphicFactory(this.currentx, 0, indexedContent, this.ytop);
  }
  if(indexedContentGraphic == null){
    alert("Error laying out graphics");
    return;
  }
  this.displayedIndexedContent[this.displayedIndexedContent.length] = indexedContentGraphic;
};

/**
 * <p>
 * Based on the quantity and type of this staff's indexed content, 
 * compute a standard spacing unit, then assign content locations based
 * on content values and the spacing unit.
 * </p>
 * <p>
 * Note that this function only assigns horizontal spacing. Vertical spacing is done 
 * elsewhere.
 * </p>
 */
Staff.prototype.layoutIndexedContent = function(){
  console.log("Laying out staff...");
  var width = this.xright - this.startx;
  var unitsNeeded = 0;
  var currentIndex = -1;
  var currentBeamAssociationGraphic = null;
  
  if(this.displayedIndexedContent.length > 0){
    this.startIndex = this.displayedIndexedContent[0].content.index;
  }
  
  // Compute a standard spacing value
  for(var i = 0;i<this.displayedIndexedContent.length; i++){
    var indexedContentGraphic = this.displayedIndexedContent[i];
    if(indexedContentGraphic.content.index > currentIndex){
      currentIndex = indexedContentGraphic.content.index;
      unitsNeeded += indexedContentGraphic.preSpacingScalar;
      unitsNeeded += indexedContentGraphic.postSpacingScalar;
    }
  }
  unitsNeeded += 2; // Add a gap at the end
  this.unitWidth = Math.floor(width / unitsNeeded);//TODO this presents a rounding problem. Need to address. Floor cuts away too much, ceil gives too much.
//  this.unitWidth = width/unitsNeeded;
  
  // Assign horizontal content locations based on the content index, content spacing, and standard spacing value 
  // A note has assigned spacing before and after itself. For example, a whole rest has two 
  // spacing units before and after it. A whole note has one spacing unit before, and three after.
  // |__-__|_0___|_0__0__0__0_|_ and so on  
  // TODO this approach doesn't handle stacked notes with different scalar values well.
  this.currentx = this.startx;
  currentIndex = -1;
  
  for(var i = 0;i<this.displayedIndexedContent.length; i++){
    var indexedContentGraphic = this.displayedIndexedContent[i];
    
    // Have we stepped to a new index?
    if(indexedContentGraphic.content.index > currentIndex){
      currentIndex = indexedContentGraphic.content.index;
        // Don't add measure lines or previous note postspacing if this is the first note of the staff
        if(i > 0){
          // Add the post spacing from the previous note
          this.currentx += this.displayedIndexedContent[i - 1].postSpacingScalar * this.unitWidth;
          // Do we need to add a measure line here?
          if(indexedContentGraphic.content.index % durConstants.WHOLE_DUR == 0){
            this.displayedNonIndexedContent[this.displayedNonIndexedContent.length] = new MeasureLine(this.currentx, this.ytop + 25);
          }
        }
        // Add the prespacing for this note
        this.currentx += indexedContentGraphic.preSpacingScalar * this.unitWidth;
        indexedContentGraphic.x = this.currentx;
    } else {
      indexedContentGraphic.x = this.currentx;
    }
    // TODO this should handle multiple types of annotations instead of just stacking them
    for(var j = 0;j<indexedContentGraphic.annotationGraphics.length; j++){
      indexedContentGraphic.annotationGraphics[j].x = indexedContentGraphic.x - 12;
      indexedContentGraphic.annotationGraphics[j].y = indexedContentGraphic.y;      
    }
    
    // TODO this should also apply stored associations
    // Add or expand an association as necessary
    
    // Only add the note to an existing beam association if the association is in the same measure as the note and the 
    // note is an 8th note or shorter.
    if(indexedContentGraphic.type <= durConstants.EIGHTH_DUR && indexedContentGraphic.content.isNote){
      if(currentBeamAssociationGraphic != null
          && currentBeamAssociationGraphic.getLastContentGraphic().content.indexBeat() == indexedContentGraphic.content.indexBeat()){
        currentBeamAssociationGraphic.addIndexedContentGraphicToBeam(indexedContentGraphic);
      } else {
        currentBeamAssociationGraphic = new BeamAssociationGraphic();
        currentBeamAssociationGraphic.addIndexedContentGraphicToBeam(indexedContentGraphic);
        this.associations[this.associations.length] = currentBeamAssociationGraphic;
      }
    }
  }
};

Staff.prototype.draw = function(ctx) {
//draw background stuff
  ctx.fillStyle = "#FF0000";
  ctx.strokeStyle = "#FF0000";
  // Draw a rectangle
  ctx.beginPath();
  ctx.moveTo(this.xleft + 25, this.ytop + staffConstants.F_LINE_OFFSET);
  ctx.lineTo(this.xleft + staffConstants.WIDTH, this.ytop +  staffConstants.F_LINE_OFFSET);
  ctx.lineTo(this.xleft + staffConstants.WIDTH, this.ytop + staffConstants.F_LINE_OFFSET + (4 * staffConstants.LINEGAP));
  ctx.lineTo(this.xleft + 25, this.ytop + staffConstants.F_LINE_OFFSET + (4 * staffConstants.LINEGAP));
  ctx.closePath();
  ctx.stroke();
  ctx.stroke();

  // Draw lines
  ctx.beginPath();
  ctx.moveTo(this.xleft + 25, this.ytop + staffConstants.F_LINE_OFFSET + staffConstants.LINEGAP);
  ctx.lineTo(this.xleft + staffConstants.WIDTH, this.ytop + staffConstants.F_LINE_OFFSET + staffConstants.LINEGAP);
  ctx.moveTo(this.xleft + 25, this.ytop + staffConstants.F_LINE_OFFSET + (2 * staffConstants.LINEGAP));
  ctx.lineTo(this.xleft + staffConstants.WIDTH, this.ytop + staffConstants.F_LINE_OFFSET + (2 * staffConstants.LINEGAP));
  ctx.moveTo(this.xleft + 25, this.ytop + staffConstants.F_LINE_OFFSET + (3 * staffConstants.LINEGAP));
  ctx.lineTo(this.xleft + staffConstants.WIDTH, this.ytop + staffConstants.F_LINE_OFFSET + (3 * staffConstants.LINEGAP));
  ctx.stroke();
  ctx.stroke();
  
  
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  // Draw key signature
  drawKey(ctx, this);
  
  // Draw the clef
  drawClef(ctx, this);
  
  // draw the active notes
  for (var i = 0; i < this.displayedIndexedContent.length; i++) {
    var note = this.displayedIndexedContent[i];
    note.draw(ctx, this);
  }
  
  for(var i = 0;i<this.displayedNonIndexedContent.length;i++){
    this.displayedNonIndexedContent[i].draw(ctx);
  }
  
  for(var i = 0;i<this.associations.length;i++){
    this.associations[i].draw(ctx);
  }
};

/******************* Measure Line **********************/
//Measure line display class
function MeasureLine(x,y){
  this.x = x;
  this.y = y;
}

// Draw from the top of the bar
// Note that we assign this function to the MeasureLine prototype so that we only have to store one copy of it.
// If we assigned it to within the MeasureLine constructor, each MeasureLine would store a copy of the function.
MeasureLine.prototype.draw = function(ctx){
  // Draw Line
  ctx.beginPath();
  ctx.moveTo(this.x,this.y);
  ctx.lineTo(this.x,this.y+40);
  ctx.stroke();
  ctx.stroke();
};