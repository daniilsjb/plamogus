package lv.tsi.uap.server.assignment.endpoint;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lv.tsi.uap.server.assignment.service.AssignmentType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentQuery {

    private String order = "asc";
    private String orderBy = "creationTime";

    private String title;
    private String course;
    private AssignmentType type;

}
