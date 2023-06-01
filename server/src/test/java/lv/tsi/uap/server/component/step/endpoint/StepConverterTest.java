package lv.tsi.uap.server.component.step.endpoint;

import lv.tsi.uap.server.component.step.service.Step;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class StepConverterTest {

    private final StepConverter victim = new StepConverter();

    @Test
    @DisplayName("Should convert response to entity")
    public void shouldConvertRequestToEntity() {
        final var actual = victim.toEntity(StepRequest.builder()
            .title("Prepare the report")
            .build());

        assertThat(actual.getId()).isNull();
        assertThat(actual.getTitle()).isEqualTo("Prepare the report");
        assertThat(actual.getCompleted()).isFalse();
        assertThat(actual.getIndex()).isNull();
    }

    @Test
    @DisplayName("Should convert entity to response")
    public void shouldConvertEntityToResponse() {
        final var actual = victim.toResponse(Step.builder()
            .id(UUID.fromString("04bbcd9b-ed67-403b-8c9e-5fe1cef06896"))
            .title("Prepare the report")
            .completed(true)
            .index(2)
            .build());

        final var expected = StepResponse.builder()
            .id(UUID.fromString("04bbcd9b-ed67-403b-8c9e-5fe1cef06896"))
            .title("Prepare the report")
            .completed(true)
            .build();

        assertThat(actual).isEqualTo(expected);
    }

}
