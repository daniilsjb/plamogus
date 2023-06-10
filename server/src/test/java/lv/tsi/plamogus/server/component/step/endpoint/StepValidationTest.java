package lv.tsi.plamogus.server.component.step.endpoint;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class StepValidationTest {

    private final Validator validator = Validation
        .buildDefaultValidatorFactory()
        .getValidator();

    @Test
    @DisplayName("Should pass validation successfully")
    public void scenario_de367108d649472c9543c64494434d2f() {
        assertThat(validator.validate(StepRequest.builder()
            .title("Do work on stuff")
            .build())).isEmpty();
    }

    @Test
    @DisplayName("Should fail validation when title is missing")
    public void scenario_bae89ef497a340fabfe3dc82841e5f67() {
        // Title is null.
        assertThat(validator.validate(StepRequest.builder()
            .build())).isNotEmpty();

        // Title is empty.
        assertThat(validator.validate(StepRequest.builder()
            .title("")
            .build())).isNotEmpty();

        // Title is blank.
        assertThat(validator.validate(StepRequest.builder()
            .title("        ")
            .build())).isNotEmpty();
    }

    @Test
    @DisplayName("Should fail validation when title is too long")
    public void scenario_6e51b3b190314bc38a6ad55a9179a56d() {
        assertThat(validator.validate(StepRequest.builder()
            .title("A".repeat(65))
            .build())).isNotEmpty();
    }

}
