package com.crud.CRUD.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UserUpdateRequest {

  @NotBlank(message = "닉네임은 필수입니다.")
  private String nickname;
}
