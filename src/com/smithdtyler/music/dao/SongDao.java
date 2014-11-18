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
package com.smithdtyler.music.dao;

import java.util.*;

import org.apache.log4j.Logger;
import org.hibernate.*;

import com.smithdtyler.music.domain.*;

/**
 * Methods for performing typical CRUD operations on a {@link Song}
 * 
 * @author Tyler
 * 
 */
public class SongDao {
  public static final Logger logger = Logger.getLogger(SongDao.class);

  /**
   * @param song The Song to save.
   */
  public static void save(Song song) {
    if(logger.isDebugEnabled()){
      logger.debug("Saving song: " + song);
    }
    Session session = SessionManager.getSession();
    Transaction tx = session.beginTransaction();
    session.saveOrUpdate(song);
    Iterator<Note> iterator = song.getNotes().iterator();
    // Clear deleted notes
    while (iterator.hasNext()) {
      Note n = iterator.next();
      if (n.getIndex() < 0) {
        iterator.remove();
        session.delete(n);
      }
    }
    tx.commit();
    session.close();
  }

  /**
   * Find a song with the provided it.
   * 
   * @param songId
   * @return The song, with its {link Note}s and {@link TimeSignature}
   *         Initialized, or <code>null</code> if no song exists with the
   *         provided songId.
   */
  public static Song findSong(Long songId) {
    if(logger.isDebugEnabled()){
      logger.debug("Looking for a song with id " + songId);
    }
    Session session = SessionManager.getSession();
    Song song = (Song) session.get(Song.class, songId);
    if (song == null) {
      session.close();
      return null;
    }
    Hibernate.initialize(song.getNotes());
    Hibernate.initialize(song.getTimeSignature());
    Hibernate.initialize(song.getUser_Songs());
    session.close();
    return song;
  }

  /**
   * @return A list of all {@link Song}s in the database.
   */
  public static List<Song> findAllSongs() {
    Session session = SessionManager.getSession();
    if (logger.isDebugEnabled()) {
      logger.debug("Retrieving all songs...");
    }
    @SuppressWarnings("unchecked")
    List<Song> songs = session.createCriteria(Song.class).list();
    session.close();
    return songs;
  }

  /**
   * Delete a Song with the provided id.
   * @param songId
   */
  public static void deleteSong(Long songId) {
    Session session = SessionManager.getSession();
    Transaction tx = session.beginTransaction();
    if (logger.isDebugEnabled()) {
      logger.debug("Deleting song " + songId);
    }
    Song song = (Song) session.get(Song.class, songId);
    if (song != null) {
      session.delete(song);
      tx.commit();
    } else {
      logger.warn("Song " + songId
          + " could not be deleted because it doesn't exist");
    }
    session.close();
  }
}
