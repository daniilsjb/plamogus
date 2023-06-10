package lv.tsi.plamogus.server.component.assignment.endpoint;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AssignmentValidationTest {

    private final Validator validator = Validation
        .buildDefaultValidatorFactory()
        .getValidator();

    @Test
    @DisplayName("Should pass validation successfully")
    public void scenario_ef0fbdf891a244299dda3532370af418() {
        // Optional fields are omitted.
        assertThat(validator.validate(AssignmentRequest.builder()
            .title("Nice title")
            .build())).isEmpty();

        // Boundary conditions.
        assertThat(validator.validate(AssignmentRequest.builder()
            .title("A".repeat(64))
            .description("B".repeat(512))
            .build())).isEmpty();
    }

    @Test
    @DisplayName("Should fail validation when title is missing")
    public void scenario_74488afbae0549a980c03ba1d2633a22() {
        // Title is null.
        assertThat(validator.validate(AssignmentRequest.builder()
            .description("...")
            .build())).isNotEmpty();

        // Title is empty.
        assertThat(validator.validate(AssignmentRequest.builder()
            .title("")
            .build())).isNotEmpty();

        // Title is blank.
        assertThat(validator.validate(AssignmentRequest.builder()
            .title("        ")
            .build())).isNotEmpty();
    }

    @Test
    @DisplayName("Should fail validation when title is too long")
    public void scenario_6b790193da7f4389a9e4fcba0a8f2e51() {
        assertThat(validator.validate(AssignmentRequest.builder()
            .title("A".repeat(65))
            .build())).isNotEmpty();
    }

    @Test
    @DisplayName("Should fail validation when description is too long")
    public void scenario_6fabf31a4b164b21b62fd8c6ff0e5ce0() {
        assertThat(validator.validate(AssignmentRequest.builder()
            .title("Nice title")
            .description("A".repeat(513))
            .build())).isNotEmpty();
    }

}
