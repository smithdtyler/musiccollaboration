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

function drawKey(ctx, staff){
  // Sharp Keys
  if(staff.key == keyConstants.C_KEY){
    return;
  }
  if(staff.key == keyConstants.G_KEY){
    return drawGKey(ctx, staff);
  }
  if(staff.key == keyConstants.D_KEY){
    return drawDKey(ctx, staff);
  }
  if(staff.key == keyConstants.A_KEY){
    return drawAKey(ctx, staff);
  }
  if(staff.key == keyConstants.E_KEY){
    return drawEKey(ctx, staff);
  }
  if(staff.key == keyConstants.B_KEY){
    return drawBKey(ctx, staff);
  }
  if(staff.key == keyConstants.F_SHARP_KEY){
    return drawFSharpKey(ctx, staff);
  }
  if(staff.key == keyConstants.C_SHARP_KEY){
    return drawCSharpKey(ctx, staff);
  }
  
  // Flat keys
  if(staff.key == keyConstants.F_KEY){
    return drawFKey(ctx, staff);
  }
  if(staff.key == keyConstants.B_FLAT_KEY){
    return drawBFlatKey(ctx, staff);
  }
  if(staff.key == keyConstants.E_FLAT_KEY){
    return drawEFlatKey(ctx, staff);
  }
  if(staff.key == keyConstants.A_FLAT_KEY){
    return drawAFlatKey(ctx, staff);
  }
  if(staff.key == keyConstants.D_FLAT_KEY){
    return drawDFlatKey(ctx, staff);
  }
  if(staff.key == keyConstants.G_FLAT_KEY){
    return drawGFlatKey(ctx, staff);
  }
  
}

// Drawing the sharp keys
function drawGKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("#", staff.xleft + 55, staff.ytop + 30);
  return;
}
function drawDKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("#", staff.xleft + 60, staff.ytop + 45);
  return drawGKey(ctx, staff);
}
function drawAKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("#", staff.xleft + 65, staff.ytop + 25);
  return drawDKey(ctx, staff);
}
function drawEKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("#", staff.xleft + 70, staff.ytop + 40);
  return drawAKey(ctx, staff);
}
function drawBKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("#", staff.xleft + 75, staff.ytop + 55);
  return drawEKey(ctx, staff);
}
function drawFSharpKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("#", staff.xleft + 80, staff.ytop + 35);
  return drawBKey(ctx, staff);
}
function drawCSharpKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("#", staff.xleft + 85, staff.ytop + 50);
  return drawFSharpKey(ctx, staff);
}

// Drawing the flay keys
function drawFKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("b", staff.xleft + 55, staff.ytop + 48);
  return;
}
function drawBFlatKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("b", staff.xleft + 60, staff.ytop + 33);
  return drawFKey(ctx, staff);
}
function drawEFlatKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("b", staff.xleft + 65, staff.ytop + 53);
  return drawBFlatKey(ctx, staff);
}
function drawAFlatKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("b", staff.xleft + 70, staff.ytop + 38);
  return drawEFlatKey(ctx, staff);
}
function drawDFlatKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("b", staff.xleft + 75, staff.ytop + 58);
  return drawAFlatKey(ctx, staff);
}
function drawGFlatKey(ctx, staff){
  ctx.font = "10pt Arial";
  ctx.fillText("b", staff.xleft + 80, staff.ytop + 43);
  return drawDFlatKey(ctx, staff);
}


/**
 * This is a big switch statement to handle the proper display of accidentals.
 * When the key is a "Sharp" key, they are displayed on one set of lines, when
 * the key is a "Flat" key, they are displayed on another set of lines.
 * 
 * This function also assigns an accidental annotation to the graphic as necessary.
 * 
 * @param pitch
 * @returns {Number}
 */
function getLineOffset(pitch, key, graphic) {
  nearestCOffset = 0;
  while (pitch - 12 >= 0) {
    pitch = pitch - 12;
    nearestCOffset += 7;
  }
  while (pitch < 0) {
    pitch += 12;
    nearestCOffset -= 7;
  }
  
  // Use a binary flag to indicate whether flat, natural or sharp annotations are required
  // sharpFlag & 0x0001 means display a sharp on any C note 
  
  var flatFlags = 0;
  var naturalFlags = 0;
  var sharpFlags = 0;
  
  var C_Mask =              0x0001;
  var C_Sharp_D_Flat_Mask = 0x0002;
  var D_Mask =              0x0004;
  var D_Sharp_E_Flat_Mask = 0x0008;
  var E_Mask =              0x0010;
  var F_Mask =              0x0020;
  var F_Sharp_G_Flat_Mask = 0x0040;
  var G_Mask =              0x0080;
  var G_Sharp_A_Flat_Mask = 0x0100;
  var A_Mask =              0x0200;
  var A_Sharp_B_Flat_Mask = 0x0400;
  var B_Mask =              0x0800;
  
  //
  // Sharp keys
  //
  if(key == keyConstants.C_KEY){
    // In C, all accidentals are displayed with sharp annotations
    // F#
    sharpFlags |= F_Sharp_G_Flat_Mask;
    // C#
    sharpFlags |= C_Sharp_D_Flat_Mask;
    // G#
    sharpFlags |= G_Sharp_A_Flat_Mask;
    // D#
    sharpFlags |= D_Sharp_E_Flat_Mask;
    // A#
    sharpFlags |= A_Sharp_B_Flat_Mask;
  }
  if(key == keyConstants.G_KEY){
    // In G, all accidentals are displayed with sharp annotations except F#, which is implied
    // An F natural must be annotated
    // F
    naturalFlags |= F_Mask;
    // C#
    sharpFlags |= C_Sharp_D_Flat_Mask;
    // G#
    sharpFlags |= G_Sharp_A_Flat_Mask;
    // D#
    sharpFlags |= D_Sharp_E_Flat_Mask;
    // A#
    sharpFlags |= A_Sharp_B_Flat_Mask;
  }
  if(key == keyConstants.D_KEY){
    // In D, all accidentals are displayed with sharp annotations except F# and C#, which are implied
    // F and C require natural annotations
    // F
    naturalFlags |= F_Mask;
    // C
    naturalFlags |= C_Mask;
    // G#
    sharpFlags |= G_Sharp_A_Flat_Mask;
    // D#
    sharpFlags |= D_Sharp_E_Flat_Mask;
    // A#
    sharpFlags |= A_Sharp_B_Flat_Mask;
  }
  if(key == keyConstants.A_KEY){
    // In A, F#, C# and G# are implied, A# and D# must be annotated as sharps.
    // F, C, and G must have natural annotations.
    // F
    naturalFlags |= F_Mask;
    // C
    naturalFlags |= C_Mask;
    // G
    naturalFlags |= G_Mask;
    // D#
    sharpFlags |= D_Sharp_E_Flat_Mask;
    // A#
    sharpFlags |= A_Sharp_B_Flat_Mask;
  }
  if(key == keyConstants.E_KEY){
    // In E, F#, C#, G#, and D# are implied. A# must be annotated.
    // F, C, G, and D must have natural annotations.
    // F
    naturalFlags |= F_Mask;
    // C
    naturalFlags |= C_Mask;
    // G
    naturalFlags |= G_Mask;
    // D
    naturalFlags |= D_Mask;
    // A#
    sharpFlags |= A_Sharp_B_Flat_Mask;
  }
  if(key == keyConstants.B_KEY){
    // In B, F#, C#, G#, D#, and A# are implied.
    // F, C, G, D, and A must have natural annotations.
    // F
    naturalFlags |= F_Mask;
    // C
    naturalFlags |= C_Mask;
    // G
    naturalFlags |= G_Mask;
    // D
    naturalFlags |= D_Mask;
    // A
    naturalFlags |= A_Mask;
  }
  // TODO handle F# and C# - I don't feel like dealing with them right now...
  
  //
  // Flat keys
  //
  if(key == keyConstants.F_KEY){
    // In F, Bb is implied, B must be annotated as natural
    // Eb, Ab, Db, and Gb must be annotated with as flat
    // B
    naturalFlags |= B_Mask;
    // Eb
    flatFlags |= D_Sharp_E_Flat_Mask;
    // Ab
    flatFlags |= G_Sharp_A_Flat_Mask;
    // Db
    flatFlags |= C_Sharp_D_Flat_Mask;
    // Gb
    flatFlags |= F_Sharp_G_Flat_Mask;
  }
  if(key == keyConstants.B_FLAT_KEY){
    // In Bb, Bb and Eb are implied, B and E must be annotated as natural
    // Ab, Db, and Gb must be annotated with as flat
    // B
    naturalFlags |= B_Mask;
    // E
    naturalFlags |= E_Mask;
    // Ab
    flatFlags |= G_Sharp_A_Flat_Mask;
    // Db
    flatFlags |= C_Sharp_D_Flat_Mask;
    // Gb
    flatFlags |= F_Sharp_G_Flat_Mask;
  }
  if(key == keyConstants.E_FLAT_KEY){
    // In Eb, Bb, Eb and Ab are implied, B, E, and A must be annotated as natural
    // Db, and Gb must be annotated with as flat
    // B
    naturalFlags |= B_Mask;
    // E
    naturalFlags |= E_Mask;
    // Ab
    naturalFlags |= A_Mask;
    // Db
    flatFlags |= C_Sharp_D_Flat_Mask;
    // Gb
    flatFlags |= F_Sharp_G_Flat_Mask;
  }
  if(key == keyConstants.A_FLAT_KEY){
    // In Ab, Bb, Eb, Ab and Db are implied, B, E, A, and D must be annotated as natural
    // Gb must be annotated with as flat
    // B
    naturalFlags |= B_Mask;
    // E
    naturalFlags |= E_Mask;
    // Ab
    naturalFlags |= A_Mask;
    // Db
    naturalFlags |= D_Mask;
    // Gb
    flatFlags |= F_Sharp_G_Flat_Mask;
  }
  if(key == keyConstants.D_FLAT_KEY){
    // In Db, Bb, Eb, Ab Db and Gb are implied, B, E, A, and D G must be annotated as natural
    // B
    naturalFlags |= B_Mask;
    // E
    naturalFlags |= E_Mask;
    // Ab
    naturalFlags |= A_Mask;
    // Db
    naturalFlags |= D_Mask;
    // Gb
    naturalFlags |= G_Mask;
  }
  // TODO handle Gb, I don't feel like it right now.
  
  switch (pitch % 12) {
  case 0:
    // C
    if(naturalFlags & C_Mask){
      graphic.addAnnotation(annotationConstants.NATURAL);
    }
    return nearestCOffset + 0;
  case 1:
    // C#/Db
    if (sharpFlags & C_Sharp_D_Flat_Mask){      
      graphic.addAnnotation(annotationConstants.SHARP);
      return nearestCOffset + 0;
    } else if(isSharpKey(key)){
      return nearestCOffset + 0;
    } else if(flatFlags & C_Sharp_D_Flat_Mask){
      graphic.addAnnotation(annotationConstants.FLAT);
      return nearestCOffset + 1;
    } else {
      return nearestCOffset + 1;
    }
  case 2:
    // D
    if(naturalFlags & D_Mask){
      graphic.addAnnotation(annotationConstants.NATURAL);
    }
    return nearestCOffset + 1;
  case 3:
    // D#/Eb
    if (sharpFlags & D_Sharp_E_Flat_Mask){      
      graphic.addAnnotation(annotationConstants.SHARP);
      return nearestCOffset + 1;
    } else if(isSharpKey(key)){
      return nearestCOffset + 1; 
    } else if(flatFlags & D_Sharp_E_Flat_Mask){
      graphic.addAnnotation(annotationConstants.FLAT);
      return nearestCOffset + 2;
    } else{
      return nearestCOffset + 2;
    }
  case 4:
    // E
    if(naturalFlags & E_Mask){
      graphic.addAnnotation(annotationConstants.NATURAL);
    }
    return nearestCOffset + 2;
  case 5:
    // F
    if(naturalFlags & F_Mask){
      graphic.addAnnotation(annotationConstants.NATURAL);
    }
    return nearestCOffset + 3;
  case 6:
    // F#/Gb
    if (sharpFlags & F_Sharp_G_Flat_Mask){      
      graphic.addAnnotation(annotationConstants.SHARP);
      return nearestCOffset + 3;
    } else if(isSharpKey(key)){
      return nearestCOffset + 3;
    } else if(flatFlags & F_Sharp_G_Flat_Mask){
      graphic.addAnnotation(annotationConstants.FLAT);
      return nearestCOffset + 4;
    } else {
      return nearestCOffset + 4;
    }
  case 7:
    // G
    if(naturalFlags & G_Mask){
      graphic.addAnnotation(annotationConstants.NATURAL);
    }
    return nearestCOffset + 4;
  case 8:
    // G#/Ab
    if (sharpFlags & G_Sharp_A_Flat_Mask){      
      graphic.addAnnotation(annotationConstants.SHARP);
      return nearestCOffset + 4;
    } else if(isSharpKey(key)){
      return nearestCOffset + 4;
    } else if(flatFlags & G_Sharp_A_Flat_Mask){
      graphic.addAnnotation(annotationConstants.FLAT);
      return nearestCOffset + 5;
    } else {
      return nearestCOffset + 5;
    }
  case 9:
    // A
    if(naturalFlags & A_Mask){
      graphic.addAnnotation(annotationConstants.NATURAL);
    }
    return nearestCOffset + 5;
  case 10:
    // A#/Bb
    if (sharpFlags & A_Sharp_B_Flat_Mask){      
      graphic.addAnnotation(annotationConstants.SHARP);
      return nearestCOffset + 5;
    } else if(isSharpKey(key)){
      return nearestCOffset + 5;
    } else if(flatFlags & A_Sharp_B_Flat_Mask){
      graphic.addAnnotation(annotationConstants.FLAT);
      return nearestCOffset + 6;
    } else {
      return nearestCOffset + 6;
    }
  case 11:
    // B
    if(naturalFlags & B_Mask){
      graphic.addAnnotation(annotationConstants.NATURAL);
    }
    return nearestCOffset + 6;
  }
}

/**
 * When a note is dropped, which pitch should it have?
 */
function getPitch(lineOffset, key) {
  // Start by finding the closest C pitch
  nearestC = 0;
  while (lineOffset - 7 >= 0) {
    nearestC += 12;
    lineOffset = lineOffset - 7;
  }
  while (lineOffset < 0) {
    nearestC -= 12;
    lineOffset = lineOffset + 7;
  }
  // After we've got the closest C, figure out what our offset from that C is
  if(isSharpKey(key)){
    switch (lineOffset % 7) {
    // C
    case 0:
      if(key == keyConstants.C_KEY || key == keyConstants.G_KEY){
        return nearestC + 0;
      }
      // Sharp for every sharp key other than C and G
      return nearestC + 1;
    // D
    case 1:
      if(key == keyConstants.C_KEY || key == keyConstants.G_KEY || key == keyConstants.D || key == keyConstants.A_KEY){
        return nearestC + 2;
      }
      // Sharp for every sharp key other than C, G, D, and A
      return nearestC + 3;
    // E
    case 2:
      return nearestC + 4;
    // F
    case 3:
      if(key == keyConstants.C_KEY){
        return nearestC + 5;
      }
      // Sharp for every sharp key other than C
      return nearestC + 6;
    // G
    case 4:
      if(key == keyConstants.C_KEY || key == keyConstants.G_KEY || key == keyConstants.D){
        return nearestC + 7;
      }
      // G is sharp in every sharp key other than C, G, and D
      return nearestC + 8;
    // A
    case 5:
      if(key == keyConstants.C_KEY || key == keyConstants.G_KEY || key == keyConstants.D || key == keyConstants.A_KEY ||
          key == keyConstants.E_KEY){
        return nearestC + 9;
      }
      // A is sharp in B
      return nearestC + 10;
    // B
    case 6:
      return nearestC + 11;
    }
  } else {
    switch (lineOffset % 7) {
    // TODO fill in for flat keys
    // C
    case 0:
      return nearestC + 0;
    // D
    case 1:
      return nearestC + 2;
    // E
    case 2:
      return nearestC + 4;
    // F
    case 3:
      return nearestC + 5;
    // G
    case 4:
      return nearestC + 7;
    // A
    case 5:
      return nearestC + 9;
    // B
    case 6:
      return nearestC + 11;
    }
  }
}