package lv.tsi.uap.server.step.endpoint;

import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StepQuery {

    private UUID assignmentId;

}
