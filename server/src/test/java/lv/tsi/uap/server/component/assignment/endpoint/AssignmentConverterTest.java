package lv.tsi.uap.server.component.assignment.endpoint;

import lv.tsi.uap.server.component.assignment.service.Assignment;
import lv.tsi.uap.server.component.assignment.service.AssignmentType;
import lv.tsi.uap.server.component.course.service.Course;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class AssignmentConverterTest {

    private final AssignmentConverter victim = new AssignmentConverter();

    @Test
    @DisplayName("Should convert response to entity when course is present")
    public void scenario_0865d894655545ed9b2614fcf0d9048d() {
        final var actual = victim.toEntity(AssignmentRequest.builder()
            .title("Computer Practice #3")
            .description("Should be completed in R.")
            .type(AssignmentType.PRACTICE)
            .deadlineTime(Instant.EPOCH)
            .courseId(UUID.fromString("a3819fff-8efc-48ac-a978-62bc43dc0576"))
            .build());

        assertThat(actual.getId()).isNull();
        assertThat(actual.getTitle()).isEqualTo("Computer Practice #3");
        assertThat(actual.getDescription()).isEqualTo("Should be completed in R.");
        assertThat(actual.getType()).isEqualTo(AssignmentType.PRACTICE);
        assertThat(actual.getDeadlineTime()).isEqualTo(Instant.EPOCH);
        assertThat(actual.getCourse().getId()).isEqualTo(UUID.fromString("a3819fff-8efc-48ac-a978-62bc43dc0576"));
        assertThat(actual.getCreationTime()).isNull();
    }

    @Test
    @DisplayName("Should convert response to entity when course is not present")
    public void scenario_d5b7f97e929647a7bc17c5142865d7f6() {
        final var actual = victim.toEntity(AssignmentRequest.builder()
            .title("Computer Practice #3")
            .description("Should be completed in R.")
            .type(AssignmentType.PRACTICE)
            .deadlineTime(Instant.EPOCH)
            .build());

        assertThat(actual.getId()).isNull();
        assertThat(actual.getTitle()).isEqualTo("Computer Practice #3");
        assertThat(actual.getDescription()).isEqualTo("Should be completed in R.");
        assertThat(actual.getType()).isEqualTo(AssignmentType.PRACTICE);
        assertThat(actual.getDeadlineTime()).isEqualTo(Instant.EPOCH);
        assertThat(actual.getCreationTime()).isNull();
        assertThat(actual.getCourse()).isNull();
    }

    @Test
    @DisplayName("Should convert entity to response when course is present")
    public void scenario_3d1dd01c8497448f8259c1b0ed5f78f5() {
        final var actual = victim.toResponse(Assignment.builder()
            .id(UUID.fromString("04bbcd9b-ed67-403b-8c9e-5fe1cef06896"))
            .title("Computer Practice #3")
            .description("Should be completed in R.")
            .type(AssignmentType.PRACTICE)
            .deadlineTime(Instant.EPOCH)
            .course(Course.builder()
                .id(UUID.fromString("a3819fff-8efc-48ac-a978-62bc43dc0576"))
                .code("PTMS")
                .build())
            .build());

        final var expected = AssignmentResponse.builder()
            .id(UUID.fromString("04bbcd9b-ed67-403b-8c9e-5fe1cef06896"))
            .title("Computer Practice #3")
            .description("Should be completed in R.")
            .type(AssignmentType.PRACTICE)
            .deadlineTime(Instant.EPOCH)
            .course(AssignmentResponse.Course.builder()
                .id(UUID.fromString("a3819fff-8efc-48ac-a978-62bc43dc0576"))
                .code("PTMS")
                .build())
            .build();

        assertThat(actual).isEqualTo(expected);
    }

    @Test
    @DisplayName("Should convert entity to response when course is not present")
    public void scenario_cf86a20309514f9fa4e9219f01fe2d4f() {
        final var actual = victim.toResponse(Assignment.builder()
            .id(UUID.fromString("04bbcd9b-ed67-403b-8c9e-5fe1cef06896"))
            .title("Computer Practice #3")
            .description("Should be completed in R.")
            .type(AssignmentType.PRACTICE)
            .deadlineTime(Instant.EPOCH)
            .build());

        final var expected = AssignmentResponse.builder()
            .id(UUID.fromString("04bbcd9b-ed67-403b-8c9e-5fe1cef06896"))
            .title("Computer Practice #3")
            .description("Should be completed in R.")
            .type(AssignmentType.PRACTICE)
            .deadlineTime(Instant.EPOCH)
            .build();

        assertThat(actual).isEqualTo(expected);
    }

}
