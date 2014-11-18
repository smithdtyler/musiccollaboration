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
package com.smithdtyler.music.domain;

import java.util.Set;

/**
 * @author Tyler
 *
 */
public class User {
  private Long id;
  private String username;
  private String email;
  private String passwordHash;
  private Boolean isAdmin;
  private Set<User_Song> user_Songs;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public void setIsAdmin(Boolean isAdmin) {
    this.isAdmin = isAdmin;
  }

  public Boolean getIsAdmin() {
    return isAdmin;
  }

  public Set<User_Song> getUser_Songs() {
    return user_Songs;
  }

  public void setUser_Songs(Set<User_Song> user_Songs) {
    this.user_Songs = user_Songs;
  }

  @Override
  public String toString() {
    return "User [username=" + username + "]";
  }
}
