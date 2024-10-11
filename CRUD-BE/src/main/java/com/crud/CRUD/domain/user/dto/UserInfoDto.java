package com.crud.CRUD.domain.user.dto;

import com.crud.CRUD.domain.user.entity.User;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {

  private String userId;
  private String nickname;
  private LocalDateTime createdAt;
  private LocalDateTime modifiedAt;

  public UserInfoDto(User user) {
    this.userId = user.getUserId();
    this.nickname = user.getNickname();
    this.createdAt = user.getCreatedAt();
    this.modifiedAt = user.getModifiedAt();
  }
}
