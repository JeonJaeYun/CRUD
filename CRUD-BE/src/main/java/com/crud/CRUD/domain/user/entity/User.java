package com.crud.CRUD.domain.user.entity;

import com.crud.CRUD.global.common.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User extends BaseTimeEntity {

  @Id
  private String userId;

  private String password;

  private String nickname;
}
