package lv.tsi.uap.server.component.dashboard.service;

import lombok.RequiredArgsConstructor;
import lv.tsi.uap.server.component.assignment.service.Assignment;
import lv.tsi.uap.server.component.assignment.service.AssignmentRepository;
import lv.tsi.uap.server.component.course.service.Course;
import lv.tsi.uap.server.component.course.service.CourseRepository;
import lv.tsi.uap.server.component.dashboard.endpoint.DashboardResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DefaultDashboardService implements DashboardService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final Supplier<Instant> instantSupplier;

    @Override
    public DashboardResponse index() {
        final var assignments = assignmentRepository.findAll();
        return DashboardResponse.builder()
            .pendingCount(countPendingAssignments(assignments))
            .overdueCount(countOverdueAssignments(assignments))
            .types(countAssignmentsByType(assignments))
            .semesters(countAssignmentsBySemester(assignments))
            .deadlines(countAssignmentsByDeadline(assignments))
            .build();
    }

    private Long countPendingAssignments(List<Assignment> assignments) {
        return assignments.stream()
            .filter(it -> !it.getCompleted())
            .count();
    }

    private Long countOverdueAssignments(List<Assignment> assignments) {
        final var now = instantSupplier.get();
        return assignments.stream()
            .filter(it -> !it.getCompleted() &&
                it.getDeadlineTime() != null &&
                it.getDeadlineTime().isBefore(now))
            .count();
    }

    private List<DashboardResponse.TypeFrequency> countAssignmentsByType(List<Assignment> assignments) {
        return assignments.stream()
            .filter(it -> it.getType() != null)
            .collect(Collectors.groupingBy(Assignment::getType, Collectors.counting()))
            .entrySet().stream()
            .map(it -> DashboardResponse.TypeFrequency.builder()
                .type(it.getKey())
                .count(it.getValue())
                .build())
            .toList();
    }

    private List<DashboardResponse.SemesterFrequency> countAssignmentsBySemester(List<Assignment> assignments) {
        final var courseToSemester = courseRepository.findAll().stream()
            .filter(it -> it.getSemester() != null)
            .collect(Collectors.toMap(Course::getId, Course::getSemester));

        final var semesterFrequencies = new HashMap<Integer, Long>();
        for (final var assignment : assignments) {
            final var course = assignment.getCourse();
            if (course != null && courseToSemester.containsKey(course.getId())) {
                final var semester = courseToSemester.get(course.getId());
                semesterFrequencies.merge(semester, 1L, Long::sum);
            }
        }

        return semesterFrequencies.entrySet().stream()
            .map(it -> DashboardResponse.SemesterFrequency.builder()
                .semester(it.getKey())
                .count(it.getValue())
                .build())
            .toList();
    }

    private List<DashboardResponse.DeadlineFrequency> countAssignmentsByDeadline(List<Assignment> assignments) {
        final var now = instantSupplier.get();
        return assignments.stream()
            .filter(it -> !it.getCompleted() && it.getDeadlineTime() != null)
            .collect(Collectors.groupingBy(Assignment::getDeadlineTime, Collectors.counting()))
            .entrySet().stream()
            .map(it -> DashboardResponse.DeadlineFrequency.builder()
                .deadlineTime(it.getKey())
                .overdue(it.getKey().isBefore(now))
                .count(it.getValue())
                .build())
            .toList();
    }

}
