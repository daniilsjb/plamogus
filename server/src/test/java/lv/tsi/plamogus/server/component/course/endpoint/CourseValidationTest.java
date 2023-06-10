package lv.tsi.plamogus.server.component.course.endpoint;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CourseValidationTest {

    private final Validator validator = Validation
        .buildDefaultValidatorFactory()
        .getValidator();

    @Test
    @DisplayName("Should pass validation successfully")
    public void scenario_ef0fbdf891a244299dda3532370af418() {
        // Optional fields are omitted.
        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .title("Computer Science")
            .build())).isEmpty();

        // Boundary conditions.
        assertThat(validator.validate(CourseRequest.builder()
            .code("A".repeat(8))
            .title("B".repeat(64))
            .description("C".repeat(1024))
            .semester(99)
            .build())).isEmpty();
    }

    @Test
    @DisplayName("Should fail validation when code is missing")
    public void scenario_530746c332594b80bef287ed8fee47dc() {
        // Code is null.
        assertThat(validator.validate(CourseRequest.builder()
            .title("Computer Science")
            .build())).isNotEmpty();

        // Code is empty.
        assertThat(validator.validate(CourseRequest.builder()
            .code("")
            .title("Computer Science")
            .build())).isNotEmpty();

        // Code is blank.
        assertThat(validator.validate(CourseRequest.builder()
            .code("         ")
            .title("Computer Science")
            .build())).isNotEmpty();
    }

    @Test
    @DisplayName("Should fail validation when title is missing")
    public void scenario_d062b6277bc64601854d4c882db799c6() {
        // Title is null.
        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .build())).isNotEmpty();

        // Title is empty.
        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .title("")
            .build())).isNotEmpty();

        // Title is blank.
        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .title("        ")
            .build())).isNotEmpty();
    }

    @Test
    @DisplayName("Should fail validation when code is too long")
    public void scenario_cde4f341b45b4db894cd9815032fd365() {
        assertThat(validator.validate(CourseRequest.builder()
            .code("A".repeat(9))
            .title("Computer Science")
            .build())).isNotEmpty();
    }

    @Test
    @DisplayName("Should fail validation when title is too long")
    public void scenario_1df45c2a75184721b4e1010c8beda3b5() {
        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .title("A".repeat(65))
            .build())).isNotEmpty();
    }

    @Test
    @DisplayName("Should fail validation when description is too long")
    public void scenario_a05104c42fa640f6a166f27cdbd2f185() {
        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .title("Computer Science")
            .description("A".repeat(1025))
            .build())).isNotEmpty();
    }

    @Test
    @DisplayName("Should fail validation when semester is non-positive")
    public void scenario_482674408f9a407eab8917b7e88d2724() {
        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .title("Computer Science")
            .semester(0)
            .build())).isNotEmpty();

        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .title("Computer Science")
            .semester(-1)
            .build())).isNotEmpty();

        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .title("Computer Science")
            .semester(-123)
            .build())).isNotEmpty();
    }

    @Test
    @DisplayName("Should fail validation when semester is too large")
    public void scenario_8d09828642444e349c5b4825f553e1bf() {
        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .title("Computer Science")
            .semester(100)
            .build())).isNotEmpty();

        assertThat(validator.validate(CourseRequest.builder()
            .code("CS101")
            .title("Computer Science")
            .semester(1283746)
            .build())).isNotEmpty();
    }

}
