package lv.tsi.uap.server.component.assignment.endpoint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lv.tsi.uap.server.component.assignment.service.AssignmentType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentQuery {

    private String order = "asc";
    private String orderBy = "creationTime";

    private String title;
    private String course;
    private AssignmentType type;

}
