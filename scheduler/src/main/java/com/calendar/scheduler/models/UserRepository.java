package com.calendar.scheduler.models;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.calendar.scheduler.models.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.username = :username")
    User findByUsername(@Param("username") String username);
}
