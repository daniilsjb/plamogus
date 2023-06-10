package lv.tsi.plamogus.server.component.step.endpoint;

import lombok.Builder;
import lombok.Value;

import java.util.UUID;

@Value
@Builder
class StepResponse {

    private final UUID id;
    private final String title;
    private final Boolean completed;

}
