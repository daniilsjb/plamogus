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
    public void shouldConvertRequestToEntityWhenCourseIsPresent() {
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
    public void shouldConvertRequestToEntityWhenCourseIsNotPresent() {
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
    public void shouldConvertEntityToResponseWhenCourseIsPresent() {
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
    public void shouldConvertEntityToResponseWhenCourseIsNotPresent() {
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
