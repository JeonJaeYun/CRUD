package com.crud.CRUD.domain.user.service;

import com.crud.CRUD.domain.user.dto.UserUpdateRequest;
import com.crud.CRUD.domain.user.dto.UserInfoDto;
import com.crud.CRUD.domain.user.entity.User;
import com.crud.CRUD.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public UserInfoDto getUser(String userId) {

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    return new UserInfoDto(user);
  }

  public void updateUser(String userId, UserUpdateRequest userUpdateRequest) {

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    user.setNickname(userUpdateRequest.getNickname());

    userRepository.save(user);
  }

  public void deleteUser(String userId) {

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    userRepository.delete(user);
  }
}
