package lv.tsi.uap.server.component.course.endpoint;

import lv.tsi.uap.server.component.course.service.Course;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class CourseConverterTest {

    private final CourseConverter victim = new CourseConverter();

    @Test
    @DisplayName("Should convert response to entity")
    public void scenario_ddf4b4aa1a1640a8aaac86c60f65876d() {
        final var actual = victim.toEntity(CourseRequest.builder()
            .code("PTMS")
            .title("Probability Theory and Mathematical Statistics")
            .description("Practical assignments must be completed in R.")
            .semester(4)
            .build());

        assertThat(actual.getId()).isNull();
        assertThat(actual.getCode()).isEqualTo("PTMS");
        assertThat(actual.getTitle()).isEqualTo("Probability Theory and Mathematical Statistics");
        assertThat(actual.getDescription()).isEqualTo("Practical assignments must be completed in R.");
        assertThat(actual.getSemester()).isEqualTo(4);
    }

    @Test
    @DisplayName("Should convert entity to response")
    public void scenario_e705b791a17645e6aeaf21d93ea560c2() {
        final var actual = victim.toResponse(Course.builder()
            .id(UUID.fromString("04bbcd9b-ed67-403b-8c9e-5fe1cef06896"))
            .code("PTMS")
            .title("Probability Theory and Mathematical Statistics")
            .description("Practical assignments must be completed in R.")
            .semester(4)
            .build());

        final var expected = CourseResponse.builder()
            .id(UUID.fromString("04bbcd9b-ed67-403b-8c9e-5fe1cef06896"))
            .code("PTMS")
            .title("Probability Theory and Mathematical Statistics")
            .description("Practical assignments must be completed in R.")
            .semester(4)
            .build();

        assertThat(actual).isEqualTo(expected);
    }

}
