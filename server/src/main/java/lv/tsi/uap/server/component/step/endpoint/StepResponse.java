package lv.tsi.uap.server.component.step.endpoint;

import lombok.Builder;
import lombok.Value;

import java.util.UUID;

@Value
@Builder
class StepResponse {

    UUID id;
    String title;
    Boolean completed;

}
