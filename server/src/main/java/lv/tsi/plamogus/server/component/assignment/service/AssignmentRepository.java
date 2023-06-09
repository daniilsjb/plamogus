package lv.tsi.plamogus.server.component.assignment.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID>, JpaSpecificationExecutor<Assignment> {

}
