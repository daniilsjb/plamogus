package lv.tsi.uap.server.component.user.service;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Boolean existsByEmail(String email);

    Boolean existsByUsername(String username);

}
