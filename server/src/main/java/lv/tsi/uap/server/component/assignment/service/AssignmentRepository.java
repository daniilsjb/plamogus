package lv.tsi.uap.server.component.assignment.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID>, JpaSpecificationExecutor<Assignment> {

    @Query("""
        SELECT c.semester, COUNT(*) FROM Course c
        INNER JOIN Assignment a ON a.course.id = c.id
        GROUP BY c.semester ORDER BY c.semester
    """)
    List<Object[]> countAssignmentsBySemester();

}