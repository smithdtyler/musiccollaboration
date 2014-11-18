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

///////////////////////////////////////////////////////
/////////// Inheritance Helper Functions //////////////
// In Javascript, inheritance associations must be made
// explicitly.
///////////////////////////////////////////////////////

/**
 * <p>
 * This function assigns the prototype of a given type to
 * that of another type.
 * </p>
 * <p>
 * In our case, this allows us to have a single NoteGraphic
 * class which defines shared functions.
 * </p>
 * <p><b>Reference:</b> <code> http://www.spheredev.org/wiki/Prototypes_in_JavaScript</code> </p>
 * @param child
 * @param supertype
 */
function extend(child, supertype){
  child.prototype.__proto__ = supertype.prototype;
}