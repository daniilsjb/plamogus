package lv.tsi.uap.server.component.course.endpoint;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseQuery {

    private String order = "asc";
    private String orderBy = "code";
    private String search;

}
