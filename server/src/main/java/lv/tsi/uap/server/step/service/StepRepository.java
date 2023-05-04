package lv.tsi.uap.server.step.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StepRepository extends JpaRepository<Step, Long> {

    @Query("SELECT MAX(s.index) FROM Step s WHERE s.assignment.id = ?1")
    Optional<Integer> findLastIndex(UUID assignmentId);

    @Modifying
    @Query("UPDATE Step s SET s.index = s.index - 1 WHERE s.assignment.id = ?1 AND s.index > ?2")
    void updateIndices(UUID assignmentId, Integer start);

    List<Step> findByAssignmentIdOrderByIndex(UUID assignmentId);

    Optional<Step> findByAssignmentIdAndIndex(UUID assignmentId, Integer index);

    void deleteByAssignmentIdAndIndex(UUID assignmentId, Integer index);

}
