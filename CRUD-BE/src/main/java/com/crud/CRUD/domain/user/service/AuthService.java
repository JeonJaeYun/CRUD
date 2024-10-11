package com.crud.CRUD.domain.user.service;

import com.crud.CRUD.domain.user.dto.JoinDto;
import com.crud.CRUD.domain.user.dto.LoginDto;
import com.crud.CRUD.domain.user.dto.UserInfoDto;
import com.crud.CRUD.domain.user.entity.User;
import com.crud.CRUD.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;

  public void join(JoinDto joinDto) {

    User newUser = new User();
    newUser.setUserId(joinDto.getUserId());
    newUser.setPassword(joinDto.getPassword());
    newUser.setNickname(joinDto.getNickname());

    userRepository.save(newUser);
  }

  public UserInfoDto login(LoginDto loginDto) {

    User user = userRepository.findById(loginDto.getUserId())
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    if(!user.getPassword().equals(loginDto.getPassword())) {
      throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
    }

    UserInfoDto userInfoDto = new UserInfoDto();

    userInfoDto.setUserId(user.getUserId());
    userInfoDto.setNickname(user.getNickname());

    return userInfoDto;
  }

  public void logout() {

  }
}
