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
 * An association graphic tracks a connection between two indexed content graphics.
 * @returns {AssociationGraphic}
 */
function AssociationGraphic(){
  this.indexedContentGraphics = [];
}

AssociationGraphic.prototype.addindexedContentGraphic = function(indexedContentGraphic){
  this.indexedContentGraphics[this.indexedContentGraphics.length] = indexedContentGraphic;
};

AssociationGraphic.prototype.getLastContentGraphic = function(){
  return this.indexedContentGraphics[this.indexedContentGraphics.length-1];
};

/**
 * A beam association graphic is an association graphic which connects 8th and shorter notes with a Beam.
 * @returns {BeamAssociationGraphic}
 */
function BeamAssociationGraphic(){
  AssociationGraphic.call(this);
}

// Connect Beam Association Graphic to the shared prototype
extend(BeamAssociationGraphic, AssociationGraphic);

BeamAssociationGraphic.prototype.addIndexedContentGraphicToBeam = function(indexedContentGraphic){
  indexedContentGraphic.inBeamAssociationGraphic = true;
  AssociationGraphic.prototype.addindexedContentGraphic.call(this, indexedContentGraphic);
};

BeamAssociationGraphic.prototype.draw = function(ctx){
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';

  if(this.indexedContentGraphics.length > 1){
    // Check to see if this association is increasing, decreasing, or neither
    var monotonic = true;
    var highestContentGraphic = this.indexedContentGraphics[0];
    var steps = 0;
    for(var i = 0;i<this.indexedContentGraphics.length-1;i++){
      if(this.indexedContentGraphics[i+1].content.pitch > highestContentGraphic.content.pitch){
        highestContentGraphic = this.indexedContentGraphics[i+1];
      }
      if(this.indexedContentGraphics[i].content.pitch < this.indexedContentGraphics[i + 1].content.pitch){
        steps++;
      } else if(this.indexedContentGraphics[i].content.pitch > this.indexedContentGraphics[i + 1].content.pitch){
        steps--;
      }
    }
    if(Math.abs(steps) != this.indexedContentGraphics.length - 1){
      monotonic = false;
    }

    // TODO handle single short notes which don't have the same duration as the surrounding notes.
    // TODO finish implementing for 32nd notes, and for the first/ unique notes in non-monotonic associations.
    if(monotonic){
      ctx.lineWidth = 3;
      var rise = this.indexedContentGraphics[this.indexedContentGraphics.length - 1].y - this.indexedContentGraphics[0].y;
      var run = this.indexedContentGraphics[this.indexedContentGraphics.length - 1].x - this.indexedContentGraphics[0].x;
      var slope = rise/run;
      ctx.beginPath();
      ctx.moveTo(this.indexedContentGraphics[0].x + 4,this.indexedContentGraphics[0].y - DEFAULT_STEM_HEIGHT);
      ctx.lineTo(this.indexedContentGraphics[this.indexedContentGraphics.length - 1].x + 4,this.indexedContentGraphics[this.indexedContentGraphics.length -1 ].y - DEFAULT_STEM_HEIGHT);
      ctx.stroke();
      ctx.stroke();
      for(var i = 0;i<this.indexedContentGraphics.length -1; i++){
        if(this.indexedContentGraphics[i].type <= durConstants.SIXTEENTH_DUR && this.indexedContentGraphics[i + 1].type <= durConstants.SIXTEENTH_DUR){
          ctx.beginPath();
          ctx.moveTo(this.indexedContentGraphics[i].x + 4,(this.indexedContentGraphics[0].y + (slope * (this.indexedContentGraphics[i].x - this.indexedContentGraphics[0].x)))  - (DEFAULT_STEM_HEIGHT-6));
          ctx.lineTo(this.indexedContentGraphics[i+1].x + 4,(this.indexedContentGraphics[0].y + (slope * (this.indexedContentGraphics[i + 1].x - this.indexedContentGraphics[0].x)))  - (DEFAULT_STEM_HEIGHT-6));
          ctx.stroke();
          ctx.stroke();
        } else if(this.indexedContentGraphics[i].type <= durConstants.SIXTEENTH_DUR && i == 0){
          // If this is a sixteenth note or smaller, and it's the first note in the association, and the next note isn't a sixteenth note or shorter
          // draw a partial line going forward.
          var halfwayX = ((this.indexedContentGraphics[i].x + 4) + (this.indexedContentGraphics[i+1].x + 4)) / 2;
          ctx.beginPath();
          ctx.moveTo(this.indexedContentGraphics[i].x + 4,(this.indexedContentGraphics[0].y + (slope * (this.indexedContentGraphics[i].x - this.indexedContentGraphics[0].x)))  - (DEFAULT_STEM_HEIGHT - 6));
          ctx.lineTo(halfwayX,(this.indexedContentGraphics[0].y + (slope * (halfwayX - (this.indexedContentGraphics[0].x + 4)))) - (DEFAULT_STEM_HEIGHT-6));
          ctx.stroke();
          ctx.stroke();
        } else if (this.indexedContentGraphics[i+1].type <= durConstants.SIXTEENTH_DUR  && (i + 1) == (this.indexedContentGraphics.length - 1)){
          // If this is a sixteenth note or smaller, and it's not the first note in the association, and the previous note wasn't a sixteenth note or shorter
          // draw a partial line going backward.
          var halfwayX = ((this.indexedContentGraphics[i].x + 4) + (this.indexedContentGraphics[i+1].x + 4)) / 2;
          ctx.beginPath();
          ctx.moveTo(halfwayX,(this.indexedContentGraphics[0].y + (slope * (halfwayX - (this.indexedContentGraphics[0].x + 4)))) - (DEFAULT_STEM_HEIGHT-6));
          ctx.lineTo(this.indexedContentGraphics[i+1].x + 4,(this.indexedContentGraphics[0].y + (slope * (this.indexedContentGraphics[i + 1].x - this.indexedContentGraphics[0].x)))  - (DEFAULT_STEM_HEIGHT-6));
          ctx.stroke();
          ctx.stroke();
        }
        if(this.indexedContentGraphics[i].type <= durConstants.THIRTYSECOND_DUR && this.indexedContentGraphics[i + 1].type <= durConstants.THIRTYSECOND_DUR){
          ctx.beginPath();
          ctx.moveTo(this.indexedContentGraphics[i].x + 4,(this.indexedContentGraphics[0].y + (slope * (this.indexedContentGraphics[i].x - this.indexedContentGraphics[0].x)))  - (DEFAULT_STEM_HEIGHT-10));
          ctx.lineTo(this.indexedContentGraphics[i+1].x + 4,(this.indexedContentGraphics[0].y + (slope * (this.indexedContentGraphics[i + 1].x - this.indexedContentGraphics[0].x)))  - (DEFAULT_STEM_HEIGHT-10));
          ctx.stroke();
          ctx.stroke();
        } else if(this.indexedContentGraphics[i].type <= durConstants.THIRTYSECOND_DUR && i == 0){
          // If this is a thirtysecond note or smaller, and it's the first note in the association, and the next note isn't a sixteenth note or shorter
          // draw a partial line going forward.
          var halfwayX = ((this.indexedContentGraphics[i].x + 4) + (this.indexedContentGraphics[i+1].x + 4)) / 2;
          ctx.beginPath();
          ctx.moveTo(this.indexedContentGraphics[i].x + 4,(this.indexedContentGraphics[0].y + (slope * (this.indexedContentGraphics[i].x - this.indexedContentGraphics[0].x)))  - (DEFAULT_STEM_HEIGHT - 12));
          ctx.lineTo(halfwayX,(this.indexedContentGraphics[0].y + (slope * (halfwayX - (this.indexedContentGraphics[0].x + 4)))) - (DEFAULT_STEM_HEIGHT-12));
          ctx.stroke();
          ctx.stroke();
        } else if (this.indexedContentGraphics[i+1].type <= durConstants.THIRTYSECOND_DUR && (i + 1) == (this.indexedContentGraphics.length - 1)){
          // If this is a thirtysecond note or smaller, and it's not the first note in the association, and the previous note wasn't a sixteenth note or shorter
          // draw a partial line going backward.
          var halfwayX = ((this.indexedContentGraphics[i].x + 4) + (this.indexedContentGraphics[i+1].x + 4)) / 2;
          ctx.beginPath();
          ctx.moveTo(halfwayX,(this.indexedContentGraphics[0].y + (slope * (halfwayX - (this.indexedContentGraphics[0].x + 4)))) - (DEFAULT_STEM_HEIGHT-12));
          ctx.lineTo(this.indexedContentGraphics[i+1].x + 4,(this.indexedContentGraphics[0].y + (slope * (this.indexedContentGraphics[i + 1].x - this.indexedContentGraphics[0].x)))  - (DEFAULT_STEM_HEIGHT-12));
          ctx.stroke();
          ctx.stroke();
        }
      }
      ctx.lineWidth = 1;
      for(var i = 0;i<this.indexedContentGraphics.length; i++){
        var height =  (this.indexedContentGraphics[i].y - (this.indexedContentGraphics[0].y + (slope * (this.indexedContentGraphics[i].x - this.indexedContentGraphics[0].x)))) + DEFAULT_STEM_HEIGHT;
        this.indexedContentGraphics[i].drawStem(ctx, height);
      }
    } else {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.indexedContentGraphics[0].x + 4,highestContentGraphic.y - DEFAULT_STEM_HEIGHT);
      ctx.lineTo(this.indexedContentGraphics[this.indexedContentGraphics.length - 1].x + 4,highestContentGraphic.y - DEFAULT_STEM_HEIGHT);
      ctx.stroke();
      ctx.stroke();
      for(var i = 0;i<this.indexedContentGraphics.length -1; i++){
        if(this.indexedContentGraphics[i].type <= durConstants.SIXTEENTH_DUR && this.indexedContentGraphics[i + 1].type <= durConstants.SIXTEENTH_DUR){
          ctx.beginPath();
          ctx.moveTo(this.indexedContentGraphics[i].x + 4,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-6));
          ctx.lineTo(this.indexedContentGraphics[i+1].x + 4,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-6));
          ctx.stroke();
          ctx.stroke();
        }else if(this.indexedContentGraphics[i].type <= durConstants.SIXTEENTH_DUR && i == 0){
          // If this is a sixteenth note or smaller, and it's the first note in the association, and the next note isn't a sixteenth note or shorter
          // draw a partial line going forward.
          var halfwayX = ((this.indexedContentGraphics[i].x + 4) + (this.indexedContentGraphics[i+1].x + 4)) / 2;
          ctx.beginPath();
          ctx.moveTo(this.indexedContentGraphics[i].x + 4,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-6));
          ctx.lineTo(halfwayX,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-6));
          ctx.stroke();
          ctx.stroke();
        } else if (this.indexedContentGraphics[i+1].type <= durConstants.SIXTEENTH_DUR  && (i + 1) == (this.indexedContentGraphics.length - 1)){
          // If this is a sixteenth note or smaller, and it's not the first note in the association, and the previous note wasn't a sixteenth note or shorter
          // draw a partial line going backward.
          var halfwayX = ((this.indexedContentGraphics[i].x + 4) + (this.indexedContentGraphics[i+1].x + 4)) / 2;
          ctx.beginPath();
          ctx.moveTo(halfwayX,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-6));
          ctx.lineTo(this.indexedContentGraphics[i+1].x + 4,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-6));
          ctx.stroke();
          ctx.stroke();
        }
        if(this.indexedContentGraphics[i].type <= durConstants.THIRTYSECOND_DUR && this.indexedContentGraphics[i + 1].type <= durConstants.THIRTYSECOND_DUR){
          ctx.beginPath();
          ctx.moveTo(this.indexedContentGraphics[i].x + 4,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-12));
          ctx.lineTo(this.indexedContentGraphics[i+1].x + 4,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-12));
          ctx.stroke();
          ctx.stroke();
        }else if(this.indexedContentGraphics[i].type <= durConstants.THIRTYSECOND_DUR && i == 0){
          // If this is a thirtysecond note or smaller, and it's the first note in the association, and the next note isn't a sixteenth note or shorter
          // draw a partial line going forward.
          var halfwayX = ((this.indexedContentGraphics[i].x + 4) + (this.indexedContentGraphics[i+1].x + 4)) / 2;
          ctx.beginPath();
          ctx.moveTo(this.indexedContentGraphics[i].x + 4,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-12));
          ctx.lineTo(halfwayX,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-12));
          ctx.stroke();
          ctx.stroke();
        } else if (this.indexedContentGraphics[i+1].type <= durConstants.THIRTYSECOND_DUR  && (i + 1) == (this.indexedContentGraphics.length - 1)){
          // If this is a thirtysecond note or smaller, and it's not the first note in the association, and the previous note wasn't a sixteenth note or shorter
          // draw a partial line going backward.
          var halfwayX = ((this.indexedContentGraphics[i].x + 4) + (this.indexedContentGraphics[i+1].x + 4)) / 2;
          ctx.beginPath();
          ctx.moveTo(halfwayX,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-12));
          ctx.lineTo(this.indexedContentGraphics[i+1].x + 4,highestContentGraphic.y  - (DEFAULT_STEM_HEIGHT-12));
          ctx.stroke();
          ctx.stroke();
        }
      }
      ctx.lineWidth = 1;
      for(var i = 0;i<this.indexedContentGraphics.length; i++){
        this.indexedContentGraphics[i].drawStem(ctx, (this.indexedContentGraphics[i].y - highestContentGraphic.y) + DEFAULT_STEM_HEIGHT);
      }
    }
  } else if (this.indexedContentGraphics.length == 1){
    // draw the note with its stem and flag
    // TODO should probably just remove it from the association at this point.
    this.indexedContentGraphics[0].drawStem(ctx, DEFAULT_STEM_HEIGHT);
    this.indexedContentGraphics[0].drawFlags(ctx, DEFAULT_STEM_HEIGHT);
  }
  ctx.lineWidth = 1;
};
