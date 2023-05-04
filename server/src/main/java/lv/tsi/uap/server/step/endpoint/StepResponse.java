package lv.tsi.uap.server.step.endpoint;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
class StepResponse {

    String title;
    Boolean completed;

}
