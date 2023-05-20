package lv.tsi.uap.server.step.endpoint;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
class StepResponse {

    Long id;
    String title;
    Boolean completed;

}
