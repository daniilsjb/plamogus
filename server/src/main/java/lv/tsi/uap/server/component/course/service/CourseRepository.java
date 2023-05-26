package lv.tsi.uap.server.component.course.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID>, JpaSpecificationExecutor<Course> {

    Boolean existsByIdAndProfileId(UUID id, UUID profileId);

    Optional<Course> findByIdAndProfileId(UUID id, UUID profileId);

}
