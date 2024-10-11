package com.crud.CRUD.domain.user.repository;

import com.crud.CRUD.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {

}
