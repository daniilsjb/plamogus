package lv.tsi.uap.server.component.dashboard.service;

import lv.tsi.uap.server.component.assignment.service.Assignment;
import lv.tsi.uap.server.component.assignment.service.AssignmentRepository;
import lv.tsi.uap.server.component.assignment.service.AssignmentType;
import lv.tsi.uap.server.component.course.service.Course;
import lv.tsi.uap.server.component.course.service.CourseRepository;
import lv.tsi.uap.server.component.dashboard.endpoint.DashboardResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DefaultDashboardServiceTest {

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private Supplier<Instant> instantSupplier;

    @InjectMocks
    private DefaultDashboardService victim;

    @Test
    @DisplayName("Should calculate statistics successfully")
    public void scenario_d106af18dcc446a9840f1e46d4443dda() {
        final var course1Id = UUID.fromString("cfb1d26f-044b-4d0c-a4c0-05097c127da0");
        final var course2Id = UUID.fromString("1cfc60ab-1944-412e-8b6d-d0c256f36de9");
        final var course3Id = UUID.fromString("8ddb92fb-e520-4bf1-b8f7-96bd3a5af4d3");
        final var course4Id = UUID.fromString("89ceab30-8695-48af-9474-3de50e4fccd9");

        final var courses = List.of(
            Course.builder()
                .id(course1Id)
                .semester(1)
                .build(),
            Course.builder()
                .id(course2Id)
                .semester(1)
                .build(),
            Course.builder()
                .id(course3Id)
                .semester(2)
                .build(),
            Course.builder()
                .id(course4Id)
                .build()
        );

        final var assignments = List.of(
            Assignment.builder()
                .completed(true)
                .deadlineTime(Instant.parse("2023-05-09T00:00:00Z"))
                .type(AssignmentType.REPORT)
                .course(Course.builder()
                    .id(course1Id)
                    .build())
                .build(),
            Assignment.builder()
                .completed(true)
                .deadlineTime(Instant.parse("2023-05-06T00:00:00Z"))
                .type(AssignmentType.HOMEWORK)
                .build(),
            Assignment.builder()
                .completed(false)
                .deadlineTime(Instant.parse("2023-05-07T00:00:00Z"))
                .type(AssignmentType.REPORT)
                .course(Course.builder()
                    .id(course1Id)
                    .build())
                .build(),
            Assignment.builder()
                .completed(true)
                .deadlineTime(Instant.parse("2023-05-03T00:00:00Z"))
                .course(Course.builder()
                    .id(course2Id)
                    .build())
                .build(),
            Assignment.builder()
                .completed(false)
                .deadlineTime(Instant.parse("2023-05-02T00:00:00Z"))
                .type(AssignmentType.PRACTICE)
                .course(Course.builder()
                    .id(course2Id)
                    .build())
                .build(),
            Assignment.builder()
                .completed(true)
                .deadlineTime(Instant.parse("2023-05-07T00:00:00Z"))
                .course(Course.builder()
                    .id(course2Id)
                    .build())
                .build(),
            Assignment.builder()
                .completed(false)
                .deadlineTime(Instant.parse("2023-05-08T00:00:00Z"))
                .type(AssignmentType.PRACTICE)
                .course(Course.builder()
                    .id(course3Id)
                    .build())
                .build(),
            Assignment.builder()
                .completed(false)
                .deadlineTime(Instant.parse("2023-05-07T00:00:00Z"))
                .course(Course.builder()
                    .id(course3Id)
                    .build())
                .build(),
            Assignment.builder()
                .completed(true)
                .deadlineTime(Instant.parse("2023-05-07T00:00:00Z"))
                .type(AssignmentType.PRESENTATION)
                .course(Course.builder()
                    .id(course4Id)
                    .build())
                .build(),
            Assignment.builder()
                .completed(true)
                .deadlineTime(Instant.parse("2023-05-07T00:00:00Z"))
                .type(AssignmentType.PRACTICE)
                .course(Course.builder()
                    .id(course4Id)
                    .build())
                .build(),
            Assignment.builder()
                .completed(false)
                .deadlineTime(Instant.parse("2023-05-02T00:00:00Z"))
                .type(AssignmentType.PRESENTATION)
                .build()
        );

        when(courseRepository.findAll()).thenReturn(courses);
        when(assignmentRepository.findAll()).thenReturn(assignments);
        when(instantSupplier.get()).thenReturn(Instant.parse("2023-05-07T00:00:00Z"));

        final var result = victim.index();

        assertThat(result.getPendingCount()).isEqualTo(5L);
        assertThat(result.getOverdueCount()).isEqualTo(2L);

        assertThat(result.getTypes()).hasSameElementsAs(List.of(
            DashboardResponse.TypeFrequency.builder()
                .type(AssignmentType.REPORT)
                .count(2L)
                .build(),
            DashboardResponse.TypeFrequency.builder()
                .type(AssignmentType.HOMEWORK)
                .count(1L)
                .build(),
            DashboardResponse.TypeFrequency.builder()
                .type(AssignmentType.PRESENTATION)
                .count(2L)
                .build(),
            DashboardResponse.TypeFrequency.builder()
                .type(AssignmentType.PRACTICE)
                .count(3L)
                .build()
        ));

        assertThat(result.getSemesters()).hasSameElementsAs(List.of(
            DashboardResponse.SemesterFrequency.builder()
                .semester(1)
                .count(5L)
                .build(),
            DashboardResponse.SemesterFrequency.builder()
                .semester(2)
                .count(2L)
                .build()
        ));

        assertThat(result.getDeadlines()).hasSameElementsAs(List.of(
            DashboardResponse.DeadlineFrequency.builder()
                .deadlineTime(Instant.parse("2023-05-07T00:00:00Z"))
                .overdue(false)
                .count(2L)
                .build(),
            DashboardResponse.DeadlineFrequency.builder()
                .deadlineTime(Instant.parse("2023-05-02T00:00:00Z"))
                .overdue(true)
                .count(2L)
                .build(),
            DashboardResponse.DeadlineFrequency.builder()
                .deadlineTime(Instant.parse("2023-05-08T00:00:00Z"))
                .overdue(false)
                .count(1L)
                .build()
        ));

        verify(instantSupplier, times(2)).get();
        verify(courseRepository).findAll();
        verify(assignmentRepository).findAll();
    }

}
