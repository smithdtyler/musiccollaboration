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

var song; // TODO perhaps this isn't the best way to manage the variable, its scope isn't obvious
var MEASURES_PER_LINE = 3;

// Get the Canvas State
var cManager = new CanvasManager(document.getElementById('canvas'));

// We don't want to re-set the song name editing field over and over on each click.
var editedSongName = false;
var editedSongKey = false;
var editedSongTempo = false;

// If the user clicks on the song name, let them edit it.
var nameField = document.getElementById("songname");
nameField.addEventListener('mousedown', function(e) {
  editSongName();
}, true);

function editSongName(){
	var nameField = document.getElementById("songname");
	if(!editedSongName && song){
	    nameField.innerHTML ="<h2><input type=\"text\" id=\"songnamefield\" value=\"" + song.name + "\"></h2>";
	    editedSongName = true;
	  }
}

nameField.addEventListener('change', function(e){
  // If the user edited the song name, save it and reset the name field.
  songnamefield = document.getElementById("songnamefield");
  if(songnamefield){
    song.name = songnamefield.value;
  }
}, true);

nameField.addEventListener('blur', function(e){
  // If the user clicks away from the name field, put it back to the basic display
  songnamefield = document.getElementById("songnamefield");
  if(songnamefield){
    document.getElementById("songname").innerHTML = "<h2>" + song.name + "</h2>";
    editedSongName = false;
  }
}, true);

var keyField = document.getElementById("songkey");
keyField.addEventListener('mousedown', function(e){
  if(!editedSongKey){
    selectString = "<p>Key = <select id=\"keyselect\">";
    for(var i=0;i<keys.length;i++){
      selectString += "<option value=\"" + keys[i] + "\"";
      if (keys[i] == song.key) {
        selectString += "selected=\"selected\"";
      }
      selectString += ">" + keys[i] + "</option>"; 
    }
    selectString += "</select></p>";
    keyField.innerHTML = selectString;
    
    editedSongKey = true;
  }
}, true);

keyField.addEventListener('change', function(e){
  // If the user edited the song key, save it and reset the key field.
  keySelect = document.getElementById("keyselect");
  if(keySelect){
    song.key = keySelect.value;
    cManager.key = keySelect.value;
    cManager.layoutNotes(song.indexedContent);
  }
}, true);

keyField.addEventListener('blur', function(e){
  // If the user clicks away from the key field, put it back to the basic display.
  keySelect = document.getElementById("keyselect");
  if(keySelect){
    keyField.innerHTML = "<p> Key = " + song.key + "</p>";
    editedSongKey = false;
  }
}, true);

var tempoField = document.getElementById("songtempo");
tempoField.addEventListener('mousedown', function(e){
  if(!editedSongTempo){
    selectString = "<p>Tempo = <select id=\"temposelect\">";
    for(var i=0;i<tempos.length;i++){
      selectString += "<option value=\"" + tempos[i] + "\"";
      if(tempos[i] == song.tempo){
        selectString += "selected=\"selected\"";
      }
      selectString += ">" + tempos[i] + "</option>";
    }
    selectString += "</select></p>";
    tempoField.innerHTML = selectString;
    editedSongTempo = true;
  }
}, true);

tempoField.addEventListener('change', function(e){
  // If the user edited the song tempo, save it and reset the tempo field
  tempoSelect = document.getElementById("temposelect");
  if(tempoSelect){
    song.tempo = parseInt(tempoSelect.value);
  }
}, true);

tempoField.addEventListener('blur', function(e){
  // If the user clicks away from the tempo field, put it back to the basic display
  tempoSelect = document.getElementById("temposelect");
  if(tempoSelect){
    document.getElementById("songtempo").innerHTML = "<p>Tempo = " + song.tempo + "</p>";
    editedSongTempo = false;
  }
}, true);

function displaySong() {
  document.getElementById("songname").innerHTML = "<h2>" + song.name + "</h2>";
  document.getElementById("songkey").innerHTML = "<p> Key = " + song.key + "</p>";
  document.getElementById("songtempo").innerHTML = "<p>Tempo = " + song.tempo + "</p>";
  cManager.timesignature = song.timesignature;
  cManager.key = song.key;
  cManager.layoutNotes(song.indexedContent);
  editedSongName = false;
  editedSongKey = false;
  editedSongTempo = false;
}

function saveCurrentSong() {
  if (song) {
    xmlString = song.toXMLString();
    if (xmlString) {
      // alert(xmlString);
      xmlOpen("POST",
          'SimpleSongServlet?save=' + encodeURIComponent(xmlString), null,
          songResponseHandler);
    } else {
      alert("Song saving not supported in this browser");
    }
  } else {
    alert("No song loaded!");
  }
}

function deleteCurrentSong() {
  if(confirm("Are you sure you want to delete " + song.name + "?")){
    if (song && song.id >= 0) {
      xmlOpen("POST",
          'SimpleSongServlet?delete_song_id=' + song.id, null,
          songResponseHandler);
      window.location.reload();
    } else {
      alert("No active song loaded!");
    }
  }
}

/**
 * 
 */
function songResponseHandler() {
  if (req.readyState == 4) {
    if (req.status == 200) {
      // alert(req.response);
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(req.response, "text/xml");
      if(xmlDoc && xmlDoc.getElementsByTagName(xmlConstants.SONG_XML)[0]){
        console.log("Received XML " + xmlDoc);
        song = new Song();
        song.parseXML(xmlDoc);
        var endMarker = new EndOfSong();
        endMarker.index = durConstants.WHOLE_DUR * MEASURES_PER_LINE * 4;
        song.indexedContent[song.indexedContent.length] = endMarker;
        displaySong();
      }
    } else {
      // alert('not correct status yet!');
    }
  } else {
    // alert('not ready yet!');
  }
}

function getSong(songId) {
  xmlOpen("GET", 'SimpleSongServlet?song_id=' + songId, null,
      songResponseHandler);
}

/**
 * If the user requests all songs be send, display the resulting html.
 */
function allSongsResponseHandler() {
  if (req.readyState == 4) {
    if (req.status == 200) {
       document.getElementById("songs").innerHTML = req.response;
    }
  }
}

function getAllSongsForUser(){
  xmlOpen("GET", 'SimpleSongServlet?get_all_songs', null, allSongsResponseHandler);
}

function newSong(){
  song = new Song();
  var endMarker = new EndOfSong();
  endMarker.index = durConstants.WHOLE_DUR * MEASURES_PER_LINE * 4;
  song.indexedContent[song.indexedContent.length] = endMarker;
  displaySong();
}

/**
 * Open a connection to the specified URL, which is intended to respond with an
 * XML message.
 * 
 * @param string method The connection method; either "GET" or "POST".
 * @param string url The URL to connect to.
 * @param string toSend The data to send to the server; must be URL encoded.
 * @param function responseHandler The Javascript function handling server
 *          response.
 */
function xmlOpen(method, url, toSend, responseHandler) {
  if (window.XMLHttpRequest) {
    // browser has native support for XMLHttpRequest object
    req = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    // try XMLHTTP ActiveX (Internet Explorer) version
    req = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (req) {
    req.onreadystatechange = responseHandler;
    req.open(method, url, true);
    req.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    req.send(toSend);
  } else {
    alert('Your browser does not seem to support XMLHttpRequest.');
  }
}

function play(){
  song.prepPlaybackArray();
  playSong();
}