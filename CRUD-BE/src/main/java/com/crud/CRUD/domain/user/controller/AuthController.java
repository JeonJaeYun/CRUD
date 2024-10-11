package com.crud.CRUD.domain.user.controller;

import com.crud.CRUD.domain.user.dto.JoinDto;
import com.crud.CRUD.domain.user.dto.LoginDto;
import com.crud.CRUD.domain.user.dto.UserInfoDto;
import com.crud.CRUD.domain.user.service.AuthService;
import com.crud.CRUD.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

  private final AuthService authService;

  // 회원가입
  @PostMapping("/join")
  public ResponseEntity<String> join(@RequestBody JoinDto joinDto) {
    authService.join(joinDto);
    return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 완료");
  }

  // 로그인
  @PostMapping("/login")
  public ResponseEntity<UserInfoDto> login(@RequestBody LoginDto loginDto) {
    return ResponseEntity.status(HttpStatus.OK).body(authService.login(loginDto));
  }

  // 로그아웃
  @PostMapping("/logout")
  public ResponseEntity<String> logout() {
    authService.logout();
    return ResponseEntity.status(HttpStatus.OK).body("로그아웃 완료");
  }
}
