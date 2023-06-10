package lv.tsi.plamogus.server.component.step.endpoint;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StepQuery {

    private UUID assignmentId;

}
