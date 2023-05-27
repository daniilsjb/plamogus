package lv.tsi.uap.server.component.step.endpoint;

import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
class StepRequest {

    String title;

}
